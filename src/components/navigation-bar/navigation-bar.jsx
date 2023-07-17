import { createRoot } from 'react-dom/client'
import React from 'react'
import { Navbar, Nav, Container } from 'react-bootstrap'
import MainView from '../main-view/main-view'
import 'bootstrap/dist/css/bootstrap.min.css'
import "./index.scss"


export default function NavBar() {
  return (
    <Navbar bg='light' expand='lg'>
      <Container>
        <MainView />
      </Container>
    </Navbar>
  )
}

const container = document.querySelector("#root")
const root = createRoot(container)
root.render(<App />)