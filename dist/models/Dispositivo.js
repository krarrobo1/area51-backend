"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _sequelize = _interopRequireWildcard(require("sequelize"));

var _database = require("../database/database");

var _Empleado = _interopRequireDefault(require("../models/Empleado"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var Dispositivo = _database.sequelize.define('dispositivo', {
  id: {
    type: _sequelize.INTEGER,
    primaryKey: true
  },
  nombre: {
    type: _sequelize.STRING,
    allowNull: false
  },
  ip: {
    type: _sequelize.CIDR,
    allowNull: false
  },
  mac: {
    type: _sequelize.MACADDR,
    allowNull: false
  },
  modelo: {
    type: _sequelize.STRING,
    allowNull: true
  },
  estado: {
    type: _sequelize.BOOLEAN
  }
}, {
  timestamps: false
});

console.log(_Empleado["default"]);

_Empleado["default"].hasMany(Dispositivo, {
  foreignKey: 'empleadoid',
  sourceKey: 'id'
});

Dispositivo.belongsTo(_Empleado["default"], {
  foreignKey: 'empleadoid',
  sourceKey: 'id'
});
var _default = Dispositivo;
exports["default"] = _default;