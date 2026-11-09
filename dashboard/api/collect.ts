import { collect } from "./_collector";

export const config = { runtime: "edge" };

export default function handler(request: Request): Promise<Response> {
  return collect(request, "events");
}
