import React from 'react'
import { format } from 'date-fns'

import MovieCard from '../movie-card/movie-card.jsx'
import TmdbApi from '../../api/tmdb-api.js'

const MAX_OVERVIEW_LENGTH = 200
const NO_RELEASE_DATE_TEXT = 'Release date unknown'
const NO_OVERVIEW_TEXT = 'This movie has no description'

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      movies: [],
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
    this.movies.getMovies('return').then((data) => {
      data.results.forEach(({ id, overview, release_date, title }) => {
        const formattedDate = release_date ? format(new Date(release_date), 'MMMM d, yyyy') : NO_RELEASE_DATE_TEXT
        this.setState(({ movies }) => {
          const movie = {
            id: id,
            overview: overview ? this.shortenOverview(overview) : NO_OVERVIEW_TEXT,
            releaseDate: formattedDate,
            title: title,
          }
          const updatedMovies = [...movies]
          updatedMovies.push(movie)
          return {
            movies: updatedMovies,
          }
        })
      })
    })
  }
  render() {
    return (
      <div className="movies">
        {this.state.movies.map(({ id, overview, releaseDate, title }) => {
          return <MovieCard key={id} overview={overview} releaseDate={releaseDate} title={title} />
        })}
      </div>
    )
  }
}
