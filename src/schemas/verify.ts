import { z } from "zod";

const VerifyC = z.object({
    VCode: z.string().length(6, { message: "VCode must be 6 characters long" }),
    username: z.string().min(3, "Username must be at least 3 characters").max(20, "Username must be less than 20 characters"),
});

export default VerifyC;