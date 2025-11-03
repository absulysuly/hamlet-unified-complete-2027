const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: '*', // Allow all origins for now
  credentials: true
}));
app.use(express.json());

// Mock data for Iraqi election platform
const mockGovernorates = [
  { id: 'baghdad', name: 'بغداد', enName: 'Baghdad', slug: 'baghdad' },
  { id: 'basra', name: 'البصرة', enName: 'Basra', slug: 'basra' },
  { id: 'erbil', name: 'أربيل', enName: 'Erbil', slug: 'erbil' },
  { id: 'mosul', name: 'الموصل', enName: 'Mosul', slug: 'mosul' },
  { id: 'najaf', name: 'النجف', enName: 'Najaf', slug: 'najaf' },
  { id: 'karbala', name: 'كربلاء', enName: 'Karbala', slug: 'karbala' },
  { id: 'sulaymaniyah', name: 'السليمانية', enName: 'Sulaymaniyah', slug: 'sulaymaniyah' },
  { id: 'duhok', name: 'دهوك', enName: 'Duhok', slug: 'duhok' },
];

const mockParties = [
  { id: '1', name: 'Democratic Party', logoUrl: 'https://via.placeholder.com/100', leader: 'Ali Hassan', founded: 2003 },
  { id: '2', name: 'Reform Coalition', logoUrl: 'https://via.placeholder.com/100', leader: 'Sara Ahmed', founded: 2010 },
  { id: '3', name: 'Progressive Union', logoUrl: 'https://via.placeholder.com/100', leader: 'Omar Khalil', founded: 2015 },
];

const mockCandidates = [
  {
    id: '1',
    name: 'علي حسن',
    enName: 'Ali Hassan',
    party: 'Democratic Party',
    partyId: '1',
    governorate: 'Baghdad',
    governorateId: 'baghdad',
    avatarUrl: 'https://i.pravatar.cc/150?u=ali',
    bio: 'خبرة 15 عامًا في الخدمة العامة',
    verified: true,
    votes: 15420,
    platformSummary: 'Focus on education reform and infrastructure development'
  },
  {
    id: '2',
    name: 'سارة أحمد',
    enName: 'Sara Ahmed',
    party: 'Reform Coalition',
    partyId: '2',
    governorate: 'Basra',
    governorateId: 'basra',
    avatarUrl: 'https://i.pravatar.cc/150?u=sara',
    bio: 'ناشطة في مجال حقوق المرأة',
    verified: true,
    votes: 12350,
    platformSummary: 'Women rights and economic development'
  },
  {
    id: '3',
    name: 'عمر خليل',
    enName: 'Omar Khalil',
    party: 'Progressive Union',
    partyId: '3',
    governorate: 'Erbil',
    governorateId: 'erbil',
    avatarUrl: 'https://i.pravatar.cc/150?u=omar',
    bio: 'مهندس ورجل أعمال',
    verified: false,
    votes: 8920,
    platformSummary: 'Technology and innovation for modern Iraq'
  },
];

const mockStats = {
  totalVoters: 25000000,
  registeredVoters: 18500000,
  totalCandidates: mockCandidates.length,
  totalParties: mockParties.length,
  governorates: mockGovernorates.length,
  lastUpdated: new Date().toISOString()
};

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Hamlet Iraqi Election Platform API',
    timestamp: new Date().toISOString(),
    version: '2.0.0'
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Hamlet Iraqi Election Platform API',
    timestamp: new Date().toISOString(),
    version: '2.0.0'
  });
});

// Candidates endpoints
app.get('/api/candidates', (req, res) => {
  const { governorate, party, page = 1, limit = 10 } = req.query;

  let filtered = [...mockCandidates];

  if (governorate && governorate !== 'all') {
    filtered = filtered.filter(c => c.governorateId === governorate);
  }

  if (party && party !== 'all') {
    filtered = filtered.filter(c => c.partyId === party);
  }

  const startIndex = (parseInt(page) - 1) * parseInt(limit);
  const endIndex = startIndex + parseInt(limit);
  const paginated = filtered.slice(startIndex, endIndex);

  res.json({
    data: paginated,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: filtered.length,
      totalPages: Math.ceil(filtered.length / parseInt(limit))
    }
  });
});

app.get('/api/candidates/:id', (req, res) => {
  const candidate = mockCandidates.find(c => c.id === req.params.id);

  if (!candidate) {
    return res.status(404).json({ error: 'Candidate not found' });
  }

  res.json(candidate);
});

// Governorates endpoints
app.get('/api/governorates', (req, res) => {
  res.json({ data: mockGovernorates });
});

app.get('/api/governorates/:slug', (req, res) => {
  const governorate = mockGovernorates.find(g => g.slug === req.params.slug);

  if (!governorate) {
    return res.status(404).json({ error: 'Governorate not found' });
  }

  const candidates = mockCandidates.filter(c => c.governorateId === governorate.id);

  res.json({
    ...governorate,
    candidates,
    stats: {
      totalCandidates: candidates.length,
      registeredVoters: 1500000 + Math.floor(Math.random() * 500000),
      pollingStations: 50 + Math.floor(Math.random() * 100)
    }
  });
});

// Parties endpoints
app.get('/api/parties', (req, res) => {
  res.json({ data: mockParties });
});

app.get('/api/parties/:id', (req, res) => {
  const party = mockParties.find(p => p.id === req.params.id);

  if (!party) {
    return res.status(404).json({ error: 'Party not found' });
  }

  const candidates = mockCandidates.filter(c => c.partyId === party.id);

  res.json({
    ...party,
    candidates,
    totalVotes: candidates.reduce((sum, c) => sum + c.votes, 0)
  });
});

// Stats endpoints
app.get('/api/stats', (req, res) => {
  res.json(mockStats);
});

app.get('/api/stats/dashboard', (req, res) => {
  res.json({
    ...mockStats,
    trending: mockCandidates.slice(0, 3).map(c => ({
      id: c.id,
      name: c.name,
      votes: c.votes,
      change: '+' + Math.floor(Math.random() * 500)
    }))
  });
});

// Social endpoints (basic)
app.post('/api/posts/:postId/like', (req, res) => {
  res.json({ success: true, likes: Math.floor(Math.random() * 1000) });
});

// Portal endpoints (redirect to main candidates API)
app.get('/portal/candidates', (req, res) => {
  res.redirect(307, '/api/candidates');
});

// Civic endpoints
app.get('/civic/stats/dashboard', (req, res) => {
  res.redirect(307, '/api/stats/dashboard');
});

app.get('/civic/governorates/:slug', (req, res) => {
  res.redirect(307, `/api/governorates/${req.params.slug}`);
});

app.get('/civic/parties/:id', (req, res) => {
  res.redirect(307, `/api/parties/${req.params.id}`);
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Hamlet Iraqi Election Platform API',
    version: '2.0.0',
    status: 'running',
    endpoints: {
      health: '/health or /api/health',
      candidates: '/api/candidates',
      candidateById: '/api/candidates/:id',
      governorates: '/api/governorates',
      parties: '/api/parties',
      stats: '/api/stats'
    },
    timestamp: new Date().toISOString()
  });
});

app.get('/api', (req, res) => {
  res.redirect(307, '/');
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Hamlet Backend running on port ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Accepting requests from all origins`);
  console.log(`✅ API endpoints ready`);
});

module.exports = app;
