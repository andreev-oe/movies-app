import React from 'react'
import { Input } from 'antd'

export default class SearchBar extends React.Component {
  constructor(props) {
    super(props)
    this.debouncedRequest = this.debounce(this.props.getMovies, 2000)
  }
  debounce(fn, debounceTime) {
    let debounceTimer
    return function (...data) {
      clearTimeout(debounceTimer)
      debounceTimer = setTimeout(() => {
        fn.apply(this, data)
        clearTimeout(debounceTimer)
        debounceTimer = null
      }, debounceTime)
    }
  }
  componentDidUpdate(prevProps) {
    if (prevProps.value !== this.props.value) {
      this.debouncedRequest()
    }
  }

  render() {
    const { onChange, className, value, placeholder } = this.props
    return <Input onChange={onChange} className={className} placeholder={placeholder} value={value} />
  }
}
