import NavbarRoutes from "@/components/NavbarRoutes";
import { Chapters, Course, UserProgress } from "@prisma/client"
import { CourseMobileSidebar } from "./course-mobile-sidebar";

interface CourrseNavbarProps {
    course: Course & {
        chapters: (Chapters &{
            userProgress: UserProgress[] | null
        })[];
    };
    progressCount:number;
};

export const CourseNavbar =  ({
    course,
    progressCount,
}:CourrseNavbarProps ) => {
    return (
        <div className="p-4 border-b h-full flex items-center bg-white shadow-sm">
            <CourseMobileSidebar 
            course={course}
            progressCount={progressCount}
            />
            <NavbarRoutes />
        </div>
    )
}