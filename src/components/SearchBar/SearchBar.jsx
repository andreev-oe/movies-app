import React from 'react'
import { Input } from 'antd'
import PropTypes from 'prop-types'

const DEBOUNCE_TIME = 1000
const SEARCH_PLACEHOLDER = 'Type to search...'

const debounce = (fn, debounceTime) => {
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

class SearchBar extends React.Component {
  constructor(props) {
    super(props)
    this.debouncedRequest = debounce(this.props.getMovies, DEBOUNCE_TIME)
  }
  componentDidUpdate(prevProps) {
    if (prevProps.value !== this.props.value) {
      this.debouncedRequest()
    }
  }
  render() {
    const { onChange, className, value } = this.props
    return <Input onChange={onChange} className={className} placeholder={SEARCH_PLACEHOLDER} value={value} />
  }
}

SearchBar.defaultProps = {
  onChange: () => {},
  className: '',
  value: '',
  placeholder: '',
}
SearchBar.propTypes = {
  onInputChange: PropTypes.func,
  className: PropTypes.string,
  value: PropTypes.string,
  placeholder: PropTypes.string,
}

export default SearchBar
