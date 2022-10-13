const { application } = require("express");
const express = require("express"),
  Styliner = require("styliner"),
  nodemailer = require("nodemailer"),
  cat = require("cat-me");

const app = express();

app.get("/", function (req, res) {
  res.json({
    message: "Done",
  });
});

const fs = require("fs");
const path = require("path");

// new folder absolute path
const dirPath = path.join(__dirname);
async function main(res) {
  var styliner = new Styliner(dirPath);
  var originalSource = require("fs").readFileSync(
    __dirname + "/index.html",
    "utf8"
  );
  var html;

  styliner.processHTML(originalSource).then(function (processedSource) {
    html = processedSource;
  });

  //Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Fred Foo 👻" <foo@example.com>', // sender address
    to: "bar@example.com, baz@example.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: html, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  res.redirect(nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

app.get("/mail", (req, res) => {
  main(res).catch(console.error);
  console.log(dirPath);
  /*res.json({
    message: "Mailed",
    ürl: nodemailer.getTestMessageUrl(info),
  });*/
});

app.listen(3000, () => {
  console.log(cat());
});
