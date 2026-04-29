import { prisma } from "@/lib/prisma";

export const authRepository = {
  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, name: true, passwordHash: true, avatarUrl: true, createdAt: true },
    });
  },

  async createUser(data: { email: string; name: string; passwordHash: string }) {
    return prisma.user.create({
      data,
      select: { id: true, email: true, name: true, avatarUrl: true, createdAt: true },
    });
  },

  async emailExists(email: string): Promise<boolean> {
    const count = await prisma.user.count({ where: { email } });
    return count > 0;
  },
};
