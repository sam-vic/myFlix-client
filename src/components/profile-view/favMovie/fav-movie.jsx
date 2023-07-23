import React, { useState, useEffect } from 'react'

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
      headers: { Authorization: `Bearer ${token}` }
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
                  headers: { Authorization: `Bearer ${token}` }
                }).then((response) => response.json())
              )
            )
            setFavoriteMoviesData(moviesData.map(movie => movie.Title)) // Extract only the movie names
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

  return (
    <div>
      <div className="mt-4">
        <h2>Favorite Movies</h2>
        <div className="row">
          {favoriteMoviesData.length > 0 ? (
            favoriteMoviesData.map((movie) => (
              <div key={movie} className="col-lg-3 col-md-4 col-sm-6 mb-4">
                <div className="card">
                  <img
                    src={movie.imageUrl}
                    className="card-img-top"
                    alt={movie.title}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{movie}</h5>
                    <p className="card-text">{movie.description}</p>
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