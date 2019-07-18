const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const Room = require('../models/room')

const router = express.Router()
router.use(bodyParser.json())

module.exports = router
