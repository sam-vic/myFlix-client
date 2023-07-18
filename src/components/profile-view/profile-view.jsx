import React, { useState, useEffect } from 'react'


export default function ProfileView({ token ,user }) {
    const [userData, setUserData] = useState(null);
    useEffect(() => {
        if (!token) {
            return
        }

        fetch(`https://mycf-movie-api.herokuapp.com/users/${user.Username}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then((response) => response.json())
            .then((data) => {
                console.log('imported user data:', data)
                setUserData({
                    id: data._id,
                    username: data.Username,
                    password: data.Password,
                    email: data.Email,
                    birthday: data.Birthday,
                    favouriteMovies: data.FavoriteMovies || [],
                })
            })
            .catch((error) => {
                console.error('Error fetching user data:', error)
            })
    }, [user])

    if (!userData) {
        return <div>Loading...</div>
    }
    return (
        <div>
            <h1>Hello, {userData.username}!</h1>
            <p>Email: {userData.email}</p>
            <p>Birthday: {userData.birthday}</p>
            <h2>Your Favorite Movies:</h2>
            <ul>
                {userData.favouriteMovies.map((movieId) => (
                    <li key={movieId}>{movieId}</li>
                ))}
            </ul>
        </div>
    )
}