import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string, {/* verifyCode is the otp */}
) : Promise<ApiResponse> {
    try {

        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'SecretMssg | Verification Code',
            react: VerificationEmail({username, otp: verifyCode}),
          });

        return {success: false, message: "Verification email sent successfully"}
        
    } catch (emailError) {
        console.log("Error sending verification email", emailError)
        
        return {success: false, message: "Failed to send verification email"}
        {/* since there's a promise, so a return is mandatory */}
    }
}