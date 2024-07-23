import { db } from "@/lib/db"; 
import { Attachment, Chapters } from "@prisma/client";

interface GetChapterProps {
    userId: string;
    courseId: string;
    chapterId: string;
};

export const getChapter = async ({
    userId,
    courseId,
    chapterId,
}: GetChapterProps) => {
    
    try {
        const purchase = await db.purchase.findUnique({
            where: {
                userId_courseId: {
                    userId,
                    courseId: courseId 
                }
            }
        });

        const course = await db.course.findUnique({
            where: {
                isPublished: true,
                id: courseId,
            },
            select: {
                price: true,
            }
        });

        const chapter = await db.chapters.findUnique({
            where: {
                id: chapterId,
                isPublished: true
            }
        });

        if (!chapter || !course) {
            throw new Error("Chapter or Course not Found");
        }

        let attachments: Attachment[] = [];
        let nextChapter: Chapters | null = null;

        if (purchase) {
            attachments = await db.attachment.findMany({
                where: {
                    courseId: courseId
                }
            });
        }

        if (chapter.isFree || purchase) {
            nextChapter = await db.chapters.findFirst({
                where: {
                    courseId: courseId,
                    isPublished: true,
                    position: {
                        gt: chapter.position
                    }
                },
                orderBy: {
                    position: "asc"
                }
            });
        }

        const userProgress = await db.userProgress.findUnique({
            where: {
                userId_chapterId: {
                    userId,
                    chapterId
                }
            }
        });

        return {
            chapter,
            course,
            videoUrl: chapter.videoUrl,
            attachments,
            nextChapter,
            userProgress,
            purchase
        };

    } catch (error) {
        console.log("GET_CHAPTERS", error);
        return {
            chapter: null,
            course: null,
            videoUrl: null,
            attachments: [],
            nextChapter: null,
            userProgress: null,
            purchase: null
        };
    }
};
