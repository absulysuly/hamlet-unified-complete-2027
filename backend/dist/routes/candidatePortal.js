"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const crypto_1 = __importDefault(require("crypto"));
const router = (0, express_1.Router)();
const DATA_FILE = path_1.default.resolve(process.cwd(), 'data', 'candidates.json');
async function readCandidates() {
    try {
        const raw = await fs_1.promises.readFile(DATA_FILE, 'utf8');
        return JSON.parse(raw);
    }
    catch (error) {
        if (error.code === 'ENOENT') {
            return [];
        }
        throw error;
    }
}
async function writeCandidates(candidates) {
    await fs_1.promises.mkdir(path_1.default.dirname(DATA_FILE), { recursive: true });
    await fs_1.promises.writeFile(DATA_FILE, JSON.stringify(candidates, null, 2), 'utf8');
}
function normaliseCandidate(payload) {
    if (!payload.name || !payload.phone || !payload.province) {
        throw new Error('Missing required candidate fields (name, phone, province)');
    }
    return {
        id: crypto_1.default.randomUUID(),
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
        const candidate = normaliseCandidate(req.body);
        const candidates = await readCandidates();
        candidates.unshift(candidate);
        await writeCandidates(candidates);
        res.json({ success: true, candidate });
    }
    catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});
router.post('/bulk', async (req, res) => {
    try {
        const rows = req.body?.candidates;
        if (!rows || !Array.isArray(rows)) {
            return res.status(400).json({ success: false, error: 'candidates array is required' });
        }
        const candidates = await readCandidates();
        const newRecords = rows.map(normaliseCandidate);
        const combined = [...newRecords, ...candidates];
        await writeCandidates(combined);
        res.json({ success: true, imported: newRecords.length });
    }
    catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});
router.get('/', async (req, res) => {
    try {
        const { province, status, invitationSent, page = '1', limit = '50', } = req.query;
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
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
router.post('/send-invitations', async (req, res) => {
    try {
        const { candidateIds, customMessage } = req.body;
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
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
router.put('/:id/status', async (req, res) => {
    try {
        const { status, notes } = req.body;
        const { id } = req.params;
        if (!status) {
            return res.status(400).json({ success: false, error: 'status is required' });
        }
        const candidates = await readCandidates();
        const index = candidates.findIndex(candidate => candidate.id === id);
        if (index === -1) {
            return res.status(404).json({ success: false, error: 'Candidate not found' });
        }
        const updatedCandidate = {
            ...candidates[index],
            status,
            notes: notes ?? candidates[index].notes,
            responded: status === 'interested' ? true : candidates[index].responded,
            respondedAt: status === 'interested' ? new Date().toISOString() : candidates[index].respondedAt,
        };
        candidates[index] = updatedCandidate;
        await writeCandidates(candidates);
        res.json({ success: true, candidate: updatedCandidate });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
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
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
router.get('/stats', async (_req, res) => {
    try {
        const candidates = await readCandidates();
        const total = candidates.length;
        const invited = candidates.filter(candidate => candidate.invitationSent).length;
        const responded = candidates.filter(candidate => candidate.responded).length;
        const byProvince = candidates.reduce((acc, candidate) => {
            const key = candidate.province || 'غير محدد';
            acc[key] = (acc[key] || 0) + 1;
            return acc;
        }, {});
        const byStatus = candidates.reduce((acc, candidate) => {
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
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
exports.default = router;
