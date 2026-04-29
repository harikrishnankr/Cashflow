import { defineConfig } from "prisma/config";
import "dotenv/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    // DIRECT_URL bypasses PgBouncer — required for Prisma Migrate
    url: process.env.DIRECT_URL!,
  },
});
