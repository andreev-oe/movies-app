import React from 'react'
import { Alert, Spin } from 'antd'

const ERROR_MESSAGE = 'Sorry, content not loaded, check your internet connection and try to update page'

export default class MoviesList extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { movies, loading, error, errorContent, showMoviesCards } = this.props
    const hasData = !(loading && error)
    const spinner = loading ? <Spin className="spinner" size="large" /> : null
    const errorMessage = error ? (
      <Alert
        showIcon
        type={'error'}
        className="error-message"
        message={ERROR_MESSAGE}
        description={`Description - ${errorContent}`}
      />
    ) : null
    const content = hasData ? showMoviesCards(movies) : null
    return (
      <div className="movies">
        {content}
        {spinner}
        {errorMessage}
      </div>
    )
  }
}
