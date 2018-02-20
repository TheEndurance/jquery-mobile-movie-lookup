'use strict';

var httpRequest = new XMLHttpRequest();
var searchText = document.getElementById('searchText');
var listView = document.getElementById('movieList');
var API = 'http://www.omdbapi.com/?apikey=7823e390';
var MOVIE_CLICK_CLASS = "js-click-movie";

///
// Utility function to call API
///
var callAPI = function callAPI() {
    var typeOfRequest = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'GET';
    var callback = arguments[1];
    var apiUrl = arguments[2];

    for (var _len = arguments.length, queryStrings = Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
        queryStrings[_key - 3] = arguments[_key];
    }

    if (typeof callback === 'function' && Array.isArray(queryStrings)) {
        httpRequest.onreadystatechange = callback;
        httpRequest.open(typeOfRequest, '' + apiUrl + queryStrings.map(function (queryString) {
            return '&' + queryString;
        }), true);
        httpRequest.send();
        console.log();
    }
};

///
// Event handler for searching movies
///
var searchMovieEventHandler = function searchMovieEventHandler() {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
        if (httpRequest.status === 200) {
            var markup = renderMovieListItems(JSON.parse(httpRequest.responseText).Search);
            if (markup) {
                listView.innerHTML = markup;
                $(listView).listview('refresh');
            }
        } else {
            alert('There was a problem with the request.');
        }
    }
};

///
// Renders list items for the movies
///
var renderMovieListItems = function renderMovieListItems(jsonArray) {
    if (jsonArray === undefined) return;
    return '\n        ' + jsonArray.map(function (movie) {
        return '<li>\n                <a class="' + MOVIE_CLICK_CLASS + '" data-movie-id="' + movie.imdbID + '" href="#">\n                    <img src="' + movie.Poster + '">\n                    <h2>' + movie.Title + '</h2>\n                    <p>' + movie.Year + '</p>\n                </a>\n            </li> \n        ';
    }).join('') + '\n    ';
};

///
// Event handler when movie list items are clicked
///
var movieClickedEventHandler = function movieClickedEventHandler() {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
        if (httpRequest.status === 200) {
            window.sessionStorage.setItem('movie', httpRequest.responseText);
        } else {
            alert('There was a problem with the request.');
        }
    }
};

///
// Event listeners
///
searchText.addEventListener('keydown', function (e) {
    var searchValue = e.target.value;
    if (searchValue.length > 3) {
        callAPI('GET', searchMovieEventHandler, API, ['s=' + searchValue]);
    }
}, false);

$('#movieList').on('click', 'a.' + MOVIE_CLICK_CLASS, function () {
    var movieId = this.dataset.movieId;
    if (movieId && movieId.length > 0) {
        callAPI('GET', movieClickedEventHandler, API, ['i=' + movieId]);
    }
});