import subirArchivo from '../helpers/subir-archivo.js';
import Pelicula from '../models/pelicula.js';
import path from 'path'
import url from 'url'
import * as fs from "fs"

const peliculaGet= async (req, res)=>{
    const peliculas = await Pelicula.find()
    res.json({
        peliculas
    })
}

const peliculaGetId= async (req, res)=>{
    const {id}=req.params
    const pelicula = await Pelicula.findById(id) 

    res.json({
        pelicula
    })
}

const peliculaGetTitulo= async (req, res)=>{
    const {titulo}=req.query
    const pelicula = await Pelicula.find({$or:[
        {titulo:new RegExp(titulo)},
        {subtitulo:new RegExp(titulo)}
    ]}) 

    res.json({
        pelicula
    })
}

const peliculaGetActoresPelicula = async (req, res)=>{
    const {id}= req.params;
    const pelicula = await Pelicula.find().where('reparto.idActor').in(id).exec();
    res.json({
        pelicula
    })
}

const peliculaPost = async (req, res)=>{
    const {titulo,subtitulo,duracion,poster,genero,sinopsis,estado,idioma,director,reparto}=req.body;
    const peliculas = new Pelicula({titulo,subtitulo,duracion,poster,genero,sinopsis,estado,idioma,director,reparto})
    peliculas.save() //esto me permite guardar la informacion en la base de datos
    res.json({peliculas})
}

const peliculaPut = async (req, res)=>{
    const {id} = req.params;    
    const {titulo,subtitulo,duracion,poster,genero,sinopsis,estado,idioma,director,reparto}=req.body;
    const pelicula= await Pelicula.findByIdAndUpdate(id,{titulo,subtitulo,duracion,poster,genero,sinopsis,estado,idioma,director,reparto});
    res.json({
        pelicula
    })
}

const cargarArchivo = async (req, res) => {
    const { id } = req.params;
   // try {
        let nombre
        await subirArchivo(req.files, undefined)
            .then(value => nombre = value)
            .catch((err) => console.log(err));

        //persona a la cual pertenece la foto
        let pelicula = await Pelicula.findById(id);
        if (pelicula.poster) {
            const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
            const pathImage = path.join(__dirname, '../uploads/', pelicula.poster);
            
            if (fs.existsSync(pathImage)) {
                console.log('Existe archivo');
                fs.unlinkSync(pathImage)
            }
            
        }
       
        await Pelicula.findByIdAndUpdate(id, { poster: nombre })
        //responder
        res.json({ nombre });
    // } catch (error) {
    //     res.status(400).json({ error, 'general': 'Controlador' })
    // }

}

const peliculaDelete = async (req, res)=>{
    const {id}= req.params;
   const pelicula= await Pelicula.findByIdAndDelete(id);
   res.json({
       pelicula
   })
}


export {peliculaGet, peliculaPost, peliculaGetId,peliculaGetTitulo,peliculaGetActoresPelicula,peliculaPut,cargarArchivo,peliculaDelete}