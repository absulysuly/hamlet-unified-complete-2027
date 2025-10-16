import { Router, type Request, type Response } from 'express';
import type { UserRole } from 'shared-schema/types';
import { loginWithRole } from '../services/authService';

export const authRouter = Router();

authRouter.post('/login', (req: Request, res: Response) => {
    const { role }: { role?: UserRole } = req.body ?? {};
    if (!role) {
        return res.status(400).json({ error: 'role is required' });
    }

    loginWithRole(role)
        .then(result => {
            if (!result) {
                return res.status(404).json({ error: 'User not found for provided role' });
            }
            return res.json(result);
        })
        .catch(error => {
            console.error('[auth/login] failed', error);
            res.status(500).json({ error: 'Internal server error' });
        });
});
