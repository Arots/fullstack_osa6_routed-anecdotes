import React from 'react'
import './styles.css'
import { BrowserRouter as Router, Route, NavLink, Redirect, Link } from 'react-router-dom'
import { Button, FormControl, FormGroup, ControlLabel, PageHeader,
   Alert, Navbar, Nav, NavItem, ListGroup, ListGroupItem, Grid, Row, Col, Image } from 'react-bootstrap'
import AlanTuring from './AlanTuring.PNG'

const Menu = () => (
  <div>
    <div>
      <Navbar inverse collapseOnSelect>
        <Navbar.Header>
          <Navbar.Brand>
            Software anecdotes
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav>
            <NavItem href="#">
              <Link to="/">home</Link>
            </NavItem>
            <NavItem href="#">
              <Link to="/list">create new</Link>
            </NavItem>
            <NavItem href="#">
              <Link to="/info">about</Link>
            </NavItem>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </div>
    <br />
  </div>
)

const AnecdoteList = ({ anecdotes }) => (
  <div>
    <PageHeader><small>Anecdotes</small></PageHeader>
    <ListGroup striped>
        {anecdotes.map(anecdote => <ListGroupItem key={anecdote.id} >
          <NavLink to={`/anecdotes/${anecdote.id}`}>{anecdote.content}</NavLink> </ListGroupItem>)}
    </ListGroup>
  </div>
)

const Anecdote = ({anecdote}) => {
  return (
    <div>
      <PageHeader><small>{anecdote.content} by {anecdote.author}</small></PageHeader>
      <div>has {anecdote.votes} votes</div>
      <div>for more info see <a href={anecdote.info}>{anecdote.info}</a></div>
      <br/>
    </div>
  )
}

const About = () => (
  <div>
    <h2>About anecdote app</h2>
    <Grid>
      <Row>
        <Col xs={6} md={4} >
        <p>According to Wikipedia:</p>
        <em>An anecdote is a brief, revealing account of an individual person or an incident. 
      Occasionally humorous, anecdotes differ from jokes because their primary purpose is not simply to provoke laughter but to reveal a truth more general than the brief tale itself, 
      such as to characterize a person by delineating a specific quirk or trait, to communicate an abstract idea about a person, place, or thing through the concrete details of a short narrative. 
      An anecdote is "a story with a point."</em>
        </Col>
        <Col xs={6} md={4}>
          <Image src={AlanTuring} circle />
        </Col>
        </Row>
        <br/>
        <Row>
        <Col xs={12} md={8}>
          Software engineering is full of excellent anecdotes, at this app you can find the best and add more.
        </Col>
      </Row>
      <br/>
    </Grid>
  </div>
)

const Footer = () => (
  <div>
    Anecdote app for <a href='https://courses.helsinki.fi/fi/TKT21009/121540749'>Full Stack -sovelluskehitys</a>.

    See <a href='https://github.com/mluukkai/routed-anecdotes'>https://github.com/mluukkai/routed-anecdotes</a> for the source code. 
  </div>
)

const Notification = ({notification}) => {
  const footerStyle = {
    display: notification === '' ? 'none' : ''
  }
  return (
    <Alert bsStyle="warning" style={footerStyle} >
      <strong>{notification}</strong>
    </Alert>
  )
}

class CreateNew extends React.Component {
  constructor() {
    super()
    this.state = {
      content: '',
      author: '',
      info: '',
      redirect: false
    }
  }

  handleChange = (e) => {
    console.log(e.target.name, e.target.value)
    this.setState({ [e.target.name]: e.target.value })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.addNew({
      content: this.state.content,
      author: this.state.author,
      info: this.state.info,
      votes: 0
    })
    this.setState({
      content: '',
      author: '',
      info: ''
    })
  }

  render() {
    return(
      <div>
        <PageHeader>create a new anecdote</PageHeader>
        <form onSubmit={this.handleSubmit}>
        <FormGroup>
          <ControlLabel>content: </ControlLabel>
            <FormControl className="input" name='content' value={this.state.content} onChange={this.handleChange} />
          <ControlLabel>author: </ControlLabel>
            <FormControl className="input" name='author' value={this.state.author} onChange={this.handleChange} />
          <ControlLabel>url for more info: </ControlLabel>
            <FormControl className="input" name='info' value={this.state.info} onChange={this.handleChange} />
          <Button bsStyle="success" type="submit">create</Button>
        </FormGroup>
        </form>
      </div>  
    )

  }
}

class App extends React.Component {
  constructor() {
    super()

    this.state = {
      anecdotes: [
        {
          content: 'If it hurts, do it more often',
          author: 'Jez Humble',
          info: 'https://martinfowler.com/bliki/FrequencyReducesDifficulty.html',
          votes: 0,
          id: '1'
        },
        {
          content: 'Premature optimization is the root of all evil',
          author: 'Donald Knuth',
          info: 'http://wiki.c2.com/?PrematureOptimization',
          votes: 0,
          id: '2'
        }
      ],
      notification: '',
      redirect: false
    } 
  }

  addNew = (anecdote) => {
    anecdote.id = (Math.random() * 10000).toFixed(0)
    this.setState({ 
      anecdotes: this.state.anecdotes.concat(anecdote),
      redirect: true,
      notification: `a new anecdote: ${anecdote.content} created!` })
    setTimeout(() => {
      this.setState({
        notification: '',
        redirect: false
      })
    }, 4000)
  }

  anecdoteById = (id) =>
    this.state.anecdotes.find(a => a.id === id)

  vote = (id) => {
    const anecdote = this.anecdoteById(id)

    const voted = {
      ...anecdote,
      votes: anecdote.votes + 1
    }

    const anecdotes = this.state.anecdotes.map(a => a.id === id ? voted : a)

    this.setState({ anecdotes })
  }

  render() {
    return (
      
      <div className="container">
        <Router>
          <div>
            <Menu />
            <Notification notification={this.state.notification} />
            <Route exact path='/' render={() => <AnecdoteList anecdotes={this.state.anecdotes} />} />
            <Route exact path='/list' render={() => this.state.redirect ?
              <Redirect to='/' /> : <CreateNew addNew={this.addNew} />} />
            <Route exact path='/info' render={() => <About />} />
            <Route exact path='/anecdotes/:id' render={({ match }) =>
              <Anecdote anecdote={this.anecdoteById(match.params.id)} />}
            />
          </div>
        </Router>
        <Footer />
      </div>
    );
  }
}

export default App;
