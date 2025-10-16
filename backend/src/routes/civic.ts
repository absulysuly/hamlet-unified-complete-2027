import { Router, type Request, type Response } from 'express';
import multer from 'multer';

import { dashboardStats, governorateParticipation, governorateData, partyData, slugify } from '../mockData';

const upload = multer();
const router = Router();

router.get('/stats/dashboard', (_req: Request, res: Response) => {
    res.json(dashboardStats);
});

router.get('/stats/participation', (_req: Request, res: Response) => {
    res.json(governorateParticipation);
});

router.get('/governorates/:slug', (req: Request, res: Response) => {
    const { slug } = req.params;
    const normalized = slugify(slug ?? '');
    const data = governorateData.get(normalized);

    if (!data) {
        return res.status(404).json({ error: 'Governorate not found' });
    }

    res.json(data);
});

router.get('/parties/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const data = partyData[id];

    if (!data) {
        return res.status(404).json({ error: 'Party not found' });
    }

    res.json(data);
});

router.post('/reports/integrity', upload.single('evidence'), (req: Request, res: Response) => {
    const { governorate, violationType, description } = req.body ?? {};

    if (!governorate || !violationType || !description) {
        return res.status(400).json({ error: 'governorate, violationType, and description are required' });
    }

    // Placeholder implementation – replace with persistence and notification logic.
    res.status(201).json({ success: true, trackingId: `IQ-2025-${Math.random().toString(36).slice(2, 9).toUpperCase()}` });
});

export const civicRouter = router;
