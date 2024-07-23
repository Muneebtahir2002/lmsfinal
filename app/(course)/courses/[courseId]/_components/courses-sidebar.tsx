import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { Chapters, Course, UserProgress } from "@prisma/client"
import { redirect } from "next/navigation";
import { CourseSidebarItem } from "./course-sidebar-items";
import { CourseProgress } from "@/components/course-progress";

interface CoursesSidebarProps{
    course: Course &{
        chapters: (Chapters &{
            userProgress: UserProgress[] | null;
        })[]
    };
    progressCount: number;
};


export const CoursesSidebar = async ({
    course,
    progressCount,
}: CoursesSidebarProps) => {

    const { userId } = auth();

    if(!userId){
        return redirect("/");
    }

    const purchase = await db.purchase.findUnique({
        where:{
            userId_courseId :{
                userId,
                courseId: course.id,
            }
        }
    });

    
    return(
        <div className="h-full border-r flex flex-col overflow-y-auto shadow-sm">
            <div className="p-8 flex flex-col border-b">
                <h1 className="font-semibold">
                    {course.title}
                </h1>
                {purchase && (
                    <CourseProgress 
                    variant="success"
                    value ={progressCount}
                    />
                )}
            </div>
            <div className="flex flex-col w-full">
            {course.chapters.map((chapter)=>(
                <CourseSidebarItem 
                key={chapter.id}
                id={chapter.id}
                label={chapter.title}
                isCompleted={!!chapter.userProgress?.[0]?.isCompleted}
                courseId={course.id}
                isLocked={!chapter.isFree && !purchase}
                />
            ))}
            </div>
        </div>
    )
}