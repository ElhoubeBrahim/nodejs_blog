const express = require('express')
const route = express.Router()
const connection = require('../../database/connection')

/*

Users Apis
  1 => /api/users/login   : POST : Auth
  2 => /api/users/u       : GET

*/

// Login User Api Router
route.post('/login', (req, res) => {
  // Get Sent Data From User
  let data = {
    email: req.body.email,
    password: req.body.password
  }
  // Prepare SQL Statement
  let sql = 'SELECT * FROM users WHERE email=?'
  // Execute Query
  connection.query(sql, data.email, (err, user) => {
    // if There is Error
    if (err) {
      res.status(500).json({
        status: 0,
        msg: 'Oooops! There is Some Error While Fetching Posts. Please Try Again Later',
        err: err
      })
      return
    }

    // If There is User With Same Sent Email
    if (user.length > 0) {
      // Check Password
      if (user[0].password === data.password) {

        req.session.loggedin = true
        req.session.user = {
          id: user[0].id,
          email: user[0].email,
          name: user[0].email.substring(0, user[0].email.lastIndexOf('@'))
        }

        res.json({
          user: req.session.user,
          status: 1,
          msg: 'Logged in Successfully'
        })
      } else {
        res.json({
          key: 'password',
          status: 0,
          msg: 'Wrong Password'
        })
      }
    } else {
      res.json({
        key: 'email',
        status: 0,
        msg: 'There is No User With This Email'
      })
    }
  })
})

// Get Single User Info Router
route.get('/u', (req, res) => {
  if (req.session.loggedin) {
    res.json({
      user: req.session.user,
      status: 1,
      msg: 'User Data Fetched Successfully'
    })
  } else {
    res.status(403).json({
      status: 0,
      msg: 'Unauthorized Request'
    })
  }
})

module.exports = route
