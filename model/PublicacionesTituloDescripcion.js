
import DataBase from "../config/Database.js";

export default class PublicacionesTituloDescripcion{
    constructor(id_publicacionesTituloDescripcion,publicacionesTitulo,publicacionesDescripcion,publicacionesTituloDescripcionImagen,publicacionesTituloDescripcion_estado ){
        this.id_publicacionesTituloDescripcion =id_publicacionesTituloDescripcion;
        this.publicacionesTitulo = publicacionesTitulo;
        this.publicacionesDescripcion = publicacionesDescripcion;
        this.publicacionesTituloDescripcionImagen = publicacionesTituloDescripcionImagen;
        this.publicacionesTituloDescripcion_estado = publicacionesTituloDescripcion_estado;
    }


    //SELECCIONAR TODAS LAS PUBLICACIONES
    async seleccionarPublicacionesTituloDescripcion() {
        const conexion = DataBase.getInstance();
        const query = "SELECT * FROM publicacionesTituloDescripcion WHERE publicacionesTituloDescripcion_estado <> 0";
        try {
            const resultado = await conexion.ejecutarQuery(query);
            return resultado;
        } catch (error) {
            console.log(error);
        }
    }


    //METODO PARA INSERTAR NUEVA PUBLICACION
    async insertarPublicacionesTituloDescripcion(
        publicacionesTitulo,publicacionesDescripcion,publicacionesTituloDescripcionImagen
    ){
        const conexion = DataBase.getInstance();
        const query = 'INSERT INTO publicacionesTituloDescripcion(publicacionesTitulo,publicacionesDescripcion,publicacionesTituloDescripcionImagen) VALUES (?,?,?)';
        const param = [
            publicacionesTitulo,publicacionesDescripcion,publicacionesTituloDescripcionImagen
        ];
        try {
            const resultado = await conexion.ejecutarQuery(query,param);
            if (resultado) {
                return resultado;
            }
        } catch (error) {
            throw new Error('NO se logo ingresar publicacion nueva / Problema al establecer la conexion con la base de datos desde la clase Publicaciones.js')

        }
    }





    //METODO PARA ACTUALIZAR NUEVA PUBLICACION
    async actualizarPublicacionesTituloDescripcion(
        publicacionesTitulo,publicacionesDescripcion,publicacionesTituloDescripcionImagen,id_publicacionesTituloDescripcion
    ){
        const conexion = DataBase.getInstance();
        const query = `
UPDATE publicacionesTituloDescripcion SET publicacionesTitulo = ?, publicacionesDescripcion = ?, publicacionesTituloDescripcionImagen = ?
WHERE id_publicacionesTituloDescripcion = ?
`;
        const param = [
            publicacionesTitulo,publicacionesDescripcion,publicacionesTituloDescripcionImagen,id_publicacionesTituloDescripcion
        ];
        try {
            const resultado = await conexion.ejecutarQuery(query,param);
            if (resultado) {
                return resultado;
            }
        } catch (error) {
            throw new Error('NO se logo ingresar publicacion nueva / Problema al establecer la conexion con la base de datos desde la clase Publicaciones.js')

        }
    }





    //METODO PARA ELIMINACION LOGICA DE UNA PUBLICACIONDE 1 A CERO
    async eliminacionPublicacionesTituloDescripcion(
        id_publicacionesTituloDescripcion
    ){
        const conexion = DataBase.getInstance();
        const query = `
UPDATE publicacionesTituloDescripcion SET publicacionesTituloDescripcion_estado = 0 WHERE id_publicacionesTituloDescripcion = ?
`;
        const param = [
            id_publicacionesTituloDescripcion
        ];
        try {
            const resultado = await conexion.ejecutarQuery(query,param);
            if (resultado) {
                return resultado;
            }
        } catch (error) {
            throw new Error('NO se logo eliminar publicacion nueva / Problema al establecer la conexion con la base de datos desde la clase Publicaciones.js')

        }
    }






    //METODO PARA ELIMINACION LOGICA DE UNA PUBLICACIONDE 1 A CERO
    async seleccionarnPublicacionesTituloDescripcionEspecifica(
        id_publicacionesTituloDescripcion
    ){
        const conexion = DataBase.getInstance();
        const query = `
SELECT * from publicacionesTituloDescripcion WHERE  id_publicacionesTituloDescripcion = ? and publicacionesTituloDescripcion_estado <> 0
`;
        const param = [
            id_publicacionesTituloDescripcion
        ];
        try {
            const resultado = await conexion.ejecutarQuery(query,param);
            if (resultado) {
                return resultado;
            }
        } catch (error) {
            throw new Error('NO se logo eliminar publicacion nueva / Problema al establecer la conexion con la base de datos desde la clase Publicaciones.js')

        }
    }

}