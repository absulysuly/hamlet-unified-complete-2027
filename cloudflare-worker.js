// Cloudflare Worker - Backend API for Hamlet Project
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Type': 'application/json',
    };

    // Handle OPTIONS
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Mock data
    const governorates = [
      { id: 'baghdad', name: 'بغداد', enName: 'Baghdad', slug: 'baghdad' },
      { id: 'basra', name: 'البصرة', enName: 'Basra', slug: 'basra' },
      { id: 'erbil', name: 'أربيل', enName: 'Erbil', slug: 'erbil' },
      { id: 'mosul', name: 'الموصل', enName: 'Mosul', slug: 'mosul' },
      { id: 'najaf', name: 'النجف', enName: 'Najaf', slug: 'najaf' },
      { id: 'karbala', name: 'كربلاء', enName: 'Karbala', slug: 'karbala' },
      { id: 'sulaymaniyah', name: 'السليمانية', enName: 'Sulaymaniyah', slug: 'sulaymaniyah' },
      { id: 'duhok', name: 'دهوك', enName: 'Duhok', slug: 'duhok' },
    ];

    const parties = [
      { id: '1', name: 'Democratic Party', logoUrl: 'https://via.placeholder.com/100', leader: 'Ali Hassan', founded: 2003 },
      { id: '2', name: 'Reform Coalition', logoUrl: 'https://via.placeholder.com/100', leader: 'Sara Ahmed', founded: 2010 },
      { id: '3', name: 'Progressive Union', logoUrl: 'https://via.placeholder.com/100', leader: 'Omar Khalil', founded: 2015 },
    ];

    const candidates = [
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
        bio: 'مهندس وخبير في التكنولوجيا',
        verified: true,
        votes: 10200,
        platformSummary: 'Technology and innovation in government'
      }
    ];

    // Routes
    if (path === '/' || path === '/health') {
      return new Response(JSON.stringify({
        status: 'OK',
        message: 'Hamlet Iraqi Election Platform API (Cloudflare Worker)',
        timestamp: new Date().toISOString(),
        version: '2.0.0'
      }), { headers: corsHeaders });
    }

    if (path === '/api/health') {
      return new Response(JSON.stringify({
        status: 'OK',
        message: 'API is running',
        timestamp: new Date().toISOString()
      }), { headers: corsHeaders });
    }

    if (path === '/api/candidates') {
      return new Response(JSON.stringify({ data: candidates }), { headers: corsHeaders });
    }

    if (path === '/api/governorates') {
      return new Response(JSON.stringify({ data: governorates }), { headers: corsHeaders });
    }

    if (path === '/api/parties') {
      return new Response(JSON.stringify({ data: parties }), { headers: corsHeaders });
    }

    if (path === '/api/stats') {
      return new Response(JSON.stringify({
        data: {
          totalCandidates: candidates.length,
          totalGovernorates: governorates.length,
          totalParties: parties.length,
          totalVotes: candidates.reduce((sum, c) => sum + c.votes, 0),
          lastUpdated: new Date().toISOString()
        }
      }), { headers: corsHeaders });
    }

    // 404
    return new Response(JSON.stringify({ error: 'Not Found' }), {
      status: 404,
      headers: corsHeaders
    });
  },
};
