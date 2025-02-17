const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const app = express();

app.use(bodyParser.json());
const port = 8000;

let users = []
// let counter = 1;  [ -- NO LONGER USED -- ]
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
app.post('/user', async (req,res) => {
    let user = req.body;
    const results = await conn.query('INSERT INTO users SET ?', user)
    console.log('results', results)
    res.json({
        message: 'User Created',
        data: results
    });
})

//path = PUT /user/:id
app.put('user/:id', (req,res) => {
    let id = req.params.id;
    //หา index ของ user ที่ต้องการ update
    let selectedIndex = users.findIndex(user => user.id == id)
    // update ข้อมูล user 
    if (updateUser.firstname) {
        users[selectedIndex].firstname = updateUser.firstname
    }
    users[selectedIndex].firstname = updateUser.firstname || users[selectedIndex].firstname
    users[selectedIndex].lastname = updateUser.lastname  || users[selectedIndex].lastname

    res.json({
        message : "User update",
        data : {
            user : updateUser,
            indexUpdate : selectedIndex
        }
    });
})
//path = Delete /user/:id
app.delete('/user/:id', (req,res) => {
    let id = req.params.id;
    //หา index ของ user ที่ต้องการลบ
    let selectedIndex = users.findIndex(user => user.id == id)

    users.splice(selectedIndex, 1)
    delete users[selectedIndex]
    res.json({
        message : 'Delete Complete',
        indexDelete: selectedIndex
    });
});

app.listen(port, async(req,res) => {
    await initMySQL()
    console.log('Server is running on port' + port);
});