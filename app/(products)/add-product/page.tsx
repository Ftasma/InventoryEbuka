"use client";
import { useState } from "react";
import { Camera, ChevronLeft, Download, Plus, Trash } from "lucide-react";
import Link from "next/link";
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DialogTitle } from "@radix-ui/react-dialog";
import Papa from "papaparse";
import { useToast } from "@/hooks/use-toast";

const acceptableCsvFileTypes = ".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel";
type CsvRow = Record<string, string>;

const AddProducts = () => {
    const {toast} = useToast()
    const [tableData, setTableData] = useState<CsvRow[]>([]);
    const [headers, setHeaders] = useState<string[]>([]);
    const [csvFile, setCsvFile] = useState<File | null>(null);

    const onFileChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.length) {
            setCsvFile(e.target.files[0]);
        }
    };

    const uploadCsv = () => {
        if (!csvFile) {
            toast({title:"Please select a file first!",
                variant:"destructive"
            });
            return;
        }

        Papa.parse<CsvRow>(csvFile, {
            skipEmptyLines: true,
            header: true,
            complete: (results) => {
                if (results.data.length > 0) {
                    const parsedData: CsvRow[] = results.data as CsvRow[];
                    setHeaders(Object.keys(parsedData[0] || {})); // Ensure it's an object before calling Object.keys()
                    setTableData(parsedData);
                    toast({
                        title: "Success",
                        description: "Csv imported successfully",
                      })
                } else {
                    alert("The CSV file is empty or invalid.");
                }
            },
        });
    };

    return (
        <section className="p-8 w-full h-screen">
            <Link href="/">
                <ChevronLeft size={30} className="bg-white rounded-full p-1"/>
            </Link>
            <h1 className="text-center text-2xl font-serif">Add Products</h1>
            <aside className="mt-10">
                <h1 className="text-center font-semibold">
                    General constraints
                </h1>
                <div className="flex gap-4 w-full max-w-[23rem] mx-auto mt-8">
                   <label className="flex flex-col w-1/2">
                    <p className="font-medium">Total Minimum Order Quantity (MOQ)</p>
                    <input type="number" min="0" placeholder="0"
                     className="h-[2.5rem] rounded border px-3 outline-none focus:ring focus:ring-[#009951]" />
                    </label>
                    <label className="flex flex-col w-1/2">
                    <p className="font-medium">Transport Capacity Constraint(Tr)</p>
                    <input type="number" min="1" placeholder="0"
                    className="h-[2.5rem] rounded border px-3 outline-none focus:ring focus:ring-[#009951]" />
                    </label>
                </div>
                <div className="flex w-full max-w-[23rem] mx-auto mt-2">
                    <Button>Save</Button>
                </div>
            </aside>
            <div className="h-screen flex flex-col w-full justify-center items-center -mt-[8rem]">
                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="rounded bg-white border-[#0654B0] border text-[#0654B0] w-[30%]">
                            <Plus size={16}/> Add new product
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogTitle className="font-bold text-2xl text-center">
                            How do you want to add products?
                        </DialogTitle>
                        <div className="flex justify-between items-center">
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button className="rounded bg-white border-[#0654B0] border text-[#0654B0] w-[30%]">
                                        <Plus size={16}/> Add manually
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="w-full max-w-[40rem] h-[75vh] overflow-y-auto no-scrollbar p-6">
                                    <DialogTitle className="font-bold text-2xl text-center">
                                        Add New Product
                                    </DialogTitle>
                                    <div className="w-full flex flex-col items-center space-y-5 mt-6">
                                        <label className="w-full max-w-[23rem] flex flex-col">
                                            <p className="font-medium">Product Name</p>
                                            <input type="text" placeholder="Enter product name"
                                                   className="w-full h-[2.5rem] rounded border px-3 outline-none focus:ring focus:ring-[#009951]" />
                                        </label>
                                        <div className="flex gap-4 w-full max-w-[23rem]">
                                            <label className="flex flex-col w-1/2">
                                                <p className="font-medium">Initial Inventory Level</p>
                                                <input type="number" min="0" placeholder="NGN"
                                                       className="h-[2.5rem] rounded border px-3 outline-none focus:ring focus:ring-[#009951]" />
                                            </label>
                                            <label className="flex flex-col w-1/2">
                                                <p className="font-medium">Average Demand</p>
                                                <input type="number" min="1" placeholder="0"
                                                       className="h-[2.5rem] rounded border px-3 outline-none focus:ring focus:ring-[#009951]" />
                                            </label>
                                        </div>
                                        <div className="flex gap-4 w-full max-w-[23rem]">
                                            <label className="flex flex-col w-1/2">
                                                <p className="font-medium">Unit Selling Price (NGN)</p>
                                                <input type="number" min="0" placeholder="NGN"
                                                       className="h-[2.5rem] rounded border px-3 outline-none focus:ring focus:ring-[#009951]" />
                                            </label>
                                            <label className="flex flex-col w-1/2">
                                                <p className="font-medium">Unit Holding Cost</p>
                                                <input type="number" min="1" placeholder="0"
                                                       className="h-[2.5rem] rounded border px-3 outline-none focus:ring focus:ring-[#009951]" />
                                            </label>
                                        </div>
                                        <div className="flex gap-4 w-full max-w-[23rem]">
                                            <label className="flex flex-col w-1/2">
                                                <p className="font-medium">Unit Shortage Cost</p>
                                                <input type="number" min="0" placeholder="NGN"
                                                       className="h-[2.5rem] rounded border px-3 outline-none focus:ring focus:ring-[#009951]" />
                                            </label>
                                            <label className="flex flex-col w-1/2">
                                                <p className="font-medium">Minimum Order Quantity</p>
                                                <input type="number" min="1" placeholder="0"
                                                       className="h-[2.5rem] rounded border px-3 outline-none focus:ring focus:ring-[#009951]" />
                                            </label>
                                        </div>
                                        <div className="flex gap-4 w-full max-w-[23rem]">
                                            <label className="flex flex-col w-1/2">
                                                <p className="font-medium">Price Discount Schedule</p>
                                                <input type="number" min="0" placeholder="NGN"
                                                       className="h-[2.5rem] rounded border px-3 outline-none focus:ring focus:ring-[#009951]" />
                                            </label>
                                            <label className="flex flex-col w-1/2">
                                                <p className="font-medium">Probability Distribution of Demand</p>
                                                <input type="number" min="1" placeholder="0"
                                                       className="h-[2.5rem] rounded border px-3 outline-none focus:ring focus:ring-[#009951]" />
                                            </label>
                                        </div>
                                        <Button className="flex items-center bg-[#009951] text-white px-10">
                                           Save
                                        </Button>
                                    </div>
                                </DialogContent>
                            </Dialog>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button className="rounded bg-white border-[#0654B0] border text-[#0654B0] w-[30%]">
                                        <Download/> Import CSV
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogTitle className="font-bold text-2xl text-center">
                                        CSV Import
                                    </DialogTitle>
                                    <p className="text-red-400 italic">Please ensure that your csv file has the following parameters: "Item Name", "Average demand", "Unit selling price", "Unit holding cost", "Unit shortage cost" "Minimum Order Quantity", "Price Discount Schedule", "Probability Distribution of Demand", "Initial Inventory Level"</p>
                                    <input type="file" accept={acceptableCsvFileTypes} onChange={onFileChangeHandler}/>
                                    <DialogClose>
                                        <Button onClick={uploadCsv} className="mt-4">Upload CSV</Button>
                                    </DialogClose>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </DialogContent>
                </Dialog>
                <Table>
                    <TableCaption>A list of your added products.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            {headers.map((header, index) => (
                                <TableHead key={index}>{header}</TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tableData.map((row, rowIndex) => (
                            <TableRow key={rowIndex}>
                                {headers.map((header, colIndex) => (
                                    <TableCell key={colIndex}>{row[header]}</TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <Link href="/view-product">
                    <Button className="mt-10 bg-[#009951]">Submit Products for Analysis</Button>
                </Link>
            </div>
        </section>
    );
};

export default AddProducts;
