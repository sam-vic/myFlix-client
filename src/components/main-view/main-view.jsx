import React, { useState, useEffect } from "react"
import { DetailCard } from "./detail-card"
import { InfoView } from "../info-view/info-view"

import moviesData from "./movie.json"

{/*
fetch('../../json/movies.json')
.then((response) => response.json())
.then((data) => {data})

console.log(data) */}

export const MainView = () => {
    const [movies, setMovie] = useState([])
    const [selectedMovie, setSelectedMovie] = useState(null)

    useEffect(() => {
        setMovie(moviesData)
    }, [])

    if (selectedMovie) {
        return <InfoView movie={selectedMovie} onBackClick={() => setSelectedMovie(null)}/>
    }

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
                    onmovieClick={(newSelectedMovie) => {
                        setSelectedMovie(newSelectedMovie)
                    }}
                    />
                )
            })}
        </div>
    )
}
