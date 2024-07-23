"use client"

import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import {  LogOut } from "lucide-react";
import Link from "next/link";
import { SearchInput } from "./search-input";

const NavbarRoutes = () => {
    const pathname = usePathname();

    const isTeacherPage = pathname?.startsWith('/teacher');
    const isCoursePage = pathname?.includes('/courses');
    const isSearchPage = pathname === "/search";

    return (
    <>
    {isSearchPage && (
        <div className="hidden md:block">
            <SearchInput />
        </div>
    )}
    <div className="flex gap-2 ml-auto">
        {isTeacherPage || isCoursePage ? (
            <Link href ='/'>
            <Button size="sm" variant="ghost" className="mt-2">
                <LogOut className="h-4 w-4 mr-2" />
                Exit!
            </Button>
            </Link>
        ) : (
            <Link href ='/teacher/courses'>
                <Button size="sm" variant="ghost" className="mt-2">
                    Teacher Mode
                </Button>
            </Link>
        )}
        <UserButton 
        afterSignOutUrl="/"
        />
    </div> 
    </>
    );
}
 
export default NavbarRoutes;