var nodemailer = require("nodemailer");

const transporter = () =>
  nodemailer.createTransport({
    host: "144.0.11.253",
    port: 25,
    secure: false,
    UsedefaultCredentials: false,
    auth: {
      user: "",
      pass: "",
    },
    tls: {
      // do not fail on invalid certs
      rejectUnauthorized: false,
    },
  });

export default transporter