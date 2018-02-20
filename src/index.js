const httpRequest = new XMLHttpRequest();
const searchText = document.getElementById('searchText');
const listView = document.getElementById('movieList');
const movieTop = document.getElementById('movieTop');
const movieDetails = document.getElementById('movieDetails');
const API = 'http://www.omdbapi.com/?apikey=7823e390';
const MOVIE_CLICK_CLASS = "js-click-movie";


///
// Utility function to call API
///
const callAPI = function (typeOfRequest = 'GET', callback, apiUrl, ...queryStrings) {
    if (typeof callback === 'function' && Array.isArray(queryStrings)) {
        httpRequest.onreadystatechange = callback;
        httpRequest.open(typeOfRequest, `${apiUrl}${queryStrings.map(queryString=>`&${queryString}`)}`, true)
        httpRequest.send();
        console.log();
    }
}

///
// Event handler for searching movies
///
const searchMovieEventHandler = function () {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
        if (httpRequest.status === 200) {
            const markup = renderMovieListItems(JSON.parse(httpRequest.responseText).Search);
            if (markup!==undefined) {
                listView.innerHTML = markup;
                $(listView).listview('refresh');
            }
        } else {
            alert('There was a problem with the request.');
        }
    }
}

///
// Renders list items for the movies
///
const renderMovieListItems = function (jsonArray) {
    if (jsonArray === undefined) return;
    return `
        ${jsonArray.map(movie => 
            `<li>
                <a class="${MOVIE_CLICK_CLASS}" data-movie-id="${movie.imdbID}" href="#movie">
                    <img src="${movie.Poster}">
                    <h2>${movie.Title}</h2>
                    <p>${movie.Year}</p>
                </a>
            </li> 
        `).join('')}
    `;
}

///
// Event handler when movie list items are clicked
///
const movieClickedEventHandler = function () {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
        if (httpRequest.status === 200) {
            const json = JSON.parse(httpRequest.responseText)
            const markup = renderMovieDetails(json);
            if (markup!==undefined) {
                movieTop.innerHTML = `<img src=${json.Poster}>`;
                movieDetails.innerHTML = markup;
                $(movieDetails).listview('refresh');
            }
        } else {
            alert('There was a problem with the request.');
        }
    }
}

///
// Render movie details markup
///
const renderMovieDetails = function (json) {
    if (json === undefined) return;
    return `${iterateOverMovieJSON(json)}
    `;
}

///
// Helper function to iterate over JSON keys and values and return listview markup
///
const iterateOverMovieJSON = function (json) {
    let markup = "";
    for (let key in json) {
        if (json.hasOwnProperty(key)) {
            if (key != 'Poster') {
                markup += `<li><p>${key} : ${json[key]}</p></li>`
            }
        }
    }
    return markup;
}

///
// Event listeners
///
searchText.addEventListener('keydown', function (e) {
    const searchValue = e.target.value;
    if (searchValue.length > 3) {
        callAPI('GET', searchMovieEventHandler, API, [`s=${searchValue}`])
    }
}, false);


$('#movieList').on('click', `a.${MOVIE_CLICK_CLASS}`, function (e) {

    const movieId = this.dataset.movieId
    if (movieId && movieId.length > 0) {
        callAPI('GET', movieClickedEventHandler, API, [`i=${movieId}`]);
    }
});