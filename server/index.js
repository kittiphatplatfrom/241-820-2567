const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const cors = require('cors');
const app = express();

app.use(bodyParser.json());
app.use(cors());
const port = 8000;

//เก็บ user
let users = []
let conn = null

 const initMySQL = async () => {
    conn = await mysql.createConnection({
        host:'localhost',
        user:     'root',  
        password: 'root',
        database: 'webdb',
        port: 8830
    })
 }

 app.get('/testdb-new', async (req, res) => {
    try{     
        const results = await conn.query('SELECT * FROM users')
         res.json(results[0])    
    } catch(error){     
        console.log('Error fetching users:', error.message)
        res.status(500).json({error: 'Error fetching users'})
    }
 })
 
// Path = / GET / Users
app.get('/users', async (req,res) => {
 // res.json(users); [ -- NO LONGER USED -- ]
    const result = await conn.query('SELECT * FROM users')
    res.json(result[0])
})

// path = POST / User
app.post('/users', async (req,res) => {
    try{ 
        let user = req.body;
        const results = await conn.query('INSERT INTO users SET ?', user)
        console.log('results:',results)
        res.json({
            message: 'User created',
            data: results[0]
        })
    } catch (error)  {
        console.error('errorMessage',error.message)
        res.status(500).json({
            message: 'something went wrong',
            errorMessage: error.message
        })
    }
})

//PATH
app.get('/users/:id', async(req,res) => {
    try{
        let id = req.params.id;
        const results = await conn.query('SELECT * FROM users WHERE id = ?', id)
        if (results[0].lengh > 0) {
            throw {statusCode: 404, message: 'User not found'}
        }
        res.json(results[0][0])
    } catch (error) {
        console.error('errorMessage',error.message)
        let statusCode = error.statusCode || 500
        res.status(500).json({
            message: 'something went wrong',
            errorMessage: error.message
        })
    }
});

//path = PUT /users/:id
app.put('users/:id', async(req,res) => {
    try{
        let id = req.params.id;
        let updateUser = req.body;
        const results = await conn.query(
        'UPDATE users SET ? WHERE id = ? ',
             [updateUser, id ]
        )
        res.json({
            message: 'Update User Completed',
            data: results[0]
        })
    } catch (error)  {
        console.error('errorMessage',error.message)
        res.status(500).json({
            message: 'something went wrong',
            errorMessage: error.message
        })
    }
})
   
//path = Delete /user/:id
app.delete('/users/:id', async (req,res) => {
    try{
        let id = req.params.id;
        const results = await conn.query('DELETE From users WHERE id = ?', id)
        res.json({
            message: 'Delete User Completed',
            data: results[0]
        })
    } catch (error) {
        console.error('errorMessage' ,error.message)
        res.status(500).json({
            message: 'something went wrong',
            errorMessage: error
        })
    }
})

app.listen(port, async() => {
    await initMySQL()
    console.log('Server is running on port', + port);
});