import React from 'react'

import MovieCard from '../movie-card/movie-card.jsx'
import TmdbApi from '../../api/tmdb-api.js'

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      movies: [],
    }
    this.movies = new TmdbApi()
    this.updateMovies()
  }
  updateMovies() {
    this.movies.getMovies('return').then((data) => {
      data.results.forEach(({ id, overview, release_date, title }) => {
        this.setState(({ movies }) => {
          const movie = {
            id: id,
            overview: overview,
            releaseDate: release_date,
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
