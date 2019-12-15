export const port = process.env.PORT || 4000;

export const env = process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

export const dburi = process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgres://postgres:@localhost:5432/registrate';
export const seed = process.env.SEED = process.env.SEED || '19wrqk12n3f876653deyuop';

export const google_key = process.env.GOOGLE_KEY;

import { google } from 'googleapis';
const OAuth2 = google.auth.OAuth2;

let gmailConfig = {
    userid: process.env.USER_ID,
    secret: process.env.G_SECRET,
    refresh_token: process.env.R_TOKEN,

}

const oauth2Client = new OAuth2(
    gmailConfig.userid,
    gmailConfig.secret,
    "https://developers.google.com/oauthplayground"
);

oauth2Client.setCredentials({
    refresh_token: gmailConfig.refresh_token
});

const accessToken = oauth2Client.getAccessToken();

export const dbconfig = {
    dialect: 'postgres',
    dialectOptions: {
        ssl: true
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};



// export const transporterConfig = {
//     host: "smtp.mailtrap.io",
//     port: 2525,
//     auth: {
//         user: process.env.MUSER || '567e7f50289f0b',
//         pass: process.env.MPASS || 'df0b48e0c208a2'
//     }
// };

export const transporterConfig = {
    service: "gmail",
    auth: {
        type: "OAuth2",
        user: "registrateapp@gmail.com",
        clientId: gmailConfig.userid,
        clientSecret: gmailConfig.secret,
        refreshToken: gmailConfig.refresh_token,
        accessToken: accessToken
    }
}