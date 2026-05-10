import { error } from "@/lib/response";

export async function POST() {
  try {
    return await Promise.resolve({})
  } catch (err) {
    return error(err);
  }
}