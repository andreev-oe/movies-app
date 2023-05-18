import React from 'react'
import { Rate } from 'antd'
import PropTypes from 'prop-types'

import { Consumer } from '../../services/movies-context/movies-context.jsx'

const POSTER_WIDTH = 183
const POSTER_HEIGHT = 281
const STARS_COUNT = 10
const DIGITS_AFTER_COMMA = 1
const ratingScore = {
  BAD: 3,
  AVERAGE: 5,
  GOOD: 7,
}
const ratingScoreCss = {
  BAD: 'bad',
  AVERAGE: 'average',
  GOOD: 'good',
  GREAT: 'great',
}

const setColor = (voteAverage) => {
  if (voteAverage < ratingScore.BAD) {
    return ratingScoreCss.BAD
  }
  if (voteAverage >= ratingScore.BAD && voteAverage < ratingScore.AVERAGE) {
    return ratingScoreCss.AVERAGE
  }
  if (voteAverage >= ratingScore.AVERAGE && voteAverage < ratingScore.GOOD) {
    return ratingScoreCss.GOOD
  }
  return ratingScoreCss.GREAT
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
                count={STARS_COUNT}
                defaultValue={rating}
              />
              <div className={`movie-card__rating movie-card__rating--${setColor(voteAverage)}`}>
                <p className="movie-card__rating--popularity">{voteAverage.toFixed(DIGITS_AFTER_COMMA)}</p>
              </div>
            </div>
          </div>
        )
      }}
    </Consumer>
  )
}

MovieCard.defaultProps = {
  id: 0,
  overview: '',
  releaseDate: '',
  title: '',
  posterPath: '',
  voteAverage: 0,
  rating: 0,
  genreIds: [0],
}

MovieCard.propTypes = {
  id: PropTypes.number,
  overview: PropTypes.string,
  releaseDate: PropTypes.string,
  title: PropTypes.string,
  posterPath: PropTypes.string,
  voteAverage: PropTypes.number,
  rating: PropTypes.number,
  genreIds: PropTypes.arrayOf(PropTypes.number),
}

export default MovieCard
