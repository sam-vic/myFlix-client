import React, { useState, useEffect } from "react"
import { DetailCard } from "./detail-card"
import { InfoView } from "../info-view/info-view"

import moviesData from "./movie.json"

{/*
fetch('../../json/movies.json')
.then((response) => response.json())
.then((data) => {data})

console.log(data) */}

export default MainView = () => {
    const [movies, setMovie] = useState([])
    const [selectedMovie, setSelectedMovie] = useState(null)

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
