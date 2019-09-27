"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _sequelize = _interopRequireDefault(require("sequelize"));

var _database = require("../database/database");

var _Periodo = _interopRequireDefault(require("../models/Periodo"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Dia = _database.sequelize.define('dias', {
  id: {
    type: _sequelize["default"].INTEGER,
    primaryKey: true
  },
  nombre: {
    type: _sequelize["default"].STRING
  }
}, {
  timestamps: false
});

_Periodo["default"].belongsTo(Dia, {
  foreignKey: 'diaid',
  sourceKey: 'id'
});

Dia.hasMany(_Periodo["default"], {
  foreignKey: 'diaid',
  sourceKey: 'id'
});
var _default = Dia;
exports["default"] = _default;