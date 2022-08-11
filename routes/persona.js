import {Router} from "express"
import {personaGet, personaPost, personaGetLogin, personaGetId, personaGetEmail, personaPut,personPut,personaPutActive,personaPutDeActiv} from "../controllers/persona.js"
import {check} from "express-validator"
import {validarCampos} from "../middleware/validar_campos.js"
import {helpersPersona} from "../helpers/persona.js"
import {validarJWT} from "../middleware/validar-jwt.js"
const router = new Router()

router.get('/',[
    validarJWT,
    validarCampos
],personaGet)

router.get('/:id',[
    check('id').isMongoId(),
    validarCampos
],personaGetId)

router.get('/email/:email',personaGetEmail)

router.post('/',[
    check('nombre', 'El nombre es obligatorio!').not().isEmpty(),
    check('apellido', 'El apellido es obligatorio').not().isEmpty(),
    check('email', 'El correo no es válido').isEmail(),
    check('email').custom( helpersPersona.existeEmail ),
    check('password', 'Password no es válido').isLength({ min: 6}),
    validarCampos       
],personaPost)
router.put('/:id',[
    check('id').isMongoId(),
    validarCampos
],personaPut)

router.put('/estado/:id',[
    check('id').isMongoId(),
    validarCampos
],personPut)

router.put('/activar/:id',[
    check('id').isMongoId(),
    check('id').custom(helpersPersona.existeUsuarioById),
    validarCampos
],personaPutActive)

router.put('/desactivar/:id',[
    check('id').isMongoId(),
    check('id').custom(helpersPersona.existeUsuarioById),
    validarCampos
],personaPutDeActiv)

router.get('/login/user',[
    check('email', 'El correo no es válido').isEmail(),
    
    validarCampos    
],personaGetLogin)



export default router