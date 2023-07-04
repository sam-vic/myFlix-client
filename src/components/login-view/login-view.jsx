import React, { useState } from "react"

export default function LoginView({ onLoggedIn }) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [item, setItem] = useState()

    const handleSubmit = (event) => {
        event.preventDefault()

        const data = {
            access: username,
            secret: password
        }
        console.log('what is this', data)

        // compares input with database
        fetch(`https://mycf-movie-api.herokuapp.com/login?Username=${username}&Password=${password}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then((response) => response.json())
            .then((data) => {
                console.log('Login response:', data)
                if (data.user) {
                    localStorage.setItem("user", JSON.stringify(data.user))
                    localStorage.setItem("token", data.token)
                    onLoggedIn(data.user, data.token)
                } else {
                    alert('No User Found')
                }
            })
            .catch((event) => {
                alert('Something went wrong')
            })
    }

    return (
        <form onSubmit={handleSubmit} >
            <label>
                Username:
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
            </label>
            <label>
                Password:
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </label>
            <button type="submit">Submit</button>
        </form>
    )
}