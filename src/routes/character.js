const { Router } = require('express');
const { Character } = require('../db')

const router = Router()

router.get('/', async(req, res) => {
    let characters = await Character.findAll({
        attributes: ['image', 'name']
    })

    return res.send(characters)
})

router.post('/create', async (req, res) => {
    let { name, image, age, weight, history} = req.body

    if(!name || !image){
        return res.send('Faltan datos obligatorios')
    }

    try {
        let new_character = await Character.create({
            name: name,
            image: image,
            age: age,
            weight: weight,
            history: history
        })

        return res.send(new_character)
    } catch (error) {
        return res.send(error)
    }
})

router.delete('/delete/:id', async(req, res) => {
    let { id } = req.params

    if(!id)return res.send('No especificaste el personaje');

    try {
        let character = await Character.findByPk(id)

        if(!character)return res.send('El personaje no existe!')

        await character.destroy()

        return res.send('Personaje eliminado correctamente!')

    } catch (error) {
        return res.send(error)
    }
})

router.put('/edit/:id', async(req, res) => {
    let { id } = req.params
    let condition = {}
    let { name, image, age, weight, history } = req.body

    try {
        let character = await Character.findByPk(id)
        if(!character)return res.send('Ese personaje no existe')

        if(name)condition.name = name
        if(image)condition.image = image
        if(age)condition.age = age
        if(weight)condition.weight = weight
        if(history)condition.history = history

        await character.update(condition)
        return res.send('Personaje actualizado')
    } catch (error) {
        return res.send(error)
    }
})



module.exports = router