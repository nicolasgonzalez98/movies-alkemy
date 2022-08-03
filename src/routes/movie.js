const { Router } = require('express')
const { Character, Movie } = require('../db')
const router = Router()

router.get('/', async(req, res) => {
    let movies = await Movie.findAll({
        attributes: ['image', 'title', 'date_of_creation']
    })

    return res.send(movies)
})

router.get('/details/:id', async(req, res) => {
    const { id } = req.params

    try {
        let movie = await Movie.findByPk(id, {
            include: {
                model: Character,
                attributes: ['name', 'image', 'age', 'weight', 'history'],
                through: {
                    attributes: []
                }
            }
        })

        return res.send(movie)

    } catch (error) {
        return res.send(error)
    }
})

router.post('/create', async (req, res) => {
    let { title, image, date_of_creation, rating } = req.body

    if(!title || !image){
        return res.send('Faltan datos obligatorios')
    }

    try {
        let new_movie = await Movie.create({
            title: title,
            image: image,
            date_of_creation: date_of_creation,
            rating: rating
        })

        return res.send(new_movie)
    } catch (error) {
        return res.send(error)
    }
})

router.delete('/delete/:id', async(req, res) => {
    let { id } = req.params

    if(!id)return res.send('No especificaste la pelicula.');

    try {
        let movie = await Movie.findByPk(id)

        if(!movie)return res.send('La pelicula no existe!')

        await movie.destroy()

        return res.send('Pelicula eliminada correctamente!')

    } catch (error) {
        return res.send(error)
    }
})

router.put('/edit/:id', async(req, res) => {
    let { id } = req.params
    let condition = {}
    let { title, image, date_of_creation, rating } = req.body

    try {
        let movie = await Movie.findByPk(id)
        if(!movie)return res.send('La pelicula no existe')

        if(title)condition.title = title
        if(image)condition.image = image
        if(date_of_creation)condition.date_of_creation = date_of_creation
        if(rating)condition.rating = rating

        await movie.update(condition)
        return res.send('Pelicula actualizado')
    } catch (error) {
        return res.send(error)
    }
})

module.exports = router