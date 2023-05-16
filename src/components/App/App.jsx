import React from 'react'
import { format } from 'date-fns'
import { Pagination, Tabs } from 'antd'

import { Provider } from '../../services/movies-context/movies-context.jsx'
import TmdbApi from '../../services/api/tmdb-api.js'
import defaultPoster from '../../img/default-poster.jpg'
import { SearchBar } from '../SearchBar/index.js'
import { MoviesList } from '../MoviesList/index.js'

const MAX_OVERVIEW_LENGTH = 200
const MAX_TITLE_LENGTH = 45
const NO_RELEASE_DATE_TEXT = 'Release date unknown'
const NO_OVERVIEW_TEXT = 'This movie has no description'
const NO_TITLE_TEXT = 'This movie has no title'
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
      searchTabOpened: true,
    }
    this.moviesApi = new TmdbApi()
    this.switchTab = (key) => {
      if (key === '1') {
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
    this.setMoviesToState = (data) => {
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
      let updatedMovies = []
      data.forEach(({ id, genreIds, overview, releaseDate, title, posterPath, popularity }) => {
        const movie = {
          id: id,
          genreIds: genreIds,
          overview: overview ? this.shortenText(overview, MAX_OVERVIEW_LENGTH) : NO_OVERVIEW_TEXT,
          releaseDate: releaseDate ? format(new Date(releaseDate), 'MMMM d, yyyy') : NO_RELEASE_DATE_TEXT,
          title: title ? this.shortenText(title, MAX_TITLE_LENGTH) : NO_TITLE_TEXT,
          posterPath: posterPath ? `${POSTER_URL}${posterPath}` : defaultPoster,
          popularity: popularity,
        }
        updatedMovies.push(movie)
      })
      this.setState(() => {
        return {
          movies: updatedMovies,
          loading: false,
          error: false,
          totalPages: data.totalPages,
        }
      })
    }
    this.getMovies = (page) => {
      this.setState(() => {
        return {
          movies: [],
          noMoviesFound: false,
          error: false,
          loading: true,
        }
      })
      this.moviesApi
        .getMovies(page, this.state.searchText)
        .then((data) => this.setMoviesToState(data))
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
    this.getRatedMovies = () => {
      this.setState(() => {
        return {
          movies: [],
          noMoviesFound: false,
          error: false,
          loading: true,
        }
      })
      this.moviesApi
        .getRatedMovies(this.state.guestSessionId)
        .then((data) => this.setMoviesToState(data))
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
    this.onInput = (evt) => {
      this.setState({
        searchText: evt.target.value,
      })
    }
  }
  shortenText(text, maxLength) {
    if (text.length > maxLength) {
      const shortText = text.slice(0, maxLength).split(' ')
      shortText.pop()
      return `${shortText.join(' ')}...`
    }
    return text
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
    const { movies, totalPages } = this.state
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
          {this.state.searchTabOpened ? (
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
          {movies.length !== 0 ? (
            <Pagination
              pageSize={20}
              defaultCurrent={1}
              total={totalPages}
              onChange={(page) => this.getMovies(page)}
              className="pagination"
            />
          ) : null}
        </div>
      </div>
    )
  }
}
