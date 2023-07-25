import React, { useState, useEffect } from 'react';
import FavMovies from './favMovie/fav-movie';
import { Button, Card } from 'react-bootstrap';

export default function ProfileView({ token, user, userUnregistered }) {
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    birthday: ''
  });
  const [unregistered, setUnregistered] = useState(false);

  useEffect(() => {
    if (!token) {
      return;
    }

    fetch(`https://mycf-movie-api.herokuapp.com/users/${user.Username}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((response) => response.json())
      .then((data) => {
        setUserData(data);
        setFormData({
          username: data.Username,
          email: data.Email,
          birthday: data.Birthday
        });
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
      });
  }, [token, user.Username]);

  const handleUnregister = () => {
    fetch(`https://mycf-movie-api.herokuapp.com/users/${user.Username}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((response) => {
        if (response.ok) {
          setUnregistered(true);
          console.log(`${user.Username} was successfully deleted.`);
          userUnregistered();
        } else {
          console.error('Error unregistering user:', response.status, response.statusText);
        }
      })
      .catch((error) => {
        console.error('Error unregistering user:', error);
      });
  };

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="row">
      <div className="col-md-6">
        <Card>
          <Card.Body>
            <Card.Title>Hello, {userData.Username}!</Card.Title>
            <div>
              <Card.Text>Email: {userData.Email}</Card.Text>
              <Card.Text>Birthday: {userData.Birthday}</Card.Text>
            </div>
          </Card.Body>
        </Card>
      </div>
      <div className="col-md-6">
        <Card>
          <Card.Body>
            <Card.Title>Update Profile</Card.Title>
            <form >
              <div>
                <label>Username:</label>
                <input
                  type="text"
                  name="username"
                  placeholder="username"
                />
              </div>
              <div>
                <label>Email:</label>
                <input
                  type="text"
                  name="email"
                  placeholder="email"
                />
              </div>
              <div>
                <label>Birthday:</label>
                <input
                  type="text"
                  name="birthday"
                  placeholder="birthday"
                />
              </div>
              <Button type="submit">Save Changes</Button>
              <Button type="button" onClick={handleUnregister}>
                Unregister
              </Button>
            </form>
          </Card.Body>
        </Card>
      </div>
      {unregistered && <p>Successfully unregistered. Redirecting to login page...</p>}
      <FavMovies user={user} token={token} />
    </div>
  );
}
