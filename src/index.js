const httpRequest = new XMLHttpRequest();
const searchText = document.getElementById('searchText');
const listView = document.getElementById('movieList');
const API='http://www.omdbapi.com/?apikey=7823e390';


const callAPI = function (typeOfRequest,event) {
    const textValue = event.target.value;
    if (textValue.length < 3) return;
    httpRequest.onreadystatechange = updateListView;
    httpRequest.open(typeOfRequest, `${API}&s=${textValue}`, true)
    httpRequest.send();
    
}


const updateListView = function () {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
        if (httpRequest.status === 200) {
            templateListView(JSON.parse(httpRequest.responseText).Search);
        } else {
            alert('There was a problem with the request.');
        }
    }
}

const templateListView = function(json){
    if (json===undefined) return;
    const markup = `
        ${json.map(movie => 
            `<li>
                <a href="#">
                    <img src="${movie.Poster}">
                    <h2>${movie.Title}</h2>
                    <p>${movie.Year}</p>
                </a>
            </li> 
        `).join('')}
    `;
    listView.innerHTML = markup;
    $(listView).listview('refresh');
}


searchText.addEventListener('keyup', function(e){ callAPI('GET',e)},false);