import { prisma } from "@/lib/prisma";
import type { CreateUserDto, UpdateUserDto } from "@/types/user.types";

export const userRepository = {
  async findAll(options?: { page?: number; pageSize?: number }) {
    const page = options?.page ?? 1;
    const pageSize = options?.pageSize ?? 20;
    const skip = (page - 1) * pageSize;

    const [items, total] = await Promise.all([
      prisma.user.findMany({ skip, take: pageSize, orderBy: { createdAt: "desc" } }),
      prisma.user.count(),
    ]);

    return { items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  },

  async findById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  },

  async create(data: CreateUserDto) {
    return prisma.user.create({ data: { email: data.email, name: data.name, passwordHash: data.password } });
  },

  async update(id: string, data: UpdateUserDto) {
    return prisma.user.update({ where: { id }, data });
  },

  async delete(id: string) {
    return prisma.user.delete({ where: { id } });
  },
};
