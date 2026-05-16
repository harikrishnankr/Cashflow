import { prisma } from "@/lib/prisma";

export const authRepository = {
  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        passwordHash: true,
        avatarUrl: true,
        currency: true,
        timezone: true,
        hasOnBoarded: true,
        updatedAt: true,
        createdAt: true,
      },
    });
  },

  async createUser(data: {
    email: string;
    name: string;
    passwordHash: string;
  }) {
    return prisma.user.create({
      data,
      select: {
        id: true,
        email: true,
        name: true,
        avatarUrl: true,
        createdAt: true,
      },
    });
  },

  async emailExists(email: string): Promise<boolean> {
    const count = await prisma.user.count({ where: { email } });
    return count > 0;
  },

  async findUserById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        avatarUrl: true,
        createdAt: true,
      },
    });
  },

  async createRefreshToken(data: {
    userId: string;
    tokenHash: string;
    rememberMe: boolean;
    expiresAt: Date;
    userAgent?: string;
    ipAddress?: string;
  }) {
    return prisma.refreshToken.create({ data });
  },

  async findRefreshToken(tokenHash: string) {
    return prisma.refreshToken.findUnique({
      where: { tokenHash },
      select: {
        id: true,
        userId: true,
        rememberMe: true,
        expiresAt: true,
        revokedAt: true,
      },
    });
  },

  async revokeRefreshToken(tokenHash: string) {
    return prisma.refreshToken.update({
      where: { tokenHash },
      data: { revokedAt: new Date() },
    });
  },

  // Rotate: revoke old token and create a new one atomically.
  async rotateRefreshToken(
    oldTokenHash: string,
    newToken: {
      userId: string;
      tokenHash: string;
      rememberMe: boolean;
      expiresAt: Date;
      userAgent?: string;
      ipAddress?: string;
    },
  ) {
    return prisma.$transaction([
      prisma.refreshToken.update({
        where: { tokenHash: oldTokenHash },
        data: { revokedAt: new Date() },
      }),
      prisma.refreshToken.create({ data: newToken }),
    ]);
  },

  // Called by a cleanup job — delete all expired or revoked tokens for a user.
  async deleteExpiredTokens(userId: string) {
    return prisma.refreshToken.deleteMany({
      where: {
        userId,
        OR: [{ expiresAt: { lt: new Date() } }, { revokedAt: { not: null } }],
      },
    });
  },
};
