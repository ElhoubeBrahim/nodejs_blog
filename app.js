const express = require('express')
const path = require('path')
const fileUpload = require('express-fileupload')
const session = require('express-session')
const favicon = require('express-favicon')

// Init Application
const app = express()

app.enable('trust proxy', 1)

// Enable Sessions Middleware
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}))

// Run Body Parser Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Enable File Upload Middleware
app.use(fileUpload())

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')))

// Set Favicon
app.use(favicon(path.join(__dirname, 'favicon.ico')))

// Set Main Routes
app.use('/', require('./routes/routes'))

// Set Posts Routes
app.use('/api/posts', require('./routes/api/posts'))

// Set Users Routes
app.use('/api/users', require('./routes/api/users'))

// 404 Page Not Found Error
app.use(function (req, res) {
  res.status(404).redirect('/404');
});

// Start Server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log('Server Running on Port ', PORT, ' at http://localhost:' + PORT))