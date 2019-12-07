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

// Escuchar mensaje
socket.on('enviarMensaje', function(obj) {
    console.log('Servidor: ', obj);

});




let miboton = document.getElementById('miboton');

miboton.addEventListener('click', () => {
    let name = document.getElementById('name');
    let message = document.getElementById('message');
    /*socket.emit('enviarMensaje', {
        usuario: name.value,
        mensaje: message.value
    }, function(resp) {
        console.log('respuesta server', resp);
    });*/
    socket.emit('imhere', { id: 7, range: Math.floor(Math.random() * 100), lat: -3.986957, long: -79.201525 });
    name.value = '';
    message.value = '';
    window.alert('Mensaje Enviado!');
});