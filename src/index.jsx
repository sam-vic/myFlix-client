import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import { Container } from 'react-bootstrap'

import MainView from './components/main-view/main-view'
import './index.scss'

const MyFlixApplication = () => {
  return (
    <Container>
      <MainView />
    </Container>
  )
}

const container = document.querySelector('#root')
const root = createRoot(container)

// Wrap the entire MyFlixApplication component with BrowserRouter
const AppWithRouter = (
  <BrowserRouter>
    <MyFlixApplication />
  </BrowserRouter>
)

root.render(AppWithRouter)
