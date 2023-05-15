import React from 'react'
import { format } from 'date-fns'
import { Pagination, Tabs } from 'antd'

import { Provider } from '../../services/movies-context/movies-context.jsx'
import TmdbApi from '../../services/api/tmdb-api.js'
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
      guestSessionId: null,
      genres: [],
    }
    this.moviesApi = new TmdbApi()
    this.switchTab = (key) => {
      if (key === '1') {
        this.getMovies(1)
      } else {
        this.getRatedMovies(1)
      }
    }
    this.getMovies = (page = 1) => {
      this.setState(() => {
        return {
          movies: [],
          noMoviesFound: false,
          error: false,
          loading: true,
        }
      })
      this.moviesApi
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
          data.forEach(({ id, genreIds, overview, releaseDate, title, posterPath, popularity }) => {
            this.setState(({ movies }) => {
              const movie = {
                id: id,
                genreIds: genreIds,
                overview: overview ? this.shortenOverview(overview) : NO_OVERVIEW_TEXT,
                releaseDate: releaseDate ? format(new Date(releaseDate), 'MMMM d, yyyy') : NO_RELEASE_DATE_TEXT,
                title: title,
                posterPath: posterPath ? `${POSTER_URL}${posterPath}` : defaultPoster,
                popularity: popularity,
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
    this.getRatedMovies = (page = 1) => {
      this.setState(() => {
        return {
          movies: [],
          noMoviesFound: false,
          error: false,
          loading: true,
        }
      })
      this.moviesApi
        .getRatedMovies(page, this.state.guestSessionId)
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
          data.forEach(({ id, genreIds, overview, releaseDate, title, posterPath, popularity }) => {
            this.setState(({ movies }) => {
              const movie = {
                id: id,
                genreIds: genreIds,
                overview: overview ? this.shortenOverview(overview) : NO_OVERVIEW_TEXT,
                releaseDate: releaseDate ? format(new Date(releaseDate), 'MMMM d, yyyy') : NO_RELEASE_DATE_TEXT,
                title: title,
                posterPath: posterPath ? `${POSTER_URL}${posterPath}` : defaultPoster,
                popularity: popularity,
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
  componentDidMount() {
    this.moviesApi.createGuestSession().then((data) => {
      this.setState({
        guestSessionId: data.guestSessionId,
      })
      this.moviesApi.getGenres().then((data) => {
        this.setState({
          genres: data.genres,
        })
      })
      this.getMovies()
    })
  }

  render() {
    const { loading, totalPages } = this.state
    const items = [
      {
        key: '1',
        label: 'Search',
      },
      {
        key: '2',
        label: 'Rated',
      },
    ]

    return (
      <div className="content-wrapper">
        <div className="page-content">
          <Tabs centered defaultActiveKey="1" items={items} onChange={(key) => this.switchTab(key)} />
          <SearchBar
            onChange={this.onInput}
            getMovies={this.getMovies}
            className="search-field"
            placeholder={'Type here to search...'}
            value={this.state.searchText}
          />
          <Provider
            value={{
              state: this.state,
              addRating: this.moviesApi.addRating,
            }}
          >
            <MoviesList />
          </Provider>
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
