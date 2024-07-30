express = require("express");
schemas = require("../schemas/schemas.ts");
const sensitiveRouter = express.Router();
const Mailjet = require("node-mailjet");
const mailjet = Mailjet.apiConnect(
  "ae76f55b363e69bfc1997c6d8444376a",
  "1e4718967f6630fc145cdd84fe3eb11d"
);

sensitiveRouter.post("/jot-user-sensitive", async (req, res) => {
  const { first, last, password, email, parentUserId, username } = req.body;
  const { initialSignup, emailTrigger, sendPassword } = req.query;
  const sensitive = schemas.JotSensitive;

  //first signup

  const newUserSensitiveData = {
    first: first,
    last: last,
    password: password,
    email: email,
    parentUserId: parentUserId,
    username: username,
  };
  if (initialSignup) {
    const newUserSensitive = new schemas.JotSensitive(newUserSensitiveData);
    const save = newUserSensitive.save();

    if (save) {
      return res.send(true);
    }
  }

  //send code for password recovery

  if (emailTrigger) {
    let min = Math.ceil(1000);
    let max = Math.floor(9999);
    let recoveryCode = Math.floor(Math.random() * (max - min) + max);

    const request = mailjet.post("send", { "version": "v3.1" }).request({
      "Messages": [
        {
          "From": {
            "Email": "daneprestonwd@gmail.com",
            "Name": "Jot",
          },
          "To": [
            {
              "Email": email,
              "Name": "Jot User",
            },
          ],

          "Subject": "Your Temporary Code",
          "TemplateLanguage": true,
          "TemplateID": 6074025,
          "CustomID": JSON.stringify(recoveryCode),
          "Variables": {
            "code": JSON.stringify(recoveryCode),
          },
        },
      ],
    });
    request
      .then((result) => {
        return res.send(JSON.stringify(recoveryCode));
      })
      .catch((err) => {
        console.log(err.statusCode);
      });
  }

  //email password

  if (sendPassword) {
    const password = await sensitive.find({ email: email }, { password: 1 });
    let passwordFinal = password[0].password.replace(
      /^["'](.+(?=["']$))["']$/,
      "$1"
    );

    const request = mailjet.post("send", { "version": "v3.1" }).request({
      "Messages": [
        {
          "From": {
            "Email": "daneprestonwd@gmail.com",
            "Name": "Jot",
          },
          "To": [
            {
              "Email": email,
              "Name": "Jot User",
            },
          ],
          "Subject": "Your Recovered Account.",
          "TemplateLanguage": true,
          "TemplateId": 6074207,
          "CustomID": JSON.stringify(passwordFinal),
          "Variables": {
            "password": JSON.stringify(passwordFinal),
          },
        },
      ],
    });
    request
      .then((result) => {
        return res.send(true);
      })
      .catch((err) => {
        console.log(err.statusCode);
      });
  }
});

sensitiveRouter.get("/jot-user-sensitive", async (req, res) => {
  const sensitive = schemas.JotSensitive;
  const {
    emailCheck,
    emailCheckData,
    loginCheckEmail,
    loginCheckUsername,
    email,
    username,
    password,
    userSens,
    userId,
    oldPasswordCheck,
    oldPassword,
  } = req.query;

  //login check

  // login check

  if (loginCheckEmail) {
    const userData = await sensitive
      .find({
        email: email,
        password: password,
      })
      .exec();

    if (userData) {
      return res.send(JSON.stringify(userData));
    }
  }
  if (loginCheckUsername) {
    const userData = await sensitive
      .find({
        username: username,
        password: password,
      })
      .exec();

    if (userData) {
      return res.send(JSON.stringify(userData));
    }
  }

  //email check

  if (emailCheck) {
    const userEmailConfirm = await sensitive
      .find({ email: emailCheckData })
      .exec();

    if (userEmailConfirm.length == 0) {
      return res.send(true);
    } else {
      return res.send(false);
    }
  }

  //settings

  if (userSens) {
    const userData = await sensitive.find({ parentUserId: userId }).exec();
    if (userData) {
      return res.send(JSON.stringify(userData));
    }
  }

  if (oldPasswordCheck) {
    const userData = await sensitive.find({ parentUserId: userId }).exec();
    if (userData[0].password == oldPassword) {
      return res.send(true);
    } else {
      return res.send(false);
    }
  }
});

sensitiveRouter.put("/jot-user-sensitive", async (req, res) => {
  const sensitive = schemas.JotSensitive;

  const { updateAccountSettings, userId, updatedAccountData } = req.query;
  const updatedData = JSON.parse(updatedAccountData);

  if (updateAccountSettings) {
    const update = await sensitive.updateOne(
      { parentUserId: userId },
      {
        firstName: updatedData.firstName,
        lastName: updatedData.lastName,
        email: updatedData.email,
        password: updatedData.password,
      }
    );

    if (update) {
      return res.send(true);
    } else {
      return res.send(false);
    }
  }
});

module.exports = sensitiveRouter;
