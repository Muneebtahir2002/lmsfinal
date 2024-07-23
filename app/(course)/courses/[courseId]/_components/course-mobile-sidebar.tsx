import { Menu } from "lucide-react";
import { Chapters, Course, UserProgress } from "@prisma/client";

import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet";

import { CoursesSidebar } from "./courses-sidebar";

interface CourseMobileSidebarProps{
    course: Course & {
        chapters: (Chapters &{
            userProgress: UserProgress[] | null
        })[];
    };
    progressCount:number;
};

export const CourseMobileSidebar = ({
    course,
    progressCount,
}: CourseMobileSidebarProps) => {
    return(
    <Sheet>
        <SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition">
            <Menu />
        </SheetTrigger>
        <SheetContent side="left" className="p-0 bg-white w-72">
            <CoursesSidebar 
            course={course}
            progressCount={progressCount}
            />
        </SheetContent>
    </Sheet>
    )
}