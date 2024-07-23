"use client"
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

interface Sidebaritem {
    href: string;
    icon: LucideIcon; 
    label: string;
  }
const Sidebaritem = ({
    icon: Icon,
    label,
    href,
}:Sidebaritem) => {
    const pathname = usePathname();
    const router = useRouter();

    const isActive =(pathname== "/" && href=='/') ||
    pathname ==href || pathname?.startsWith('${href}/');

    const onClick = () => {
        router.push(href);
    }

    return ( 
    <div>
        <button
        onClick={onClick}
        type="button"
        className={cn(
            "flex items-center gap-x-w text-slate-500 text-sm font-[500] pl-6 transition-all hover:text-slate-600 hover:bg-slate-300/200",
            isActive && " bg-sky-200/20 hover:bg-sky-200/20 hover: text-sky-900 w-full h-full"
        )}>
        <div className="flex items-center gap-x-2 py-4">
        <Icon 
        size={22}
        className={cn(
            "text-slate-500",
            isActive && "text-sky-700"
        )}
        />
        {label}
        </div>
        <div 
        className={cn(
            "ml-auto h-full opacity-0 border-2 border-sky-700 transition-all",
            isActive &&"opacity-100"
          )}
          />
        </button>
    </div> 
    );
}
 
export default Sidebaritem;