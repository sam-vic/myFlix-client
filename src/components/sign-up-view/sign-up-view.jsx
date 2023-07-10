import { useState } from "react"
import { Button, Form } from 'react-bootstrap'

export default function SignupView() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const [birthday, setBirthday] = useState('')

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
            .then((response) => {
                if (response.ok) {
                    alert('Sign Up Successful')
                } else {
                    alert('Sign up Error')
                }
            })
    }

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formUsername">
                <Form.Label>
                    Username:
                    <Form.Control
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        minLength="3"
                    />
                </Form.Label>
            </Form.Group>
            <Form.Group controlId="formPassword">
                <Form.Label>
                    Password:
                    <Form.Control
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </Form.Label>
            </Form.Group>
            <Form.Group controlId="formEmail">
                <Form.Label>
                    Email:
                    <Form.Control
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </Form.Label>
            </Form.Group>
            <Form.Group controlId="formBirthday">
                <Form.Label>
                    Birthday:
                    <Form.Control
                        type="date"
                        value={birthday}
                        onChange={(e) => setBirthday(e.target.value)}
                        required
                    />
                </Form.Label>
            </Form.Group>
            <Button type='submit'>Submit</Button>
        </Form>
    )
}