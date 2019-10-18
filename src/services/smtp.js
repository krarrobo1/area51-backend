import { createTransport } from 'nodemailer';
import { transporterConfig } from '../config/config';

/*
class Mail {
    constructor(to, subject, text) {
        this.to = to;
        this.subject = subject;
        this.text = text;
    }
}*/

export async function sendEmail(mail, res) {
    let transporter = createTransport(transporterConfig);
    let { to, subject, text } = mail;
    let mailOptions = {
        from: 'Registrate App | MailSender <registrate@example.com>',
        to,
        subject,
        text
    };
    try {
        await transporter.sendMail(mailOptions);
        return true;
    } catch (err) {
        return res.status(500).json({ ok: false, err });
    }
}