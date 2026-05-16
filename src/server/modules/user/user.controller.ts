import type { NextRequest } from "next/server";
import { userService } from "./user.service";
import { parseAndValidate } from "@/server/utils/validator.utils";
import { onboardingSchema } from "@/schema/user/onboarding.schema";
import type { UserProfile } from "@/schema/user";

class UserController {
  async getUser(_req: NextRequest, userId: string): Promise<UserProfile> {
    return userService.getMe(userId);
  }

  async setOnBoarding(req: NextRequest, userId: string): Promise<UserProfile> {
    const data = await parseAndValidate(req, onboardingSchema);
    return userService.completeOnboarding(userId, {
      currency: data.currency,
      timezone: data.timezone,
      recurringIncomes: data.recurringIncomes,
    });
  }
}

export const userController = new UserController();
