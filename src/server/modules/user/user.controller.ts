import type { NextRequest } from "next/server";
import { userService } from "./user.service";
import { parseAndValidate } from "@/server/utils/validator.utils";
import { onboardingSchema } from "@/schema/user/user-form.schema";
import type { UserProfile } from "@/schema/user";

class UserController {
  async getUser(_req: NextRequest, userId: string): Promise<UserProfile> {
    return userService.getMe(userId);
  }

  async setOnBoarding(req: NextRequest, userId: string): Promise<UserProfile> {
    const data = await parseAndValidate(req, onboardingSchema);
    return userService.completeOnboarding(userId, {
      currency: data.currency,
      incomeSource: data.incomeSource,
      timezone: data.timezone,
    });
  }
}

export const userController = new UserController();
