import PropTypes from 'prop-types'
import { Card, Button } from 'react-bootstrap'
import './detail-card.scss'
import React, { useState }from 'react'
import { Link } from 'react-router-dom'

export const DetailCard = ({ movie, user, token }) => {
    const [isFavorited, setIsFavorited] = useState(false);
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
                        setIsFavorited(true);
                    } else if (response.status === 409) {
                        console.log('Movie already in favorites');
                    } else {
                        console.error('Error adding movie to favorites');
                    }
                })
                .catch((error) => {
                    console.error('Error adding movie to favorites:', error);
                });
        }
    };
    return (
        <Card className='h-100'>
            <Card.Img variant='top' src={movie.image} />
            <Card.Body>
                <Card.Title key={movie.id}>{movie.title}</Card.Title>
                <Card.Text>{movie.desc}</Card.Text>
                <Link to={`/movies/${encodeURIComponent(movie.id)}`}>
                    <Button variant='link'>Open</Button>
                </Link>
                <Button variant='primary' onClick={handleFavouriteClick} disabled={isFavorited}>
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