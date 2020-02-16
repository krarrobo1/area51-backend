export const port = process.env.PORT || 4000;
export const time = process.env.CRON || '*/15 * * * *';

export const env = process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

export const dburi = process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgres://postgres:@localhost:5432/nueva';
export const seed = process.env.SEED = process.env.SEED || '19wrqk12n3f876653deyuop';

export const google_key = process.env.GOOGLE_KEY;

import { google } from 'googleapis';
const OAuth2 = google.auth.OAuth2;

/*let gmailConfig = {
    userid: process.env.USER_ID,
    secret: process.env.G_SECRET,
    refresh_token: process.env.R_TOKEN,
}*/

const oauth2Client = new OAuth2(
    process.env.USER_ID,
    process.env.G_SECRET,
    "https://developers.google.com/oauthplayground"
);


let accessToken;

if (env !== 'dev') {
    oauth2Client.setCredentials({
        refresh_token: process.env.R_TOKEN
    });
    accessToken = oauth2Client.getAccessToken();
}


const devConfig = {
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};

const prodConfig = {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true
        }
    },
    logging: false,
    ssl: true
}


const devTransporter = {
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: process.env.MUSER || '567e7f50289f0b',
        pass: process.env.MPASS || 'df0b48e0c208a2'
    }
};

const prodTransporter = {
    service: "gmail",
    auth: {
        type: "OAuth2",
        user: "registrateapp@gmail.com",
        clientId: process.env.USER_ID,
        clientSecret: process.env.G_SECRET,
        refreshToken: process.env.R_TOKEN,
        accessToken: accessToken
    }
}



if (env === 'dev') {
    dbconfig = devConfig;
    transporterConfig = devTransporter;
} else {
    dbconfig = prodConfig;
    transporterConfig = prodTransporter;
}



export let dbconfig;
export let transporterConfig;