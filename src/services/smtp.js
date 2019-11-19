import { createTransport } from 'nodemailer';
import { transporterConfig } from '../config/config';

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
        console.log(err);
        return res.status(500).json({ ok: false, err });
    }
}