const { Router } = require('express');
const { Character, Movie } = require('../db')
const { Op } = require('sequelize')

const router = Router()

router.get('/', async(req, res) => {
    let { name, age, movies } = req.query

    let condition = {}
    let attributes = ['image', 'name']
    let where = {}
    let include = {}
    

    try {
        if(name)where.name = { [Op.iLike]: `%${name}%` }
        if(age)where.age = age
        if(movies){
            include.model = Movie
            include.attributes = []
            include.through = {attributes: []}
            include.where = {id:movies}
            condition.include = include
            
        }
        condition.attributes = attributes
        condition.where = where
        
        let characters = await Character.findAll(condition)
    
        return res.send(characters)
    } catch (error) {
        return res.send(error)
    }
})

router.get('/details/:id', async(req, res) => {
    const { id } = req.params

    try {
        let character = await Character.findByPk(id, {
            include: {
                model: Movie,
                attributes: ['title', 'image', 'rating', 'date_of_creation'],
                through: {
                    attributes: []
                }
            }
        })

        return res.send(character)
    } catch (error) {
        return res.send(error)
    }
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
    let { name, image, age, weight, history, movies } = req.body

    try {
        let character = await Character.findByPk(id, {
            include:{
                model: Movie,
                attributes: ['title'],
                through: {
                    attributes: []
                }
            }
        })
        if(!character)return res.send('Ese personaje no existe')

        if(name)condition.name = name
        if(image)condition.image = image
        if(age)condition.age = age
        if(weight)condition.weight = weight
        if(history)condition.history = history
        if(movies){
           let response = character.dataValues.movies?.map(m => m.title)
           let eliminados = []

           for(let i = 0; i<response.length;i++){
                if(!movies.includes(response[i])){
                    eliminados.push(response[i])
                }
            }
            

            let movieDelete = await Movie.findAll({
                where:{title:eliminados}
            })

            

            const pending_promises_array = movieDelete.map(e => character.removeMovie(e))
            await Promise.all(pending_promises_array)

            let movieDb = await Movie.findAll({
                where:{title:movies}
            })

            await character.addMovie(movieDb)
        }

        await character.update(condition)
        return res.send('Personaje actualizado')
    } catch (error) {
        return res.send(error)
    }
})



module.exports = router