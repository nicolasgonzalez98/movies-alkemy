const { Router } = require('express');
const { User } = require('../db')

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
            console.log('hola')
            return res.send('La contraseña no coincide.')
        }else{
            res.send('Has iniciado sesión!')
        }

    } catch (error) {
        return res.send(error)
    }
})

module.exports = router