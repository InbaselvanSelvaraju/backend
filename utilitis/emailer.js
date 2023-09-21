const nodemailer = require("nodemailer")


const sendEmail = async (options) => {
    const transportor = nodemailer.createTransport({
        host : process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user:process.env.EMAIL_USERNAME,
            pass:  process.env.EMAIL_PASSWORD
        }
    }) 

    const mailoptions = {
        from: "inbaselvan <inbaselvaninbaa@gmail.com>",
        to: options.email,
        subject: options.subject,
        text : options.message
    }
    await transportor.sendMail(mailoptions)
}

module.exports = sendEmail;


