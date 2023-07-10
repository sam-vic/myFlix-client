import "bootstrap/dist/css/bootstrap.min.css";
import './info-view.scss'

export const InfoView = ({ movie, onBackClick }) => {
    return (
        <>
            <div>
                <img src={movie.image} />
            </div>
            <div>
                <span>Title: </span>
                <span>{movie.title}</span>
            </div>
            <div>
                <span>Author: </span>
                <span>{movie.author}</span>
            </div>
            <button className="back-button" onClick={onBackClick}>
                Back
            </button>
        </>
    )
}