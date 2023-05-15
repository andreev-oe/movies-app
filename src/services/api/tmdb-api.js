export default class TmdbApi {
  constructor() {
    this._apiKey = '7e43fdd420c8881bba08d1b8de759c71'
    this.getMovies = async (keyWord, page) => {
      //TODO temporary this is the default value for fetch
      if (!keyWord) {
        keyWord = 'return'
      }
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${this._apiKey}&language=en-US&query=${keyWord}&page=${page}&include_adult=false`,
        {
          method: 'GET',
        }
      )
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`)
      }
      const movies = await response.json()
      return this._transformMovies(movies)
    }
    this.getRatedMovies = async (page, guestSessionId) => {
      const response = await fetch(
        `https://api.themoviedb.org/3/guest_session/${guestSessionId}/rated/movies?api_key=${this._apiKey}`,
        {
          method: 'GET',
        }
      )
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`)
      }
      const movies = await response.json()
      return this._transformMovies(movies)
    }
    this.addRating = async (rating, movieId, guestSessionId) => {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}/rating?api_key=${this._apiKey}&guest_session_id=${guestSessionId}`,
        {
          method: 'POST',
          headers: {
            accept: 'application/json',
            'Content-Type': 'application/json;charset=utf-8',
          },
          body: JSON.stringify({ value: rating }),
        }
      )
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`)
      }
    }
  }
  _transformMovies(movies) {
    const totalPages = movies.total_pages
    const results = movies.results.map((movie) => {
      const transformedMovies = {
        ...movie,
        backdropPath: movie.backdrop_path,
        genreIds: movie.genre_ids,
        originalLanguage: movie.original_language,
        originalTitle: movie.original_title,
        posterPath: movie.poster_path,
        releaseDate: movie.release_date,
        voteAverage: movie.vote_average,
        voteCount: movie.vote_count,
      }
      delete transformedMovies.backdrop_path
      delete transformedMovies.genre_ids
      delete transformedMovies.original_language
      delete transformedMovies.original_title
      delete transformedMovies.poster_path
      delete transformedMovies.release_date
      delete transformedMovies.vote_average
      delete transformedMovies.vote_count
      return transformedMovies
    })
    results.totalPages = totalPages
    return results
  }
  _transformGuestSession(guestSessionData) {
    const transformedSessionData = {
      ...guestSessionData,
      guestSessionId: guestSessionData.guest_session_id,
      expiresAt: guestSessionData.expires_at,
    }
    delete transformedSessionData.guest_session_id
    delete transformedSessionData.expires_at
    return transformedSessionData
  }
  async createGuestSession() {
    const response = await fetch(
      `https://api.themoviedb.org/3/authentication/guest_session/new?api_key=${this._apiKey}`,
      {
        method: 'GET',
      }
    )
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`)
    }
    const data = await response.json()
    return this._transformGuestSession(data)
  }
  async getGenres() {
    const response = await fetch(
      `https://api.themoviedb.org/3/genre/movie/list?api_key=${this._apiKey}&language=en-US`,
      {
        method: 'GET',
      }
    )
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`)
    }
    return await response.json()
  }
}
