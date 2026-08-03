const express = require('express');
const router = express.Router();
const db = require('../database');

// Helper function to generate a random 6-character invite code
function generateInviteCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// 1. Create a new household
router.post('/', (req, res) => {
  const { name, userId } = req.body;

  if (!name || !userId) {
    return res.status(400).json({ error: 'Household name and userId are required.' });
  }

  const queryInsertHousehold = `INSERT INTO households (name, owner_id) VALUES (?, ?)`;
  
  db.run(queryInsertHousehold, [name, userId], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const householdId = this.lastID;

    // Automatically make the creator an owner in household_members
    const queryInsertMember = `INSERT INTO household_members (household_id, user_id, role) VALUES (?, ?, 'owner')`;
    
    db.run(queryInsertMember, [householdId, userId], (memberErr) => {
      if (memberErr) {
        return res.status(500).json({ error: memberErr.message });
      }

      res.status(201).json({
        message: 'Household created successfully.',
        household: { id: householdId, name, ownerId: userId }
      });
    });
  });
});

// 2. List all households a user belongs to
router.get('/user/:userId', (req, res) => {
  const { userId } = req.params;

  const query = `
    SELECT h.id, h.name, h.owner_id, hm.role 
    FROM households h
    JOIN household_members hm ON h.id = hm.household_id
    WHERE hm.user_id = ?
  `;

  db.all(query, [userId], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// 3. Generate an invite code (Owner only)
router.post('/:id/invites', (req, res) => {
  const householdId = req.params.id;
  const { userId } = req.body;

  // Check if user is the owner
  const checkOwnerQuery = `SELECT role FROM household_members WHERE household_id = ? AND user_id = ?`;

  db.get(checkOwnerQuery, [householdId, userId], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (!row || row.role !== 'owner') {
      return res.status(403).json({ error: 'Access denied. Only household owners can generate invites.' });
    }

    const inviteCode = generateInviteCode();
    const insertInviteQuery = `INSERT INTO household_invites (household_id, invite_code) VALUES (?, ?)`;

    db.run(insertInviteQuery, [householdId, inviteCode], function (inviteErr) {
      if (inviteErr) {
        return res.status(500).json({ error: inviteErr.message });
      }

      res.status(201).json({
        message: 'Invite code generated successfully.',
        inviteCode
      });
    });
  });
});

// 4. Join a household using an invite code
router.post('/join', (req, res) => {
  const { inviteCode, userId } = req.body;

  if (!inviteCode || !userId) {
    return res.status(400).json({ error: 'Invite code and userId are required.' });
  }

  const findInviteQuery = `SELECT household_id FROM household_invites WHERE invite_code = ?`;

  db.get(findInviteQuery, [inviteCode.toUpperCase()], (err, invite) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (!invite) {
      return res.status(404).json({ error: 'Invalid or expired invite code.' });
    }

    // Check if user is already a member
    const checkMemberQuery = `SELECT id FROM household_members WHERE household_id = ? AND user_id = ?`;

    db.get(checkMemberQuery, [invite.household_id, userId], (memberCheckErr, existingMember) => {
      if (memberCheckErr) {
        return res.status(500).json({ error: memberCheckErr.message });
      }

      if (existingMember) {
        return res.status(400).json({ error: 'User is already a member of this household.' });
      }

      // Add user as a regular member
      const addMemberQuery = `INSERT INTO household_members (household_id, user_id, role) VALUES (?, ?, 'member')`;

      db.run(addMemberQuery, [invite.household_id, userId], function (addErr) {
        if (addErr) {
          return res.status(500).json({ error: addErr.message });
        }

        res.status(200).json({
          message: 'Joined household successfully.',
          householdId: invite.household_id
        });
      });
    });
  });
});

// 5. List all members in a household
router.get('/:id/members', (req, res) => {
  const householdId = req.params.id;

  const query = `
    SELECT hm.user_id, hm.role, hm.joined_at
    FROM household_members hm
    WHERE hm.household_id = ?
  `;

  db.all(query, [householdId], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

module.exports = router;