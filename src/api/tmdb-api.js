export default class TmdbApi {
  constructor() {
    this.authToken =
      'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3ZTQzZmRkNDIwYzg4ODFiYmEwOGQxYjhkZTc1OWM3MSIsInN1YiI6IjY0NTkzN2JjMTU2Y2M3MDE3ZDcyZDBhNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.oDVyvuvmKACZBcS_uPrDixm2moA9Jct2fLhutfeGlzU'
    this._apiKey = 'api_key=7e43fdd420c8881bba08d1b8de759c71'
    this._searchUrl = 'https://api.themoviedb.org/3/search/movie'
    this._searchMoviesOptions = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: this.authToken,
      },
    }
    this._guestSessionOptions = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: this.authToken,
      },
    }
  }
  createUrl(keyWord, page) {
    const searchParams = new URLSearchParams({
      query: keyWord,
      include_adult: false,
      language: 'en-US',
      page: page,
      api_key: this._apiKey,
    }).toString()
    return new URL(`${this._searchUrl}?${searchParams}`)
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
  async getMovies(keyWord, page) {
    //TODO temporary this is the default value for fetch
    if (!keyWord) {
      keyWord = 'return'
    }
    const url = this.createUrl(keyWord, page)
    const response = await fetch(url, this._searchMoviesOptions)
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`)
    }
    const movies = await response.json()
    return this._transformMovies(movies)
  }
  async createGuestSession() {
    const response = await fetch(
      'https://api.themoviedb.org/3/authentication/guest_session/new',
      this._guestSessionOptions
    )
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`)
    }
    const data = await response.json()
    return this._transformGuestSession(data)
  }
}
