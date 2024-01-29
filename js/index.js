const filmsAPI = 'http://localhost:3000/films';
const firstmovieURL = `${filmsAPI}/1`;

fetch(firstmovieURL)
.then(res=>res.json())
.then(console.log(films))
