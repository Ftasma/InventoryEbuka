"use client"
import { Button } from "@/components/ui/button";
import { ChevronLeft, Plus, Trash } from "lucide-react";
import Link from "next/link";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { DialogClose } from "@radix-ui/react-dialog";
import { useToast } from "@/hooks/use-toast"
const Categories = () => {
    const { toast } = useToast()
    const [category, setCategory] = useState<string>("");
    const [categories, setCategories] = useState<string[]>([
       
    ]);

    const addCategory = () => {
        if (category.trim() !== "" && !categories.includes(category)) {
            setCategories(prevCategories => [...prevCategories, category]);
            setCategory("");
            toast({
                title: "Success",
                description: "New category added successfully",
                variant:"success"
            })
        }
    };

    const deleteCategory = (categoryToDelete: string) => {
        setCategories(prevCategories => prevCategories.filter(item => item !== categoryToDelete));
        toast({
            title: "Success",
            description: "Category deleted successfully",
        })
    };

    // const deleteSequence=(item:any)=>{
    //    deleteCategory(item)
      
    // //    console.log("deleted");
    // }

    return ( 
        <section className="bg-[#EFEFF0] min-h-screen w-screen pb-6">
            <aside className="w-full gap-[18%] md:gap-[36%] flex items-center px-16 py-10">
                <Link href="/"><ChevronLeft size={35} className="bg-white p-1 rounded-full text-slate-700"/></Link>
                <h1 className="text-2xl font-bold">Categories</h1>
            </aside>
            <div className="w-full">
                {categories.map((item) => (
                    <div className="w-full" key={item}>
                        <div className="text-2xl mx-auto w-[80%] mb-2 border-[2px] h-[3rem] px-5 flex justify-between items-center">
                            <p>{item}</p>
                            <Dialog>
                                <DialogTrigger className="cursor-pointer">
                                <Trash className="text-[#EC221F] cursor-pointer"/>
                                </DialogTrigger>
                                <DialogContent>

                                    <DialogHeader>
                                       <DialogTitle>Are you sure you want to delete this category?</DialogTitle> 
                                    </DialogHeader>
                                    <div className="flex gap-3 place-self-center">
                                        <DialogClose>
                                            <Button onClick={()=>deleteCategory(item)} className="bg-[#EC221F] text-white">Yes</Button>
                                        </DialogClose>
                                        <DialogClose>
                                            <Button className="bg-[#009951] text-white">No</Button>
                                        </DialogClose>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-[7%]">
                <Dialog>
                    <DialogTrigger className="flex place-self-center">
                        <Button className="flex px-20 py-7 bg-[#009951] text-white"><Plus/> Add new category</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add new category</DialogTitle>
                        </DialogHeader>
                        <div className="w-full flex flex-col gap-3 item-center justify-center mb-5">
                            <h1 className="text-[1rem] font-bold">Category</h1>
                            <input
                                value={category} 
                                onChange={(e) => setCategory(e.target.value)} 
                                type="text" 
                                placeholder="Input your category name"
                                className="bg-[#EFEFF0] border-slate-500 border w-[80%] h-[2.3rem] rounded-[3px]" 
                            />
                            <DialogClose>
                            <Button onClick={addCategory} className="place-self-center bg-[#009951]">Add category</Button>
                            </DialogClose>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </section> 
    );
};

export default Categories;
