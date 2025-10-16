import type { UserRole } from 'shared-schema/types';
import { prisma } from '../lib/prisma';
import { toSharedUser } from './mappers';

export const loginWithRole = async (role: UserRole) => {
  const user = await prisma.user.findFirst({
    where: { role },
    include: {
      governorate: true,
    },
  });

  if (!user) {
    return null;
  }

  const sharedUser = toSharedUser(user);
  const token = `mock-token-${sharedUser.id}`; // TODO: replace with real token issuance

  return { user: sharedUser, token };
};
