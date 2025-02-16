"use client";
import { useState } from "react";
import { ChevronLeft, Plus, Download } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DialogTitle } from "@radix-ui/react-dialog";
import Papa from "papaparse";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import withAuth from "@/withAuth";

const acceptableCsvFileTypes = ".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel";

// Define the payload structure
type Item = {
  name: string;
  initialLevel: number;
  averageDemand: number;
  sellingPrice: number;
  holdingCost: number;
  shortageCost: number;
  minimumOrder: number;
  priceDiscountAmount: number;
  priceDiscountUnit: number;
  probabilityDistribution: number;
};

type Payload = {
  totalMinimumOrder: number;
  transportCapacity: number;
  items: Item[];
};

const AddProducts = () => {
  const { toast } = useToast();
  const [tableData, setTableData] = useState<Item[]>([]);
  const [isCsvUploaded, setIsCsvUploaded] = useState(false);

  // State for general constraints
  const [totalMinimumOrder, setTotalMinimumOrder] = useState<number>(0);
  const [transportCapacity, setTransportCapacity] = useState<number>(0);

  // State for manual input fields
  const [manualProduct, setManualProduct] = useState<Item>({
    name: "",
    initialLevel: 0,
    averageDemand: 0,
    sellingPrice: 0,
    holdingCost: 0,
    shortageCost: 0,
    minimumOrder: 0,
    priceDiscountAmount: 0,
    priceDiscountUnit: 0,
    probabilityDistribution: 0,
  });

  // Handle file upload
  const onFileChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const file = e.target.files[0];
      Papa.parse<Item>(file, {
        skipEmptyLines: true,
        header: true,
        complete: (results) => {
          if (results.data.length > 0) {
            // Convert numeric fields to numbers
            const parsedData: Item[] = results.data.map((item) => ({
              name: item.name,
              initialLevel: Number(item.initialLevel),
              averageDemand: Number(item.averageDemand),
              sellingPrice: Number(item.sellingPrice),
              holdingCost: Number(item.holdingCost),
              shortageCost: Number(item.shortageCost),
              minimumOrder: Number(item.minimumOrder),
              priceDiscountAmount: Number(item.priceDiscountAmount),
              priceDiscountUnit: Number(item.priceDiscountUnit),
              probabilityDistribution: Number(item.probabilityDistribution),
            }));
            setTableData(parsedData);
            setIsCsvUploaded(true);
            toast({
              title: "Success",
              description: "CSV imported successfully",
              variant: "success",
            });
          } else {
            toast({
              title: "Error",
              description: "The CSV file is empty or invalid.",
              variant: "destructive",
            });
          }
        },
      });
    }
  };

  // Handle manual input change
  const handleManualInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof Item) => {
    const value = e.target.value;
    setManualProduct({
      ...manualProduct,
      [field]: typeof manualProduct[field] === "number" ? Number(value) : value,
    });
  };

  // Save manually added product
  const saveManualProduct = () => {
    // Validate if all fields are filled
    if (Object.values(manualProduct).some((value) => value === "" || value === 0)) {
      toast({
        title: "Error",
        description: "Please fill all fields.",
        variant: "destructive",
      });
      return;
    }

    // Add the new product to the table data
    setTableData([...tableData, manualProduct]);

    // Reset the form
    setManualProduct({
      name: "",
      initialLevel: 0,
      averageDemand: 0,
      sellingPrice: 0,
      holdingCost: 0,
      shortageCost: 0,
      minimumOrder: 0,
      priceDiscountAmount: 0,
      priceDiscountUnit: 0,
      probabilityDistribution: 0,
    });

    toast({
      title: "Success",
      description: "Product added.",
      variant: "success",
    });
  };

  // Save general constraints to local storage
  const saveGeneralConstraints = () => {
    localStorage.setItem("totalMinimumOrder", totalMinimumOrder.toString());
    localStorage.setItem("transportCapacity", transportCapacity.toString());
    toast({
      title: "Success",
      description: "General constraints saved.",
      variant: "success",
    });
  };

  // Mutation to submit data to the endpoint
  const submitMutation = useMutation({
    mutationFn: async (payload: Payload) => {
      const response = await axios.post(`https://ebuka-backend.onrender.com/product/create/${localStorage.getItem("userId")}`, payload);
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Products submitted for analysis.",
        variant: "success",
      });
      // Clear local storage after submission
      localStorage.removeItem("totalMinimumOrder");
      localStorage.removeItem("transportCapacity");
      setTableData([]);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit products.",
        variant: "destructive",
      });
    },
  });

  // Handle submission of all data
  const handleSubmit = () => {
    const payload: Payload = {
      totalMinimumOrder: Number(localStorage.getItem("totalMinimumOrder")) || 0,
      transportCapacity: Number(localStorage.getItem("transportCapacity")) || 0,
      items: tableData,
    };
    submitMutation.mutate(payload);
  };

  return (
    <section className="p-8 w-full h-screen">
      <Link href="/">
        <ChevronLeft size={30} className="bg-white rounded-full p-1" />
      </Link>
      <h1 className="text-center text-2xl font-serif">Add Products</h1>
      <aside className="mt-10">
        <h1 className="text-center font-semibold">General constraints</h1>
        <div className="flex gap-4 w-full max-w-[23rem] mx-auto mt-8">
          <label className="flex flex-col w-1/2">
            <p className="font-medium">Total Minimum Order Quantity (MOQ)</p>
            <input
              type="number"
              min="0"
              placeholder="0"
              value={totalMinimumOrder}
              onChange={(e) => setTotalMinimumOrder(Number(e.target.value))}
              className="h-[2.5rem] rounded border px-3 outline-none focus:ring focus:ring-[#009951]"
            />
          </label>
          <label className="flex flex-col w-1/2">
            <p className="font-medium">Transport Capacity Constraint(Tr)</p>
            <input
              type="number"
              min="1"
              placeholder="0"
              value={transportCapacity}
              onChange={(e) => setTransportCapacity(Number(e.target.value))}
              className="h-[2.5rem] rounded border px-3 outline-none focus:ring focus:ring-[#009951]"
            />
          </label>
        </div>
        <div className="flex w-full max-w-[23rem] mx-auto mt-2">
          <Button onClick={saveGeneralConstraints}>Save</Button>
        </div>
      </aside>
      <div className="h-screen flex flex-col w-full justify-center items-center -mt-[8rem]">
        {!isCsvUploaded && (
          <Dialog>
            <DialogTrigger asChild>
              <Button className="rounded bg-white border-[#0654B0] border text-[#0654B0] p-2">
                <Plus size={16} /> Add new product
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogTitle className="font-bold text-2xl text-center">
                How do you want to add products?
              </DialogTitle>
              <div className="flex justify-between items-center">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="rounded bg-white border-[#0654B0] border text-[#0654B0] p-2">
                      <Plus size={16} /> Add manually
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="w-full max-w-[40rem] h-[75vh] overflow-y-auto no-scrollbar p-6">
                    <DialogTitle className="font-bold text-2xl text-center">
                      Add New Product
                    </DialogTitle>
                    <div className="w-full flex flex-col items-center space-y-5 mt-6">
                      {Object.keys(manualProduct).map((field) => (
                        <label key={field} className="w-full max-w-[23rem] flex flex-col">
                          <p className="font-medium">{field}</p>
                          <input
                            type={typeof manualProduct[field as keyof Item] === "number" ? "number" : "text"}
                            placeholder={`Enter ${field}`}
                            value={manualProduct[field as keyof Item]}
                            onChange={(e) => handleManualInputChange(e, field as keyof Item)}
                            className="w-full h-[2.5rem] rounded border px-3 outline-none focus:ring focus:ring-[#009951]"
                          />
                        </label>
                      ))}
                      <DialogClose>
                        <Button onClick={saveManualProduct} className="flex items-center bg-[#009951] text-white px-10">
                          Save
                        </Button>
                      </DialogClose>
                    </div>
                  </DialogContent>
                </Dialog>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="rounded bg-white border-[#0654B0] border text-[#0654B0] p-2">
                      <Download /> Import CSV
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogTitle className="font-bold text-2xl text-center">
                      CSV Import
                    </DialogTitle>
                    <p className="text-red-400 italic">
                      Please ensure that your CSV file has the following parameters: "name", "initialLevel", "averageDemand", "sellingPrice", "holdingCost", "shortageCost", "minimumOrder", "priceDiscountAmount", "priceDiscountUnit", "probabilityDistribution"
                    </p>
                    <input type="file" accept={acceptableCsvFileTypes} onChange={onFileChangeHandler} />
                    <DialogClose>
                      <Button onClick={() => setIsCsvUploaded(true)} className="mt-4">
                        Upload CSV
                      </Button>
                    </DialogClose>
                  </DialogContent>
                </Dialog>
              </div>
            </DialogContent>
          </Dialog>
        )}
        <div className="w-full max-h-[40vh] overflow-y-auto mt-6">
          <Table>
            <TableCaption>A list of your added products.</TableCaption>
            <TableHeader>
              <TableRow>
                {Object.keys(manualProduct).map((header, index) => (
                  <TableHead key={index}>{header}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableData.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {Object.values(row).map((value, colIndex) => (
                    <TableCell key={colIndex}>{value}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <Button onClick={handleSubmit} className="mt-10 bg-[#009951]">
          Submit Products for Analysis
        </Button>
      </div>
    </section>
  );
};

export default withAuth(AddProducts);