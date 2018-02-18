'use strict';

var httpRequest = new XMLHttpRequest();
var searchText = document.getElementById('searchText');
var listView = document.getElementById('movieList');
var API = 'http://www.omdbapi.com/?apikey=7823e390';

var callAPI = function callAPI(typeOfRequest, event) {
    var textValue = event.target.value;
    if (textValue.length < 3) return;
    httpRequest.onreadystatechange = updateListView;
    httpRequest.open(typeOfRequest, API + '&s=' + textValue, true);
    httpRequest.send();
};

var updateListView = function updateListView() {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
        if (httpRequest.status === 200) {
            templateListView(JSON.parse(httpRequest.responseText).Search);
        } else {
            alert('There was a problem with the request.');
        }
    }
};

var templateListView = function templateListView(json) {
    if (json === undefined) return;
    var markup = '\n        ' + json.map(function (movie) {
        return '<li>\n                <a href="#">\n                    <img src="' + movie.Poster + '">\n                    <h2>' + movie.Title + '</h2>\n                    <p>' + movie.Year + '</p>\n                </a>\n            </li> \n        ';
    }).join('') + '\n    ';
    listView.innerHTML = markup;
    $(listView).listview('refresh');
};

searchText.addEventListener('keyup', function (e) {
    callAPI('GET', e);
}, false);