// Titles: https://omdbapi.com/?s=thor&page=1&apikey=f5e6feca

// search ==> https://www.omdbapi.com/?s=spiderman&page=2&apikey=f5e6feca

//http://www.omdbapi.com/?y=2020&apikey=f5e6feca

//https://www.omdbapi.com/?page=1&apikey=f5e6feca


const searchbox = document.getElementById('search');
const resultGrid = document.getElementById('result-grid');


const searchList = document.getElementById('search-list');
const movieSearchBox = document.getElementById('movie-search-box')
// load movies from API
async function loadMovies(searchTerm){
    const URL = `https://omdbapi.com/?s=${searchTerm}&page=1&apikey=f5e6feca`;
    const res = await fetch(`${URL}`);
    const data = await res.json();
   // console.log(data.Search);  // *** search results are stored in data object ***
    if(data.Response == "True") displayMovieList(data.Search);
}
function findMovies(){
    let searchTerm = (movieSearchBox.value).trim();
   //console.log(searchTerm);
    if(searchTerm.length > 0){
        searchList.classList.remove('hide-search-list');
        loadMovies(searchTerm);
    } else {
        searchList.classList.add('hide-search-list');
    }
}
function displayMovieList(movies){
    searchList.innerHTML = "";
    for(let idx = 0; idx < movies.length; idx++){
        let movieListItem = document.createElement('div');
        console.log(movieListItem);
        movieListItem.dataset.id = movies[idx].imdbID; // setting movie id in  data-id
        movieListItem.classList.add('search-list-item');
        if(movies[idx].Poster != "N/A")
            moviePoster = movies[idx].Poster;
        else 
            moviePoster = "image_not_found.png";

        movieListItem.innerHTML = `
        <div class = "search-item-thumbnail">
            <img src = "${moviePoster}">
        </div>
        <div class = "search-item-info">
            <h3>${movies[idx].Title}</h3>
            <p>${movies[idx].Year}</p>
            <p>${movies[idx].imdbID}</p>
        </div>
        `;
        searchList.appendChild(movieListItem);    
    }
    loadMovieDetails();
    
}
function loadMovieDetails(){
    const searchListMovies = searchList.querySelectorAll('.search-list-item');
    searchListMovies.forEach(movie => {
        movie.addEventListener('click', async () => {
           //  console.log(movie);
            searchList.classList.add('hide-search-list');
             movieSearchBox.value = "";
             const result = await fetch(`http://www.omdbapi.com/?i=${movie.dataset.id}&apikey=f5e6feca`);
             const movieDetails = await result.json();
              //console.log(movieDetails);
             displayMovieDetails(movieDetails);
        });
    });
}
function displayMovieDetails(details){
    resultGrid.innerHTML = `
    <div class = "movie-poster">
        <img src = "${(details.Poster != "N/A") ? details.Poster : "image_not_found.png"}" alt = "movie poster">
    </div>
    <div class = "movie-info">
        <h3 class = "movie-title">${details.Title}</h3>
        <ul class = "movie-misc-info">
            <li class = "year">Year: ${details.Year}</li>
            <li class = "rated">Ratings: ${details.Rated}</li>
            <li class = "released">Released: ${details.Released}</li>
        </ul>
        <p class = "genre"><b>Genre:</b> ${details.Genre}</p>
        <p class = "writer"><b>Writer:</b> ${details.Writer}</p>
        <p class = "actors"><b>Actors: </b>${details.Actors}</p>
        <p class = "plot"><b>Plot:</b>     ${details.Plot}</p>
        <p class = "language"><b>Language:</b> ${details.Language}</p>
        <p class = "awards"><b><i class = "fas fa-award"></i></b> ${details.Awards}</p>
        <button id="wishlist-button">   💓  </button>
        <div class="rate">
        <input type="number" id="rating-input" placeholder="Add ratings">
        <input type="text" id="comment-input" placeholder="Add a comment...">
        <button id="save-button">SAVE</button>
    </div>
    </div>
    `;

    

    const wishlistButton = resultGrid.querySelector('#wishlist-button');
    wishlistButton.addEventListener('click', () => {
        saveToWishlist(details);
    });

    function saveToWishlist(movieDetails) {
        // Get the existing wishlist from local storage or create an empty array
        const existingWishlist = JSON.parse(localStorage.getItem('fav')) || [];
    
        // Check if the movie is already in the wishlist
        const isMovieInWishlist = existingWishlist.some(item => item.movie.imdbID === movieDetails.imdbID);
    
        // If the movie is already in the wishlist, show an error message
        if (isMovieInWishlist) {
            alert("Movie is already in the wishlist.");
            return;
        }
    
        // Create an object with movie details, ratings, and comments
        const newMovie = {
            movie: movieDetails,
            ratings: [],
            comments: []
        };
    
        // Add the new movie object to the wishlist
        existingWishlist.push(newMovie);
    
        // Save the updated wishlist back to local storage
        localStorage.setItem('fav', JSON.stringify(existingWishlist));
        alert("Movie added to the wishlist.");
    }
    
// Attach event listener to the save button
const saveButton = resultGrid.querySelector('#save-button');
saveButton.addEventListener('click', () => {
    const ratingInput = resultGrid.querySelector('#rating-input');
    const commentInput = resultGrid.querySelector('#comment-input');
    
    const rating = ratingInput.value;
    const comment = commentInput.value;
    
    // You can save both ratings and comments using functions here
    saveRating(details, rating);
    saveComment(details, comment);
    
    ratingInput.value = ''; 
    commentInput.value = ''; // Clear the inputs after saving
});

document.addEventListener('DOMContentLoaded', () => {
    // Attach event listeners to buttons and inputs here
    const saveButton = document.querySelector('#save-button');
    saveButton.addEventListener('click', () => {
        // Call the appropriate functions (saveRating and saveComment) here
        const ratingInput = document.querySelector('#rating-input');
        const commentInput = document.querySelector('#comment-input');
        
        const rating = ratingInput.value;
        const comment = commentInput.value;
        
        saveRating(details, rating);
        saveComment(details, comment);
        
        ratingInput.value = ''; 
        commentInput.value = ''; // Clear the inputs after saving
    });

});


}
function saveRating(movieDetails, rating) {
    // Get the existing wishlist from local storage
    const existingWishlist = JSON.parse(localStorage.getItem('fav')) || [];

    // Find the movie in the wishlist
    const movieInWishlist = existingWishlist.find(item => item.movie.imdbID === movieDetails.imdbID);

    // If the movie is found, add the rating to its ratings array
    if (movieInWishlist) {
        if (!movieInWishlist.ratings.includes(rating)) {
            movieInWishlist.ratings.push(rating);
            localStorage.setItem('fav', JSON.stringify(existingWishlist));
            alert("Ratings added.");
        } else {
            alert("Ratings already given.");
        }
    } else {
        alert("Movie not found in the wishlist.");
    }
}

function saveComment(movieDetails, comment) {
    // Get the existing wishlist from local storage
    const existingWishlist = JSON.parse(localStorage.getItem('fav')) || [];

    // Find the movie in the wishlist
    const movieInWishlist = existingWishlist.find(item => item.movie.imdbID === movieDetails.imdbID);

    // If the movie is found, add the comment to its comments array
    if (movieInWishlist) {
        if (!movieInWishlist.comments.includes(comment)) {
            movieInWishlist.comments.push(comment);
            localStorage.setItem('fav', JSON.stringify(existingWishlist));
            alert("Comment added.");
        } else {
            alert("Comment already exists.");
        }
    } else {
        alert("Movie not found in the wishlist.");
    }
}






window.addEventListener('click',(event)=>{
if(event.target.className != "form-control"){
    searchList.classList.add('hide-search-list');
}
})
//window.addEventListener("load", setup);


//*************  pagination  *************//


const API_KEY = 'api_key=1cf50e6248dc270629e802686245c2c8';
const BASE_URL = 'https://api.themoviedb.org/3';
const API_URL = BASE_URL + '/discover/movie?sort_by=popularity.desc&'+API_KEY;
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const searchURL = BASE_URL + '/search/movie?'+API_KEY;

const main = document.getElementById('main');
const prev = document.getElementById('prev')
const next = document.getElementById('next')
const current = document.getElementById('current')

var currentPage = 1;
var nextPage = 2;
var prevPage = 3;
var lastUrl = '';
var totalPages = 100;


getMovies(API_URL);

function getMovies(url) {
  lastUrl = url;
    fetch(url).then(res => res.json()).then(data => {
        console.log(data.results)
        if(data.results.length !== 0){
            showMovies(data.results);
            currentPage = data.page;
            nextPage = currentPage + 1;
            prevPage = currentPage - 1;
            totalPages = data.total_pages;

            current.innerText = currentPage;

            if(currentPage <= 1){
              prev.classList.add('disabled');
              next.classList.remove('disabled')
            }else if(currentPage>= totalPages){
              prev.classList.remove('disabled');
              next.classList.add('disabled')
            }else{
              prev.classList.remove('disabled');
              next.classList.remove('disabled')
            }

            tagsEl.scrollIntoView({behavior : 'smooth'})

        }else{
            main.innerHTML= `<h1 class="no-results">No Results Found</h1>`
        }
       
    })

}


function showMovies(data) {
    main.innerHTML = '';

    data.forEach(movie => {
        const {title, poster_path, vote_average, overview, id} = movie;
        const movieEl = document.createElement('div');
        movieEl.classList.add('movie');
        movieEl.innerHTML = `
             <img src="${poster_path? IMG_URL+poster_path: "http://via.placeholder.com/1080x1580" }" alt="${title}">

            <div class="movie-info">
                <h3>${title}</h3>
                <p>🌟  ${vote_average}</p>
            </div>
            <div class="overview">
                <h3>Overview</h3>
                ${overview}
                <br/> 
            </div>
        
        `
        main.appendChild(movieEl);

    })
}

prev.addEventListener('click', () => {
  if(prevPage > 0){
    pageCall(prevPage);
  }
})

next.addEventListener('click', () => {
  if(nextPage <= totalPages){
    pageCall(nextPage);
  }
})

function pageCall(page){
  let urlSplit = lastUrl.split('?');
  let queryParams = urlSplit[1].split('&');
  let key = queryParams[queryParams.length -1].split('=');
  if(key[0] != 'page'){
    let url = lastUrl + '&page='+page
    getMovies(url);
  }else{
    key[1] = page.toString();
    let a = key.join('=');
    queryParams[queryParams.length -1] = a;
    let b = queryParams.join('&');
    let url = urlSplit[0] +'?'+ b
    getMovies(url);
  }
}

