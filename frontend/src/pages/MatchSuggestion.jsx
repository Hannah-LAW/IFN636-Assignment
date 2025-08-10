import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

function MatchResults() {
  const { user } = useAuth();
  const [matches, setMatches] = useState([]);

  const fetchMatches = async () => {
    if (!user) return;
    try {
      const res = await axiosInstance.get('/api/matches', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setMatches(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, [user]);

  if (!user) return <p>Please login to see match suggestions.</p>;

  return (
    <div>
      <h2>Match Suggestions</h2>
      {matches.length === 0 ? (
        <p>No matches found.</p>
      ) : (
        <ul>
          {matches.map(match => (
            <li key={match._id}>
              <h4>{match.title} ({match.type})</h4>
              <p>{match.description}</p>
              <p>{match.Campus} - {match.Location}</p>
              {match.imageUrl && <img src={match.imageUrl} alt={match.title} width="150" />}
              <p>Status: {match.status}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MatchResults;