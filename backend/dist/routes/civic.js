"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.civicRouter = void 0;
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const mockData_1 = require("../mockData");
const upload = (0, multer_1.default)();
const router = (0, express_1.Router)();
router.get('/stats/dashboard', (_req, res) => {
    res.json(mockData_1.dashboardStats);
});
router.get('/stats/participation', (_req, res) => {
    res.json(mockData_1.governorateParticipation);
});
router.get('/governorates/:slug', (req, res) => {
    const { slug } = req.params;
    const normalized = (0, mockData_1.slugify)(slug ?? '');
    const data = mockData_1.governorateData.get(normalized);
    if (!data) {
        return res.status(404).json({ error: 'Governorate not found' });
    }
    res.json(data);
});
router.get('/parties/:id', (req, res) => {
    const { id } = req.params;
    const data = mockData_1.partyData[id];
    if (!data) {
        return res.status(404).json({ error: 'Party not found' });
    }
    res.json(data);
});
router.post('/reports/integrity', upload.single('evidence'), (req, res) => {
    const { governorate, violationType, description } = req.body ?? {};
    if (!governorate || !violationType || !description) {
        return res.status(400).json({ error: 'governorate, violationType, and description are required' });
    }
    // Placeholder implementation – replace with persistence and notification logic.
    res.status(201).json({ success: true, trackingId: `IQ-2025-${Math.random().toString(36).slice(2, 9).toUpperCase()}` });
});
exports.civicRouter = router;
