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
        console.log(`Email sended to ${to}`);
    } catch (err) {
        throw err
    }
}