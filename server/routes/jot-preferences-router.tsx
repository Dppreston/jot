let express = require("express");
let preferenceRouter = express.Router();
let schemas = require("../schemas/schemas.ts");
let React = require("react");

preferenceRouter.get("/jot-user-preferences", async (req, res) => {
  const preferences = schemas.JotPreferences;
  const { userId, userPreferences, theme, privateProfileCheck } = req.query;

  if (userPreferences) {
    const preferenceData = await preferences
      .find({ parentUserId: userId })
      .exec();
    if (preferenceData) {
      return res.send(JSON.stringify(preferenceData));
    }
  }

  if (theme) {
    const data = await preferences
      .find({ parentUserId: userId }, { darkMode: 1 })
      .exec();
    if (data) {
      return res.send(data[0].darkMode);
    }
    res.end();
  }

  if (privateProfileCheck) {
    const data = await preferences
      .find({ parentUserId: userId }, { privateProfile: 1 })
      .exec();
    if (data) {
      return res.send(data[0].privateProfile);
    } else {
      return res.send(false);
    }
  }
});

preferenceRouter.put(`/jot-user-preferences`, async (req, res) => {
  const preferences = schemas.JotPreferences;

  const { userId, updateDarkmode, currentState, privateProfile } = req.query;

  //update dark mode

  if (updateDarkmode) {
    const action = await preferences.updateOne(
      { parentUserId: userId },
      { darkMode: currentState }
    );
    if (action) {
      return res.send(true);
    } else {
      return res.send(false);
    }
  }

  //update prive profile

  if (privateProfile) {
    const action = await preferences
      .updateOne({ parentUserId: userId }, { privateProfile: currentState })
      .exec();
    if (action) {
      return res.send(true);
    } else {
      return res.send(false);
    }
  }
});

preferenceRouter.post(`/jot-user-preferences`, async (req, res) => {
  const { parentUserId, darkMode, privateProfile } = req.body;

  const newUserPreferenceData = {
    parentUserId: parentUserId,
    darkMode: darkMode,
    privateProfile: privateProfile,
  };

  const newPref = new schemas.JotPreferences(newUserPreferenceData);
  const savePref = await newPref.save();

  if (savePref) {
    return res.send(true);
  } else {
    return res.send(false);
  }
});

module.exports = preferenceRouter;
