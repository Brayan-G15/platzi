// const api = axios.create({
//     baseURL: "https://api.themoviedb.org/3/",
//     headers: {
//         "Content-Type": "application/json;charset=utf-8",
//     },
//     params: {
//         "apy_key": API_KEY,
//     },
// });

//Utils

function likedMoviesList (){
    const item = JSON.parse(localStorage.getItem("liked_movies"));
    let movies;

    if (item){
        movies = item;
    } else {
        movies = {};
    }
    return movies;
}

function likeMovie(movie) {
    const likedMovies = likedMoviesList();

    if (likedMovies[movie.id]) {
        likedMovies[movie.id] = undefined;
    } else {
        likedMovies[movie.id] = movie;
    }

    localStorage.setItem("liked_movies", JSON.stringify(likedMovies));
}

const lazyloader = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            const url = entry.target.getAttribute("data-img")
            entry.target.setAttribute("src", url);
        }
    });
});

function createMovies(movies, container, {lazyLoad = false, clean = true} = {}){
    if(clean) {
        container.innerHTML = "";
    }

    movies.forEach(movie => {
        //const trendingMoviesPreviewList = document.querySelector("#trendingPreview .trendingPreview-movieList");//Guarda la etiqueta del HTML en una constante

        const movieContainer = document.createElement("div"); //Crea una nueva etiqueta div en el HTML 
        movieContainer.classList.add("movie-container"); // Mete la eqitueta creada en dentro de la etiqueta que se pasa en el id parentesis
        

        const movieImg = document.createElement("img"); //Crea una nueva etiqueta img en el HTML
        movieImg.classList.add("movie-img"); // Mete la etiqueta creada dentro de la etiqueta que se pasa en el id parentesis
        movieImg.setAttribute("all", movie.title); //Le pasamos el valor titulo de la pelicula que al atributo all
        movieImg.setAttribute(lazyLoad ? "data-img" : "src", "https://image.tmdb.org/t/p/w300"+ movie.poster_path); //Le pasamos el valor titulo de la pelicula que al atributo all
        movieImg.addEventListener("click", () => {
            location.hash = "#movie=" + movie.id;
        });

        // boton para favoritos
        const movieBtn =document.createElement("button");
        movieBtn.classList.add("movie-btn");
        likedMoviesList()[movie.id] && movieBtn.classList.add("movie-btn--liked");
        movieBtn.addEventListener("click", () => {
            movieBtn.classList.toggle("movie-btn--liked");
            likeMovie(movie);
            getLikedMovies(); //Llamamos la function para que agregue a favoritos sin necesidad de recargar
        })
        if (lazyLoad) {
            lazyloader.observe(movieImg);
        }

        //Metemos las etiquetas dentro de otras etiquetas para dar la estructura qu trae el HTML
        movieContainer.appendChild(movieImg);
        movieContainer.appendChild(movieBtn);
        container.appendChild(movieContainer);
    });

}

function createCategories(categories, container){
    container.innerHTML = "";
    
    categories.forEach(category => {
        //const categoriesPreviewList = document.querySelector("#categoriesPreview .categoriesPreview-list");//Guarda la etiqueta del HTML en una constante

        const categoryContainer = document.createElement("div"); //Crea una nueva etiqueta div en el HTML 
        categoryContainer.classList.add("category-container"); // Mete la eqitueta creada en dentro de la etiqueta que se pasa en el id parentesis

        const categoryTitle = document.createElement("h3"); //Crea una nueva etiqueta h3 en el HTML
        categoryTitle.classList.add("category-title"); // Mete la etiqueta creada dentro de la etiqueta que se pasa en el id parentesis
        categoryTitle.setAttribute("id", category.id); //Le pasamos el id que nos arroja el array de genres
        categoryTitle.addEventListener("click", () => {
            location.hash = `#category=${category.id}-${category.name}`;
        })
        const categoryTitleText = document.createTextNode(category.name); //Ponemos el texto de la categoria


        //Metemos las etiquetas dentro de otras etiquetas para dar la estructura qu trae el HTML
        categoryTitle.appendChild(categoryTitleText);
        categoryContainer.appendChild(categoryTitle);
        container.appendChild(categoryContainer);
    });
}

//Function preview de tendecnia de peliculas
async function getTrendingMoviesPreview() {
    const res = await fetch(`https://api.themoviedb.org/3/trending/movie/day?api_key=${API_KEY}`);
    const data = await res.json();

    const movies = data.results; // Arroja un array

    createMovies(movies, trendingMoviesPreviewList, true);

    // trendingMoviesPreviewList.innerHTML = "";

    // //Manipulacion del DOM
    // movies.forEach(movie => {
    //     //const trendingMoviesPreviewList = document.querySelector("#trendingPreview .trendingPreview-movieList");//Guarda la etiqueta del HTML en una constante

    //     const movieContainer = document.createElement("div"); //Crea una nueva etiqueta div en el HTML 
    //     movieContainer.classList.add("movie-container"); // Mete la eqitueta creada en dentro de la etiqueta que se pasa en el id parentesis

    //     const movieImg = document.createElement("img"); //Crea una nueva etiqueta img en el HTML
    //     movieImg.classList.add("movie-img"); // Mete la etiqueta creada dentro de la etiqueta que se pasa en el id parentesis
    //     movieImg.setAttribute("all", movie.title); //Le pasamos el valor titulo de la pelicula que al atributo all
    //     movieImg.setAttribute("src", "https://image.tmdb.org/t/p/w300"+ movie.poster_path); //Le pasamos el valor titulo de la pelicula que al atributo all
    
    //     //Metemos las etiquetas dentro de otras etiquetas para dar la estructura qu trae el HTML
    //     movieContainer.appendChild(movieImg);
    //     trendingMoviesPreviewList.appendChild(movieContainer);
    // });
}

//Funcion lista de generos 
async function getGenresMoviesPreview() {
    const res = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`);
    const data = await res.json();
    const categories = data.genres; // Arroja un array

    createCategories(categories, categoriesPreviewList);

    
    // categoriesPreviewList.innerHTML = "";

    // //Manipulacion del DOM
    // categories.forEach(category => {
    //     //const categoriesPreviewList = document.querySelector("#categoriesPreview .categoriesPreview-list");//Guarda la etiqueta del HTML en una constante

    //     const categoryContainer = document.createElement("div"); //Crea una nueva etiqueta div en el HTML 
    //     categoryContainer.classList.add("category-container"); // Mete la eqitueta creada en dentro de la etiqueta que se pasa en el id parentesis

    //     const categoryTitle = document.createElement("h3"); //Crea una nueva etiqueta h3 en el HTML
    //     categoryTitle.classList.add("category-title"); // Mete la etiqueta creada dentro de la etiqueta que se pasa en el id parentesis
    //     categoryTitle.setAttribute("id", category.id); //Le pasamos el id que nos arroja el array de genres
    //     categoryTitle.addEventListener("click", () => {
    //         location.hash = `#category=${category.id}-${category.name}`;
    //     })
    //     const categoryTitleText = document.createTextNode(category.name); //Ponemos el texto de la categoria


    //     //Metemos las etiquetas dentro de otras etiquetas para dar la estructura qu trae el HTML
    //     categoryTitle.appendChild(categoryTitleText);
    //     categoryContainer.appendChild(categoryTitle);
    //     categoriesPreviewList.appendChild(categoryContainer);
    // });
}



async function  getMoviesByCategory(id){
        const res = await fetch(`https://api.themoviedb.org/3/discover/movie?with_genres=${id}&api_key=${API_KEY}`);
        const data = await res.json();

        const movies = data.results; // Arroja un array

        createMovies(movies, genericSection, {lazyLoad: true});
    
    // createMovies(movies, genericSection, {lazyLoad: true, clean: true});

     // Boton paginacion, cargar mas
    // const btnLoadMore = document.createElement("button");
    // btnLoadMore.innerText = "load more";
    // btnLoadMore.addEventListener("click", getPaginatedTrendingMovies)
    // genericSection.appendChild(btnLoadMore);

    // genericSection.innerHTML = ""; // limpia la carga de datos para evitar carga repetida

    // //Manipulacion del DOM
    // movies.forEach(movie => {
    //     //const trendingMoviesPreviewList = document.querySelector("#trendingPreview .trendingPreview-movieList");//Guarda la etiqueta del HTML en una constante

    //     const movieContainer = document.createElement("div"); //Crea una nueva etiqueta div en el HTML 
    //     movieContainer.classList.add("movie-container"); // Mete la eqitueta creada en dentro de la etiqueta que se pasa en el id parentesis

    //     const movieImg = document.createElement("img"); //Crea una nueva etiqueta img en el HTML
    //     movieImg.classList.add("movie-img"); // Mete la etiqueta creada dentro de la etiqueta que se pasa en el id parentesis
    //     movieImg.setAttribute("all", movie.title); //Le pasamos el valor titulo de la pelicula que al atributo all
    //     movieImg.setAttribute("src", "https://image.tmdb.org/t/p/w300"+ movie.poster_path); //Le pasamos el valor titulo de la pelicula que al atributo all
    
    //     //Metemos las etiquetas dentro de otras etiquetas para dar la estructura qu trae el HTML
    //     movieContainer.appendChild(movieImg);
    //     genericSection.appendChild(movieContainer);

    //     console.log("categorias");
    // });
}

function getPaginatedMoviesByCategory(id) {
    return async function () {
        const {
        scrollTop,
        scrollHeight,
        clientHeight
    } = document.documentElement;

    const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 20);
    const pageIsNoteMax = page < maxPages;

    if (scrollIsBottom && pageIsNoteMax) {
            page++;
            const res = await fetch(`https://api.themoviedb.org/3/discover/movie?with_genres=${id}&page=${page}&api_key=${API_KEY}`);
            const data = await res.json();
            console.log(data);
            const movies = data.results; // Arroja un array
          
            createMovies(movies, genericSection, { lazyLoad: true, clean: false });
        };        
    }
}

async function  getMoviesBySearch(query){
    const res = await fetch(`https://api.themoviedb.org/3/search/movie?query=${query}&api_key=${API_KEY}`);
    const data = await res.json();

    const movies = data.results; // Arroja un array
    maxPages = data.total_pages;
    console.log(maxPages);
    createMovies(movies, genericSection);
}

function getPaginatedMoviesBySearch(query) {
    return async function () {
        const {
            scrollTop,
            scrollHeight,
            clientHeight
        } = document.documentElement;
    
        const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 20);
        const pageIsNoteMax = page < maxPages;
    
        if (scrollIsBottom && pageIsNoteMax) {
            page++;
            const res = await fetch(`https://api.themoviedb.org/3/search/movie?query=${query}+page=${page}&api_key=${API_KEY}`);
            const data = await res.json();

            const movies = data.results; // Arroja un array
            createMovies(movies, genericSection, { lazyLoad: true, clean: false });
        }
    }
}

async function getTrendingMovies() {
    const res = await fetch(`https://api.themoviedb.org/3/trending/movie/day?api_key=${API_KEY}`);
    const data = await res.json();

    const movies = data.results; // Arroja un array
    maxPages = data.total_pages;
    createMovies(movies, genericSection, {lazyLoad: true, clean: true});

    // Boton paginacion, cargar mas
    // const btnLoadMore = document.createElement("button");
    // btnLoadMore.innerText = "load more";
    // btnLoadMore.addEventListener("click", getPaginatedTrendingMovies)
    // genericSection.appendChild(btnLoadMore);
}
 
async function getPaginatedTrendingMovies() {
    const {
        scrollTop,
        scrollHeight,
        clientHeight
    } = document.documentElement;

    const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 20);
    const pageIsNoteMax = page < maxPages;

    if (scrollIsBottom && pageIsNoteMax) {
        page++;
        const res = await fetch(`https://api.themoviedb.org/3/trending/movie/day?page=${page}&api_key=${API_KEY}`);
        const data = await res.json();

        const movies = data.results; // Arroja un array

        createMovies(movies, genericSection, {lazyLoad: true, clean: false});
    }
    

    // const btnLoadMore = document.createElement("button");
    // btnLoadMore.innerText = "load more";
    // btnLoadMore.addEventListener("click", getPaginatedTrendingMovies)
    // genericSection.appendChild(btnLoadMore);
}



async function getMovieById(id){
    const res = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`);
    const data = await res.json();

    const movie = data;
    const movieImgUrl = 'https://image.tmdb.org/t/p/w500' + movie.poster_path;
    console.log("imagen");
    console.log(movieImgUrl)
    headerSection.style.background = `
      linear-gradient(
        180deg,
        rgba(0, 0, 0, 0.35) 19.27%,
        rgba(0, 0, 0, 0) 29.17%
      ),
      url(${movieImgUrl})
    `;
    
    movieDetailTitle.textContent = movie.title;
    movieDetailDescription.textContent = movie.overview;
    movieDetailScore.textContent = movie.vote_average;
  
    createCategories(movie.genres, movieDetailCategoriesList);

    getRelatedMoviesId(id);
}

async function getRelatedMoviesId(id){
    const res = await fetch(`https://api.themoviedb.org/3/movie/${id}/similar?api_key=${API_KEY}`);
    const data = await res.json();

    const movies = data.results;

    createMovies(movies, relatedMoviesContainer);
}


function getLikedMovies() {
    const likedMovies = likedMoviesList();
    const moviesArray = Object.values(likedMovies);

    createMovies(moviesArray, likedMoviesListArticle, { lazyLoad: true, clean: true});
    console.log(likedMovies);

    
}