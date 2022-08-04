const { Router } = require('express');
require('dotenv').config();
const { User } = require('../db')
const jwt = require('jsonwebtoken')
const keys = require('../../settings/keys')
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)



const router = Router()

router.get('/', (req, res) => {
    return res.send('estas en auth')
})

router.post('/register', async (req, res) => {
    const { username, password } = req.body

    if(!username || !password){
        return res.send('Faltan datos obligatorios')
    }

    try {
        
        

        const findUser = await User.findOne({
            where:{
                name:username
            }
        })

        if(findUser){
            return res.send({error: 'El usuario ya existe'})
        }else{
            let user = await User.create({
                name: username,
                password: password
            })

            const msg = {
                to: user.name, // Change to your recipient
                from: user.name, // Change to your verified sender
                subject: 'Bienvenido!',
                text: 'Bienvenido a AlkemyMovies',
                html: '<strong>Bienvenido a AlkemyMovies</strong>',
              }

            sgMail
            .send(msg)
            .then(() => {
                console.log('Email sent')
            })
            .catch((error) => {
                console.error(error)
            })

            return res.send(user)
        } 

    } catch (error) {
        return res.send(error)
    }
})

router.post('/login', async(req, res) => {
    let { username, password } = req.body

    if(!username || !password){
        return res.send('Faltan datos obligatorios')
    }

    try {
        password = password.toString()

        const findUser = await User.findOne({
            where:{
                name:username
            }
        })

        

        if(!findUser){
            return res.send('El usuario no existe!')
        }else if(findUser.password !== password){
            return res.send('La contraseña no coincide.')
        }else{
            
            const payload = {
                check:true
            }
            const token = await jwt.sign(payload, keys.key,{
                expiresIn: '7d'
            })

            res.send({
                message: 'Has iniciado sesion!',
                token: token
            })
        }

    } catch (error) {
        return res.send(error)
    }
})

module.exports = router