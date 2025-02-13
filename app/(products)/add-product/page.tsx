"use client";
import { useState } from "react";
import { Camera, ChevronLeft, Download, Plus, Trash } from "lucide-react";
import Link from "next/link";
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DialogTitle } from "@radix-ui/react-dialog";
import Papa from "papaparse";

const acceptableCsvFileTypes = ".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel";
type CsvRow = Record<string, string>;

const AddProducts = () => {
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
            alert("Please select a file first!");
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
            <div className="h-screen flex flex-col w-full justify-center items-center">
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
                                    <label className="h-[10rem] w-[15rem] bg-white rounded-lg flex flex-col items-center justify-center mx-auto cursor-pointer border border-gray-300 hover:border-gray-400 transition">
                                        <Camera size={50} className="text-[#009951]" />
                                        <p className="text-center font-bold mt-2">Upload Product Image</p>
                                        <input type="file" accept="image/*" className="hidden" />
                                    </label>
                                    <div className="w-full flex flex-col items-center space-y-5 mt-6">
                                        <label className="w-full max-w-[23rem] flex flex-col">
                                            <p className="font-medium">Select Category</p>
                                            <select className="w-full h-[2.5rem] rounded border px-3 outline-none focus:ring focus:ring-[#009951]">
                                                <option value="">Choose Category</option>
                                                <option value="Clothing">Clothing</option>
                                                <option value="Electronics">Electronics</option>
                                                <option value="Accessories">Accessories</option>
                                                <option value="Home Appliances">Home Appliances</option>
                                            </select>
                                        </label>
                                        <label className="w-full max-w-[23rem] flex flex-col">
                                            <p className="font-medium">Product Name</p>
                                            <input type="text" placeholder="Enter product name"
                                                   className="w-full h-[2.5rem] rounded border px-3 outline-none focus:ring focus:ring-[#009951]" />
                                        </label>
                                        <div className="flex gap-4 w-full max-w-[23rem]">
                                            <label className="flex flex-col w-1/2">
                                                <p className="font-medium">Price (NGN)</p>
                                                <input type="number" min="0" placeholder="NGN"
                                                       className="h-[2.5rem] rounded border px-3 outline-none focus:ring focus:ring-[#009951]" />
                                            </label>
                                            <label className="flex flex-col w-1/2">
                                                <p className="font-medium">Order Quantity</p>
                                                <input type="number" min="1" placeholder="0"
                                                       className="h-[2.5rem] rounded border px-3 outline-none focus:ring focus:ring-[#009951]" />
                                            </label>
                                        </div>
                                        <button className="flex items-center text-[#009951]">
                                            <Plus size={20} /> Add Quantity Discount
                                        </button>
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
