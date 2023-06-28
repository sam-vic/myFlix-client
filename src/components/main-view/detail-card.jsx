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