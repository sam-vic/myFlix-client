import PropTypes from 'prop-types'
import { Card, Button } from 'react-bootstrap'
import './detail-card.scss'
import React from 'react'
import { Link } from 'react-router-dom'

export const DetailCard = ({ movie }) => {
    return (
        <Card className='h-100'>
            <Card.Img variant='top' src={movie.image} />
            <Card.Body>
                <Card.Title key={movie.id}>{movie.title}</Card.Title>
                <Card.Text>{movie.desc}</Card.Text>
                <Link to={`/movies/${encodeURIComponent(movie.id)}`}>
                    <Button variant='link'>Open</Button>
                </Link>
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