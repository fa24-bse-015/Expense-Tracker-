import React, { useState, useEffect } from 'react';

const HouseholdManager = ({ activeHousehold, setActiveHousehold, userId }) => {
  const [households, setHouseholds] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newHouseholdName, setNewHouseholdName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [message, setMessage] = useState('');

  // Fetch households on load
  useEffect(() => {
    fetchHouseholds();
  }, [userId]);

  const fetchHouseholds = async () => {
    try {
      const res = await fetch(`/api/households/user/${userId}`);
      if (res.ok) {
        const data = await res.json();
        setHouseholds(data);
      }
    } catch (err) {
      console.error('Error fetching households:', err);
    }
  };

  const handleCreateHousehold = async (e) => {
    e.preventDefault();
    if (!newHouseholdName) return;

    try {
      const res = await fetch('/api/households', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newHouseholdName, userId }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('Household created successfully!');
        setNewHouseholdName('');
        fetchHouseholds();
      } else {
        setMessage(data.error || 'Failed to create household.');
      }
    } catch (err) {
      setMessage('Server error.');
    }
  };

  const handleJoinHousehold = async (e) => {
    e.preventDefault();
    if (!inviteCode) return;

    try {
      const res = await fetch('/api/households/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inviteCode, userId }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('Joined household successfully!');
        setInviteCode('');
        fetchHouseholds();
      } else {
        setMessage(data.error || 'Failed to join household.');
      }
    } catch (err) {
      setMessage('Server error.');
    }
  };

  const handleGenerateInvite = async (householdId) => {
    try {
      const res = await fetch(`/api/households/${householdId}/invites`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      const data = await res.json();
      if (res.ok) {
        setGeneratedCode(data.inviteCode);
      } else {
        setMessage(data.error || 'Only owners can generate invites.');
      }
    } catch (err) {
      setMessage('Server error.');
    }
  };

  return (
    <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <strong>Active Workspace: </strong>
          <select 
            value={activeHousehold || 'personal'} 
            onChange={(e) => setActiveHousehold(e.target.value === 'personal' ? null : e.target.value)}
            style={{ padding: '5px 10px', fontSize: '14px' }}
          >
            <option value="personal">Personal Mode</option>
            {households.map((h) => (
              <option key={h.id} value={h.id}>
                Household: {h.name} ({h.role})
              </option>
            ))}
          </select>
        </div>

        <button onClick={() => setShowModal(!showModal)} style={{ padding: '6px 12px', cursor: 'pointer' }}>
          {showModal ? 'Close Manage' : 'Manage Households'}
        </button>
      </div>

      {showModal && (
        <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #eee' }}>
          <h3>Manage Households</h3>
          {message && <p style={{ color: 'blue' }}>{message}</p>}

          {/* Create Household */}
          <form onSubmit={handleCreateHousehold} style={{ marginBottom: '15px' }}>
            <h4>Create New Household</h4>
            <input 
              type="text" 
              placeholder="Household Name" 
              value={newHouseholdName} 
              onChange={(e) => setNewHouseholdName(e.target.value)}
              style={{ padding: '5px', marginRight: '10px' }}
            />
            <button type="submit">Create</button>
          </form>

          {/* Join Household */}
          <form onSubmit={handleJoinHousehold} style={{ marginBottom: '15px' }}>
            <h4>Join Household via Code</h4>
            <input 
              type="text" 
              placeholder="Enter Invite Code" 
              value={inviteCode} 
              onChange={(e) => setInviteCode(e.target.value)}
              style={{ padding: '5px', marginRight: '10px' }}
            />
            <button type="submit">Join</button>
          </form>

          {/* List and Generate Invite Codes */}
          <div>
            <h4>Your Households</h4>
            <ul>
              {households.map((h) => (
                <li key={h.id} style={{ marginBottom: '5px' }}>
                  {h.name} ({h.role}) {' '}
                  {h.role === 'owner' && (
                    <button onClick={() => handleGenerateInvite(h.id)} style={{ fontSize: '12px' }}>
                      Generate Invite Code
                    </button>
                  )}
                </li>
              ))}
            </ul>
            {generatedCode && (
              <p><strong>New Invite Code:</strong> <span style={{ background: '#eee', padding: '2px 6px' }}>{generatedCode}</span></p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HouseholdManager;