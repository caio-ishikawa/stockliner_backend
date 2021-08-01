const express = require('express')
const mysql = require('mysql')
const cors = require('cors')
const bcrypt = require('bcrypt')
const app = express()
const saltRounds = 10

app.use(express.json())
app.use(cors())

const db = mysql.createConnection({
    user: "root",
    host: "127.0.0.1",
    password: "password",
    database: "authentication"
})

app.post('/signup', (req, res) => {
    const username = req.body.username
    const password = req.body.password

    bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) {
            console.log(err)
        }
        db.query("INSERT INTO users (username, password) VALUES (?, ?)", [username, hash], (err, result) => {
            console.log(err)
        })
    })
})

app.post('/login', (req, res) => {
    const username = req.body.username
    const password = req.body.password

    db.query("SELECT * FROM  users WHERE username = ?", [username], (err, result) => {
        if (err) {
            res.send({err: err})
        } 
        if (result.length > 0) {
            bcrypt.compare(password, result[0].password, (err, response) => {
                if (response) {
                    res.send(result)
                } else{
                    res.send({message: "Invalid Credentials"})
                }
            })
        } else {
            res.send({message: "User does not exist."})
        }
        
    })
})

app.post('/add_comment', (req, res) => {
    const stock_name = req.body.stock_name;
    const username = req.body.username
    const content = req.body.content

    db.query("INSERT INTO comment_section (stock_name, username, content) VALUE (?, ?, ?)", [stock_name, username, content], (err, result) => {
        if (err) {
            res.send({err: err})
        } else{
            if (result) {
                res.send(result)
            } 
        }
    })
})

app.get('/comment_sections/:stock_name', (req, res, next) => {
    const stock_name = req.params.stock_name.toString()
    console.log(stock_name)

    db.query("SELECT * FROM comment_section WHERE stock_name = ?", [stock_name], (err, result) => {
        if (err){
            res.send(err)
        } else{
            if (result){
                console.log('result!')
                res.send(result)
            } else {
                console.log('no result')
            }
        }
    })
})


app.listen(process.env.PORT || PORT, () => {
    console.log('server running on port ${PORT}')
})