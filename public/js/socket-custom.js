/*
 * Client
 */


var socket = io();




// Notifica cuando se ha conectado al servidor, para estar pendiente de cambios
socket.on('connect', function() {
    console.log('Conectado al servidor');
});

// Escuchar eventos
socket.on('disconnect', function() {
    console.log('Perdimos coneccion con el servidor');
});

socket.on('recieveMessage', function(msj) {
    console.log('El servidor dice:', msj);
});

// Escuchar mensaje
socket.on('enviarMensaje', function(obj) {
    console.log('Servidor: ', obj);

});

socket.on("pong", function(data) {
    console.log('Latency', data);
});




let miboton = document.getElementById('miboton');
let ping = document.getElementById('ping');
let msj = document.getElementById('msj');

miboton.addEventListener('click', () => {

    let name = document.getElementById('name');
    let message = document.getElementById('message');
    socket.emit('sendRange', { id: 7, radio: 60, latitud: -3.986957, longitud: -79.201525 });
    console.log('mensaje enviado...');
});

ping.addEventListener('click', () => {
    socket.emit('ping');
});

msj.addEventListener('click', () => {
    socket.emit('sendMessage', 'Hola');
});