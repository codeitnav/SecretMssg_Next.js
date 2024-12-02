import { Message } from "@/model/User";

// most of the times when a type is defined, we use "interface" 
export interface ApiResponse{
    success: boolean;
    message: string;
    isAcceptingMessages?: boolean;
    messages?: Array<Message>
}
// isAcceptingMessages is optional as we dont need it in funcs like signup