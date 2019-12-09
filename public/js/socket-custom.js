

/*
 * Client
 */


var socket = io('http://192.168.137.171:4000',{reconnection: true, reconnectionDelay: 1000, reconnectionDelayMax: 5000, reconnectionAttemps: 5});






// Notifica cuando se ha conectado al servidor, para estar pendiente de cambios
socket.on('connect', function() {
    console.log('Conectado al servidor');
});

// Escuchar eventos
socket.on('disconnect', function() {
    alert('Perdimos coneccion con el servidor');
});

socket.on('reconnect',function(){
    alert('Reconectado con el server..');
})

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