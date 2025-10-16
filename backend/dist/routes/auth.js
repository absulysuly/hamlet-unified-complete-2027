"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const authService_1 = require("../services/authService");
exports.authRouter = (0, express_1.Router)();
exports.authRouter.post('/login', (req, res) => {
    const { role } = req.body ?? {};
    if (!role) {
        return res.status(400).json({ error: 'role is required' });
    }
    (0, authService_1.loginWithRole)(role)
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
