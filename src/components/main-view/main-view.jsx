import React, { useState, useEffect } from "react"
import { DetailCard } from "./detail-card"
import { InfoView } from "../info-view/info-view"
import LoginView from "../login-view/login-view"

import moviesData from "./movie.json"

{/*
fetch('../../json/movies.json')
.then((response) => response.json())
.then((data) => {data})

console.log(data) */}

export default MainView = () => {
    const [movies, setMovie] = useState([])
    const [selectedMovie, setSelectedMovie] = useState(null)
    const [user, setUser] = useState(null)

    useEffect(() => {
        fetch("https://openlibrary.org/search.json?q=star+wars")
        .then((response) => response.json())
        .then((data) => {
            console.log(data)
            const dataFromApi = data.docs.map((doc) => {
                return {
                    id: doc.key,
                    title: doc.title,
                    image: `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`,
                    author: doc.author_name?.[0]
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
