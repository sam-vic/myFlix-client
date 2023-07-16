import PropTypes from 'prop-types'
import { Card } from 'react-bootstrap'
import './detail-card.scss'

export const DetailCard = ({ movie, onMovieClick }) => {
    return (
        <Card className='h-100'
            onClick={() => {
                onMovieClick(movie)
            }}
        >
            <Card.Img variant='top' src={movie.image} />
            <Card.Body>
                <Card.Title key={movie.id}>
                    {movie.title}
                </Card.Title>
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
    }).isRequired,
    onMovieClick: PropTypes.func.isRequired,
};