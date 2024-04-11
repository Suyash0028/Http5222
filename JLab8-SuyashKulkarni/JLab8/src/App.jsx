import { useState } from 'react'
import './App.css'
import Header from './components/Header/Header'
import Question from './components/Question/Question'
import Footer from './components/Footer/Footer'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Header />
      <Question />
      <Footer />
    </>
  )
}

export default App
