import { z } from "zod";



const signIN = z.object({
   identifier: z.string().email({ message: "Invalid email address" }),
   password: z.string()
});

export default signIN;