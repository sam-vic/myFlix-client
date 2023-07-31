import React, { useState, useEffect } from 'react';
import FavMovies from './favMovie/fav-movie';
import { Button, Card } from 'react-bootstrap';

export default function ProfileView({ token, user, userUnregistered }) {
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    month: '',
    day: '',
    year: ''
  });
  const [newUserData, setNewUserData] = useState(null);
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
          month: data.Birthday ? data.Birthday.split('-')[1] : '',
          day: data.Birthday ? data.Birthday.split('-')[2] : '',
          year: data.Birthday ? data.Birthday.split('-')[0] : ''
        });
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
      });
  }, [token, user.Username]);


  // Function to format date in "mm/dd/yyyy" format
  const formatDate = (month, day, year) => {
    const formattedMonth = String(month).padStart(2, '0');
    const formattedDay = String(day).padStart(2, '0');
    return `${formattedMonth}/${formattedDay}/${year}`;
  };

  // Update form input values when user types in the fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }));
  };

  // Update the form data when the user selects a date from the dropdowns
  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }));
  };

  // Update user data if there are changes
  const handleSubmit = (e) => {
    e.preventDefault();

    // Only send fields that have changed
    const updatedData = {};
    for (const key in formData) {
      if (formData[key] !== userData[key]) {
        if (key === 'month' || key === 'day' || key === 'year') {
          updatedData['Birthday'] = formatDate(formData.month, formData.day, formData.year);
        } else {
          updatedData[key.charAt(0).toUpperCase() + key.slice(1)] = formData[key];
        }
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

  const getAdjustedDate = (date) => {
    const offset = new Date().getTimezoneOffset() * 60 * 1000; // Timezone offset in milliseconds
    return new Date(date.getTime() + offset);
  };

  const birthday =
    newUserData && newUserData.Birthday
      ? Date.parse(newUserData.Birthday)
      : userData && userData.Birthday
        ? Date.parse(userData.Birthday)
        : null;
  console.log(birthday);

  const months = Array.from({ length: 12 }, (_, i) => new Date(0, i).toLocaleString('default', { month: '2-digit' }));
  const days = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));
  const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);

  if (!userData) {
    return <div>Loading...</div>;
  }

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

  if (!userData) {
    return <div>Loading...</div>
  }

  return (
    <div className="row">
      <div className="col-md-6">
        <Card>
          <Card.Body>
            <Card.Title>Hello, {userData.Username}!</Card.Title>
            <div>
              <Card.Text>Email: {newUserData?.Email || userData.Email}</Card.Text>
              <Card.Text>Birthday: {birthday ? getAdjustedDate(new Date(birthday)).toDateString() : "N/A"}</Card.Text>
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
                {/* Dropdown for Month */}
                <select name="month" value={formData.month} onChange={handleDateChange}>
                  {months.map((month) => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ))}
                </select>
                {/* Dropdown for Day */}
                <select name="day" value={formData.day} onChange={handleDateChange}>
                  {days.map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
                {/* Dropdown for Year */}
                <select name="year" value={formData.year} onChange={handleDateChange}>
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
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
  )
}
