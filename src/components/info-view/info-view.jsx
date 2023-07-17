import './info-view.scss'
import React from 'react'
import { Button, Card } from 'react-bootstrap'

export const InfoView = ({ movie }) => {
    return (
        <Card>
            <Card.Img src={movie.image} />
            <Card.Body>
                <span>Title: </span>
                <Card.Title>{movie.title}</Card.Title>
                <span>Author: </span>
                <Card.Text>{movie.author}</Card.Text>
            </Card.Body>
            <Button variant='primary' className='back-button'>
                Back
            </Button>
        </Card>
    )
}

