const express = require('express')
const path = require('path')
const route = express.Router()

// Main Route
route.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'home.html'))
})

// Blog Route
route.get('/blog', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'posts', 'blog.html'))
})

// Add New Post Form Route
route.get('/add_post', (req, res) => {
  // If User is Logged in
  if (req.session.loggedin) {
    res.sendFile(path.join(__dirname, '..', 'views', 'posts', 'add_post.html'))
  } else {
    res.redirect('/login')
  }
})

// Edit Post Form Route
route.get('/edit_post/:slug', (req, res) => {
  // If User is Logged in
  if (req.session.loggedin) {
    res.sendFile(path.join(__dirname, '..', 'views', 'posts', 'edit_post.html'))
  } else {
    res.redirect('/login')
  }
})

// Show Single Post Route
route.get('/posts/:slug', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'posts', 'post.html'))
})

// Login Route
route.get('/login', (req, res) => {
  // If User is Logged in
  if (req.session.loggedin) {
    res.redirect('/dashboard')
  } else {
    res.sendFile(path.join(__dirname, '..', 'views', 'login.html'))
  }
})

// Lougout Route
route.get('/logout', (req, res) => {
  if (req.session.loggedin) {
    req.session.destroy((err) => {
      if (err) throw err
      res.redirect('/')
    })
  }
})

// Dashboard Route
route.get('/dashboard', (req, res) => {
  // If User is Logged in
  if (req.session.loggedin) {
    res.sendFile(path.join(__dirname, '..', 'views', 'dashboard.html'))
  } else {
    res.redirect('/login')
  }
})

// Include Header 1 Route
route.get('/get_header', (req, res) => {
  // If User is Logged in
  if (req.session.loggedin) {
    res.sendFile(path.join(__dirname, '..', 'views', 'layouts', 'header_1.html'))
  } else {
    res.sendFile(path.join(__dirname, '..', 'views', 'layouts', 'header_2.html'))
  }
})

// Include Footer Route
route.get('/get_footer', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'layouts', 'footer.html'))
})

// 500 Internal Server Error Route
route.get('/500', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'errors', '500.html'))
})

// 404 Page Not Found Error Route
route.get('/404', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'errors', '404.html'))
})

module.exports = route