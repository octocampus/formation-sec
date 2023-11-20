// Simple SQLi Example
// See:
// https://www.w3schools.com/sql/sql_injection.asp
// https://www.owasp.org/index.php/Testing_for_SQL_Injection_(OTG-INPVAL-005)

var express = require('express')
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./test.db');

var app = express()

db.run("CREATE TABLE IF NOT EXISTS users (email string, password string)")

app.get('/', function (req, res) {
  res.send('Hello World!')
})

// List all users
app.get('/list', function (req, res) {
  db.all("SELECT * FROM users", (err, users) => {
    if (err) {
      res.send("Error: " + err)
    } else {
      res.send(users)
    }
  })
})

// Create a user
// This is get to simplify demonstration
// Also no hashing or deduplication, all sorts of problems. Don't do this.
app.get('/create', function (req, res) {
  if ((typeof req.query.email === "undefined")
      || (typeof req.query.password === "undefined")) {
    return res.send("email and password arguments required")
  }

  db.run("INSERT INTO users (email, password) VALUES (?, ?)",
      req.query.email, req.query.password, (err) => {
        if(err) {
          return res.send("Error: " + err)
        }
        res.send("ok")
      })
})

app.get('/login', function (req, res) {
  if ((typeof req.query.email === "undefined")
      || (typeof req.query.password === "undefined")) {
    return res.send("email and password arguments required")
  }

  let query = "SELECT * FROM users WHERE email='" + req.query.email + "' AND password='" + req.query.password + "'"

  console.log("Query: " + query)

  db.get(query, (err, user) => {
    if (!user) {
      return res.send("User account not found or invalid password")
    }
    res.send("Password ok")
  })

})

app.listen(3000, function () {
  console.log('Listening on http://localhost:3000')
})
