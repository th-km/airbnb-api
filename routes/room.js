const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const Room = require('../models/room')

const router = express.Router()
router.use(bodyParser.json())

/*
 |--------------------------------------------------------------------------
 | CREATE
 |--------------------------------------------------------------------------
 | POST http://localhost:3000/room/publish
 | Parameters Body: title, description, photos (array), price, city, loc (arr)
*/

router.post('/room/publish', async (req, res) => {
  try {
    const room = new Room({
      title: req.body.title,
      description: req.body.description,
      photos: req.body.photos,
      price: req.body.price,
      city: req.body.city,
      loc: req.body.loc
    })

    await room.save()
    return res.json({ message: 'Room published' })
  } catch (error) {
    return res.json({ message: error.message })
  }
})

/*
 |--------------------------------------------------------------------------
 | READ
 |--------------------------------------------------------------------------
 | GET http://localhost:3000/:id
 | Parameters Query: id
 | Example /api/room/58ff73d11765a998979a33ad
*/

router.get('/room', async (req, res) => {
  try {
    const rooms = await Room.find()

    return res.json(rooms)
  } catch (error) {
    return res.status(400).json({ message: error.message })
  }
})

/*
 |--------------------------------------------------------------------------
 | SEARCH
 |--------------------------------------------------------------------------
 | GET http://localhost:3000/api/rooms
 | Example /api/rooms?city=Paris
*/
const createFilters = req => {
  const filters = {}

  if (req.query.priceMin) {
    filters.price = {}
    filters.price.$gte = req.query.priceMin
  }

  if (req.query.priceMax) {
    if (filters.price === undefined) {
      filters.price = {}
    }
    filters.price.$lte = req.query.priceMax
  }

  if (req.query.city) {
    filters.city = req.query.city
  }

  return filters
}

router.get('/api/room', async (req, res) => {
  try {
    const filters = createFilters(req)
    const search = await Room.find(filters)
    const rooms = await search

    let count = 0
    if (rooms) {
      count = rooms.length
    }

    if (req.query.page) {
      const page = req.query.page
      const limit = 2

      search.limit(limit)
      search.skip(limit * (page - 1))
    }

    return res.json({
      rooms,
      count
    })
  } catch (error) {
    return res.status(400).json({ message: error.message })
  }
})

module.exports = router
