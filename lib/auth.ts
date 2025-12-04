import bcrypt from "bcryptjs";
import { NextAuthOptions }  from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"
import { connectToDatabase } from "./db";
export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: {label: "Email", type: "text"},
                password: {label: "Password", type: "password"}
            },
            async authorize(credentials){
                if(!credentials?.email || !credentials?.password){
                    throw new Error("Missing email or password")
                }
                try{
                    await connectToDatabase()
                    const user = await User.findOne({email: credentials.email})
                    if(!user){
                        throw new Error("No user found with this");
                    }
                    const isValid = await bcrypt.compare(
                        credentials.password,
                        user.password
                    )
                    if(!isValid){
                        throw new Error("Invalid password");
                    }
                    return {
                        id: user._id.toString(),
                        email: user.email
                    }
                } catch(error){
                    console.log("Auth error: ", error)
                    throw error
                }
            }
        })
  ],
}

function CredentialsProvider(arg0: { name: string; credentials: { email: { label: string; type: string; }; password: { label: string; type: string; }; }; authorize(credentials: any): Promise<{ id: any; email: any; }>; }): import("next-auth/providers/index").Provider {
    throw new Error("Function not implemented.");
}
