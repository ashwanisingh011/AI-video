/* eslint-disable @typescript-eslint/no-unused-vars */
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { IVideo } from "@/models/Video";
import { Video } from "@imagekit/next";

import { getServerSession } from "next-auth";
import { Hedvig_Letters_Sans } from "next/font/google";
import { NextRequest, NextResponse } from "next/server";

export async function GET(){
     try {
        await connectToDatabase();
        const videos = await Video.find({}).sort({createdAt: -1}).lean()
        if(!videos || videos.lenght === 0){
            return NextResponse.json([], {status: 200})
        }
        return NextResponse.json(videos)
     } catch (error) {
        return NextResponse.json(
            {error: "Failed to fetch videos"},
            {status: 500}
        )
     }
}

export async function POST(request: NextRequest){
    try {
        const session = await getServerSession(authOptions)
        if(!session){
            return NextResponse.json(
                {error: "Unauthorized"},
                {status: 401}
            )
        }
        await connectToDatabase()
       const body : IVideo =  await request.json()
       if(!body.title || !body.description || !body.videoUrl|| !body.thumbnailUrl){
        return NextRequest.json(
            {error: "Missing required fields"},
            {status: 400}
        );
       }
       const videoData = {
        ...body,
        controls: body?.controls ?? true,
        transformation: {
            height: 1920,
            widht: 1080,
            quality: body.transformation?.quality ?? 100
        }
       };

       const newVideo = await Video.create(videoData)

       return NextResponse.json(newVideo)
    } catch (error) {
        return NextResponse.json(
            {error: "Failed to create video"},
            {status: 500}
        )
    }
}