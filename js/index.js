const filmAPI = "http://localhost:3000/films";
let currentMovie = null;

document.addEventListener('DOMContentLoaded', () => {
    // Fetch data from the server and populate movie menu
    fetchMovies();
});

async function fetchMovies() {
    try {
        // Fetch movies data from the server
        const response = await fetch(`${filmAPI}`);
        const movies = await response.json();

        // Display the list of movies
        displayMovies(movies);

        // Display details of the first movie (if any)
        if (movies.length > 0) {
            fetchMovieDetails(movies[0].id);
        }
    } catch (error) {
        console.error('Error fetching movies:', error);
    }
}

function displayMovies(movies) {
    // Clear previous list items
    const filmsList = document.getElementById('films');
    filmsList.innerHTML = '';

    // Populate the movie menu
    movies.forEach(movie => {
        const li = document.createElement('li');
        li.textContent = movie.title;
        li.classList.add('film', 'item');

        // Add click event to show details when a movie is clicked
        li.addEventListener('click', () => {
            fetchMovieDetails(movie.id);
        });

        filmsList.appendChild(li);
    });
}

async function fetchMovieDetails(movieId) {
    try {
        // Fetch detailed information about a specific movie
        const response = await fetch(`http://localhost:3000/films/${movieId}`);
        if (!response.ok) {
            throw new Error('Movie details not found');
        }
        const movie = await response.json();

        // Set the current movie
        currentMovie = movie;

        // Reset ticket count to zero and button state
        resetTicketCount();

        // Display the details of the selected movie
        displayMovieDetails(movie);
    } catch (error) {
        console.error('Error fetching movie details:', error);
    }
}

function resetTicketCount() {
    // Reset ticket count to zero
    const tickets = document.getElementById('ticket-num');
    tickets.textContent = currentMovie.capacity - currentMovie.tickets_sold;

    // Reset buy ticket button state
    const buyTicketBtn = document.getElementById('buy-ticket');
    buyTicketBtn.textContent = tickets.textContent > 0 ? 'Buy Ticket' : 'Sold Out';
}

function displayMovieDetails(movie) {
    const movieName = document.getElementById('movie-name');
    const movieImage = document.getElementById('movie-image');
    const movieDescription = document.getElementById('movie-description');
    const showTime = document.getElementById('showtime');
    const runTime = document.getElementById('runtime');

    // Display movie details
    movieName.textContent = movie.title;
    movieImage.src = movie.poster;
    movieImage.alt = movie.title;
    movieDescription.textContent = movie.description;
    showTime.textContent = "Showtime: " + movie.showtime;
    runTime.textContent = "Runtime: " + movie.runtime + " minutes";
    
}

function buyTicket() {
    try {
        if (!currentMovie) {
            console.error('No movie selected');
            return;
        }

        // Get the remaining tickets from the UI
        let remTickets = parseInt(document.getElementById('ticket-num').textContent);

        // Check if there are available tickets
        if (remTickets > 0) {
            // Update the UI with the new ticket count
            document.getElementById('ticket-num').textContent = remTickets - 1;

            // Update tickets sold count for the current movie
            currentMovie.tickets_sold++;

            // Reset ticket count and button state
            resetTicketCount();

            // Log the ticket purchase for the selected movie
            console.log('Ticket bought for:', currentMovie.title);
        } else {
            console.log('No tickets available for:', currentMovie.title);
        }
    } catch (error) {
        console.error('Error buying ticket:', error);
    }
}

// Add event listener to the buy ticket button
const buyTicketBtn = document.getElementById('buy-ticket');
buyTicketBtn.addEventListener('click', buyTicket);
