import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function DELETE (
  req: Request,
  { params } :{params: { courseId:string; chapterId:string; } }
){
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    
    const courseOwner = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId: userId,
      },
    });

    if (!courseOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const chapter = await db.chapters.findUnique({
      where:{
        id: params.chapterId,
        courseId: params.courseId
      }
    });

    if (!chapter) {
      return new NextResponse("Not Found", { status: 404 });
    }

    const deletedChapter = await db.chapters.delete({
      where:{
        id: params.chapterId
      }
    });

    const publishedChaptersInCourse = await db.chapters.findMany({
      where:{
        courseId: params.courseId,
        isPublished: true,
      }
    });

    if(!publishedChaptersInCourse.length){
      await db.course.update({
        where:{
          id: params.courseId,
        },
        data:{
          isPublished: false,
        }
      });
    }

    return NextResponse.json(deletedChapter);
  } catch (error) {
      console.log("[CHAPTER_ID_DELETE]", error)
      return new NextResponse("Internal Error", { status:500 })
  }
}
export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { userId } = auth();
    const values = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const courseOwner = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId: userId,
      },
    });

    if (!courseOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const chapter = await db.chapters.findUnique({
      where: {
        id: params.chapterId,
        courseId: params.courseId,
      },
    });

    if (!chapter) {
      return new NextResponse("Not Found", { status: 404 });
    }

    const updatedChapter = await db.chapters.update({
      where: {
        id: params.chapterId,
      },
      data: {
        ...values
      },
    });

    return NextResponse.json(updatedChapter);
  } catch (error) {
    console.error("Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}