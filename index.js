const express = require('express')
const mongoose = require('mongoose')
const roomRoute = require('./routes/room')
const userRoute = require('./routes/user')

const app = express()
const port = 3000

app.use(roomRoute)
app.use(userRoute)

mongoose.connect('mongodb://localhost/airbnb', { useNewUrlParser: true })
mongoose.set('useCreateIndex', true)
app.listen(port, () => console.log('Server started'))
