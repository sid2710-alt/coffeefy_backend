const nodeMailer = require("nodemailer");
const ErrorHandler = require("./errorhandler");
require("dotenv");

const sendEmail = async (options) => {
  const transporter = nodeMailer.createTransport({
    host: "smtp.gmail.com",
    port: "587",
    auth: {
      user: "rakeshbaghel9621@gmail.com",
      pass: "Rak@9621",
    },
  });

  const mailOptions = {
    from: "rakeshbaghel9621@gmail.com",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  console.log(options.email, "\n", options.subject, "\n", options.message);

  await transporter
    .sendMail(mailOptions)
    .then((respnse) => {
      console.log("email sended");
    })
    .catch((error) => {
      console.log("email not sended ");
    });
};

module.exports = sendEmail;
