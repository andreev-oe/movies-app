import React from 'react'
import { Rate } from 'antd'

const POSTER_WIDTH = 183
const POSTER_HEIGHT = 281

const MovieCard = ({ overview, releaseDate, title, posterPath }) => {
  return (
    <div className="movie-card">
      <img className="movie-card__poster" src={posterPath} alt="movie" width={POSTER_WIDTH} height={POSTER_HEIGHT} />
      <div className="movie-card__info">
        <h2 className="movie-card__title">{title}</h2>
        <p className="movie-card__date">{releaseDate}</p>
        <div className="movie-card__genres">
          <p className="movie-card__genres--genre">Action</p>
          <p className="movie-card__genres--genre">Drama</p>
        </div>
        <p className="movie-card__description">{overview}</p>
        <Rate count={10} />
        <div className="movie-card__rating">
          <p className="movie-card__rating--data">6.6</p>
        </div>
      </div>
    </div>
  )
}

export default MovieCard
