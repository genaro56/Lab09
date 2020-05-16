const API_TOKEN = '2abbf7c3-245b-404f-9473-ade729ed4653';

function addBookMarkFetch(data) {
    let url = '/bookmarks';

    let postData = {
        title: data.title,
        url: data.url,
        description: data.description,
        rating: Number(data.rating),
    }

    let settings = {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${API_TOKEN}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
    }

    let results = document.querySelector('.results');

    fetch(url, settings)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(res => {
            fetchBookmarks();
        })
        .catch(err => {
            results.innerHTML = `<div> ${err.message} </div>`;
        });
}
function deleteBookmarkFetch(id) {
    let url = '/bookmark/' + id;
    console.log("id", id)
    console.log('%c url', 'background: #332167; color: #B3D1F6; font-size: 16px', url)
    let settings = {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${API_TOKEN}`,
            'Content-Type': 'application/json'
        },
    }

    let results = document.querySelector('.results');

    fetch(url, settings)
        .then(response => {
            if (response.ok) {
                return response;
            }
            throw new Error(response.statusText);
        })
        .then(res => {
            fetchBookmarks();
        })
        .catch(err => {
            results.innerHTML = `<div> ${err.message} </div>`;
        });
}

function updateBookmarkFetch(id, title, bookmarkUrl, description, rating) {
    const data = Object.assign({},
        id && { id: id },
        title && { title },
        bookmarkUrl && { url: bookmarkUrl },
        description && { description },
        rating && { rating: Number(rating) }
    )
    console.log("Data", data)
    let url = '/bookmark/' + id;
    let settings = {
        method: 'PATCH',
        headers: {
            Authorization: `Bearer ${API_TOKEN}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }
    
    let results = document.querySelector('.results');
    fetch(url, settings)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(res => {
            fetchBookmarks();
        })
        .catch(err => {
            results.innerHTML = `<div> ${err.message} </div>`;
        });
}

function getBookMarkFetch(title) {
    let url = `/bookmark?title=${title}`;
    let settings = {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${API_TOKEN}`
        }
    }
    let results = document.querySelector('.results');

    fetch(url, settings)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(res => {
            results.innerHTML = "";
            console.log(res)
            for (let i = 0; i < res.length; i++) {
                results.innerHTML += `
                    <div> 
                        <h3>${res[i].title} </h3>
                        <ul>
                            <li>id: ${res[i].id}</li>
                            <li>url: ${res[i].url}</li>
                            <li>description: ${res[i].description}</li>
                            <li>rating: ${res[i].rating}</li>
                        </ul>
                    </div>
                    `;
            }
        })
        .catch(err => {
            results.innerHTML = `<div> ${err.message} </div>`;
        });
}

function fetchBookmarks() {

    let url = '/bookmarks';
    let settings = {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${API_TOKEN}`
        }
    }
    let results = document.querySelector('.results');

    fetch(url, settings)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(res => {
            results.innerHTML = "";
            console.log(res)
            for (let i = 0; i < res.length; i++) {
                results.innerHTML += `
                    <div> 
                        <h3>${res[i].title} </h3>
                        <ul>
                            <li>id: ${res[i].id}</li>
                            <li>url: ${res[i].url}</li>
                            <li>description: ${res[i].description}</li>
                            <li>rating: ${res[i].rating}</li>
                        </ul>
                    </div>
                    `;
            }
        })
        .catch(err => {
            results.innerHTML = `<div> ${err.message} </div>`;
        });

}

function watchBookmarksForm() {
    let bookmarksForm = document.querySelector('.bookmarks-form');

    bookmarksForm.addEventListener('submit', (event) => {
        event.preventDefault();
        fetchBookmarks();
    });
}
function watchDeleteBookmarksForm() {
    let bookmarksForm = document.querySelector('.delete-bookmarks-form');

    bookmarksForm.addEventListener('submit', (event) => {
        event.preventDefault();
        let id = document.getElementById('bookmarkId').value;
        deleteBookmarkFetch(id);
    });
}
function watchUpdateBookmarksForm() {
    let bookmarksForm = document.querySelector('.update-bookmarks-form');;

    bookmarksForm.addEventListener('submit', (event) => {
        event.preventDefault();
        let id = document.getElementById('updateBookmarkId').value;
        let title = document.getElementById('updateBookmarkTitle').value;
        let url = document.getElementById('updateBookmarkURL').value;
        let rating = document.getElementById('updateBookmarkRating').value;
        let description = document.getElementById('updateBookmarkDescription').value;

        updateBookmarkFetch(id, title, url, description, rating);
    });
}

function watchAddBookmarksForm() {
    let bookmarksForm = document.querySelector('.add-bookmarks-form');

    bookmarksForm.addEventListener('submit', (event) => {
        event.preventDefault();
        let title = document.getElementById('bookmarkTitle').value;
        let url = document.getElementById('bookmarkURL').value;
        let rating = document.getElementById('bookmarkRating').value;
        let description = document.getElementById('bookmarkDescription').value;

        addBookMarkFetch({ title, url, description, rating });
    })
}
function watchGetBookmarkForm() {
    let bookmarksForm = document.querySelector('.get-bookmark-form');

    bookmarksForm.addEventListener('submit', (event) => {
        event.preventDefault();
        let title = document.getElementById('getBookmarkTitle').value;
        getBookMarkFetch(title);
    })
}

function init() {
    watchBookmarksForm();
    watchAddBookmarksForm();
    watchDeleteBookmarksForm();
    watchUpdateBookmarksForm();
    watchGetBookmarkForm();
}

init();