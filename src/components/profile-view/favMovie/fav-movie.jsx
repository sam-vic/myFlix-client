import React, { useState, useEffect } from 'react'
import { Button } from 'react-bootstrap'
import './fav-movie.scss'

export default function FavMovies({ token, user }) {
  const [userData, setUserData] = useState(null)
  const [favoriteMovies, setFavoriteMovies] = useState([])
  const [favoriteMoviesData, setFavoriteMoviesData] = useState([])

  useEffect(() => {
    if (!token) {
      return
    }

    // Fetch favorite movie IDs
    fetch(`https://mycf-movie-api.herokuapp.com/users/${user.Username}/favoriteMovies`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => response.json())
      .then((movieIds) => {
        setFavoriteMovies(movieIds)

        // Fetch favorite movie data using the movie IDs
        const fetchFavoriteMoviesData = async () => {
          try {
            const moviesData = await Promise.all(
              movieIds.map((id) =>
                fetch(`https://mycf-movie-api.herokuapp.com/movies/id/${id}`, {
                  headers: { Authorization: `Bearer ${token}` },
                }).then((response) => response.json())
              )
            )
            setFavoriteMoviesData(moviesData) // Update favoriteMoviesData with the fetched data
          } catch (error) {
            console.error('Error fetching favorite movies data:', error)
          }
        }

        fetchFavoriteMoviesData()
      })
      .catch((error) => {
        console.error('Error fetching favorite movie IDs:', error)
      })
  }, [token, user.Username])

  // Remove favorite movie from the list
  const handleRemoveFromFavorites = (movieId) => {
    fetch(`https://mycf-movie-api.herokuapp.com/users/${user.Username}/favoriteMovies/${movieId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          // Movie removed successfully, update the favorites list
          setFavoriteMovies((prevFavorites) => prevFavorites.filter((id) => id !== movieId))

          // Update favoriteMoviesData with the filtered movies data
          setFavoriteMoviesData((prevMoviesData) => prevMoviesData.filter((movie) => movie._id !== movieId))

          console.log('Movie removed from favorites.')
        } else {
          // Handle error cases, if needed
          console.error('Error removing movie from favorites:', response.status, response.statusText)
        }
      })
      .catch((error) => {
        console.error('Error removing movie from favorites:', error)
      })
  }

  return (
    <div className="favorite-movies">
      <div className="favorite-movies-container">
        <h2 className="favorite-movies-heading">Favorite Movies</h2>
        <div className="movie-cards-row">
          {favoriteMoviesData.length > 0 ? (
            favoriteMoviesData.map((movie) => (
              <div key={movie._id} className="movie-card-col col-lg-3 col-md-4 col-sm-6 mb-4">
                <div className="movie-card">
                  <img
                    src={movie.ImagePath}
                    className="movie-card-img-top"
                    alt={movie.Title}
                  />
                  <div className="movie-card-body">
                    <h5 className="movie-card-title">{movie.Title}</h5>
                    <Button className="btn-remove" onClick={() => handleRemoveFromFavorites(movie._id)}>
                      Remove from Favorites
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div>No favorite movies found.</div>
          )}
        </div>
      </div>
    </div>

  )
}