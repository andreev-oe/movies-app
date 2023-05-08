export default class TmdbApi {
  constructor() {
    this._apiKey = 'api_key=7e43fdd420c8881bba08d1b8de759c71'
    this._searchUrl = 'https://api.themoviedb.org/3/search/movie'
    this._requestOptions = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3ZTQzZmRkNDIwYzg4ODFiYmEwOGQxYjhkZTc1OWM3MSIsInN1YiI6IjY0NTkzN2JjMTU2Y2M3MDE3ZDcyZDBhNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.oDVyvuvmKACZBcS_uPrDixm2moA9Jct2fLhutfeGlzU',
      },
    }
  }
  createUrl(keyWord) {
    const searchParams = new URLSearchParams({
      query: keyWord,
      include_adult: true,
      language: 'en-US',
      page: 1,
      api_key: this._apiKey,
    }).toString()
    return new URL(`${this._searchUrl}?${searchParams}`)
  }
  async getMovies(keyWord) {
    const url = this.createUrl(keyWord)
    try {
      const response = await fetch(url, this._requestOptions)
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}, message: ${response.statusText}`)
      }
      return await response.json()
    } catch (error) {
      //TODO show error message to user
      throw new Error(error)
    }
  }
}
