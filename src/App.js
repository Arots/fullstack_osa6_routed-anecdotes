import React from 'react'
import './styles.css'
import { BrowserRouter as Router, Route, NavLink, Redirect } from 'react-router-dom'

const Menu = () => (
  <div>
    <div style={{backgroundColor: 'transparent', border: '2px dotted', borderRadius: '12px', padding: '15px' }}>
      <NavLink 
         exact to='/'
        activeStyle={{
          fontWeight: 'bold',
          backgroundColor: 'pink',
          padding: '10px',
          border: '2px dashed',
          borderRadius: '15px'
        }}>
        anecdotes</NavLink>&nbsp;
      <NavLink 
        exact to='/list'
        activeStyle={{
          fontWeight: 'bold',
          backgroundColor: 'pink',
          padding: '10px',
          border: '2px dashed',
          borderRadius: '15px'
        }}>
        create new</NavLink>&nbsp;
      <NavLink 
        exact to='/info' 
        activeStyle={{
          fontWeight: 'bold',
          backgroundColor: 'pink',
          padding: '10px',
          border: '2px dashed',
          borderRadius: '15px'
        }}>
        about</NavLink>&nbsp;
    </div>
    <br />
  </div>
)

const AnecdoteList = ({ anecdotes }) => (
  <div>
    <h2>Anecdotes</h2>
    <ul>
      {anecdotes.map(anecdote => <li key={anecdote.id} >
      <NavLink to={`/anecdotes/${anecdote.id}`}>{anecdote.content}</NavLink></li>)}
    </ul>  
  </div>
)

const Anecdote = ({anecdote}) => {
  return (
    <div>
      <h2>{anecdote.content} by {anecdote.author}</h2>
      <div>has {anecdote.votes} votes</div>
      <div>for more info see <a href={anecdote.info}>{anecdote.info}</a></div>
      <br/>
    </div>
  )
}

const About = () => (
  <div>
    <h2>About anecdote app</h2>
    <p>According to Wikipedia:</p>
    
    <em>An anecdote is a brief, revealing account of an individual person or an incident. 
      Occasionally humorous, anecdotes differ from jokes because their primary purpose is not simply to provoke laughter but to reveal a truth more general than the brief tale itself, 
      such as to characterize a person by delineating a specific quirk or trait, to communicate an abstract idea about a person, place, or thing through the concrete details of a short narrative. 
      An anecdote is "a story with a point."</em>

    <p>Software engineering is full of excellent anecdotes, at this app you can find the best and add more.</p>
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
    color: 'green',
    fontStyle: 'Arial',
    fontSize: 14,
    border: '2px solid',
    borderRadius: '15px 50px',
    display: notification === '' ? 'none' : '',
    padding: '8px'
  }
  return (
    <div style={footerStyle} >
      {notification}
    </div>
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
        <h2>create a new anecdote</h2>
        <form onSubmit={this.handleSubmit}>
          <div>
            content: 
            <input className="input" name='content' value={this.state.content} onChange={this.handleChange} />
          </div>
          <div>
            author:
            <input className="input" name='author' value={this.state.author} onChange={this.handleChange} />
          </div>
          <div>
            url for more info:
            <input className="input" name='info' value={this.state.info} onChange={this.handleChange} />
          </div> 
          <button>create</button>
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
      <div>
        <h1>Software anecdotes</h1>
        <div />
        <Router>
          <div>
          <Menu />
            <Notification notification={this.state.notification} />
            <Route exact path='/' render={() => <AnecdoteList anecdotes={this.state.anecdotes} />} />
            <Route exact path='/list' render={() => this.state.redirect ?
              <Redirect to='/' /> : <CreateNew addNew={this.addNew} />}/>
            <Route exact path='/info' render={() => <About />}/>
            <Route exact path='/anecdotes/:id' render={({match}) => 
              <Anecdote anecdote={this.anecdoteById(match.params.id)}/> }
            />
          </div>
        </Router>
        <Footer />
      </div>
    );
  }
}

export default App;
