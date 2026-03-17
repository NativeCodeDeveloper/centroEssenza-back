import PublicacionesTituloDescripcion from "../model/PublicacionesTituloDescripcion.js";

export default class PublicacionesTituloDescripcionController{
    constructor(){
    }

    static async seleccionarPublicacionesTituloDescripcionController(req, res){
        try {
            const PublicacionesClass = new PublicacionesTituloDescripcion();
            const respuestaModel = await PublicacionesClass.seleccionarPublicacionesTituloDescripcion();
            if(respuestaModel){
                return res.status(200).json(respuestaModel);
            }else{
                return res.status(404).json([])
            }
        }catch(error){
            return res.status(400).send({message: 'ServerErrror'});
        }
    }



    static async insertarPublicacionesTituloDescripcionController(req, res){
        try {
            const {publicacionesTitulo,publicacionesDescripcion,publicacionesTituloDescripcionImagen} = req.body;
            const PublicacionesClass = new PublicacionesTituloDescripcion();
            const respuestaModel = await PublicacionesClass.insertarPublicacionesTituloDescripcion(publicacionesTitulo,publicacionesDescripcion,publicacionesTituloDescripcionImagen);

            if(respuestaModel.affectedRows > 0){
                return res.status(200).json({message: true});
            }else{
                return res.status(200).json({message: false});
            }
        }catch(error){
            return res.status(400).send({message: 'ServerErrror'});
        }
    }




    static async actualizarPublicacionesTituloDescripcionController(req, res){
        try {
            const {
                publicacionesTitulo,
                publicacionesDescripcion,
                publicacionesTituloDescripcionImagen,
                id_publicacionesTituloDescripcion
            } = req.body;

            const PublicacionesClass = new PublicacionesTituloDescripcion();
            const respuestaModel = await PublicacionesClass.actualizarPublicacionesTituloDescripcion(
                publicacionesTitulo,
                publicacionesDescripcion,
                publicacionesTituloDescripcionImagen,
                id_publicacionesTituloDescripcion
            );

            if(respuestaModel.affectedRows > 0){
                return res.status(200).json({message: true});
            }else{
                return res.status(200).json({message: false});
            }
        }catch(error){
            return res.status(400).send({message: 'ServerErrror'});
        }
    }




    static async eliminarPublicacionesTituloDescripcionController(req, res){
        try {
            const {
                id_publicacionesTituloDescripcion
            } = req.body;

            const PublicacionesClass = new PublicacionesTituloDescripcion();
            const respuestaModel = await PublicacionesClass.eliminacionPublicacionesTituloDescripcion(
                id_publicacionesTituloDescripcion
            );

            if(respuestaModel.affectedRows > 0){
                return res.status(200).json({message: true});
            }else{
                return res.status(200).json({message: false});
            }
        }catch(error){
            return res.status(400).send({message: 'ServerErrror'});
        }
    }




    static async seleccionarEspecifica_PublicacionesTituloDescripcionController(req, res){
        try {
            const {
                id_publicacionesTituloDescripcion
            } = req.body;

            const PublicacionesClass = new PublicacionesTituloDescripcion();
            const respuestaModel = await PublicacionesClass.seleccionarnPublicacionesTituloDescripcionEspecifica(
                id_publicacionesTituloDescripcion
            );

            if(respuestaModel){
                return res.status(200).json(respuestaModel);
            }else{
                return res.status(200).json({message: "sindata"});
            }
        }catch(error){
            return res.status(400).send({message: 'ServerErrror'});
        }
    }


}