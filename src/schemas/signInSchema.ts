import { z } from "zod";

export const signInSchema = z.object({
    identifier: z.string(),
    pasword: z.string(),
})

/* identifier/email/username - name the variable as you want */