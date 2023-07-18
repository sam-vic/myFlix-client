import React, { useState, useEffect } from 'react'

export default function ProfileView({ token, user }) {
  const [userData, setUserData] = useState(null)
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    birthday: ""
  })
  const [favoriteMovies, setFavoriteMovies] = useState([])

  useEffect(() => {
    if (!token) {
      return
    }

    fetch(`https://mycf-movie-api.herokuapp.com/users/${user.Username}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((response) => response.json())
      .then((data) => {
        setUserData(data)
        setFormData({
          username: data.Username,
          email: data.Email,
          birthday: data.Birthday
        })
      })
      .catch((error) => {
        console.error('Error fetching user data:', error)
      })

      fetch(`https://mycf-movie-api.herokuapp.com/users/${user.Username}/favoriteMovies`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then((response) => response.json())
        .then((movieIds) => {
          // Fetch the movie details for each movie ID
          console.log(movieIds)
          try {
            Promise.all(movieIds.map((id) => fetchMovieById(id)))
              .then((movies) => {
                setFavoriteMovies(movies.filter((movie) => movie !== null)); // Filter out any null movie objects
              })
              .catch((error) => {
                console.error('Error fetching favorite movies:', error);
              });
          } catch (error) {
            console.error('Error processing movie data:', error);
          }
        })
        .catch((error) => {
          console.error('Error fetching favorite movie IDs:', error);
        });
  }, [token, user.Username])

  const fetchMovieById = (movieId) => {
    return fetch(`https://mycf-movie-api.herokuapp.com/movies/${movieId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((response) => response.json())
      .then((movie) => {
        return movie
      })
      .catch((error) => {
        console.error(`Error fetching movie with ID ${movieId}:`, error)
        return null
      })
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Only send fields that have changed
    const updatedData = {}
    for (const key in formData) {
      if (formData[key] !== userData[key]) {
        updatedData[key] = formData[key]
      }
    }

    // Update user data if there are changes
    if (Object.keys(updatedData).length > 0) {
      fetch(`https://mycf-movie-api.herokuapp.com/users/${user.Username}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updatedData)
      })
        .then((response) => response.json())
        .then((data) => {
          setUserData(data)
        })
        .catch((error) => {
          console.error('Error updating user data:', error)
        })
    }
  }

  if (!userData || favoriteMovies === null) {
    return <div>Loading...</div>;
  }


  return (
    <div>
      <h1>Hello, {userData.Username}!</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder={userData.Username}
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="text"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder={userData.Email}
          />
        </div>
        <div>
          <label>Birthday:</label>
          <input
            type="text"
            name="birthday"
            value={formData.birthday}
            onChange={handleChange}
            placeholder={userData.Birthday}
          />
        </div>
        <button type="submit">Save Changes</button>
      </form>

      <div className="mt-4">
        <h2>Favorite Movies</h2>
        <div className="row">
          {favoriteMovies.length > 0 ? (
            favoriteMovies.map((movie) => (
              <div key={movie._id} className="col-lg-3 col-md-4 col-sm-6 mb-4">
                <div className="card">
                  <img
                    src={movie.imageUrl}
                    className="card-img-top"
                    alt={movie.title}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{movie.title}</h5>
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