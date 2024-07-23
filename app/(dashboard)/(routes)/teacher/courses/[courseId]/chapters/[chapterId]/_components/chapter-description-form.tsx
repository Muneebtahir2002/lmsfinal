"use client"
import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
Form,
FormControl,
FormField,
FormItem,
FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Chapters } from "@prisma/client";
import { Editor } from "@/components/editor";
import { Preview } from "@/components/preview";


interface ChapterDescriptionFormProps {
    initialData: Chapters
    courseId: string;
    chapterId :string
}

const formSchema = z.object({
    description: z.string().min(1)
})
const ChapterDescriptionForm = ({
    initialData,
    courseId,
    chapterId,
}:ChapterDescriptionFormProps) => {
    const [isEditing, setIsEditing ] = useState(false)

    const ToggleEdit =()=> setIsEditing((current)=>! current);

    const router = useRouter();

    const form = useForm <z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            description: initialData?.description || ""
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async ( values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values)
            toast.success("Chapter Updated") 
            ToggleEdit();
            router.refresh();
        } catch  {
            toast.error("Something went wrong")
        }
    };

    return ( <>
     <div className="mt-6 border bg-slate-100 rounded-md p-4 w-96">
            <div className="font-medium flex items-center justify-between">
                <div>Chapter Description</div>
                <Button onClick={ToggleEdit} variant="ghost">
                    {isEditing ? (
                        <div className="text-end">Cancel</div>
                    ) : (
                        <>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit Description
                        </>
                    )}
                </Button>
            </div>
            {!isEditing &&(
                <div className={cn(
                    "text-sm mt-2",
                    !initialData.description && "text-slate-500 italic"
                )}>{!initialData.description && "No description"}
                {initialData.description &&(
                    <Preview 
                    value={initialData.description}
                    />
            )}
                </div>
            )}
            
            {isEditing &&(
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4 mt-4"
                >
                    <FormField
                    control={form.control}
                    name="description"
                    render={({field})=>(
                        <FormItem>
                        <FormControl>
                          <Editor 
                          {...field}
                          />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}>
                    </FormField>
                    <div className="flex items-center gap-x-2">
                    <Button
                    disabled ={!isValid || isSubmitting}
                    type="submit"
                    >Save
                    </Button>
                    </div>
                </form>
                </Form>
            )}
        </div>
    </> );
}
 
export default ChapterDescriptionForm;