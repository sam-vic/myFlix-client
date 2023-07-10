import 'bootstrap/dist/css/bootstrap.min.css'
import './info-view.scss'

import PropTypes from 'prop-types'
import { Button, Card } from 'react-bootstrap'

export const InfoView = ({ movie, onBackClick }) => {
    return (
        <Card>
            <Card.Img src={movie.image} />
            <Card.Body>
                <span>Title: </span>
                <Card.Title>{movie.title}</Card.Title>
                <span>Author: </span>
                <Card.Text>{movie.author}</Card.Text>
            </Card.Body>
            <Button className='back-button' onClick={onBackClick}>
                Back
            </Button>
        </Card>
    )
}