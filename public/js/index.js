const API_TOKEN = 'password12345';

function addStudentFech( name, id ){
    let url = '/api/createStudent';

    let data = {
        name : name,
        id : Number(id)
    }

    let settings = {
        method : 'POST',
        headers : {
            Authorization : `Bearer ${API_TOKEN}`,
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify( data )
    }

    let results = document.querySelector( '.results' );

    fetch( url, settings )
        .then( response => {
            if( response.ok ){
                return response.json();
            }
            throw new Error( response.statusText );
        })
        .then( responseJSON => {
            fetchStudents();
        })
        .catch( err => {
            results.innerHTML = `<div> ${err.message} </div>`;
        });
}

function fetchStudents(){

    let url = '/api/students';
    let settings = {
        method : 'GET',
        headers : {
            Authorization : `Bearer ${API_TOKEN}`
        }
    }
    let results = document.querySelector( '.results' );

    fetch( url, settings )
        .then( response => {
            if( response.ok ){
                return response.json();
            }
            throw new Error( response.statusText );
        })
        .then( responseJSON => {
            results.innerHTML = "";
            for ( let i = 0; i < responseJSON.length; i ++ ){
                results.innerHTML += `<div> ${responseJSON[i].name} </div>`;
            }
        })
        .catch( err => {
            results.innerHTML = `<div> ${err.message} </div>`;
        });
    
}

function watchStudentsForm(){
    let studentsForm = document.querySelector( '.students-form' );

    studentsForm.addEventListener( 'submit', ( event ) => {
        event.preventDefault();

        fetchStudents();
    });
}

function watchAddStudentForm(){
    let studentsForm = document.querySelector( '.add-student-form' );

    studentsForm.addEventListener( 'submit' , ( event ) => {
        event.preventDefault();
        let name = document.getElementById( 'studentName' ).value;
        let id = document.getElementById( 'studentID' ).value;

        addStudentFech( name, id );
    })
}

function init(){
    watchStudentsForm();
    watchAddStudentForm();
}

init();