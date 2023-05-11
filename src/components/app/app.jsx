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
      totalPages: 0,
      loading: true,
      error: false,
      noMoviesFound: false,
      errorContent: null,
      searchText: null,
    }
    this.movies = new TmdbApi()
    this.getMovies = (page = 1) => {
      this.setState(() => {
        return {
          movies: [],
          noMoviesFound: false,
          error: false,
          loading: true,
        }
      })
      this.movies
        .getMovies(this.state.searchText, page)
        .then((data) => {
          this.setState({
            movies: [],
          })
          if (!data.length) {
            this.setState({
              movies: [],
              noMoviesFound: true,
              loading: false,
              error: false,
            })
          }
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
                error: false,
                noMoviesFound: false,
                totalPages: data.totalPages,
              }
            })
          })
        })
        .catch((errorContent) => {
          this.setState(() => {
            return {
              movies: [],
              error: true,
              noMoviesFound: false,
              errorContent: errorContent.toString(),
              loading: false,
            }
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
    //TODO too many paintings, look at index then map goes through the loop
    return movies.map(({ id, overview, releaseDate, title, posterPath }) => {
      return <MovieCard key={id} overview={overview} releaseDate={releaseDate} title={title} posterPath={posterPath} />
    })
  }
  componentDidMount() {
    this.getMovies()
  }

  render() {
    const { movies, loading, error, noMoviesFound, errorContent, totalPages } = this.state
    return (
      <div className="content-wrapper">
        <div className="page-content">
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
            noMoviesFound={noMoviesFound}
            errorContent={errorContent}
            showMoviesCards={this.showMoviesCards}
          />
          <Pagination
            pageSize={20}
            defaultCurrent={1}
            total={totalPages}
            onChange={(page) => this.getMovies(page)}
            className={`pagination loading-${loading}`}
          />
        </div>
      </div>
    )
  }
}
