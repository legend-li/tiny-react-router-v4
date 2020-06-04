import { pathToRegexp } from 'path-to-regexp'
import React, { useEffect, useState, useContext, useCallback } from 'react'

const RouterContext = React.createContext()

export function BrowserRouter (props) {
  const [state, setState] = useState({
    location: {
      pathname: window.location.pathname
    },
    history: {
      push: (path) => {
        history.pushState({ path }, null, path)
        setState(preState => {
          return {
            ...preState,
            location: {
              ...preState.location,
              pathname: path
            }
          }
        })
      }
    }
  })
  useEffect(() => {
    const popstateHandler = (e) => {
      const path = e.state.path
      setState(preState => {
        return {
          ...preState,
          location: {
            ...preState.location,
            pathname: path
          }
        }
      })
    }
    window.addEventListener('popstate', popstateHandler)
    return () => {
      window.removeEventListener('popstate', popstateHandler)
    }
  }, [])
  return <RouterContext.Provider value={state}>{props.children}</RouterContext.Provider>
}

export function Switch (props) {
  const { location } = useContext(RouterContext)
  const { children } = props
  let matched = false
  let child = null
  React.Children.map(children, component => {
    if (!matched && React.isValidElement(component)) {
      let { path = '' } = component.props
      let pathMatch = pathToRegexp(path, null, {end: false})
      matched = pathMatch.test(location.pathname)
      child = component
    }
  })
  return matched ? React.cloneElement(child) : null
}

export function Route (props) {
  const { location } = useContext(RouterContext)
  const { component, path, exact = false } = props
  let keys = []
  let values = []
  let pathMatch = pathToRegexp(path, keys, { end: exact })
  values = (location.pathname.match(pathMatch) || []).splice(1)
  keys = keys.map(i => i.name)
  let componentProps = {
    match: {
      params: values.reduce((obj, d, i) => {
        obj[keys[i]] = d
        return obj
      }, {})
    }
  }
  return pathMatch.test(location.pathname) ? React.createElement(component, componentProps) : null
}

export function NavLink (props) {
  const { location, history } = useContext(RouterContext)
  const { children, to, style } = props
  const handleClick = useCallback((e) => {
    e.preventDefault()
    history.push(to)
  }, [history, to])
  let pathMatch = pathToRegexp(to, null, { end: false })
  const className = pathMatch.test(location.pathname) ? 'active' : ''
  return <a className={className} style={{...style}} href={to} onClick={handleClick}>{children}</a>
}

export function Redirect (props) {
  const { to } = props
  const { location, history } = useContext(RouterContext)
  let pathMatch = pathToRegexp(to, null, { end: false })
  if (!pathMatch.test(location.pathname)) {
    history.push(to)
  }
  return null
}

export default {
  BrowserRouter,
  Switch,
  Route,
  NavLink,
  Redirect
}
