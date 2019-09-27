"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _sequelize = _interopRequireDefault(require("sequelize"));

var _database = require("../database/database");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

//import Dia from './Dia';
var Periodo = _database.sequelize.define('periodo', {
  id: {
    type: _sequelize["default"].INTEGER,
    primaryKey: true
  },
  horainicio: {
    type: _sequelize["default"].TIME
  },
  horafin: {
    type: _sequelize["default"].TIME
  }
}, {
  timestamps: false
});

var _default = Periodo;
exports["default"] = _default;