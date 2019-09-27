"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _sequelize = _interopRequireDefault(require("sequelize"));

var _database = require("../database/database");

var _Permiso = _interopRequireDefault(require("../models/Permiso"));

var _Empleado = _interopRequireDefault(require("../models/Empleado"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var DetallePermiso = _database.sequelize.define('detallepermiso', {
  id: {
    type: _sequelize["default"].INTEGER,
    primaryKey: true
  },
  fechainicio: {
    type: 'TIMESTAMPTZ'
  },
  fechafin: {
    type: 'TIMESTAMPTZ'
  },
  estado: {
    type: _sequelize["default"].BOOLEAN
  }
}, {
  timestamps: false
});

_Permiso["default"].hasMany(DetallePermiso, {
  foreignKey: 'permisoid',
  sourceKey: 'id'
});

DetallePermiso.belongsTo(_Permiso["default"], {
  foreignKey: 'permisoid',
  sourceKey: 'id'
});

_Empleado["default"].hasMany(DetallePermiso, {
  foreignKey: 'empleadoid',
  sourceKey: 'id'
});

DetallePermiso.belongsTo(_Empleado["default"], {
  foreignKey: 'empleadoid',
  sourceKey: 'id'
});
var _default = DetallePermiso;
exports["default"] = _default;