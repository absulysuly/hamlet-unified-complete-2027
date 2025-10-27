import express, { type Request, type Response } from 'express';
import cors from 'cors';

import { config } from '../src/config';
import { socialRouter } from '../src/routes/social';
import { civicRouter } from '../src/routes/civic';
import { authRouter } from '../src/routes/auth';
import candidatePortalRouter from '../src/routes/candidatePortal';

const app = express();

app.use(cors({
    origin: config.allowedOrigins,
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRouter);
app.use('/api/social', socialRouter);
app.use('/api/civic', civicRouter);
app.use('/api/portal/candidates', candidatePortalRouter);

app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok' });
});

// Export for Vercel serverless
export default app;
