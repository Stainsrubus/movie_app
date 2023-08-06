const favMovies = JSON.parse(localStorage.getItem('fav'));

function clearResultContainer() {
    const resultContainer = document.getElementById('result-container');
    resultContainer.innerHTML = ''; // Clear existing content
}

function displayMovieDetails(movie, index) {
    const resultContainer = document.getElementById('result-container');

    const movieEntry = document.createElement('div');
    movieEntry.classList.add('result-container');
    movieEntry.innerHTML = `
        <div class="movie-entry">
            <div class="movie-poster">
                <img src="${(movie.movie.Poster !== "N/A") ? movie.movie.Poster : "image_not_found.png"}" alt="movie poster">
            </div>
            <div class="intro">
                <h3 class="movie-title">${movie.movie.Title}</h3>
                <p class="year">${movie.movie.Year}</p>
                <p class="writer"><b>Director:</b> ${movie.movie.Writer}</p>
                <p class="actors"><b>Starring:</b> ${movie.movie.Actors}</p>
                <p class="comment">Comments: ${movie.comments}</p>
                <p class="ratings">${movie.ratings}🌟</p>
                <button class="delete-button" data-index="${index}">Delete</button>
            </div>
        </div>
    `;
    resultContainer.appendChild(movieEntry);
}

clearResultContainer(); // Clear existing content

function updateDisplay() {
    clearResultContainer();
    favMovies.forEach((movie, index) => {
        displayMovieDetails(movie, index);
    });

    // Add click event listener for delete buttons
    const deleteButtons = document.querySelectorAll('.delete-button');
    deleteButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const indexToRemove = event.target.getAttribute('data-index');
            favMovies.splice(indexToRemove, 1); // Remove movie entry from the array
            localStorage.setItem('fav', JSON.stringify(favMovies)); // Update local storage

            // Update the display after removing the movie
            updateDisplay();
        });
    });
}

updateDisplay();
