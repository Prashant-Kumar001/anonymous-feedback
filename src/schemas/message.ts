import { z } from "zod";

const messageC = z.object({
  content: z.string().min(5, { message: "Message must be at least 5 character long" }).max(500, { message: "Message must be less than 500- characters long" }),
});

export default messageC;
