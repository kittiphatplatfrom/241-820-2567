const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const cors = require('cors');
const app = express();

app.use(bodyParser.json());
app.use(cors());
const port = 8000;

let users = []
let conn = null

/*
GET /users สำหรับ get users ทั้งหมด
POST /users สำหรับ create user ใหม่บันทึกเข้าไป
GET /users/:id สำหรับ get user รายคนที่ต้องการดู
PUT /users/:id สำหรับ update user รายคนที่ต้องการบันทึกเข้าไป
DELETE /users/:id สำหรับ delete user รายคนที่ต้องการลบออก
*/

const initMySQL = async () => {
  conn = await mysql.createConnection({
    host:     'localhost',
    user:     'root',
    password: 'root',
    database: 'webdb',
    port: 8830
  })
}

const validateData = (userData) => {
  let errors = []
  if (!userData.firstname) {
      errors.push('กรุณากรอกชื่อ')
  }
  if(!userData.lastname) {
      errors.push('กรุณากรอกนามสกุล')
  }
  if(!userData.age) {
      errors.push('กรุณากรอกอายุ')
  }
  if(!userData.gender) {
      errors.push('กรุณาเลือกเพศ')
  }
  if(!userData.interests) {
      errors.push('กรุณาเลือกความสนใจ')
  }
  if(!userData.description) {
      errors.push('กรุณากรอกข้อมูลตัวเอง')
  }
  return errors
}

// path = GET /users สำหรับ get users ทั้งหมด
app.get('/users', async(req, res) => {
  const results = await conn.query('SELECT * FROM users')
  res. json(results[0])  
})

app.post('/users', async (req, res) => {
  try {
    let user = req.body;
    const errors = validateData(user)
    if (errors.length > 0) {
      throw {
          message: 'กรุณากรอกข้อมูลให้ครบถ้วน',
          errors: errors}
      }
      const results = await conn.query('INSERT INTO users SET ?', user)
      res.json({
        message: "User created",
        data: results[0]
      })
    } catch (error) {
      const errorMessage = error.message || 'something went wrong'
      const errors = error.errors || []
      console.error('errorMessage', error.message)
      res.status(500).json({
        message: errorMessage,
        errors: errors
    })
  }
})
  
app.put('/users/:id', async(req, res) => {
  try{
    let id = req.params.id;
    let updateUser = req.body;
    const results = await conn.query(
      'UPDATE users SET ? WHERE id = ?', 
      [updateUser, id]
    )
    res.json({
      message: "Update User Completed",
      data: results[0]
    })
  } catch (error) {
    console.error('errorMessage',error.message)
    res.status(500).json({
      message: 'something went wrong',
      errorMessage: error.message
    })
  }
})

app.get('/users/:id', async(req, res) => {
  try{
    let id = req.params.id;
    const results = await conn.query('SELECT * FROM users WHERE id = ?', id)
    if(results[0].length == 0){
      throw {statusCode: 404, message: 'User not found'}
    }
    res.json(results[0][0])
  } catch (error) {
    console.log('errorMessage',error.message)
    let statusCode = error.statusCode || 500
    res.status(statusCode).json({
      message: 'something went wrong',
      errorMessage: error.message
    })
  }
})

app.delete('/users/:id', async (req, res) => {
  try {
      let id = req.params.id;
      const results = await conn.query('DELETE FROM users WHERE id = ?', [id])
      res.json({
          message: "Delete User Completed",
          data: results[0]
      })
  } catch (error) {
    console.error('errorMessage:', error.message);
    res.status(500).json({
        message: 'Something went wrong',
        errorMessage: error.message
    });
  }
});

app.listen(port, async(req, res) => {
  await initMySQL()
  console.log('Server is running on port' + port);
});