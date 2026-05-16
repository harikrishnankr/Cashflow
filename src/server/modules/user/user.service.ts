import { userRepository } from "./user.repository";
import { UserNotFoundError } from "./user.errors";
import type { User, UserProfile, CreateUserDto, UpdateUserDto, OnboardingDto } from "@/schema/user";
import type { User as PrismaUser } from "@prisma/client";

function toProfile(user: PrismaUser): UserProfile {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    avatarUrl: user.avatarUrl ?? undefined,
    currency: user.currency,
    timezone: user.timezone,
    hasOnBoarded: user.hasOnBoarded,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}

export const userService = {
  async list(options?: { page?: number; pageSize?: number }) {
    return userRepository.findAll(options);
  },

  async getMe(id: string): Promise<UserProfile> {
    const user = await userRepository.findById(id);
    if (!user) throw new UserNotFoundError(id);
    return toProfile(user);
  },

  async getById(id: string): Promise<User> {
    const user = await userRepository.findById(id);
    if (!user) throw new UserNotFoundError(id);
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatarUrl ?? undefined,
      role: "member",
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  },

  async create(data: CreateUserDto): Promise<User> {
    const user = await userRepository.create(data);
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatarUrl ?? undefined,
      role: data.role ?? "member",
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  },

  async update(id: string, data: UpdateUserDto): Promise<User> {
    const existing = await userRepository.findById(id);
    if (!existing) throw new UserNotFoundError(id);

    const user = await userRepository.update(id, data);
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatarUrl ?? undefined,
      role: "member",
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  },

  async completeOnboarding(id: string, data: OnboardingDto): Promise<UserProfile> {
    const existing = await userRepository.findById(id);
    if (!existing) throw new UserNotFoundError(id);
    const user = await userRepository.completeOnboarding(id, data);
    return toProfile(user);
  },

  async delete(id: string): Promise<void> {
    const existing = await userRepository.findById(id);
    if (!existing) throw new UserNotFoundError(id);
    await userRepository.delete(id);
  },
};
