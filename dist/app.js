"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireWildcard(require("express"));

var _morgan = _interopRequireDefault(require("morgan"));

var _empresa = _interopRequireDefault(require("./routes/empresa"));

var _empleado = _interopRequireDefault(require("./routes/empleado"));

var _cargo = _interopRequireDefault(require("./routes/cargo"));

var _periodo = _interopRequireDefault(require("./routes/periodo"));

var _dispositivo = _interopRequireDefault(require("./routes/dispositivo"));

var _asistencia = _interopRequireDefault(require("./routes/asistencia"));

var _detallepermiso = _interopRequireDefault(require("./routes/detallepermiso"));

var _login = _interopRequireDefault(require("./routes/login"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

//Routes
var app = (0, _express["default"])(); // Middlewares

app.use((0, _morgan["default"])('dev'));
app.use((0, _express.json)());
app.use('/api/empresa', _empresa["default"]);
app.use('/api/empleado', _empleado["default"]);
app.use('/api/cargo', _cargo["default"]);
app.use('/api/periodo', _periodo["default"]);
app.use('/api/dispositivo', _dispositivo["default"]);
app.use('/api/asistencia', _asistencia["default"]);
app.use('/api/permiso', _detallepermiso["default"]);
app.use('/api/login', _login["default"]);
var _default = app;
exports["default"] = _default;