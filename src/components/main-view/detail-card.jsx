import PropTypes from 'prop-types'

export const DetailCard = ({ movie, onMovieClick }) => {
    return <div>
        <div
            key={movie.id}
            onClick={() => {
                onMovieClick(movie)
            }}
        >
            {movie.title}
        </div>
    </div>
}

DetailCard.propTypes = {
    movie: PropTypes.shape({
        title: PropTypes.string.isRequired,
        image: PropTypes.string.isRequired,
        author: PropTypes.string
    }).isRequired,
    onMovieClick: PropTypes.func.isRequired
}