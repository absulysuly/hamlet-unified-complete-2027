"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fs_1 = require("node:fs");
const node_path_1 = __importDefault(require("node:path"));
class CandidateService {
    facebookService;
    verificationService;
    candidates = [];
    constructor(facebookService, verificationService) {
        this.facebookService = facebookService;
        this.verificationService = verificationService;
    }
    getCandidates() {
        return this.candidates;
    }
    async loadCandidatesFromCSV(filePath) {
        const resolvedPath = node_path_1.default.isAbsolute(filePath)
            ? filePath
            : node_path_1.default.resolve(process.cwd(), filePath);
        const exists = await node_fs_1.promises
            .access(resolvedPath)
            .then(() => true)
            .catch(() => false);
        if (!exists) {
            throw new Error(`Candidate CSV not found at path: ${resolvedPath}`);
        }
        const raw = await node_fs_1.promises.readFile(resolvedPath, 'utf8');
        const lines = raw
            .split(/\r?\n/)
            .map(line => line.trim())
            .filter(line => line.length > 0);
        if (lines.length <= 1) {
            this.candidates = [];
            return;
        }
        const headers = lines[0]
            .split(',')
            .map(header => header.trim().toLowerCase());
        const records = [];
        for (let i = 1; i < lines.length; i += 1) {
            const cells = lines[i].split(',');
            if (cells.length === 0 || cells[0].startsWith('#')) {
                continue;
            }
            const record = {};
            headers.forEach((header, index) => {
                record[header] = (cells[index] ?? '').trim();
            });
            const id = record['id'] ||
                record['candidateid'] ||
                record['candidate_id'] ||
                `${i}`;
            const name = record['name'] ||
                record['candidate'] ||
                record['fullname'];
            if (!name) {
                continue;
            }
            const candidate = {
                id,
                name,
                district: record['district'] || record['constituency'] || '',
                province: record['province'] || record['governorate'] || '',
                party: record['party'] || record['partyname'] || record['political_party'],
                facebookUrl: record['facebook_url'] ||
                    record['facebook'] ||
                    record['facebookpage'] ||
                    record['facebooklink'],
                facebookPageId: undefined,
                lastScraped: undefined,
                credibilityScore: 0,
                posts: [],
            };
            records.push(candidate);
        }
        this.candidates = records;
    }
    async validateFacebookPages() {
        for (const candidate of this.candidates) {
            if (!candidate.facebookUrl) {
                candidate.facebookPageId = undefined;
                candidate.credibilityScore = 0;
                candidate.verificationDetails = undefined;
                continue;
            }
            try {
                const pageIdentifier = this.extractPageId(candidate.facebookUrl);
                const pageInfo = await this.facebookService.getPageInfo(pageIdentifier);
                candidate.facebookPageId = pageInfo.id ?? pageIdentifier;
                candidate.verificationDetails = await this.verificationService.verifyCandidatePage(candidate, pageInfo);
                candidate.credibilityScore = candidate.verificationDetails.confidence;
            }
            catch (error) {
                candidate.facebookPageId = undefined;
                candidate.credibilityScore = 0;
                candidate.verificationDetails = undefined;
                console.warn(`Failed to validate Facebook page for ${candidate.name}: ${candidate.facebookUrl}`);
            }
        }
    }
    extractPageId(url) {
        const trimmed = url.trim();
        const match = trimmed.match(/(?:facebook\.com|fb\.com)\/([^\/?#]+)/i);
        if (match && match[1]) {
            return match[1].replace(/^(pages\/)?/, '');
        }
        throw new Error('Invalid Facebook URL');
    }
}
exports.default = CandidateService;
