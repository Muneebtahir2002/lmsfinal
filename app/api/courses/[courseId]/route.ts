import { NextResponse } from "next/server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function DELETE(
    req: Request,
    { params }: { params: { courseId: string; } }
  ) {
    try {
      const { userId } = auth();
  
      if (!userId) {
        return new NextResponse("Unauthorized", { status: 401 });
      }
  
      const course = await db.course.findUnique({
        where: {
          id: params.courseId,
          userId: userId,
        },
        include: {
          chapters: true,
        }
      });
  
      if (!course) {
        return new NextResponse("Not Found", { status: 404 });
      }
  
      const deletedCourse = await db.course.delete({
        where: {
          id: params.courseId,
        },
      });
  
      return NextResponse.json(deletedCourse);
    } catch (error) {
      console.log("[COURSE_DELETE_ERROR]", error);
      return new NextResponse("Internal Error", { status: 500 });
    }
  }
  
export async function PATCH (
    req: Request,
    {params}:{params:{courseId:string}}
){
    try {
        const {userId} =auth();
        const courseId = params;
        const values =await req.json();

        if(!userId){
            return new NextResponse("Unauthorized", {status: 401 });

        }
        const course = await db.course.update({
            where:{
                id:params.courseId,
                userId,
            },
            data:{
                ...values
            }
        })
        return NextResponse.json(course);
    } catch (error) {
        console.log("[COURSE_ID]", error)
        return new NextResponse("Internal Error",{status: 500 });
    }
}