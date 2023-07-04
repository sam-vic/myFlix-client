import React, { useState, useEffect } from "react"
import { DetailCard } from "./detail-card"
import { InfoView } from "../info-view/info-view"
import LoginView from "../login-view/login-view"
import SignupView from "../sign-up-view/sign-up-view"


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

    ////// Determin if User is loged in ////
    if (!user) {
        return (
            <>
                Login
                <LoginView onLoggedIn={(user, token) => { setUser(user), setToken(token) }} />

                Sign up
                <SignupView />
            </>
        )
    }
    //// Display selected movie ////
    if (selectedMovie) {
        return <InfoView movie={selectedMovie} onBackClick={() => setSelectedMovie(null)} />
    }
    //// In case no data in api ////
    if (movies.length === 0) {
        return <div>The list is empty!</div>;
    }

    return (
        <div>
            {movies.map((movie) => {
                return (
                    <DetailCard
                        className='my-flix'
                        movie={movie}
                        key={movie.id}
                        onMovieClick={(newSelectedMovie) => {
                            setSelectedMovie(newSelectedMovie)
                        }}
                    />
                )
            })}

            <button onClick={() => { setUser(null), setToken(null), localStorage.clear() }}>Log Out</button>
        </div>
    )
}
