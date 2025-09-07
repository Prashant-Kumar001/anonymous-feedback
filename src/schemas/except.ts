import { z } from "zod";

const ISmessage = z.object({
    isExcepting: z.boolean()
});

export default ISmessage;
