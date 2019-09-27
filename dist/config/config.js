"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dbconfig = exports.seed = exports.dburi = exports.env = exports.port = void 0;
var port = process.env.PORT || 4000;
exports.port = port;
var env = process.env.NODE_ENV = process.env.NODE_ENV || 'dev';
exports.env = env;
var dburi = process.env.DBURI = process.envDBURI || 'postgres://postgres:@localhost:5432/registrate';
exports.dburi = dburi;
var seed = process.env.SEED = process.env.SEED || '19wrqk12n3f876653deyuop';
exports.seed = seed;
var dbconfig = {
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};
exports.dbconfig = dbconfig;