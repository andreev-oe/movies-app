import React from 'react'
import { Alert, Spin } from 'antd'

import MovieCard from '../movie-card/movie-card.jsx'
import { Consumer } from '../../services/movies-context/movies-context.jsx'

const ERROR_MESSAGE = 'Sorry, content not loaded, check your internet connection and try to update page'
const NO_MOVIES_MESSAGE = 'No movies found'

export default class MoviesList extends React.Component {
  constructor(props) {
    super(props)
  }
  showMoviesCards(movies) {
    //TODO too many paintings, look items then map goes through the loop
    return movies.map(({ id, genreIds, overview, releaseDate, title, posterPath, popularity }) => {
      return (
        <MovieCard
          key={id}
          overview={overview}
          releaseDate={releaseDate}
          title={title}
          posterPath={posterPath}
          popularity={popularity}
          genreIds={genreIds}
        />
      )
    })
  }

  render() {
    return (
      <Consumer>
        {({ movies, loading, error, noMoviesFound, errorContent }) => {
          const hasData = !(loading && error)
          const spinner = loading ? (
            <div className="spinner-container">
              <Spin tip="Loading..." className="spinner" size="large">
                <div className="content" />
              </Spin>
            </div>
          ) : null
          const errorMessage = error ? (
            <Alert
              showIcon
              type={'error'}
              className="error-message"
              message={ERROR_MESSAGE}
              description={`Description - ${errorContent}`}
            />
          ) : null
          const noMoviesMessage = noMoviesFound ? (
            <Alert showIcon type={'info'} className="error-message" message={NO_MOVIES_MESSAGE} />
          ) : null
          const content = hasData ? this.showMoviesCards(movies) : null
          return (
            <div className="movies">
              {content}
              {errorMessage}
              {noMoviesMessage}
              {spinner}
            </div>
          )
        }}
      </Consumer>
    )
  }
}
