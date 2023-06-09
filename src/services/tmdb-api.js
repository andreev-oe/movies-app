export default class TmdbApi {
  constructor(apiKey) {
    this._apiKey = apiKey
    this._baseUrl = 'https://api.themoviedb.org/3/'
    this._getRequestOptions = {
      method: 'GET',
    }
    this.addRating = this.addRating.bind(this)
  }
  async getMovies(keyWord, page = 1) {
    if (!keyWord) {
      keyWord = 'great'
    }
    const response = await fetch(
      `${this._baseUrl}search/movie?api_key=${this._apiKey}&language=en-US&query=${keyWord}&page=${page}&include_adult=false`,
      this._getRequestOptions
    )
    this._checkResponse(response)
    const movies = await response.json()
    return this._transformMovies(movies)
  }
  async getRatedMovies(guestSessionId, page = 1) {
    const response = await fetch(
      `${this._baseUrl}guest_session/${guestSessionId}/rated/movies?api_key=${this._apiKey}&page=${page}`,
      this._getRequestOptions
    )
    this._checkResponse(response)
    const movies = await response.json()
    return this._transformMovies(movies)
  }
  async addRating(rating, movieId, guestSessionId) {
    const response = await fetch(
      `${this._baseUrl}movie/${movieId}/rating?api_key=${this._apiKey}&guest_session_id=${guestSessionId}`,
      {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify({ value: rating }),
      }
    )
    this._checkResponse(response)
  }
  async createGuestSession() {
    const response = await fetch(
      `${this._baseUrl}authentication/guest_session/new?api_key=${this._apiKey}`,
      this._getRequestOptions
    )
    this._checkResponse(response)
    const data = await response.json()
    return this._transformGuestSession(data)
  }
  async getGenres() {
    const response = await fetch(
      `${this._baseUrl}genre/movie/list?api_key=${this._apiKey}&language=en-US`,
      this._getRequestOptions
    )
    this._checkResponse(response)
    return await response.json()
  }
  _transformMovies(movies) {
    const totalPages = movies.total_pages
    const totalResults = movies.total_results
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
    results.totalResults = totalResults
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
  _checkResponse(response) {
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`)
    }
  }
}
