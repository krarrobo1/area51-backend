export const port = process.env.PORT || 4000;
export const env = process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//export const dburi = process.env.DBURI = process.envDBURI || 'postgres://postgres:@localhost:5432/registrate';

export const dburi = process.env.DBURI = 'postgres://bejhidumohwehx:f9d2601d37c83a6880463b2d003519d88f84f5443bcdf9f42d20f0a439ad971e@ec2-174-129-18-42.compute-1.amazonaws.com:5432/dcobn68501ram8'


export const seed = process.env.SEED = process.env.SEED || '19wrqk12n3f876653deyuop';

export const dbconfig = {
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};