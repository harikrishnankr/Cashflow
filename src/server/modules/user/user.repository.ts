import { prisma } from "@/lib/prisma";
import type { CreateUserDto, OnboardingDto, UpdateUserDto } from "@/schema/user";

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

  async completeOnboarding(id: string, data: OnboardingDto) {
    return prisma.$transaction(async (tx) => {
      const user = await tx.user.update({
        where: { id },
        data: {
          currency: data.currency,
          ...(data.timezone && { timezone: data.timezone }),
          hasOnBoarded: true,
        },
      });

      await tx.recurringIncome.createMany({
        data: data.recurringIncomes.map((income) => ({
          userId: id,
          amount: income.amount,
          source: income.source,
          description: income.description,
          notes: income.notes,
          frequency: income.frequency,
          startDate: new Date(income.startDate),
          nextDueDate: new Date(income.startDate),
          reminderDaysBefore: income.reminderDaysBefore ?? 3,
        })),
      });

      return user;
    });
  },

  async delete(id: string) {
    return prisma.user.delete({ where: { id } });
  },
};
