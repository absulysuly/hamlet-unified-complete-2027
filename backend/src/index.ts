import express, { type Request, type Response } from 'express';
import cors from 'cors';

import { config } from './config';
import { socialRouter } from './routes/social';
import { civicRouter } from './routes/civic';
import { authRouter } from './routes/auth';
import candidatePortalRouter from './routes/candidatePortal';
import { governorateData, governorateParticipation } from './mockData';
import { GOVERNORATES } from 'shared-schema/types';

const app = express();

app.use(cors({
    origin: config.allowedOrigins,
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/auth', authRouter);
app.use('/social', socialRouter);
app.use('/civic', civicRouter);
app.use('/portal/candidates', candidatePortalRouter);

app.get('/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok' });
});

// API endpoints for frontend
app.get('/api/candidates', (_req: Request, res: Response) => {
    // Collect all candidates from all governorates
    const allCandidates: any[] = [];
    governorateData.forEach(data => {
        if (data.candidates) {
            allCandidates.push(...data.candidates);
        }
    });
    // Remove duplicates by id
    const uniqueCandidates = Array.from(
        new Map(allCandidates.map(c => [c.id, c])).values()
    );
    res.json(uniqueCandidates);
});

app.get('/api/governorates', (_req: Request, res: Response) => {
    res.json(GOVERNORATES);
});

app.listen(config.port, () => {
    console.log(`Hamlet backend listening on port ${config.port}`);
});
