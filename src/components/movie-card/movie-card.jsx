import React from 'react'
import { Rate } from 'antd'

const POSTER_WIDTH = 183
const POSTER_HEIGHT = 281

const MovieCard = ({ overview, releaseDate, title, posterPath, popularity }) => {
  //От 0 до 3 - #E90000
  // От 3 до 5 - #E97E00
  // От 5 до 7 - #E9D100
  // Выше 7 - #66E900
  const setColor = (popularity) => {
    if (popularity < 3) {
      return 'bad'
    }
    if (popularity >= 3 && popularity < 5) {
      return 'average'
    }
    if (popularity >= 5 && popularity < 7) {
      return 'good'
    }
    return 'great'
  }
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
        <div className={`movie-card__rating movie-card__rating--${setColor(popularity)}`}>
          <p className="movie-card__rating--popularity">{popularity.toFixed(1)}</p>
        </div>
      </div>
    </div>
  )
}

export default MovieCard
