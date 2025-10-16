const express = require('express');
const {
  createStory,
  getActiveStories,
  getCandidateStories,
  viewStory,
  deleteStory
} = require('../controllers/storyController');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, createStory);
router.get('/', auth, getActiveStories);
router.get('/candidate/:candidateId', auth, getCandidateStories);
router.post('/:id/view', auth, viewStory);
router.delete('/:id', auth, deleteStory);

module.exports = router;
