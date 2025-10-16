"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginWithRole = void 0;
const prisma_1 = require("../lib/prisma");
const mappers_1 = require("./mappers");
const loginWithRole = async (role) => {
    const user = await prisma_1.prisma.user.findFirst({
        where: { role },
        include: {
            governorate: true,
        },
    });
    if (!user) {
        return null;
    }
    const sharedUser = (0, mappers_1.toSharedUser)(user);
    const token = `mock-token-${sharedUser.id}`; // TODO: replace with real token issuance
    return { user: sharedUser, token };
};
exports.loginWithRole = loginWithRole;
