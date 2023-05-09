import React from 'react'
import { format } from 'date-fns'
import { Alert, Spin } from 'antd'

import MovieCard from '../movie-card/movie-card.jsx'
import TmdbApi from '../../api/tmdb-api.js'
import defaultPoster from '../../img/default-poster.jpg'

const ERROR_MESSAGE = 'Sorry, content not loaded, check your internet connection and try to update page'
const MAX_OVERVIEW_LENGTH = 200
const NO_RELEASE_DATE_TEXT = 'Release date unknown'
const NO_OVERVIEW_TEXT = 'This movie has no description'
const POSTER_URL = 'https://image.tmdb.org/t/p/w500'

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      movies: [],
      loading: true,
      error: false,
      errorContent: null,
    }
    this.movies = new TmdbApi()
    this.getMovies()
  }
  shortenOverview(overview) {
    if (overview.length > MAX_OVERVIEW_LENGTH) {
      const shortOverview = overview.slice(0, MAX_OVERVIEW_LENGTH).split(' ')
      shortOverview.pop()
      return `${shortOverview.join(' ')}...`
    }
    return overview
  }
  getMovies() {
    this.movies
      .getMovies('return')
      .then((data) => {
        data.forEach(({ id, overview, releaseDate, title, posterPath }) => {
          this.setState(({ movies }) => {
            const movie = {
              id: id,
              overview: overview ? this.shortenOverview(overview) : NO_OVERVIEW_TEXT,
              releaseDate: releaseDate ? format(new Date(releaseDate), 'MMMM d, yyyy') : NO_RELEASE_DATE_TEXT,
              title: title,
              posterPath: posterPath ? `${POSTER_URL}${posterPath}` : defaultPoster,
            }
            const updatedMovies = [...movies]
            updatedMovies.push(movie)
            return {
              movies: updatedMovies,
              loading: false,
            }
          })
        })
      })
      .catch((errorContent) => {
        this.setState({
          error: true,
          errorContent: errorContent.toString(),
          loading: false,
        })
      })
  }
  showMoviesCards(movies) {
    return movies.map(({ id, overview, releaseDate, title, posterPath }) => {
      return <MovieCard key={id} overview={overview} releaseDate={releaseDate} title={title} posterPath={posterPath} />
    })
  }
  render() {
    const { movies, loading, error, errorContent } = this.state
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
    const content = hasData ? this.showMoviesCards(movies) : null
    return (
      <div className="movies">
        {content}
        {spinner}
        {errorMessage}
      </div>
    )
  }
}
