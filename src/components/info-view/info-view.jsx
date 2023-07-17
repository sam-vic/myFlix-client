import './info-view.scss'
import React from 'react'
import { useParams } from 'react-router'
import { Link } from 'react-router-dom'

export const InfoView = ({ movies }) => {
    const { movieId } = useParams()
    const movie = movies.find((m) => m.id === movieId)

    if (!movie) {
        // Handle the case when the movie is not found
        return <div>Movie not found</div>;
    }

    return (
        <div>
            <div>
                <img className='w-100' src={movie.image} alt={movie.title} />
            </div>
            <div>
                <span>Title: </span>
                <span>{movie.title}</span>
                <div>{movie.desc}</div>
            </div>
            <Link to={`/`}>
                <button variant='primary' className='back-button'>Back</button>
            </Link>
        </div>
    )
}

