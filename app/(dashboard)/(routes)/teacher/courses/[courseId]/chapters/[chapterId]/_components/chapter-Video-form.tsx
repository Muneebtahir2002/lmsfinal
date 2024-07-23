"use client";

import * as z from "zod";
import axios from "axios";
import { useState } from "react";
import { Pencil, PlusCircle, Video } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Chapters } from "@prisma/client";
import { FileUpload } from "@/components/file-upload";
import ReactPlayer from "react-player";

interface ChapterVideoFormProps {
    initialData: Chapters;
    courseId: string;
    chapterId: string;
}

const formSchema = z.object({
    videoUrl: z.string().min(1)
});

const ChapterVideoForm = ({
    initialData,
    courseId,
    chapterId,
}: ChapterVideoFormProps) => {
    const [isEditing, setIsEditing] = useState(false);

    const ToggleEdit = () => setIsEditing((current) => !current);

    const router = useRouter();

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const response = await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values);
            toast.success("Chapter Updated");
            ToggleEdit();
            router.refresh();
        } catch {
            toast.error("Something went wrong");
        }
    };

    return (
        <>
            <div className="mt-6 border bg-slate-100 rounded-md p-4 w-96">
                <div className="font-medium flex items-center justify-between">
                    <div>Chapter Video</div>
                    <Button onClick={ToggleEdit} variant="ghost">
                        {isEditing && (
                            <div className="text-end">Cancel</div>
                        )}
                        {!isEditing && !initialData.videoUrl && (
                            <>
                                <PlusCircle className="h-4 w-4 mr-2" />
                                Add a Video
                            </>
                        )}
                        {!isEditing && initialData.videoUrl && (
                            <>
                                <Pencil className="h-4 w-4 mr-2" />
                                Edit Video
                            </>
                        )}
                    </Button>
                </div>
                {!isEditing && (
                    !initialData.videoUrl ? (
                        <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
                            <Video className="h-10 w-10 text-slate-500" />
                        </div>
                    ) : (
                        <div className="relative aspect-video mt-2">
                            <ReactPlayer
                                url={initialData.videoUrl}
                                controls
                                width="100%"
                                height="100%"
                            />
                        </div>
                    )
                )}
                {isEditing && (
                    <div>
                        <FileUpload
                            endpoint="chapterVideo"
                            onChange={(url) => {
                                if (url) {
                                    onSubmit({ videoUrl: url });
                                }
                            }}
                        />
                        <div className="text-sm text-slate-500">
                            Upload this chapter&apos;s video
                        </div>
                    </div>
                )}
                {initialData.videoUrl && !isEditing && (
                    <div className="text-xs text-muted-foreground mt-2">
                        Videos may take some time to process. Refresh the page to make it appear.
                    </div>
                )}
            </div>
        </>
    );
}

export default ChapterVideoForm;
