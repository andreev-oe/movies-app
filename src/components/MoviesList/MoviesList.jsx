import React from 'react'
import { Alert, Spin } from 'antd'

import { MovieCard } from '../MovieCard/index.js'
import { Consumer } from '../../context/movies-context.jsx'

const ERROR_MESSAGE = 'Sorry, content not loaded, check your internet connection and try to update page'
const NO_MOVIES_MESSAGE = 'No movies found'
const NO_RATED_MOVIES_MESSAGE = 'No rated movies'

const showMoviesCards = (movies) => {
  return movies.map(({ id, genreIds, overview, releaseDate, title, posterPath, rating, voteAverage }) => {
    return (
      <MovieCard
        key={id}
        id={id}
        overview={overview}
        releaseDate={releaseDate}
        title={title}
        posterPath={posterPath}
        voteAverage={voteAverage}
        genreIds={genreIds}
        rating={rating}
      />
    )
  })
}

const MoviesList = () => {
  return (
    <Consumer>
      {({ state: { movies, loading, error, noMoviesFound, searchTabOpened, errorContent } }) => {
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
        const noMoviesMessage =
          noMoviesFound && !error ? (
            <Alert
              showIcon
              type={'info'}
              className="error-message"
              message={searchTabOpened ? NO_MOVIES_MESSAGE : NO_RATED_MOVIES_MESSAGE}
            />
          ) : null
        const content = hasData ? showMoviesCards(movies) : null
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

export default MoviesList
