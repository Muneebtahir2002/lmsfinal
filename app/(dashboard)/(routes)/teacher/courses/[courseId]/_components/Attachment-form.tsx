"use client"

import * as z from "zod";
import axios from "axios";
import { useState } from "react";
import { File, ImageIcon, Key, Loader2, Pencil, PlusCircle, X } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Attachment, Course } from "@prisma/client";
import { FileUpload } from "@/components/file-upload";


interface AttachmentFormProps {
    initialData:Course & {attachments: Attachment []};
    courseId: string;
}

const formSchema = z.object({
   url: z.string().min(1),
});
const AttachmentForm = ({
    initialData,
    courseId
}:AttachmentFormProps) => {
    const [isEditing, setIsEditing ] = useState(false)
    const [isdeletingId, setisdeletingId ] = useState<null | string >(null)

    const ToggleEdit =()=> setIsEditing((current)=>! current);

    const router = useRouter();

    const onSubmit = async ( values: z.infer<typeof formSchema>) => {
        try {
            await axios.post(`/api/courses/${courseId}/attachments`, values)
            toast.success("Course Updated") 
            ToggleEdit();
            router.refresh();
        } catch  {
            toast.error("Something went wrong")
        }
    };

    const onDelete = async ( id: string )=>{
        try {
            setisdeletingId(id);
            await axios.delete(`/api/courses/${courseId}/attachments/${id}`);
            toast.success("Attachment Deleted")
            router.refresh();
        } catch {
            toast.error("Something went wrong")
        }finally{
            setisdeletingId(null)
        }
    }

    return ( <>
     <div className="mt-6 border bg-slate-100 rounded-md p-4 w-96">
            <div className="font-medium flex items-center justify-between">
                <div>Course Attachment</div>
                <Button onClick={ToggleEdit} variant="ghost">
                    {isEditing && (
                        <div className="text-end">Cancel</div>
                    )} 
                    {!isEditing && (
                        <>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add a Attachment
                    </>
                    )}
                </Button>
            </div>
            {!isEditing &&(
               <>
                {initialData.attachments.length === 0 &&(
                    <p className="text-sm mt-2 text-slate-500 italic">Np Attachments Yet</p>
                )}
                {initialData.attachments.length > 0 &&(
                    <div className="space-y-2">
                        {initialData.attachments.map((attachment)=>(
                            <div
                            key={attachment.id}
                            className="flex items-center p-3 w-full bg-sky-100 border-sky-100 border text-sky-700 rounded-md"
                            >
                            <File className="h-4 w-4 mr-2 flex-shrink-0" />
                            <p className="text-xs line-clamp-1">
                            {attachment.name}
                            </p>
                            {isdeletingId === attachment.id &&(
                             <div>
                                <Loader2 className="h-4 w-4 animate-spin" />
                             </div>   
                            )}    
                            {isdeletingId !== attachment.id &&(
                             <button onClick={()=> onDelete(attachment.id)}>
                                <X className="h-4 w-4 hover: opacity-75 transition" />
                             </button>   
                            )}    
                            </div>
                        ))}
                    </div>
                )}
               </>
            )}
            {isEditing &&(
                <div>
                    <FileUpload
                    endpoint="courseAttachment"
                    onChange={(url)=>{
                        if(url){
                            onSubmit({url:url})
                        }
                    }}
                    />
                    <div className="text-sm text-slate-500">
                        Add anything your students might need to complete the course
                    </div>
                </div>
                
            )}
        </div>
    </> );
}
 
export default AttachmentForm;