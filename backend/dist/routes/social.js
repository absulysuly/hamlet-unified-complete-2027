"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.socialRouter = void 0;
const express_1 = require("express");
const mockData_1 = require("../mockData");
const router = (0, express_1.Router)();
const asGovernorate = (value) => {
    if (!value)
        return undefined;
    return value;
};
router.get('/users', (req, res) => {
    const { role, governorate } = req.query;
    let filtered = mockData_1.users;
    if (role) {
        filtered = filtered.filter(user => user.role === role);
    }
    if (governorate && governorate !== 'All') {
        filtered = filtered.filter(user => user.governorate === governorate);
    }
    res.json(filtered);
});
router.get('/posts', (req, res) => {
    const { type, governorate, authorId } = req.query;
    let filtered = mockData_1.posts;
    if (type) {
        filtered = filtered.filter(post => post.type === type);
    }
    if (governorate && governorate !== 'All') {
        filtered = filtered.filter(post => post.governorates.includes(governorate));
    }
    if (authorId) {
        filtered = filtered.filter(post => post.author.id === authorId);
    }
    res.json(filtered);
});
router.post('/posts', (req, res) => {
    const { content, authorId, governorate } = req.body;
    if (!content) {
        return res.status(400).json({ error: 'content is required' });
    }
    if (!authorId) {
        return res.status(400).json({ error: 'authorId is required' });
    }
    const author = mockData_1.users.find(user => user.id === authorId);
    if (!author) {
        return res.status(404).json({ error: 'author not found' });
    }
    const newPost = {
        id: `post-${Date.now()}`,
        author,
        timestamp: new Date().toISOString(),
        content,
        likes: 0,
        comments: 0,
        shares: 0,
        isSponsored: false,
        type: 'Post',
        governorates: governorate ? [governorate] : [author.governorate],
    };
    mockData_1.posts.unshift(newPost);
    res.status(201).json(newPost);
});
router.post('/reels', (req, res) => {
    const { caption, authorId, mediaUrl, governorate } = req.body;
    if (!caption) {
        return res.status(400).json({ error: 'caption is required' });
    }
    if (!authorId) {
        return res.status(400).json({ error: 'authorId is required' });
    }
    const author = mockData_1.users.find(user => user.id === authorId);
    if (!author) {
        return res.status(404).json({ error: 'author not found' });
    }
    const newReel = {
        id: `reel-${Date.now()}`,
        author,
        timestamp: new Date().toISOString(),
        content: caption,
        mediaUrl,
        likes: 0,
        comments: 0,
        shares: 0,
        isSponsored: false,
        type: 'Reel',
        governorates: governorate ? [governorate] : [author.governorate],
    };
    mockData_1.posts.unshift(newReel);
    res.status(201).json(newReel);
});
router.get('/events', (req, res) => {
    const { governorate } = req.query;
    let filtered = mockData_1.events;
    if (governorate && governorate !== 'All') {
        filtered = filtered.filter(event => event.governorate === governorate);
    }
    res.json(filtered);
});
router.post('/events', (req, res) => {
    const { title, date, location, organizerId, governorate } = req.body;
    if (!title || !date || !location) {
        return res.status(400).json({ error: 'title, date, and location are required' });
    }
    const organizer = organizerId ? mockData_1.users.find(user => user.id === organizerId) : undefined;
    if (organizerId && !organizer) {
        return res.status(404).json({ error: 'organizer not found' });
    }
    const newEvent = {
        id: `event-${Date.now()}`,
        title,
        date,
        location,
        organizer: organizer ?? mockData_1.users[0],
        governorate: governorate ?? organizer?.governorate ?? 'Baghdad',
    };
    mockData_1.events.unshift(newEvent);
    res.status(201).json(newEvent);
});
router.get('/debates', (req, res) => {
    const { governorate, participantIds } = req.query;
    let filtered = mockData_1.debates;
    if (governorate && governorate !== 'All') {
        filtered = filtered.filter(debate => debate.participants.some(p => p.governorate === governorate));
    }
    if (participantIds) {
        const ids = participantIds.split(',').map(id => id.trim()).filter(Boolean);
        filtered = filtered.filter(debate => debate.participants.some(p => ids.includes(p.id)));
    }
    res.json(filtered);
});
router.get('/articles', (req, res) => {
    const { governorate } = req.query;
    let filtered = mockData_1.articles;
    if (governorate && governorate !== 'All') {
        filtered = filtered.filter(article => article.governorates.includes(governorate));
    }
    res.json(filtered);
});
router.post('/follow', (req, res) => {
    const { candidateId } = req.body;
    if (!candidateId) {
        return res.status(400).json({ error: 'candidateId is required' });
    }
    res.json({ success: true, candidateId });
});
router.post('/like', (req, res) => {
    const { postId } = req.body;
    if (!postId) {
        return res.status(400).json({ error: 'postId is required' });
    }
    res.json({ success: true, postId });
});
exports.socialRouter = router;
