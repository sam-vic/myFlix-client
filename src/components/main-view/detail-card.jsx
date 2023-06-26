

export const DetailCard = ({movie, onmovieClick}) => {
    return <div>
        <div
            key={movie.id}
            onClick={() => {
                onmovieClick(movie)
            }}
        >
            {movie.title}
        </div>
    </div>
}