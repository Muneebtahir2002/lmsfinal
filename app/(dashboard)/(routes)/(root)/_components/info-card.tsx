import { IconBadge } from "@/components/icon-badge"
import { LucideIcon } from "lucide-react";

interface InfoCardProps {
    numberofItems: number;
    variant?: "default" | "success"
    label: string;
    icon: LucideIcon;
}


export const InfoCard = ({
    variant,
    icon: Icon,
    numberofItems,
    label
}: InfoCardProps) =>{
    return(
        <div className="border rounded-md flex items-center gap-x-3 p-3">
            <IconBadge 
            variant={variant}
            icon={Icon}
            />
            <div>
                <p className="font-medium">
                    {label}
            <p className="text-gray-500 text-sm">
                {numberofItems} {numberofItems=== 1 ? "Course": "Courses"}
            </p>
                </p>
            </div>
        </div>
    )
}