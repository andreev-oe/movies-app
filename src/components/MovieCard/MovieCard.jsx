import React from 'react'
import { Rate } from 'antd'

import { Consumer } from '../../services/movies-context/movies-context.jsx'

const POSTER_WIDTH = 183
const POSTER_HEIGHT = 281

const setColor = (voteAverage) => {
  if (voteAverage < 3) {
    return 'bad'
  }
  if (voteAverage >= 3 && voteAverage < 5) {
    return 'average'
  }
  if (voteAverage >= 5 && voteAverage < 7) {
    return 'good'
  }
  return 'great'
}
const showMovieGenres = (movieGenresIds, genres) => {
  const movieGenres = movieGenresIds.map((movieGenreId) => {
    const genresNames = genres.find((genre) => movieGenreId === genre.id)
    if (genresNames) {
      return genresNames.name
    }
  })
  return movieGenres.map((movieGenre, index) => (
    <p key={movieGenresIds[index]} className="movie-card__genres--genre">
      {movieGenre}
    </p>
  ))
}
const MovieCard = ({ id, overview, releaseDate, title, posterPath, voteAverage, rating, genreIds }) => {
  return (
    <Consumer>
      {({ state: { genres, guestSessionId }, addRating }) => {
        return (
          <div className="movie-card">
            <img
              className="movie-card__poster"
              src={posterPath}
              alt="movie"
              width={POSTER_WIDTH}
              height={POSTER_HEIGHT}
            />
            <div className="movie-card__info">
              <h2 className="movie-card__title">{title}</h2>
              <p className="movie-card__date">{releaseDate}</p>
              <div className="movie-card__genres">{showMovieGenres(genreIds, genres)}</div>
              <p className="movie-card__description">{overview}</p>
              <Rate
                allowHalf
                onChange={(value) => {
                  addRating(value, id, guestSessionId)
                }}
                count={10}
                defaultValue={rating}
              />
              <div className={`movie-card__rating movie-card__rating--${setColor(voteAverage)}`}>
                <p className="movie-card__rating--popularity">{voteAverage.toFixed(1)}</p>
              </div>
            </div>
          </div>
        )
      }}
    </Consumer>
  )
}

export default MovieCard
