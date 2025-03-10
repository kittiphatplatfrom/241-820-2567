const BASE_URL = 'http://localhost:8000';
//2.นำ user ที่โหลดมาใส่ใน HTML
window.onload = async () => {

}
    




const loadData = async () => {
    console.log('loaded');

    const response = await axios.get('http://localhost:8000/users');
    console.log(response.data);

    const userDom = document.getElementById('user');
    let htmlData = '<div>'
    for (let i = 0; i < response.data.length; i++) {
        let user = response.data[i];
        htmlData += `<div>
          ${user.id} ${user.firstname} ${user.lastname}
        <a href= 'index.html?id=${user.id}'><button>Edit</button>
        <button class ='delete' data-id='$'{user.id}')'>Delete</button>
        </div>`
    }
    htmlData += '</div>'
    userDom.innerHTML = htmlData


    const deleteDoms = document.getElementsByClassName('delete');
    for (let i = 0; i < deleteDoms.length; i++) {
        deleteDoms[i].addEventListener('click', async (event) => {
            console.log('delete', event.target.dataset.id);
            try{
                await axios.delete(`${BASE_URL}/users/${id}`);
                loadData();
            } catch{
                console.log('error', error);
            }
        });
    }
}