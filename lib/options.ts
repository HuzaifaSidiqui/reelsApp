import  CredentialsProvider  from './../node_modules/next-auth/src/providers/credentials';
import { NextAuthOptions } from "next-auth";
import { connectToDatabase } from './db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: {label: 'Email', type: "text"},
                password: {label: "Password", type: "password"}
            },
            async authorize(credentials){
                if(!credentials?.email || !credentials?.password){
                    throw new Error("Missing email or password")
                }
                try {
                    await connectToDatabase()
                    const user = await User.findOne({email: credentials.email})
                    if(!user){
                        throw new Error("No user found");
                    }

                    const isValid = await bcrypt.compare(
                        credentials.password,
                        user.password
                    )

                    if(!isValid){
                        throw new Error("Password is invalid");
                        
                    }

                    return {
                        id: user._id.toString(),
                        email: user.email
                    }

                } catch (error) {
                    throw new Error("Internal server error");
                    
                }
            }
        })
    ],
    callbacks: {
        async jwt({token, user}){
            if(user){
                token.id = user.id
            }
            return token
        },
        async session({session, token}){
            if(session.user){
                session.user.id = token.id as string
            }
            return session
        }
    },
    pages:{
        signIn: "/login",
        error: "/login"
    },
    session:{
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60
    },
    secret : process.env.AUTH_SECRET
}

export default authOptions