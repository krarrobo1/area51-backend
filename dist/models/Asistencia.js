"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _sequelize = _interopRequireWildcard(require("sequelize"));

var _database = require("../database/database");

var _Dispositivo = _interopRequireDefault(require("../models/Dispositivo"));

var _Evento = _interopRequireDefault(require("../models/Evento"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var Asistencia = _database.sequelize.define('asistencias', {
  id: {
    type: _sequelize["default"].INTEGER,
    primaryKey: true
  },
  hora: {
    type: 'TIMESTAMPTZ'
  },
  latitud: {
    type: _sequelize["default"].NUMBER
  },
  longitud: {
    type: _sequelize["default"].NUMBER
  }
}, {
  timestamps: false
});

Asistencia.belongsTo(_Dispositivo["default"], {
  foreignKey: 'dispositivoid',
  sourceKey: 'id'
});

_Dispositivo["default"].hasMany(Asistencia, {
  foreignKey: 'dispositivoid',
  sourceKey: 'id'
});

Asistencia.belongsTo(_Evento["default"], {
  foreignKey: 'eventoid',
  sourceKey: 'id'
});

_Evento["default"].hasMany(Asistencia, {
  foreignKey: 'eventoid',
  sourceKey: 'id'
});

var _default = Asistencia;
exports["default"] = _default;