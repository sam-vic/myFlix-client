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
  const [newUserData, setNewUserData] = useState(null); // New state for updated user data
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

    // Update form input values when user types in the fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Update user data if there are changes
  const handleSubmit = (e) => {
    e.preventDefault();

    // Only send fields that have changed
    const updatedData = {};
    for (const key in formData) {
      if (formData[key] !== userData[key]) {
        updatedData[key.charAt(0).toUpperCase() + key.slice(1)] = formData[key];
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
          setNewUserData(data); // Save the updated user data in newUserData state
          console.log('Update successful:', data);
        })
        .catch((error) => {
          console.error('Error updating user data:', error);
        });
    }
  };

  useEffect(() => {
    if (userData) {
      setFormData({
        username: userData.Username,
        email: userData.Email,
        birthday: userData.Birthday
      });
    }
  }, [userData]);

  ////// unregistering //////
  const handleUnregister = () => {
    fetch(`https://mycf-movie-api.herokuapp.com/users/${user.Username}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((response) => {
        if (response.ok) {
          setUnregistered(true)
          console.log(`${user.Username} was successfully deleted.`)
          userUnregistered()
        } else {
          console.error('Error unregistering user:', response.status, response.statusText)
        }
      })
      .catch((error) => {
        console.error('Error unregistering user:', error)
      })
  }


  const birthday =
  newUserData && newUserData.Birthday
    ? Date.parse(newUserData.Birthday)
    : userData && userData.Birthday
    ? Date.parse(userData.Birthday)
    : null
  console.log(birthday)

  const formattedBirthday = new Date(formData.birthday).toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })

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
              <Card.Text>Email: {newUserData?.Email || userData.Email}</Card.Text>
              <Card.Text>Birthday: {birthday ? new Date(birthday).toDateString() : "N/A"}</Card.Text>
            </div>
          </Card.Body>
        </Card>
      </div>
      <div className="col-md-6">
        <Card>
          <Card.Body>
            <Card.Title>Update Profile</Card.Title>
            <form onSubmit={handleSubmit}>
              <div>
                <label>Username:</label>
                <input
                  type="text"
                  name="username"
                  placeholder="username"
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label>Email:</label>
                <input
                  type="text"
                  name="email"
                  placeholder="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label>Birthday:</label>
                <input
                  type="text"
                  name="birthday"
                  placeholder="birthday"
                  value={formattedBirthday}
                  onChange={handleChange}
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
