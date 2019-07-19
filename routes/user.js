const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const User = require('../models/user')

const SHA256 = require('crypto-js/sha256')
const encBase64 = require('crypto-js/enc-base64')
const uid2 = require('uid2')

const router = express.Router()
router.use(bodyParser.json())

/*
 |--------------------------------------------------------------------------
 | INSCRIPTION
 |--------------------------------------------------------------------------
 | POST http://localhost:3000/api/user/sign_up
 | Parameters Body: username, email, password, biography
*/

router.post('/api/user/sign_up', async (req, res) => {
  try {
    const password = req.body.password
    const token = uid2(16)
    const salt = uid2(16)
    const hash = SHA256(password + salt).toString(encBase64)

    const user = new User({
      account: {
        biography: req.body.biography,
        username: req.body.username
      },
      email: req.body.email,
      hash: hash,
      token: token,
      salt: salt
    })

    await user.save()
    return res.json({ message: 'User saved' })
  } catch (error) {
    return res.json({ message: error.message })
  }
})

/*
 |--------------------------------------------------------------------------
 | CONNECTION
 |--------------------------------------------------------------------------
 | POST http://localhost:3000/api/user/log_in
 | Parameters Body: email, password
*/

router.post('/api/user/log_in', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email }, ['-token', '-hash', '-salt'])

    return res.json(user)
  } catch (error) {
    return res.status(400).json({ message: error.message })
  }
})

/*
 |--------------------------------------------------------------------------
 | PROFILE
 |--------------------------------------------------------------------------
 | GET + params http://localhost:3000/api/user/:id
 | Authorization: token
*/

router.get('/api/user/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    const auth = req.headers.authorization
    const header = auth.slice(7)

    if (user) {
      if (user.token === header) {
        return res.json({
          _id: user.id,
          account: {
            username: user.account.username,
            biography: user.account.biography
          }
        })
      } else {
        return res.status(400).json({ message: 'Invalid token' })
      }
    } else {
      return res.status(400).json({ message: 'User not found' })
    }
  } catch (error) {
    return res.status(400).json({ message: error.message })
  }
})

/*
 |--------------------------------------------------------------------------
 | EDIT
 |--------------------------------------------------------------------------
 | POST http://localhost:3000/api/user/edit
 | Parameter Query: id
 | Parameters Body: email, password, account
*/

module.exports = router
