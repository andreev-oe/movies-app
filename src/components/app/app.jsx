import React from 'react'
import { format } from 'date-fns'
import { Pagination } from 'antd'

import MovieCard from '../movie-card/movie-card.jsx'
import TmdbApi from '../../api/tmdb-api.js'
import defaultPoster from '../../img/default-poster.jpg'
import SearchBar from '../search-bar/search-bar.jsx'
import MoviesList from '../movies-list/movies-list.jsx'

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
      searchText: null,
    }
    this.movies = new TmdbApi()
    this.getMovies = () => {
      this.movies
        .getMovies(this.state.searchText)
        .then((data) => {
          this.setState({
            movies: [],
          })
          console.log(data)
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
    this.onInput = (evt) => {
      this.setState({
        searchText: evt.target.value,
      })
    }
  }
  shortenOverview(overview) {
    if (overview.length > MAX_OVERVIEW_LENGTH) {
      const shortOverview = overview.slice(0, MAX_OVERVIEW_LENGTH).split(' ')
      shortOverview.pop()
      return `${shortOverview.join(' ')}...`
    }
    return overview
  }
  showMoviesCards(movies) {
    return movies.map(({ id, overview, releaseDate, title, posterPath }) => {
      return <MovieCard key={id} overview={overview} releaseDate={releaseDate} title={title} posterPath={posterPath} />
    })
  }
  render() {
    const { movies, loading, error, errorContent } = this.state
    return (
      <div className="content-wrapper">
        <SearchBar
          onChange={this.onInput}
          getMovies={this.getMovies}
          className="search-field"
          placeholder={'Type here to search...'}
          value={this.state.searchText}
        />
        <MoviesList
          movies={movies}
          loading={loading}
          error={error}
          errorContent={errorContent}
          showMoviesCards={this.showMoviesCards}
        />
        <Pagination defaultCurrent={1} total={50} className="pagination" />
      </div>
    )
  }
}
