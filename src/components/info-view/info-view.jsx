import './info-view.scss'
import React from 'react'
import { useParams } from 'react-router'
import { Link } from 'react-router-dom'

export const InfoView = ({ movies }) => {
    const { movieId } = useParams()
    const movie = movies.find((m) => m.id === movieId)

    if (!movie) {
        // Handle the case when the movie is not found
        return <div>Movie not found</div>
    }

    return (
        <div className="info-card">
            <div className="info-image">
                <img className='w-100' src={movie.image} alt={movie.title} />
            </div>
            <div className="info-details">
                <h2 className="info-title">{movie.title}</h2>
                <p className="info-description">{movie.desc}</p>
            </div>
            <Link to={`/`} className="back-link">
                <button variant='primary' className='back-button'>Back</button>
            </Link>
        </div>
    )
}

