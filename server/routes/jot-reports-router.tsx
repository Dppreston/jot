let express = require("express");
let reportsRouter = express.Router();
let schemas = require("../schemas/schemas.ts");

reportsRouter.post("/jot-reports", async (req, res) => {
  const { reportReasons, newReport } = req.query;
  const { referenceId, referenceUserId, type } = req.body;

  const reportData = {
    referenceId: referenceId,
    referenceUserId: referenceUserId,
    type: type,
    reportReasons: JSON.parse(reportReasons),
  };

  if (newReport) {
    const newReport = await new schemas.JotReports(reportData);
    const save = newReport.save();

    if (save) {
      return res.send(true);
    } else {
      return res.send(false);
    }
  }
});

module.exports = reportsRouter;
