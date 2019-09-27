"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _sequelize = _interopRequireDefault(require("sequelize"));

var _database = require("../database/database");

var _Cargo = _interopRequireDefault(require("../models/Cargo"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Empresa = _database.sequelize.define('empresa', {
  id: {
    type: _sequelize["default"].INTEGER,
    primaryKey: true
  },
  nombre: {
    type: _sequelize["default"].STRING(50),
    allowNull: false
  },
  latitud: {
    type: _sequelize["default"].NUMBER,
    allowNull: false
  },
  longitud: {
    type: _sequelize["default"].NUMBER,
    allowNull: false
  },
  radio: {
    type: _sequelize["default"].NUMBER,
    allowNull: false
  },
  estado: {
    type: _sequelize["default"].BOOLEAN
  }
}, {
  timestamps: false
});

Empresa.hasMany(_Cargo["default"], {
  foreignKey: 'empresaid',
  sourceKey: 'id'
});

_Cargo["default"].belongsTo(Empresa, {
  foreignKey: 'empresaid',
  sourceKey: 'id'
});

var _default = Empresa;
exports["default"] = _default;