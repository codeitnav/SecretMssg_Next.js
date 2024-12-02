// database connection is mandatory for all routes as nextjs works on edge
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs"

import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request){
    await dbConnect()

    try {

        const {username, email, password} = await request.json()

        const existingUserVerifiedByUsername = await UserModel.findOne({username, isVerified: true})

        // returning false if username is already taken
        if(existingUserVerifiedByUsername){
            return Response.json({
                success: false,
                message: "Username is already taken"
            }, {status: 400})
        }

        const existingUserByEmail = await UserModel.findOne({email});
        let verifyCode = Math.floor(10000 + Math.random() * 900000).toString();

        // "if" condition false - user is registering for the 1st time
        if(existingUserByEmail){
            if(existingUserByEmail.isVerified){
                return Response.json(
                    {
                      success: false,
                      message: "User already exist with this email",
                    },
                    { status: 400 }
                  );
            } else{
                const hashedPassword = await bcrypt.hash(password, 10); // 10 is the number of salt rounds. bcrypt will perform 2^10=1024 iterations of hashing.
                // salt is a random string added to password before hashing for extra security and prevent same hashing for same passwords
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
                await existingUserByEmail.save();
            }
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            // able to modify expiryDate bec of "new" keyword
            expiryDate.setHours(expiryDate.getHours() + 1) // setting expiry date to 1hour

            const verifyCode = Math.floor(100000+Math.random()*900000).toString()

            // setting default values for user model
            const newUser = new UserModel({
              username,
              email,
              password: hashedPassword,
              verifyCode,
              verifyCodeExpiry: expiryDate,
              isVerified: false,
              isAcceptingMessages: true,
              messages: [],
            })

            await newUser.save()
        }

            // send verification email
            const emailResponse = await sendVerificationEmail(
                email,
                username,
                verifyCode
            )

            if (!emailResponse.success) {
                return Response.json(
                  {
                    success: false,
                    message: emailResponse.message,
                  },
                  { status: 500 }
                );
              }
          
              return Response.json(
                {
                  success: true,
                  message: 'User registered successfully. Please verify your account.',
                },
                { status: 201 }
              );
        
        
    } catch (error) {
       console.error("Error registering user", error); {/* displayed on terminal, and the return mssg will be on frontend */}
       return Response.json({
        success: false,
        message: "Error registering user", 
       },
       {
        status: 500
       }
    ) 
    }
}