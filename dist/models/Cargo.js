"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _sequelize = _interopRequireDefault(require("sequelize"));

var _database = require("../database/database");

var _Periodo = _interopRequireDefault(require("./Periodo"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Cargo = _database.sequelize.define('cargo', {
  id: {
    type: _sequelize["default"].INTEGER,
    primaryKey: true
  },
  nombre: {
    type: _sequelize["default"].TEXT
  }
}, {
  timestamps: false
});

Cargo.hasMany(_Periodo["default"], {
  foreignKey: 'cargoid',
  sourceKey: 'id'
});

_Periodo["default"].belongsTo(Cargo, {
  foreignKey: 'cargoid',
  sourceKey: 'id'
});

var _default = Cargo;
exports["default"] = _default;