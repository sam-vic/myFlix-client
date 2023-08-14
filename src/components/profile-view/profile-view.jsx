import React, { useState, useEffect } from 'react';
import FavMovies from './favMovie/fav-movie';
import { Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import './profile-view.scss';

export default function ProfileView({ token, user, userUnregistered }) {
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    month: '',
    day: '',
    year: ''
  });
  const [newUserData, setNewUserData] = useState(null);
  const [unregistered, setUnregistered] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('')

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
        setFormData((prevFormData) => ({
          ...prevFormData,
          username: data.Username,
          email: data.Email,
          password: '',
          month: data.Birthday ? data.Birthday.split('-')[1] : '',
          day: data.Birthday ? data.Birthday.split('T')[0].split('-')[2] : '', // Extract day without time component
          year: data.Birthday ? data.Birthday.split('-')[0] : ''
        }));
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
      });
  }, [token, user.Username]);


  // Function to format date in "mm/dd/yyyy" format
  // Function to format date in "mm/dd/yyyy" format
  const formatDate = (month, day, year) => {
    const formattedMonth = String(month).padStart(2, '0');
    const formattedDay = String(day).padStart(2, '0');
    const formattedYear = String(year);

    // Return date in "mm/dd/yyyy" format
    return `${formattedMonth}/${formattedDay}/${formattedYear}`;
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
    if (name === 'day') {
      // Extract the day value from the Date object and remove time component
      const dayValue = value.split('T')[0];
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: dayValue,
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  const navigate = useNavigate()

  // Update user data if there are changes
  const handleSubmit = (e) => {
    e.preventDefault()

    if (formData.password !== confirmPassword) {
      alert('Confirm Password not matched')
      return
    }

    // Only send fields that have changed
    const updatedData = { ...formData }

    delete updatedData['confirmPassword']

    if (updatedData.password === '') {
      // Include the password field only if it's not empty
      updatedData['Password'] = updatedData.password === '' ? ' ' : updatedData.password;
    }
    console.log('Updated Data:', updatedData)

    updatedData['Birthday'] = formatDate(formData.month, formData.day, formData.year);

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
          // Check if the username was updated
          if (updatedData.Username) {
            setUserData(data)
            localStorage.setItem("user", JSON.stringify(data));
            // Navigate to the new username's profile page
            navigate(`/users/${updatedData.Username}`);
          }
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
    <div className="profile-view">
      <div className="row">
        <div className="col-md-6">
          <Card className="profile-card">
            <Card.Body>
              <Card.Title className="profile-card-title">Hello, {userData.Username}!</Card.Title>
              <div>
                <Card.Text className="profile-card-text">Email: {newUserData?.Email || userData.Email}</Card.Text>
                <Card.Text className="profile-card-text">Birthday: {birthday ? getAdjustedDate(new Date(birthday)).toDateString() : "N/A"}</Card.Text>
              </div>
            </Card.Body>
          </Card>
        </div>
        <div className="col-md-6">
          <Card className="update-profile-card">
            <Card.Body>
              <Card.Title className="update-profile-card-title">Update Profile</Card.Title>
              <form className="update-profile-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Username:</label>
                  <input
                    className="form-control white-input" // Added the class name "white-input"
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Password:</label>
                  <input
                    className="form-control white-input" // Added the class name "white-input"
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Confirm password:</label>
                  <input
                    className="form-control white-input" // Added the class name "white-input"
                    type="password"
                    name="confirm password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email:</label>
                  <input
                    className="form-control white-input" // Added the class name "white-input"
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Birthday:</label>
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
                <Button className="btn-save-changes" type="submit">Save Changes</Button>
                <Button className="btn-unregister" type="button" onClick={handleUnregister}>
                  Unregister
                </Button>
              </form>
            </Card.Body>
          </Card>
          {unregistered && <p>Successfully unregistered. Redirecting to the login page...</p>}
        </div>
        <FavMovies user={user} token={token} />
      </div>
    </div>
  )
}