import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function DELETE (
    req: Request,
    {params}: {params:{courseId:string,attachmentId:string}}
){
    try {
        const { userId } = auth()
        if(!userId) {
            return new NextResponse("Unauthorized",{status:401})
        }

        const courseOwnner = await db.course.findUnique({
            where:{
                id:params.courseId,
                userId: userId
            }
        })
        if(!courseOwnner){
            return new NextResponse("unauthorized", { status:401 })
        }

        const attachment = await db.attachment.delete({
            where:{
                courseId:params.courseId,
                id: params.attachmentId,
            }
        })
        return NextResponse.json(attachment);
        } catch (error) {
        console.log("Attachment_ID",error)
        return new NextResponse("Internal Error", {status:500});
    }
}