import Persona from '../models/persona.js';
import { generarJWT } from '../middleware/validar-jwt.js';
import bcryptjs from "bcryptjs"

const personaGet= async (req, res)=>{
    const personas = await Persona.find()
    res.json({
        personas
    })
}

const personaGetId= async (req, res)=>{
    const {id}=req.params
    const persona = await Persona.findById(id) 

    res.json({
        persona
    })
}

const personaGetEmail= async (req, res)=>{
    const {email}=req.params
    const persona = await Persona.find({email}) 

    res.json({
        persona
    })
}
const personaPost = async (req, res)=>{
    const {nombre,apellido,email,password}=req.body
    const persona = new Persona({nombre,apellido,email,password})
    const salt=bcryptjs.genSaltSync(10)
    persona.password=bcryptjs.hashSync(password,salt)
    persona.save() //esto me permite guardar la informacion en la base de datos
    res.json({persona})
}

const personaPut = async (req, res)=>{
    const {id} = req.params;    
    const {nombre,apellido,email,password}=req.body;
    const persona= await Persona.findByIdAndUpdate(id,{nombre,apellido,email,password});
    res.json({
        persona
    })
}

const personPut = async (req, res) => {   
    const { id } = req.params;  
    const { _id, createdAt,estado, ...resto } = req.body;
    const persona = await Persona.findByIdAndUpdate(id, resto);

    res.json({
        persona
    })
}

const personaPutActive=async (req, res) => {   
    const { id } = req.params;
    const persona = await Persona.findByIdAndUpdate(id, {estado:1});

    res.json({
        persona
    })
}

const personaPutDeActiv=async (req, res) => {   
    const { id } = req.params;
    const persona = await Persona.findByIdAndUpdate(id, {estado:0});

    res.json({
        persona
    })
}
const personaGetLogin= async (req, res)=>{
    const { email, password } = req.query;

        try {
            const persona = await Persona.findOne({ email })
            if (!persona) {
                return res.status(400).json({
                    msg: "Usuario / Password no son correctos"
                })
            }


            if (persona.estado === 0) {
                return res.status(400).json({
                    msg: "Usuario Inactivo"
                })
            }

            const validPassword = bcryptjs.compareSync(password, persona.password);
            if (!validPassword) {
                return res.status(400).json({
                    msg: "Usuario / Password no son correctos"
                })
            }

            const token = await generarJWT(persona.id);

            res.json({
                persona,
                token
            })

        } catch (error) {
            return res.status(500).json({
                msg: "Hable con el WebMaster"
            })
        }
}

export {personaGet, personaPost, personaGetLogin, personaGetId, personaGetEmail, personaPut,personPut,personaPutActive,personaPutDeActiv}