export const port = process.env.PORT || 4000;

export const env = process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

export const dburi = process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgres://postgres:@localhost:5432/registrate';
export const seed = process.env.SEED = process.env.SEED || '19wrqk12n3f876653deyuop';

export const google_key = process.env.GOOGLE_KEY;

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

export const transporterConfig = {
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: process.env.MUSER || '567e7f50289f0b',
        pass: process.env.MPASS || 'df0b48e0c208a2'
    }
};