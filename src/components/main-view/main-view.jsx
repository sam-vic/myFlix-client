import React, { useState, useEffect } from "react"
import { DetailCard } from "./detail-card"
import { InfoView } from "../info-view/info-view"
import LoginView from "../login-view/login-view"

import moviesData from "./movie.json"


export default MainView = () => {
    const [movies, setMovie] = useState([])
    const [selectedMovie, setSelectedMovie] = useState(null)
    const [user, setUser] = useState(null)

    useEffect(() => {
        fetch("https://mycf-movie-api.herokuapp.com/movies")
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
    }, [])

////// Determin if User is loged in ////
    if (!user) {
        return (
            <LoginView onLoggedIn={(user) => setUser(user)} />
        )
    }
//// Display selected movie ////
    if (selectedMovie) {
        return <InfoView movie={selectedMovie} onBackClick={() => setSelectedMovie(null)}/>
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

            <button onClick={() => setUser(null)}>Log Out</button>
        </div>
    )
}
