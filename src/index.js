import React from 'react'
import ReactDOM from 'react-dom';
// import { BrowserRouter as Router, Switch, NavLink, Route, Redirect } from 'react-router-dom'
import { BrowserRouter as Router, Switch, NavLink, Route, Redirect } from '../packages/react-router'

const ProductPage = props => {
  const id = props && props.match && props.match.params && props.match.params.id
  console.log(props)
  return <div style={{ padding: 10 }}>{`Product${id} page`}</div>
}

const Product = props => {
  return (
    <div style={{ display: 'flex' }}>
      <div style={{ display: 'flex', flexDirection: 'column', width: '100px' }}>
        <NavLink to="/product/1" style={{ margin: 5 }}>Product1</NavLink>
        <NavLink to="/product/2" style={{ margin: 5 }}>Product2</NavLink>
        <NavLink to="/product/3" style={{ margin: 5 }}>Product3</NavLink>
      </div>
      <div style={{ flex: 1 }}>
        <Route path="/product/:id" component={ProductPage}/>
      </div>
    </div>
  )
}

const Home = () => {
  return <div>Home page</div>
}

const About = () => {
  return <div>About page</div>
}

const App = props => {
  return (
    <Router>
      <div>
        <NavLink to="/home" style={{ margin: 5 }}>Home</NavLink>
        <NavLink to="/product" style={{ margin: 5 }}>Product</NavLink>
        <NavLink to="/about" style={{ margin: 5 }}>About</NavLink>
      </div>
      <div>
        <Switch>
          <Route path='/home' component={Home} />
          <Route path='/product' component={Product} />
          <Route path='/about' component={About} />
          <Redirect to='/home' />
        </Switch>
      </div>
    </Router>
  )
};

ReactDOM.render(<App />, document.getElementById("root"));
