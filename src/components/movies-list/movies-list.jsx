import React from 'react'
import { Alert, Spin } from 'antd'

const ERROR_MESSAGE = 'Sorry, content not loaded, check your internet connection and try to update page'
const NO_MOVIES_MESSAGE = 'No movies found'

export default class MoviesList extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { movies, loading, error, noMoviesFound, errorContent, showMoviesCards } = this.props
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
    const content = hasData ? showMoviesCards(movies) : null
    return (
      <div className="movies">
        {content}
        {errorMessage}
        {noMoviesMessage}
        {spinner}
      </div>
    )
  }
}
