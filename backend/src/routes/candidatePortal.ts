import { Router } from 'express';
import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';

const router = Router();

const DATA_FILE = path.resolve(process.cwd(), 'data', 'candidates.json');

export interface StoredCandidate {
  id: string;
  name: string;
  phone: string;
  province: string;
  district: string;
  party?: string;
  facebookUrl?: string;
  invitationSent: boolean;
  invitationSentAt?: string;
  responded: boolean;
  respondedAt?: string;
  notes?: string;
  status: 'new' | 'contacted' | 'interested' | 'not-interested';
  createdAt: string;
}

interface CandidateInput {
  name?: string;
  phone?: string;
  province?: string;
  district?: string;
  party?: string;
  facebookUrl?: string;
  notes?: string;
}

async function readCandidates(): Promise<StoredCandidate[]> {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(raw) as StoredCandidate[];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

async function writeCandidates(candidates: StoredCandidate[]): Promise<void> {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(candidates, null, 2), 'utf8');
}

function normaliseCandidate(payload: CandidateInput): StoredCandidate {
  if (!payload.name || !payload.phone || !payload.province) {
    throw new Error('Missing required candidate fields (name, phone, province)');
  }

  return {
    id: crypto.randomUUID(),
    name: payload.name.trim(),
    phone: payload.phone.trim(),
    province: payload.province.trim(),
    district: payload.district?.trim() ?? '',
    party: payload.party?.trim(),
    facebookUrl: payload.facebookUrl?.trim(),
    notes: payload.notes?.trim(),
    invitationSent: false,
    responded: false,
    status: 'new',
    createdAt: new Date().toISOString(),
  };
}

router.post('/', async (req, res) => {
  try {
    const candidate = normaliseCandidate(req.body as CandidateInput);
    const candidates = await readCandidates();
    candidates.unshift(candidate);
    await writeCandidates(candidates);
    res.json({ success: true, candidate });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
});

router.post('/bulk', async (req, res) => {
  try {
    const rows = req.body?.candidates as CandidateInput[] | undefined;
    if (!rows || !Array.isArray(rows)) {
      return res.status(400).json({ success: false, error: 'candidates array is required' });
    }

    const candidates = await readCandidates();
    const newRecords = rows.map(normaliseCandidate);
    const combined = [...newRecords, ...candidates];
    await writeCandidates(combined);
    res.json({ success: true, imported: newRecords.length });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
});

router.get('/', async (req, res) => {
  try {
    const {
      province,
      status,
      invitationSent,
      page = '1',
      limit = '50',
    } = req.query as Record<string, string | undefined>;

    const current = await readCandidates();

    const filtered = current.filter(candidate => {
      if (province && !candidate.province.toLowerCase().includes(province.toLowerCase())) {
        return false;
      }
      if (status && candidate.status !== status) {
        return false;
      }
      if (invitationSent !== undefined) {
        const desired = invitationSent === 'true';
        if (candidate.invitationSent !== desired) {
          return false;
        }
      }
      return true;
    });

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const pageSize = Math.max(1, parseInt(limit, 10) || 50);
    const start = (pageNum - 1) * pageSize;
    const pageItems = filtered.slice(start, start + pageSize);

    res.json({
      success: true,
      candidates: pageItems,
      pagination: {
        page: pageNum,
        limit: pageSize,
        total: filtered.length,
        pages: Math.ceil(filtered.length / pageSize) || 1,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

router.post('/send-invitations', async (req, res) => {
  try {
    const { candidateIds, customMessage } = req.body as {
      candidateIds?: string[];
      customMessage?: string;
    };

    const candidates = await readCandidates();

    const now = new Date().toISOString();
    let sentCount = 0;

    const updated = candidates.map(candidate => {
      const shouldSend = candidateIds && candidateIds.length > 0
        ? candidateIds.includes(candidate.id)
        : !candidate.invitationSent;

      if (!shouldSend) {
        return candidate;
      }

      // Simulate invitation sending.
      console.log('📨 Sending invitation to %s (%s)', candidate.name, candidate.phone);
      if (customMessage) {
        console.log('   Custom message:', customMessage);
      }

      sentCount += 1;
      return {
        ...candidate,
        invitationSent: true,
        invitationSentAt: now,
      };
    });

    await writeCandidates(updated);

    res.json({
      success: true,
      sent: sentCount,
      message: `Invitations sent to ${sentCount} candidate(s)`,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

router.put('/:id/status', async (req, res) => {
  try {
    const { status, notes } = req.body as { status?: StoredCandidate['status']; notes?: string };
    const { id } = req.params;

    if (!status) {
      return res.status(400).json({ success: false, error: 'status is required' });
    }

    const candidates = await readCandidates();
    const index = candidates.findIndex(candidate => candidate.id === id);

    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Candidate not found' });
    }

    const updatedCandidate: StoredCandidate = {
      ...candidates[index],
      status,
      notes: notes ?? candidates[index].notes,
      responded: status === 'interested' ? true : candidates[index].responded,
      respondedAt: status === 'interested' ? new Date().toISOString() : candidates[index].respondedAt,
    };

    candidates[index] = updatedCandidate;
    await writeCandidates(candidates);

    res.json({ success: true, candidate: updatedCandidate });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const candidates = await readCandidates();
    const filtered = candidates.filter(candidate => candidate.id !== id);

    if (filtered.length === candidates.length) {
      return res.status(404).json({ success: false, error: 'Candidate not found' });
    }

    await writeCandidates(filtered);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

router.get('/stats', async (_req, res) => {
  try {
    const candidates = await readCandidates();
    const total = candidates.length;
    const invited = candidates.filter(candidate => candidate.invitationSent).length;
    const responded = candidates.filter(candidate => candidate.responded).length;

    const byProvince = candidates.reduce<Record<string, number>>((acc, candidate) => {
      const key = candidate.province || 'غير محدد';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const byStatus = candidates.reduce<Record<string, number>>((acc, candidate) => {
      acc[candidate.status] = (acc[candidate.status] || 0) + 1;
      return acc;
    }, {});

    res.json({
      success: true,
      stats: {
        total,
        invited,
        responded,
        responseRate: total > 0 ? Number(((responded / total) * 100).toFixed(1)) : 0,
        byProvince,
        byStatus,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

export default router;
