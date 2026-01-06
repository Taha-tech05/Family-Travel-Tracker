import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import WorldMap from './WorldMap';
import { countryToContinent } from './constants';
import './App.css';

const API_BASE_URL = 'http://localhost:3000/api';

function App() {
  const [data, setData] = useState({
    countries: [],
    allVisits: [],
    allUserVisits: [],
    totalWorldCountries: 0,
    total: 0,
    users: [],
    color: 'teal',
    currentUserId: 1
  });
  const [countryInput, setCountryInput] = useState('');
  const [showNewUserForm, setShowNewUserForm] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserColor, setNewUserColor] = useState('red');
  const [error, setError] = useState('');
  const [tooltip, setTooltip] = useState({ show: false, text: '', x: 0, y: 0 });

  // Stats calculation
  const stats = useMemo(() => {
    // 1. Continents covered
    const visitedContinents = new Set();
    data.countries.forEach(code => {
      const continent = countryToContinent[code];
      if (continent) visitedContinents.add(continent);
    });

    // 2. Explored percentage
    const percentExplored = data.totalWorldCountries > 0
      ? ((data.countries.length / data.totalWorldCountries) * 100).toFixed(1)
      : 0;

    // 3. Top traveler
    let topTraveler = { name: 'None', count: 0 };
    if (data.users.length > 0 && data.allUserVisits.length > 0) {
      const userVisitCounts = {};
      data.allUserVisits.forEach(visit => {
        userVisitCounts[visit.user_id] = (userVisitCounts[visit.user_id] || 0) + 1;
      });

      let maxVisits = 0;
      let topUserId = null;
      Object.entries(userVisitCounts).forEach(([userId, count]) => {
        if (count > maxVisits) {
          maxVisits = count;
          topUserId = parseInt(userId);
        }
      });

      const topUser = data.users.find(u => u.id === topUserId);
      if (topUser) {
        topTraveler = { name: topUser.name, count: maxVisits };
      }
    }

    return {
      continentsCount: visitedContinents.size,
      percentExplored,
      topTraveler
    };
  }, [data]);

  // Fetch data from backend
  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/data`);
      setData(response.data);
      setError('');

      // Color the visited countries on the map
      // First, reset all countries to default color
      const allPaths = document.querySelectorAll('.ag-canvas_svg path');
      allPaths.forEach(path => {
        path.style.fill = '#383d46';
      });

      // Then color the visited countries
      const countryCodes = response.data.countries;
      countryCodes.forEach(code => {
        const element = document.getElementById(code);
        if (element) {
          element.style.fill = response.data.color;
        }
      });
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data. Make sure the backend server is running on port 3000.');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Tooltip handlers
  const handleMouseEnter = (e) => {
    const countryName = e.target.getAttribute('title');
    if (countryName) {
      setTooltip({
        show: true,
        text: countryName,
        x: e.clientX,
        y: e.clientY
      });
    }
  };

  const handleMouseMove = (e) => {
    if (tooltip.show) {
      setTooltip(prev => ({
        ...prev,
        x: e.clientX,
        y: e.clientY
      }));
    }
  };

  const handleMouseLeave = () => {
    setTooltip({ show: false, text: '', x: 0, y: 0 });
  };

  // Add event listeners to all country paths
  useEffect(() => {
    const paths = document.querySelectorAll('.ag-canvas_svg path');
    paths.forEach(path => {
      path.addEventListener('mouseenter', handleMouseEnter);
      path.addEventListener('mousemove', handleMouseMove);
      path.addEventListener('mouseleave', handleMouseLeave);
    });

    return () => {
      paths.forEach(path => {
        path.removeEventListener('mouseenter', handleMouseEnter);
        path.removeEventListener('mousemove', handleMouseMove);
        path.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, [data]);

  // Add country
  const handleAddCountry = async (e) => {
    e.preventDefault();
    if (!countryInput.trim()) return;

    try {
      await axios.post(`${API_BASE_URL}/add`, { country: countryInput });
      setCountryInput('');
      setError('');
      fetchData(); // Refresh data
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add country');
    }
  };

  // Switch user
  const handleUserSwitch = async (userId) => {
    try {
      await axios.post(`${API_BASE_URL}/user`, { user: userId });
      fetchData(); // Refresh data
    } catch (err) {
      console.error('Error switching user:', err);
      setError('Failed to switch user');
    }
  };

  // Add new user
  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!newUserName.trim()) {
      setError('Please enter a name');
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/new`, {
        name: newUserName,
        color: newUserColor
      });
      setNewUserName('');
      setNewUserColor('red');
      setShowNewUserForm(false);
      setError('');
      fetchData(); // Refresh data
    } catch (err) {
      setError('Failed to create user');
    }
  };

  const colorOptions = ['red', 'green', 'yellow', 'olive', 'orange', 'indigo', 'blue', 'violet', 'purple', 'pink'];

  return (
    <div className="App">
      {/* Tooltip */}
      {tooltip.show && (
        <div
          className="country-tooltip"
          style={{
            left: `${tooltip.x}px`,
            top: `${tooltip.y}px`
          }}
        >
          {tooltip.text}
        </div>
      )}
      {!showNewUserForm ? (
        <>
          {/* App Header: User Tabs and Add Country Form */}
          <header className="app-header">
            {/* User Selection Tabs */}
            <div className="tab-view tab-view-height-auto">
              {data.users.map(user => (
                <div key={user.id}>
                  <input
                    type="button"
                    value={user.id}
                    id={`user-${user.id}`}
                  />
                  <label
                    htmlFor={`user-${user.id}`}
                    className={user.id === data.currentUserId ? 'active' : ''}
                    style={{
                      backgroundColor: user.color,
                      color: user.id === data.currentUserId ? '#fff' : '#000',
                      boxShadow: user.id === data.currentUserId
                        ? `0 0 15px ${user.color}, 0 0 25px ${user.color}`
                        : 'none'
                    }}
                    onClick={() => handleUserSwitch(user.id)}
                  >
                    {user.name}
                  </label>
                </div>
              ))}
              <div>
                <input
                  type="button"
                  value="new"
                  id="tab"
                />
                <label
                  htmlFor="tab"
                  onClick={() => setShowNewUserForm(true)}
                >
                  Add Family Member
                </label>
              </div>
            </div>

            {/* Add Country Form */}
            <form onSubmit={handleAddCountry} className="add-country-form">
              {error && <div className="error-message">{error}</div>}
              <input
                type="text"
                name="country"
                autoFocus
                placeholder="Enter country name"
                value={countryInput}
                onChange={(e) => setCountryInput(e.target.value)}
              />
              <button type="submit" style={{ backgroundColor: data.color }}>
                Add
              </button>
            </form>
          </header>

          {/* Main Content Layout */}
          <div className="main-container">
            <div className="map-section">
              <WorldMap />
            </div>

            {/* Stats Dashboard */}
            <aside className="stats-dashboard">
              <h2>Travel Stats 📊</h2>

              <div className="stat-card active-user-theme" style={{ color: data.color }}>
                <span className="stat-value">{data.countries.length}</span>
                <span className="stat-label">Countries Visited</span>
              </div>

              <div className="stat-card">
                <span className="stat-value">{stats.continentsCount} / 6</span>
                <span className="stat-label">Continents Covered</span>
              </div>

              <div className="stat-card">
                <span className="stat-value">{stats.percentExplored}%</span>
                <span className="stat-label">of World Explored</span>
              </div>

              <div className="stat-card top-traveler-card">
                <span className="stat-value" style={{ fontSize: '1.4rem' }}>{stats.topTraveler.name}</span>
                <span className="stat-label">🏆 Top Traveler ({stats.topTraveler.count})</span>
              </div>
            </aside>
          </div>
        </>
      ) : (
        /* New User Form */
        <div className="new-user-form">
          <h1>Add a Family Member</h1>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleAddUser}>
            <p>What's your name?</p>
            <input
              type="text"
              name="name"
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
              placeholder="Enter name"
            />

            <p>Pick a color:</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
              {colorOptions.map(color => (
                <div key={color}>
                  <input
                    type="radio"
                    name="color"
                    id={color}
                    value={color}
                    checked={newUserColor === color}
                    onChange={(e) => setNewUserColor(e.target.value)}
                  />
                  <label htmlFor={color}>
                    <span className={color}></span>
                  </label>
                </div>
              ))}
            </div>

            <div className="spacer"></div>
            <button type="submit">Add</button>
            <button type="button" onClick={() => {
              setShowNewUserForm(false);
              setError('');
            }}>
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;
