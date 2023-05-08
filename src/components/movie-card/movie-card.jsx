import React from 'react'

export default class MovieCard extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { overview, releaseDate, title } = this.props
    return (
      <div className="movie-card">
        <img
          className="movie-card__poster"
          src="https://avatars.mds.yandex.net/get-kinopoisk-image/1600647/39da7a43-c6ff-45e1-a0d2-53a8ae43b0fb/300x450"
          alt="movie"
          width={183}
          height={281}
        />
        <div className="movie-card__info">
          <h2 className="movie-card__title">{title}</h2>
          <p className="movie-card__date">{releaseDate}</p>
          <div className="movie-card__genres">
            <p className="movie-card__genres--genre">Action</p>
            <p className="movie-card__genres--genre">Drama</p>
          </div>
          <p className="movie-card__description">{overview}</p>
        </div>
      </div>
    )
  }
}
