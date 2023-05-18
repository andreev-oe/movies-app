import React from 'react'
import { format } from 'date-fns'
import { Pagination, Tabs } from 'antd'

import { Provider } from '../../services/movies-context/movies-context.jsx'
import TmdbApi from '../../services/api/tmdb-api.js'
import defaultPoster from '../../img/default-poster.jpg'
import { SearchBar } from '../SearchBar/index.js'
import { MoviesList } from '../MoviesList/index.js'

const PAGE_SIZE = 20
const tabKey = {
  SEARCH: 'search',
  RATED: 'rated',
}
const TABS = [
  {
    key: tabKey.SEARCH,
    label: 'Search',
  },
  {
    key: tabKey.RATED,
    label: 'Rated',
  },
]

const MAX_OVERVIEW_LENGTH = 180
const MIN_OVERVIEW_LENGTH = 140
const MAX_TITLE_LENGTH = 30
const MIN_TITLE_LENGTH = 20
const NO_RELEASE_DATE_TEXT = 'Release date unknown'
const NO_OVERVIEW_TEXT = 'This movie has no description'
const NO_TITLE_TEXT = 'This movie has no title'
const POSTER_URL = 'https://image.tmdb.org/t/p/w500'

const shortenText = (text, maxLength) => {
  if (text.length > maxLength) {
    const shortText = text.slice(0, maxLength).split(' ')
    shortText.pop()
    return `${shortText.join(' ')}...`
  }
  return text
}

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      movies: [],
      totalResults: 0,
      loading: true,
      error: false,
      noMoviesFound: false,
      errorContent: null,
      searchText: null,
      guestSessionId: null,
      genres: [],
      searchTabOpened: true,
      currentPage: 1,
    }
    this.moviesApi = new TmdbApi('7e43fdd420c8881bba08d1b8de759c71')
    this.onInput = this.onInput.bind(this)
    this.getMovies = this.getMovies.bind(this)
    this.getRatedMovies = this.getRatedMovies.bind(this)
  }
  getMovies(page = 1) {
    this.setState(() => {
      return {
        movies: [],
        noMoviesFound: false,
        error: false,
        loading: true,
        currentPage: page,
      }
    })
    this.moviesApi
      .getMovies(this.state.searchText, page)
      .then((data) => this.setMoviesToState(data, page))
      .catch((errorContent) => {
        this.setState(() => {
          return {
            movies: [],
            error: true,
            noMoviesFound: true,
            errorContent: errorContent.toString(),
            loading: false,
          }
        })
      })
  }
  onInput(evt) {
    this.setState({
      searchText: evt.target.value,
    })
  }
  getRatedMovies(page = 1) {
    this.setState(() => {
      return {
        movies: [],
        noMoviesFound: false,
        error: false,
        loading: true,
      }
    })
    this.moviesApi
      .getRatedMovies(this.state.guestSessionId, page)
      .then((data) => this.setMoviesToState(data, page))
      .catch((errorContent) => {
        this.setState(() => {
          return {
            movies: [],
            error: true,
            noMoviesFound: true,
            errorContent: errorContent.toString(),
            loading: false,
          }
        })
      })
  }
  setMoviesToState(data, page = 1) {
    if (!data.length) {
      this.setState({
        noMoviesFound: true,
        loading: false,
        error: false,
        currentPage: page,
      })
    }
    let updatedMovies = []
    data.forEach(({ id, genreIds, overview, releaseDate, title, posterPath, voteAverage, rating }) => {
      let shortenOverview
      if (title.length >= MIN_TITLE_LENGTH) {
        shortenOverview = shortenText(overview, MIN_OVERVIEW_LENGTH)
      } else {
        shortenOverview = shortenText(overview, MAX_OVERVIEW_LENGTH)
      }
      const movie = {
        id: id,
        genreIds: genreIds,
        overview: shortenOverview ? shortenOverview : NO_OVERVIEW_TEXT,
        releaseDate: releaseDate ? format(new Date(releaseDate), 'MMMM d, yyyy') : NO_RELEASE_DATE_TEXT,
        title: title ? shortenText(title, MAX_TITLE_LENGTH) : NO_TITLE_TEXT,
        posterPath: posterPath ? `${POSTER_URL}${posterPath}` : defaultPoster,
        voteAverage: voteAverage,
        rating: rating,
      }
      updatedMovies.push(movie)
    })
    this.moviesApi
      .getRatedMovies(this.state.guestSessionId)
      .then((ratedMovies) => {
        let updatedRatedMovies = []
        ratedMovies.forEach(({ id, rating }) => {
          const movie = {
            id: id,
            rating: rating,
          }
          updatedRatedMovies.push(movie)
        })
        updatedRatedMovies.forEach((ratedMovie) => {
          updatedMovies.forEach((updatedMovie) => {
            if (ratedMovie.id === updatedMovie.id) {
              updatedMovie.rating = ratedMovie.rating
            }
          })
        })
        this.setState(() => {
          return {
            movies: updatedMovies,
            loading: false,
            error: false,
            totalResults: data.totalResults,
            currentPage: page,
          }
        })
      })
      .catch(() => {
        this.setState(() => {
          return {
            movies: updatedMovies,
            loading: false,
            error: false,
            totalResults: data.totalResults,
            currentPage: page,
          }
        })
      })
  }
  switchTab(key) {
    if (key === tabKey.SEARCH) {
      this.getMovies()
      this.setState(() => {
        return {
          searchTabOpened: true,
        }
      })
    } else {
      this.getRatedMovies()
      this.setState(() => {
        return {
          searchTabOpened: false,
        }
      })
    }
  }
  componentDidMount() {
    this.moviesApi
      .createGuestSession()
      .then((data) => {
        this.setState({
          guestSessionId: data.guestSessionId,
        })
        this.moviesApi
          .getGenres()
          .then((data) => {
            this.setState({
              genres: data.genres,
            })
          })
          .catch((errorContent) => {
            this.setState(() => {
              return {
                movies: [],
                error: true,
                noMoviesFound: true,
                errorContent: errorContent.toString(),
                loading: false,
              }
            })
          })
        this.getMovies()
      })
      .catch((errorContent) => {
        this.setState(() => {
          return {
            movies: [],
            error: true,
            noMoviesFound: true,
            errorContent: errorContent.toString(),
            loading: false,
          }
        })
      })
  }
  render() {
    const { movies, totalResults, currentPage, searchTabOpened } = this.state
    return (
      <div className="content-wrapper">
        <div className="page-content">
          <Tabs
            destroyInactiveTabPane={true}
            centered
            defaultActiveKey={tabKey.SEARCH}
            items={TABS}
            onChange={(key) => this.switchTab(key)}
          />
          {searchTabOpened ? (
            <SearchBar
              onChange={this.onInput}
              getMovies={this.getMovies}
              className="search-field"
              placeholder={'Type here to search...'}
              value={this.state.searchText}
            />
          ) : null}
          <Provider
            value={{
              state: this.state,
              addRating: this.moviesApi.addRating,
            }}
          >
            <MoviesList />
          </Provider>
          <Pagination
            showSizeChanger={false}
            pageSize={PAGE_SIZE}
            current={currentPage}
            total={totalResults}
            onChange={searchTabOpened ? (page) => this.getMovies(page) : (page) => this.getRatedMovies(page)}
            className={`pagination ${movies.length ? '' : 'js-hidden'}`}
          />
        </div>
      </div>
    )
  }
}
