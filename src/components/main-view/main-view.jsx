import React, { useState, useEffect } from "react"
import { DetailCard } from "../detail-card/detail-card"
import { InfoView } from "../info-view/info-view"
import LoginView from "../login-view/login-view"
import SignupView from "../sign-up-view/sign-up-view"
import NavBar from "../navigation-bar/navigation-bar"
import "./main-view.scss"

import { Row, Col, Button, Container, Card } from 'react-bootstrap'
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom"
import ProfileView from "../profile-view/profile-view"

export default MainView = () => {
    const [initialCheckDone, setInitialCheckDone] = useState(false)
    const storedUser = JSON.parse(localStorage.getItem("user"))
    const storedToken = localStorage.getItem("token")

    const [user, setUser] = useState(storedUser ? storedUser : null) // Initialize with storedUser
    const [token, setToken] = useState(storedToken ? storedToken : null) // Initialize with storedToken

    const [movies, setMovie] = useState([])
    const [selectedMovie, setSelectedMovie] = useState(null)

    const navigate = useNavigate()
    const [isUserUnregistered, setIsUserUnregistered] = useState(false)

    const onLoggedOut = () => {
        setUser(null),
            setToken(null),
            localStorage.clear(),
            navigate('/login')
    }

    const userUnregistered = () => {
        setIsUserUnregistered(true)
        setUser(null)
        setToken(null)
        localStorage.clear()
        navigate('/login')
    }


    useEffect(() => {
        if (!token) {
            return
        }

        fetch("https://mycf-movie-api.herokuapp.com/movies", {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then((response) => response.json())
            .then((data) => {
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
        localStorage.setItem("user", JSON.stringify(user))
    }, [user])

    useEffect(() => {
        // Update localStorage when token changes
        localStorage.setItem("token", token)
    }, [token])

    return (

        <div>
            <NavBar user={user} onLoggedOut={onLoggedOut} />
            <Row className="justify-content-md-center mt-4">
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
                                            <Card.Title className="light">Sign Up</Card.Title>
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
                                {user ? (
                                    // Render movies view for registered users
                                    movies.length === 0 ? (
                                        <div>The list is empty!</div>
                                    ) : (
                                        <Col md={8}>
                                            <InfoView movies={movies} />
                                        </Col>
                                    )
                                ) : (
                                    // Redirect unregistered users to login page
                                    <Navigate to='/login' replace />
                                )}
                            </>
                        }
                    />
                    <Route
                        path='/'
                        element={
                            <>
                                {user ? (
                                    // Render movies list for registered users
                                    movies.length === 0 ? (
                                        <div>The list is empty!</div>
                                    ) : (
                                        <div className='movies-container'>
                                            <div className='movies-grid'>
                                                {movies.map((movie) => (
                                                    <div className='movie-item' key={movie.id}>
                                                        <DetailCard movie={movie} user={user} token={token} />
                                                    </div>
                                                ))}
                                            </div>
                                            <Button className='logout-button' variant='primary' onClick={() => { setUser(null), setToken(null), localStorage.clear() }}>Log Out</Button>
                                        </div>
                                    )
                                ) : (
                                    // Redirect unregistered users to login page
                                    <Navigate to='/login' replace />
                                )}
                            </>
                        }
                    />
                    <Route
                        path='/users/:userId'
                        element={
                            <>
                                {user ? (
                                    <ProfileView token={token} user={user} userUnregistered={userUnregistered} />
                                ) : (
                                    // Redirect unregistered users to login page
                                    <Navigate to='/login' replace />
                                )}
                            </>
                        }
                    />
                </Routes>
            </Row>
        </div>
    )
}