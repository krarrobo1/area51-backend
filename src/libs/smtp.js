import { createTransport } from 'nodemailer';
import { transporterConfig } from '../config/config';


export async function sendEmail(mail, res) {
    let transporter = createTransport(transporterConfig);
    let { to, subject, html } = mail;
    let mailOptions = {
        from: 'Registrate App | MailSender <registrate@example.com>',
        to,
        subject,
        html
    };
    try {
        await transporter.sendMail(mailOptions);
    } catch (err) {
        throw err
    }
}