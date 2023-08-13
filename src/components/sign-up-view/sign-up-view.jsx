import { useState } from "react"
import { Button, Form } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import React from 'react'

export default function SignupView() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const [birthday, setBirthday] = useState('')
    const navigate = useNavigate()

    const handleSubmit = (event) => {
        event.preventDefault()

        const data = {
            Username: username,
            Password: password,
            Email: email,
            Birthday: birthday
        }

        fetch("https://mycf-movie-api.herokuapp.com/users", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then((response) => response.json())
            .then((data) => {
                if (data._id) {
                    console.log('Sign Up Successful:', data)
                    localStorage.setItem("user", JSON.stringify(data))
                    localStorage.setItem("token", data.token)
                    navigate('/') // Navigate to '/' after successful sign-up
                } else {
                    console.error('Sign up Error:', data)
                    alert('Sign up Error')
                }
            })
            .catch((error) => {
                console.error('Error signing up:', error)
            })
    }
    
    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formUsername">
                <Form.Label>
                    Username:
                </Form.Label>
                <Form.Control
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    minLength="3"
                />
            </Form.Group>
            <Form.Group controlId="formPassword">
                <Form.Label>
                    Password:
                </Form.Label>
                <Form.Control
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </Form.Group>
            <Form.Group controlId="formEmail">
                <Form.Label>
                    Email:
                </Form.Label>
                <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </Form.Group>
            <Form.Group controlId="formBirthday">
                <Form.Label>
                    Birthday:
                </Form.Label>
                <Form.Control
                    type="date"
                    value={birthday}
                    onChange={(e) => setBirthday(e.target.value)}
                    required
                />
            </Form.Group>
            <Button variant='primary' type='submit'>Submit</Button>
        </Form>
    )
}
