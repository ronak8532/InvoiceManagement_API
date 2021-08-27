const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");

const {
    mail: { username, password, from, service, siteLink, port, host },
} = require("../config/var");

let transporter = nodemailer.createTransport({
    service: service,
    auth: {
        user: username,
        pass: password,
    },
});

let MailGenerator = new Mailgen({
    theme: "default",
    product: {
        name: "Laundry Hut",
        link: siteLink,
    },
});

/**
 * 
 *  @method sendMail
 *  @param
 */
exports.sendMail = (mailBody, to, subject, attachments) => {
    let mail = MailGenerator.generate(mailBody);

    let message = {
        from: from,
        to: to,
        subject: subject,
        html: mail,
    };

    if (attachments) {
        message.attachments = attachments
    }

    transporter
        .sendMail(message)
        .then(() => {
            return true;
        })
        .catch((error) => console.error(error));
}

exports.subjects = {
    passwordResetRequest: 'Resetting your Laundry Hut password',
    passwordResetSuccess: 'Your password has beeen reset',
    accountRegistrationSuccess: 'Your account has been created',
    orderConfirmationInvoice: 'Your order has been confirmed'
}

exports.mailBody = {
    passwordResetSuccess: 'Your Laundry Hut password has been reset. If you did not perform this operation, please contact your manager.',
    accountRegistrationSuccess: 'Your account has been created. Welcome to Laundry Hut',
    orderConfirmationInvoice: ''
}
