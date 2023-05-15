export default class TmdbApi {
  constructor() {
    this.authToken =
      'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3ZTQzZmRkNDIwYzg4ODFiYmEwOGQxYjhkZTc1OWM3MSIsInN1YiI6IjY0NTkzN2JjMTU2Y2M3MDE3ZDcyZDBhNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.oDVyvuvmKACZBcS_uPrDixm2moA9Jct2fLhutfeGlzU'
    this._apiKey = '7e43fdd420c8881bba08d1b8de759c71'
    this._searchUrl = 'https://api.themoviedb.org/3/search/movie'
    this._guestSessionUrl = 'https://api.themoviedb.org/3/authentication/guest_session/new'
    this._genresUrl = 'https://api.themoviedb.org/3/genre/movie/list?language=en'
    this._getOptions = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: this.authToken,
      },
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
      const data = await response.json()
      console.log(data)
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
  async createGuestSession() {
    const response = await fetch(this._guestSessionUrl, this._getOptions)
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`)
    }
    const data = await response.json()
    return this._transformGuestSession(data)
  }
  async getMovies(keyWord, page) {
    //TODO temporary this is the default value for fetch
    if (!keyWord) {
      keyWord = 'return'
    }
    const url = this.createUrl(keyWord, page)
    const response = await fetch(url, this._getOptions)
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`)
    }
    const movies = await response.json()
    return this._transformMovies(movies)
  }
  async getGenres() {
    const response = await fetch(this._genresUrl, this._getOptions)
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`)
    }
    return await response.json()
  }
}
