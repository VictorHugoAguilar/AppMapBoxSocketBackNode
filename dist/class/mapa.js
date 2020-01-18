"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Mapa {
    constructor() {
        this.marcadores = {
            '1': {
                id: '1',
                nombre: 'Fernando',
                lng: -75.75512993582937,
                lat: 45.349977429009954,
                color: '#dd8fee'
            },
            '2': {
                id: '2',
                nombre: 'Amy',
                lng: -75.75195645527508,
                lat: 45.351584045823756,
                color: '#790af0'
            },
            '3': {
                id: '3',
                nombre: 'Orlando',
                lng: -75.75900589557777,
                lat: 45.34794635758547,
                color: '#19884b'
            }
        };
    }
    getMarcadores() {
        return this.marcadores;
    }
    agregarMarcador(marcador) {
        this.marcadores[marcador.id] = marcador;
    }
    borrarMarcador(id) {
        // delete Metodo de javascrip para eliminar propiedades de un objeto
        delete this.marcadores[id];
        return this.getMarcadores();
    }
    moverMarcador(marcador) {
        this.marcadores[marcador.id].lng = marcador.lng;
        this.marcadores[marcador.id].lat = marcador.lat;
    }
}
exports.Mapa = Mapa;
