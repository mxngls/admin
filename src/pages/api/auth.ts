import { supabase } from "../../lib/client";

export default async function handler(req: Request, res: Response) {
  await supabase.auth.api.setAuthCookie(req, res);
}
