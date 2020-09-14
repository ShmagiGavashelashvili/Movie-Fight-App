const autoCompleteFig = {
  renderOption(movie) {
    const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;
    return  `
    <img src=${imgSrc}>
    ${movie.Title} - ${movie.Year}
    `
  },
  inputValue(movie) {
    return movie.Title;
  },
  async fetchData(searchTerm){
    const response = await axios.get('http://www.omdbapi.com/', {
        params : {
            apikey : '655e85c3',
            s : searchTerm
        }
    });
  
    if(response.data.Error) {
      return [];
    }
  
    return response.data.Search;
  }
};


creatAutoComplete({
  ...autoCompleteFig,
  root: document.querySelector('#left-autocomplete'),
  onOptionSelect(movie) {
    document.querySelector('.tutorial').classList.add('is-hidden');
    onMovieSelect(movie, document.getElementById('left-summary'), 'left');
  }
});

creatAutoComplete({
  ...autoCompleteFig,
  root: document.querySelector('#right-autocomplete'),
  onOptionSelect(movie) {
    document.querySelector('.tutorial').classList.add('is-hidden');
    onMovieSelect(movie, document.getElementById('right-summary'), 'right');
  }
});


let leftMovie;
let rightMovie;

const onMovieSelect = async (movie, summaryElement, side) => {
  const response = await axios.get('http://www.omdbapi.com/', {
    params : {
        apikey : '655e85c3',
        i : movie.imdbID
    }
  });
    summaryElement.innerHTML = movieTemplate(response.data);
    if(side === 'left') {
      leftMovie = response.data;
    } else {
      rightMovie = response.data;
    }

     if(rightMovie && leftMovie) {
       runComparision();
     }
  }

const runComparision = () => {
   const leftSideStats = document.querySelectorAll('#left-summary .notification');
   const rightSideStats = document.querySelectorAll('#right-summary .notification');
   
   leftSideStats.forEach((leftStat, index) => {
     const rightStat = rightSideStats[index];

     const leftSideValue = parseFloat(leftStat.dataset.value);
     const rightSideValue = parseFloat(rightStat.dataset.value);


     if(rightSideValue > leftSideValue) {
        leftStat.classList.remove('is-primary');
        leftStat.classList.add('is-warning');
     } else {
        rightStat.classList.remove('is-primary');
        rightStat.classList.add('is-warning');
     }
   });
}
 

const movieTemplate = movieDetails => {
  const dollars = parseFloat(movieDetails.BoxOffice.replace(/\$/g, '').replace(/,/g, ''));
  const metascore = parseFloat(movieDetails.Metascore);
  const imdbRating = parseFloat(movieDetails.imdbRating);
  const imdbVotes = parseFloat(movieDetails.imdbVotes.replace(/,/g, ''));
  const awards = movieDetails.Awards.split(' ').reduce((prev, current) => {
     const value = parseInt(current);
     if(isNaN(value)) {
       return prev;
     } else {
       return prev + value;
     } 
    }, 0);

  return `
    <article class="media">
       <figure class="media-left">
          <p class="image">
             <img src=${movieDetails.Poster}>
          </p>
       </figure>
       <div class="media-content">
         <div class="content">
            <h1>${movieDetails.Title}</h1>
            <h4>${movieDetails.Genre}</h4>
            <p>${movieDetails.Plot}</p>
         </div>
       </div>
    </article>
    <article data-value=${awards} class="notification is-primary">
      <p class="title">${movieDetails.Awards}</p>
      <p class="subtitle">Awards</p>
    </article>
    <article data-value=${dollars} class="notification is-primary">
      <p class="title">${movieDetails.BoxOffice}</p>
      <p class="subtitle">Boxoffice</p>
    </article>
    <article data-value=${metascore} class="notification is-primary">
      <p class="title">${movieDetails.Metascore}</p>
      <p class="subtitle">Metascore</p>
    </article>
    <article data-value=${imdbRating} class="notification is-primary">
      <p class="title">${movieDetails.imdbRating}</p>
      <p class="subtitle">IMDB</p>
    </article>
    <article data-value=${imdbVotes} class="notification is-primary">
      <p class="title">${movieDetails.imdbVotes}</p>
      <p class="subtitle">IMDB Votes</p>
    </article>
  `
}

