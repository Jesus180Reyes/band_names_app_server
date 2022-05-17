const { io } = require('../index');
const Band = require('../models/band');
const Bands = require('../models/bands');

const bands = new Bands();
bands.addBand(new Band('Queen'));
bands.addBand(new Band('Martin Garrix'));
bands.addBand(new Band('Daft Punk'));
bands.addBand(new Band('Metallica'));
bands.addBand(new Band('Rammstein'));
bands.addBand(new Band('The Strokes'));
bands.addBand(new Band('Post Malone'));
// console.log(bands);
// Mensajes sockets
io.on('connection', client => {
    console.log("Cliente conectado");
    client.emit('active-bands', bands.getBands());

    client.on('disconnect', () => {
        console.log("Cliente desconectado");
    });
    client.on('mensaje', (payload) => {
        // console.log("Mensaje", payload);
        io.emit('mensaje', { admin: 'nuevo mensaje' });
        bands.addBand()
    });
    client.on('add-band', (payload) => {
        const newBand = new Band(payload.name);
        bands.addBand(newBand);
        io.emit('active-bands', bands.getBands());

    });
    client.on('delete-band', (payload) => {
        bands.deleteBand(payload.id);
        io.emit('active-bands', bands.getBands());

    });
    // Escuchar evento
    // client.on('emitir-mensaje', (payload) => {
    //     // io.emit('nuevo-mensaje', payload);  // Emite a todos los clientes
    //     client.broadcast.emit('nuevo-mensaje', payload); // Emite a todos los clientes excepto al que lo envia
    //     console.log(payload);
    // });
    client.on('vote-band', (payload) => {
        bands.voteBand(payload.id);
        io.emit('active-bands', bands.getBands());
    });

});