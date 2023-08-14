import React, { useState } from "react"
import { Button, Form } from 'react-bootstrap'
import './login-view.scss'

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
        <Form onSubmit={handleSubmit} className="center" >
            <Form.Group controlId="formUsername">
                <Form.Label className="label">
                    Username:
                </Form.Label>
                <Form.Control
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="input"
                />
            </Form.Group>
            <Form.Group controlId="formPassword">
                <Form.Label className="label">
                    Password:
                </Form.Label>
                <Form.Control
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="input"
                />
            </Form.Group>
            <Button variant='primary' type="submit" className="button">Submit</Button>
        </Form>
    )
}