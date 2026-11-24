import * as React from 'react'

/** True while the media query matches. Re-renders on change. */
export function useMediaQuery(query: string): boolean {
  const get = () => (typeof window === 'undefined' ? true : window.matchMedia(query).matches)
  const [matches, setMatches] = React.useState(get)
  React.useEffect(() => {
    const mql = window.matchMedia(query)
    const onChange = () => setMatches(mql.matches)
    onChange()
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [query])
  return matches
}
