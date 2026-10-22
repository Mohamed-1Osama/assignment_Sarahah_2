import { z } from "zod";

export const signUpSchema = z.strictObject({
    firstName: z.string().min(3).max(30),

    lastName: z.string().min(3).max(30),

    email: z.email(),

    password: z.string()
        .min(8)
        .max(16)
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),

    confirmPassword: z.string(),

    age: z.number().min(18),

    gender: z.enum(["male", "female"]),

    phoneNumber: z.string().optional()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
});


/** regex => /pattern/ - value
 * [] => single placement
 * {} => repititions
 * () => exact word |
 * 
 *  ==> /^pattern$/
 * 
 *  ? => zero or one
 *  + => one or more
 *  * => zero or more
 *  . => MATCH ANY CHARACTER
 *  \d => MATCH ANY DIGIT 
 *  \s => MATCH SPACE
 *  \w => MATCH ANY DIGIT OR ANY NUMBER OR _
 * 
 *  \D \S \W => THE OPPOSITE OF THE ABOVE
 * 
 *  what if i need the symbol itself => preceed by \
 * 
 * LOOKAHEAD => (?= condition)
 */
