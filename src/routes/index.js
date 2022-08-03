const { Router } = require('express');
// Importar todos los routers;
const authRouter = require('./auth.js');
const charactersRouter = require('./character')
const moviesRouter = require('./movie')


const jwt = require('jsonwebtoken')
const keys = require('../../settings/keys')



const router = Router();

function verification(req, res, next){
    let token = req.headers['x-access-token'] || req.headers['authorization'];
    if(!token){
        return res.status(401).send({
            error: 'Es necesario el token para ver la informacion.'
        })
    }
    if(token.startsWith('Bearer ')){
        token = token.slice(7, token.length);
    }
    if(token){
        jwt.verify(token, keys.key, (err, decoded) => {
            if(err){
                return res.json({
                    error: 'Token invalido'
                })
            }else{
                req.decoded = decoded
                next()
            }
        })
    }
}

// Configurar los routers
router.use('/auth', authRouter);
router.use('/characters', verification, charactersRouter)
router.use('/movies', verification, moviesRouter)


module.exports = router;