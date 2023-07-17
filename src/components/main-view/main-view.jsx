import React, { useState, useEffect } from "react"
import { DetailCard } from "./detail-card"
import { InfoView } from "../info-view/info-view"
import LoginView from "../login-view/login-view"
import SignupView from "../sign-up-view/sign-up-view"
import NavBar from "../navigation-bar/navigation-bar"

import { Row, Col, Button, Container, Card } from 'react-bootstrap'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

export default MainView = () => {

    const storedUser = JSON.parse(localStorage.getItem("user"))
    const storedToken = localStorage.getItem("token")

    const [user, setUser] = useState(storedUser ? storedUser : null) // Initialize with storedUser
    const [token, setToken] = useState(storedToken ? storedToken : null); // Initialize with storedToken

    const [movies, setMovie] = useState([])
    const [selectedMovie, setSelectedMovie] = useState(null)

    useEffect(() => {
        if (!token) {
            return
        }

        fetch("https://mycf-movie-api.herokuapp.com/movies", {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data)
                const dataFromApi = data.map((item) => {
                    return {
                        id: item._id,
                        title: item.Title,
                        image: item.ImagePath,
                        actors: item.Actors || [],
                        directors: [item.Director] || [],
                        desc: item.Description
                    }
                })
                setMovie(dataFromApi)
            })
    }, [token])


    useEffect(() => {
        // Update localStorage when user changes
        localStorage.setItem("user", JSON.stringify(user));
    }, [user])

    useEffect(() => {
        // Update localStorage when token changes
        localStorage.setItem("token", token);
    }, [token])

    return (
        <BrowserRouter>
            <NavBar />
            <Row className="justify-content-md-center">
                <Routes>
                    <Route
                        path='/signup'
                        element={
                            <>
                                {user ? (
                                    <Navigate to='/' />
                                ) : (
                                    <Col md={5}>
                                        <Row>
                                            <Card.Title>Sign Up</Card.Title>
                                            <SignupView />
                                        </Row>
                                    </Col>
                                )}
                            </>
                        }
                    />
                    <Route
                        path='/login'
                        element={
                            <>
                                {user ? (
                                    <Navigate to='/' />
                                ) : (
                                    <Col md={5}>
                                        <Row>
                                            <LoginView onLoggedIn={(user, token) => { setUser(user), setToken(token) }} />
                                        </Row>
                                    </Col>
                                )}
                            </>
                        }
                    />
                    <Route
                        path='/movies/:movieId'
                        element={
                            <>
                                {!user ? (
                                    <Navigate to='/login' replace />
                                ) : movies.length === 0 ? (
                                    <div>The list is empty!</div>
                                ) : (
                                    <Col md={8}>
                                        <InfoView
                                            movies={movies}
                                        />
                                    </Col>
                                )}
                            </>
                        }
                    />
                    <Route
                        path='/'
                        element={
                            <>
                                {!user ? (
                                    <Navigate to='/login' replace />
                                ) : movies.length === 0 ? (
                                    <div>The list is empty!</div>
                                ) : (
                                    <div>
                                        {movies.map((movie) => {
                                            return (
                                                <Col className='mb-5' key={movie.id} md={3}>
                                                    <DetailCard
                                                        className='my-flix'
                                                        movie={movie}
                                                        key={movie.id}
                                                    />
                                                </Col>
                                            )
                                        })}
                                        <Button variant='primary' onClick={() => { setUser(null), setToken(null), localStorage.clear() }}>Log Out</Button>
                                    </div>
                                )}
                            </>
                        }
                    />
                </Routes>
            </Row>
        </BrowserRouter>
    )
}
