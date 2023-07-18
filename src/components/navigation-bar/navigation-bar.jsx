import React from 'react'
import { Navbar, Nav, Container } from 'react-bootstrap'
import { Link } from 'react-router-dom'


export default function NavBar({ user, onLoggedOut}) {
    return (
        <Navbar bg='light' expand='lg'>
            <Container>
                <Navbar.Brand href='#'>MyFlix App</Navbar.Brand>
                <Navbar.Toggle aria-controls='basic-navbar-nav' />
                <Navbar.Collapse id='basic-navbar-nav'>
                    <Nav className='ml-auto'>
                        {!user && (
                            <>
                                <Nav.Link as={Link} to='/login'>Login</Nav.Link>
                                <Nav.Link as={Link} to='/signup'>Sign Up</Nav.Link>
                            </>
                        )}
                        {user && (
                            <>
                                <Nav.Link as={Link} to='/'>Home</Nav.Link>
                                <Nav.Link as={Link} to={`/users/${user.Username}`}>Profile</Nav.Link>
                                <Nav.Link onClick={onLoggedOut}>Log Out</Nav.Link>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

