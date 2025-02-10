const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.text());
const port = 8000;

// เก็บ user
let users = []
let counter = 1



// path = Get /users
app.get('/', (req,res) => {
    res.json(users);
})

//path = POST /user
app.post('/user', (req,res) => {
    let user = req.body;
    user.id = counter
    counter += 1
    users.push(user);
    res.json({
        message :'User created',
        user : user
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

app.listen(port,(req,res) =>{
    console.log('Server is running on port' + port);
});