import PropTypes from 'prop-types'
import { Card, Button } from 'react-bootstrap'
import './detail-card.scss'
import React, { useState }from 'react'
import { Link } from 'react-router-dom'

export const DetailCard = ({ movie, user, token }) => {
    const [isFavorited, setIsFavorited] = useState(false)
    const shortenTitle = (title, maxLength) => {
        if (title.length <= maxLength) {
            return title;
        }
        return `${title.slice(0, maxLength)}...`
    }
    const shortenDescription = (description, maxLength) => {
        if (description.length <= maxLength) {
            return description;
        }
        return `${description.slice(0, maxLength)}...`
    }
    const handleFavouriteClick = () => {
        // Check if the movie is already in favorites
        if (!isFavorited) {
            // Add the movie to the user's favoriteMovies array
            fetch(`https://mycf-movie-api.herokuapp.com/users/${user.Username}/favoriteMovies`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ movieId: movie.id })
            })
                .then((response) => {
                    if (response.ok) {
                        setIsFavorited(true)
                    } else if (response.status === 409) {
                        console.log('Movie already in favorites')
                    } else {
                        console.error('Error adding movie to favorites')
                    }
                })
                .catch((error) => {
                    console.error('Error adding movie to favorites:', error)
                })
        }
    }
    return (
        <Card className='detail-card h-100'>
            <Card.Img variant='top' src={movie.image} />
            <Card.Body>
                <Card.Title key={movie.id}>{shortenTitle(movie.title, 20)}</Card.Title>
                <Card.Text>{shortenDescription(movie.desc, 50)}</Card.Text>
                <Link to={`/movies/${encodeURIComponent(movie.id)}`}>
                    <button className='detail-button' variant='link'>Open</button>
                </Link>
                <Button className='detail-button' onClick={handleFavouriteClick} disabled={isFavorited}>
                    {isFavorited ? 'Favorited' : 'Favourite'}
                </Button>
            </Card.Body>
        </Card>
    )
}

DetailCard.propTypes = {
    movie: PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        image: PropTypes.string.isRequired,
        actors: PropTypes.arrayOf(PropTypes.string),
        directors: PropTypes.arrayOf(
            PropTypes.shape({
                Name: PropTypes.string.isRequired,
                Bio: PropTypes.string.isRequired,
                Birth: PropTypes.string.isRequired,
                Death: PropTypes.string,
            })
        ),
        desc: PropTypes.string.isRequired,
    }).isRequired
}