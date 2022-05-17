const nodemailer = require("nodemailer")

const sendEmail = async (option) => {

    var transport = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "d0c289917bb8f5",
          pass: "867fc363d6085e"
        }
      });

      const mailoption = {
          from : 'kamyab.movahhedi@gmail.com',
          to : option.email,
          subject : option.subject,
          html : option.html
      }

      await transport.sendMail(mailoption)

    
}

module.exports={
    sendEmail
}