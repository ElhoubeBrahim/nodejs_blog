const mysql = require('mysql')

// Create Connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'nodejs_blog'
})
  
// Connect to DB
connection.connect((err) => {
  if (err) throw err
  console.log('Connected Successfully With DB')
})

module.exports = connection
