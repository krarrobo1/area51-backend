"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _sequelize = _interopRequireDefault(require("sequelize"));

var _database = require("../database/database");

var _Cargo = _interopRequireDefault(require("../models/Cargo"));

var _Empresa = _interopRequireDefault(require("../models/Empresa"));

var _Rol = _interopRequireDefault(require("../models/Rol"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Empleado = _database.sequelize.define('empleado', {
  id: {
    type: _sequelize["default"].INTEGER,
    primaryKey: true
  },
  nombres: {
    type: _sequelize["default"].STRING,
    allowNull: false
  },
  apellidos: {
    type: _sequelize["default"].STRING,
    allowNull: false
  },
  ci: {
    type: _sequelize["default"].STRING,
    allowNull: false
  },
  email: {
    type: _sequelize["default"].STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: _sequelize["default"].TEXT,
    allowNull: false
  }
}, {
  timestamps: false
});

_Cargo["default"].hasMany(Empleado, {
  foreignKey: 'cargoid',
  sourceKey: 'id'
});

Empleado.belongsTo(_Cargo["default"], {
  foreignKey: 'cargoid',
  sourceKey: 'id'
});
Empleado.belongsTo(_Empresa["default"], {
  foreignKey: 'empresaid',
  sourceKey: 'id'
});

_Empresa["default"].hasMany(Empleado, {
  foreignKey: 'empresaid',
  sourceKey: 'id'
});

Empleado.belongsTo(_Rol["default"], {
  foreignKey: 'rolid',
  sourceKey: 'id'
});

_Rol["default"].hasMany(Empleado, {
  foreignKey: 'rolid',
  sourceKey: 'id'
});
/*
Cargo.hasMany(Empleado, { foreignKey: 'cargoid', sourceKey: 'id' });
Empleado.belongsTo(Cargo, { foreignKey: 'cargoid', sourceKey: 'id' });

Empleado.belongsTo(Empresa, { foreignKey: 'empresaid', sourceKey: 'id' });
Empresa.hasMany(Empleado, { foreignKey: 'empresaid', sourceKey: 'id' });
*/


var _default = Empleado;
exports["default"] = _default;