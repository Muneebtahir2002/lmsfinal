"use client";

import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { Loader2, Lock } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useConfettiStore } from "@/hooks/use-confetti-store";

interface VideoPlayerProps {
    videoUrl: string;
    courseId: string;
    chapterId: string;
    nextChapterId?: string;
    isLocked: boolean;
    completeOnEnd: boolean;
    title: string;
}

export const VideoPlayer = ({
    videoUrl,
    courseId,
    chapterId,
    nextChapterId,
    isLocked,
    completeOnEnd,
    title,
}: VideoPlayerProps) => {
    const [isReady, setIsReady] = useState(false);

    const router = useRouter();
    const confetti = useConfettiStore();

    const onEnd = async () =>{
        try {
            if(completeOnEnd){
                await axios.put(`/api/courses/${courseId}/chapters/${chapterId}/progress`,{
                    isCompleted: true,
                });

                if(!nextChapterId){
                    confetti.onOpen();
                }
                toast.success("Progress Done");
                
               
                if(nextChapterId){
                    router.push(`/courses/${courseId}/chapters/${nextChapterId}`)
                }
                router.refresh();
            }

        } catch (error) {
            toast.error("Something went wrong")
        }
    }
    useEffect(() => {
        if (!isLocked && videoUrl) {
            setIsReady(true);
        }
    }, [isLocked, videoUrl]);

    return (
        <div className="relative aspect-video">
            {!isReady && !isLocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
                    <Loader2 className="h-8 w-8 animate-spin text-secondary" />
                </div>
            )}
            {isLocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-800 flex-col gap-y-2 text-secondary">
                    <Lock className="h-8 w-8" />
                    <p>This Chapter is Locked</p>
                </div>
            )}
            {!isLocked && isReady && (
                <ReactPlayer
                    url={videoUrl}
                    className="react-player"
                    controls
                    playing
                    width="100%"
                    height="100%"
                    onEnded={onEnd}
                    
                />
            )}
        </div>
    );
};
