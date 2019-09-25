export const port = process.env.PORT || 4000;
export const env = process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

export const dburi = process.env.DBURI = process.envDBURI || 'postgres://admin:admin@35.202.182.122:5432/area51';

export const dbdev = 'postgres://postgres:@localhost:5432/registrate'

export const seed = process.env.SEED = process.env.SEED || '19wrqk12n3f876653deyuop';

export const dbconfig = {
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};