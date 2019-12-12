/*
 * Client
 */


//var socket = io('http://192.168.137.171:4000',{reconnection: true, reconnectionDelay: 1000, reconnectionDelayMax: 5000, reconnectionAttemps: 5});

//var socket = io('http://localhost:4000', { reconnection: true, timeout: 1000 })

var socket = io('http://localhost:4000', { forceNew: false })




// Notifica cuando se ha conectado al servidor, para estar pendiente de cambios
// socket.on('connect', function() {
//     console.log('Conectado con el servidor');
//     socket.emit('entrar', { userid: 1, dispositivoid: 1 });
// });


// Escuchar eventos
socket.on('disconnect', function() {
    console.log('Desconectado');
});

socket.on('reconnect', function() {
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

    let userid = document.getElementById('userid').value;
    let dispositivo = document.getElementById('dispositivo').value;



    socket.emit('send', { userid, dispositivo })
});

ping.addEventListener('click', () => {
    socket.disconnect();
});

msj.addEventListener('click', () => {
    socket.connect();
});