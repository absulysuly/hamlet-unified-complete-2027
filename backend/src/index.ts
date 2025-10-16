import express, { type Request, type Response } from 'express';
import cors from 'cors';

import { config } from './config';
import { socialRouter } from './routes/social';
import { civicRouter } from './routes/civic';
import { authRouter } from './routes/auth';
import candidatePortalRouter from './routes/candidatePortal';

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

app.listen(config.port, () => {
    console.log(`Hamlet backend listening on port ${config.port}`);
});
