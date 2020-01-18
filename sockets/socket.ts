import { Socket } from "socket.io";
import socketIO from 'socket.io';
import { UsuariosLista } from '../class/usuarios-lista';
import { Usuario } from '../class/usuario';
import { Mapa } from '../class/mapa';
import { Marcador } from '../class/marcador';

// exportar usuarios conectados  
export const usuariosConectados = new UsuariosLista();

// exportamos los mapara para obtener una sola instancia del mismo
export const mapa = new Mapa();


// Eventos de mapa
export const mapaSocket = (cliente: Socket, io: socketIO.Server) => {

    cliente.on('nuevo-marcador', (marcador: Marcador) => {
        mapa.agregarMarcador(marcador);

        // emitimos a los demas clientes el marcador menos al cliente local
        cliente.broadcast.emit('nuevo-marcador', marcador);
    });

    cliente.on('eliminar-marcador', ( id: string) => {
        mapa.borrarMarcador(id);

        // emitimos a los demas clientes el marcador menos al cliente local
        cliente.broadcast.emit('eliminar-marcador', id);
    });

    cliente.on('mover-marcador', (marcador: Marcador ) => {

        mapa.moverMarcador(marcador);

        // emitimos a los demás clientes menos al local
        cliente.broadcast.emit('mover-marcador', marcador)
    })

}


// logica para desconectar un cliente
export const desconectar = (cliente: Socket, io: socketIO.Server) => {

    cliente.on('disconnect', () => {
        console.log('Cliente desconectado... ', cliente.id);
        // eliminamos el usuario que se ha desconectado
        usuariosConectados
            .deleteUsuario(cliente.id);

        // modificar el estado de la lista de usuario
        io.emit('usuarios-activos', usuariosConectados
            .getLista())

    })
}

// conectar cliente
export const conectarCliente = (cliente: Socket, io: socketIO.Server) => {

    // creamos una instancia de un usuario
    const usuario = new Usuario(cliente.id);
    usuariosConectados
        .agregar(usuario);



}

// escuchar mensajes
export const mensaje = (cliente: Socket, io: socketIO.Server) => {

    cliente.on('mensaje', (payload: { de: string, cuerpo: string }) => {

        console.log("Mensaje recibido", payload);

        io.emit('nuevo-mensaje', payload);

    });
}

// escuchar login usuario
export const usuarioLogin = (cliente: Socket, io: socketIO.Server) => {

    cliente.on('configurar-usuario', (payload: { nombre: string }, callback: any) => {

        // console.log('Usuario configurando', payload.nombre);

        // Actualizar datos de usuario
        usuariosConectados
            .actualizarUsuario(cliente.id, payload.nombre);

        // modificar el estado de la lista de usuario
        io.emit('usuarios-activos', usuariosConectados.getLista())

        callback({
            Ok: true,
            message: `Usuario ${payload.nombre}, configurado.`
        });

    });
}


// Creamos un metodo para obtener usuarios
export const getUsuarios = (cliente: Socket, io: socketIO.Server) => {

    cliente.on('obtener-usuarios', () => {

        /*
            modificar el estado de la lista de usuario
            utilizando io.to( cliente.id ) es para solo
            emitirlo a la persona que acaba de entrar al chat
        */
        io.to(cliente.id).emit('usuarios-activos', usuariosConectados.getLista())

    });
}
