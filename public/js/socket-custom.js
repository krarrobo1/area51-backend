/*
 * Client
 */


//var socket = io('http://192.168.137.171:4000',{reconnection: true, reconnectionDelay: 1000, reconnectionDelayMax: 5000, reconnectionAttemps: 5});

//var socket = io('http://localhost:4000', { reconnection: true, timeout: 1000 })
var r1 = Math.floor(Math.random() * 100);
var r2 = Math.floor(Math.random() * 100);

var socket = io('http://localhost:4000');


socket.on('connect', function() {
    console.log('Conectado con el servidor');
    //socket.emit('data', { userid: r1, deviceid: r2, lat: 192.00, long: 192.00, inRange: true });
});

socket.on('valid', function(value) {
    if (value == 'true') {
        console.log('Empieza');
    }
});



var salir = document.getElementById('salir');
var disconnect = document.getElementById('desconectar');
var send = document.getElementById('send');

send.addEventListener('click', function() {
    socket.emit('isValid', '{ "empleadoid": 1, "dispositivoid": 3, "latitud": 38.099, "longitud": 19.223, "enRango": true }');
});


salir.addEventListener('click', function(id) {
    // socket.connect();
    socket.emit('salidaLimitesEmpresa');
});

disconnect.addEventListener('click', function() {
    socket.emit('salidaPorRegistro');
});