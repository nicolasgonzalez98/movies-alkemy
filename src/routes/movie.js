const { Router } = require('express')
const { Character, Movie, Genre } = require('../db')
const router = Router()
const { Op } = require('sequelize')

router.get('/', async(req, res) => {
    let { name, genre, order } = req.query
    
    

    let condition = {}
    let attributes = ['image', 'title', 'date_of_creation']
    let where = {}
    let include = {}

    try {
        if(name)where.title = { [Op.iLike]: `%${name}%` }
        if(genre){
            include.model = Genre
            include.attributes = []
            include.through = {attributes: []}
            include.where = {id:genre}
            condition.include = include
        }
        let order_filter
        if(order){
            if(!(order.toLowerCase() === 'asc'|| order.toLowerCase() === 'desc'))return res.send('Ingreseste un tipo de orden invalido')
            order_filter = [["date_of_creation", order.toUpperCase()]]
            condition.order = order_filter
        }


        condition.where = where
        condition.attributes = attributes
        
        
        let movies = await Movie.findAll(condition)
    
        return res.send(movies)
    } catch (error) {
        return res.send(error)
    }
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

    if(rating < 1 || rating > 5)return res.send('Ingresaste un ranking invalido')

    if(!title || !image ){
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
    let { title, image, date_of_creation, rating, characters, genres } = req.body

    if(rating < 1 || rating > 5)return res.send('Ingresaste un ranking invalido')

    try {
        let movie = await Movie.findByPk(id, {
            include:[
            {
                model: Character,
                attributes: ['name'],
                through: {
                    attributes: []
                }
            },
            {
                model: Genre,
                attributes: ['name'],
                through: {
                    attributes: []
                }
            }
        ]
        })
        if(!movie)return res.send('La pelicula no existe')

        if(title)condition.title = title
        if(image)condition.image = image
        if(date_of_creation)condition.date_of_creation = date_of_creation
        if(rating)condition.rating = rating
        if(characters){
            let response = movie.dataValues.characters?.map(m => m.name)
            let eliminados = []

            for(let i = 0; i<response.length;i++){
                if(!characters.includes(response[i])){
                    eliminados.push(response[i])
                }
            }

            let characterDelete = await Character.findAll({
                where:{name:eliminados}
            })

            const pending_promises_array = characterDelete.map(e => movie.removeCharacter(e))
            await Promise.all(pending_promises_array)

            characterDelete.map(e => e.removeMovie(movie))

            let characterDb = await Character.findAll({
                where:{name:characters}
            })

            characterDb.map(e => e.addMovie(movie))

            await movie.addCharacter(characterDb)
        }

        if(genres){
            let response = movie.dataValues.genres?.map(m => m.name)
            let eliminados = []

            for(let i = 0; i<response.length;i++){
                if(!genres.includes(response[i])){
                    eliminados.push(response[i])
                }
            }

            let genreDelete = await Genre.findAll({
                where:{name:eliminados}
            })

            const pending_promises_array = genreDelete.map(e => movie.removeGenre(e))
            await Promise.all(pending_promises_array)

            genreDelete.map(e => e.removeMovie(movie))

            let genreDb = await Genre.findAll({
                where:{name:genres}
            })

            genreDb.map(e => e.addMovie(movie))

            await movie.addGenre(genreDb)
        }

        await movie.update(condition)
        return res.send('Pelicula actualizado')
    } catch (error) {
        return res.send(error)
    }
})

module.exports = router