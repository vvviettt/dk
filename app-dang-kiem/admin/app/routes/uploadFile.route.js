const authMiddleware = require("../middlewares/auth.middleware");

module.exports = (app) => {
  const file = require("../controllers/uploadFile.controller");
  var router = require("express").Router();

  router.post("/", file.uploadFile);

  app.use("/file", authMiddleware.loggedin, router);
  app.get("/500", (req, res) => {
    res.render("err");
  });
  app.get("/404", (req, res) => {
    res.render("404");
  });
};
