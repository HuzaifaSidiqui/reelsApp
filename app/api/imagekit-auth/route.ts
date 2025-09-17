// File: app/api/upload-auth/route.ts
import { getUploadAuthParams } from "@imagekit/next/server"
import { NextResponse } from "next/server"

export async function GET() {

    const { token, expire, signature } = getUploadAuthParams({
        privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string, 
        publicKey: process.env.NEXT_PUBLIC_KEY as string,
        // expire: 30 * 60, 
        // token: "random-token", 
    })

    try {
        
        return Response.json({ token, expire, signature, publicKey: process.env.NEXT_PUBLIC_KEY})
    } catch (error) {
        return NextResponse.json(
            {error: "Imagekit auth failed"},
            {status: 500}
        )
    }
}