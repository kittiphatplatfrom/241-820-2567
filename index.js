const BASE_URL = 'https://localhost:8000';
let mode = 'CREATE' 
let selectedId = ''

window.onload =  async () => {
    const urlParams = new URLSearchParams(window.location.search)
    const id = urlParams.get('id')
    console.log ('id', id)
    if (id)  {
        mode = 'EDIT'
        selectedId = id
        //1. เราจะดึงข้อมูล user ที่ต้องการแก้ไขมา
        try{
            const response = await axios.get(`${BASE_URL}/user/${id}`)
            console.log('response', response.data)

    let firstNameDOM = document.querySelector('input[name="firstname"]')
    let lastNameDOM = document.querySelector('input[name="lastname"]')
    let ageDOM = document.querySelector('input[name="age"]')
    let descriptionDOM = document.querySelector('textarea[name="description"]')

    let genderDOM = document.querySelectorAll('input[name="gender"]:checked') || {}
    let interestDOM = document.querySelectorAll('input[name="interest"]:checked') || {}
    console.log('interest', user.interests)

    for (let i = 0; i < genderDOM.length; i++) {
        if (genderDOM[i].value == user.gender) {
            genderDOM[i].checked = true
        }
    }

    for(let i = 0; i < interestDOM.length; i++) {
            if (user.interests.includes(interestDOMs[i].value)) {
                interestDOM[i].checked = true
            }
        }
    

    firstNameDOM.value = user.firstname
    lastNameDOM.value = user.lastname
    ageDOM.value = user.age
    descriptionDOM.value = user.description

        } catch (error) {
            console.log('error', error)
        }

        //2. นำข้อมูล user ที่ดึงมาใส่ใน input
    }

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
const submitData = async () => {
    let firstNameDOM = document.querySelector('input[name="firstname"]')
    let lastNameDOM = document.querySelector('input[name="lastname"]')
    let ageDOM = document.querySelector('input[name="age"]') 
    let genderDOM = document.querySelector('input[name="gender"]:checked') || {}
    let interestDOM = document.querySelectorAll('input[name="interest"]:checked') || {}
    let descriptionDOM = document.querySelector('textarea[name="description"]')

    let messageDOM = document.getElementById('message')

    try{
        let interest = ''

    for (let i = 0; i < interestDOM.length; i++) {
        interest += interestDOM[i].value
        if (i < interestDOM.length - 1) {
            interest += ','
        }
    }

    

    let userData = {
        firstname : firstNameDOM.value,
        lastname : lastNameDOM.value,
        age : ageDOM.value,
        gender : genderDOM.value,
        description : descriptionDOM.value,
        interests : interest
    }
    console.log('submitData', userData)


    if (mode == 'CREATE') {
        const response  =await axios.post(`${BASE_URL}/users`, userData)
        console.log('response', response.data)

    } else {
        const response  =await axios.put(`${BASE_URL}/users/${selectedId}`, userData)
        message = 'แก้ไขข้อมูลเรียบร้อย'
        console.log('response', response.data)
    }

    messageDOM.interText = message
    messageDOM.className = 'message success'



    const response  =await axios.post(`${BASE_URL}/user`, userData)
        console.log('response', response.data)
        messageDOM.interText = 'บันทึกข้อมูลเรียบร้อย' 
        messageDOM.className = 'message success'
    } catch (error) {
        console.log('error message', error.message)
        console.log('error',error.errors)
        if (error.response) {
            console.log(error.response)
            error.message = error.response.data.message
            error.errors = error.response.data.errors   
        }
    
        let htmlData = '<div>'
        htmlData += ` <div>${error.message}</div>`
        htmlData += '<ul>'
        for (let i = 0; i< error.errors.length; i++) {
            htmlData += `<li>${error.errors[i]}</li>`
        }
        htmlData += '</ul>'
        htmlData += '</div>'

        messageDOM.innerHTML = htmlData
        messageDOM.className = 'message danger'
    }
}