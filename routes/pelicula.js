import {Router} from "express"
import {peliculaPost,peliculaGet,peliculaGetId,peliculaGetTitulo,peliculaGetActoresPelicula,peliculaPut,peliculaDelete} from "../controllers/pelicula.js"
import { check } from "express-validator"
import { validarCampos } from "../middleware/validar_campos.js"
import {helpersPelicula} from "../helpers/pelicula.js"
import { validarJWT } from "../middleware/validar-jwt.js"
import validarExistaArchivo from "../middleware/validar-existe-archivo.js"
import { cargarArchivo } from "../controllers/pelicula.js"
import subirArchivo from "../helpers/subir-archivo.js"


const router = new Router()

router.get('/',peliculaGet)
router.get('/id/:id',[
    check('id').isMongoId(),
    validarCampos
],peliculaGetId)
router.get('/titulo',peliculaGetTitulo)
router.get('/actor/pelicula/:id',[
    check('id').isMongoId(),
    validarCampos
], peliculaGetActoresPelicula)
router.post('/',[
    check('titulo', 'El titulo es obligatorio!').not().isEmpty(),
    check('subtitulo', 'El subtitulo es obligatorio').not().isEmpty(),
    check('duracion', 'El tiempo de duracion es obligatorio').not().isEmpty(),
    check('poster', 'El poster es obligatorio').not().isEmpty(),
    check('genero', 'El genero es obligatorio').not().isEmpty(),
    check('sinopsis', 'La sinopsis es obligatorio').not().isEmpty(),
    check('estado', 'El estado es obligatorio').not().isEmpty(),
    check('idioma', 'El campo idioma es obligatorio').not().isEmpty(),
    check('director', 'El campo director es obligatorio').not().isEmpty(),
    check('reparto').custom(helpersPelicula.Reparto),
    validarCampos       
],peliculaPost)
router.post('/upload/:id',[
    validarJWT,
    check('id', 'No es un ID válido').isMongoId(),
    //check('id').custom(), 
    validarExistaArchivo,
    validarCampos
],cargarArchivo)

router.post('/subir')
check('id').isMongoId(),
subirArchivo,

router.put('/:id',[
    check('id').isMongoId(),
    validarCampos
],peliculaPut)
router.delete('/:id',[
    check('id').isMongoId(),
    validarCampos
],peliculaDelete)


export default router