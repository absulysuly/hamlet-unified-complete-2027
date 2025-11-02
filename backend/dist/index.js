"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const config_1 = require("./config");
const social_1 = require("./routes/social");
const civic_1 = require("./routes/civic");
const auth_1 = require("./routes/auth");
const candidatePortal_1 = __importDefault(require("./routes/candidatePortal"));
const mockData_1 = require("./mockData");
const types_1 = require("shared-schema/types");
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: config_1.config.allowedOrigins,
    credentials: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/auth', auth_1.authRouter);
app.use('/social', social_1.socialRouter);
app.use('/civic', civic_1.civicRouter);
app.use('/portal/candidates', candidatePortal_1.default);
app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
});
// API endpoints for frontend
app.get('/api/candidates', (_req, res) => {
    // Collect all candidates from all governorates
    const allCandidates = [];
    mockData_1.governorateData.forEach(data => {
        if (data.candidates) {
            allCandidates.push(...data.candidates);
        }
    });
    // Remove duplicates by id
    const uniqueCandidates = Array.from(new Map(allCandidates.map(c => [c.id, c])).values());
    res.json(uniqueCandidates);
});
app.get('/api/governorates', (_req, res) => {
    res.json(types_1.GOVERNORATES);
});
app.listen(config_1.config.port, () => {
    console.log(`Hamlet backend listening on port ${config_1.config.port}`);
});
