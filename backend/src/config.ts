import dotenv from 'dotenv';

dotenv.config();

const parsePort = (value: string | undefined, fallback: number): number => {
    if (!value) return fallback;
    const parsed = Number.parseInt(value, 10);
    return Number.isNaN(parsed) ? fallback : parsed;
};

const parseAllowedOrigins = (value: string | undefined): string[] => {
    if (!value) {
        return ['http://localhost:5173', 'http://localhost:4173'];
    }
    return value.split(',').map(origin => origin.trim()).filter(Boolean);
};

export const config = {
    port: parsePort(process.env.PORT, 4000),
    allowedOrigins: parseAllowedOrigins(process.env.ALLOWED_ORIGINS),
    logLevel: process.env.LOG_LEVEL ?? 'info',
};
