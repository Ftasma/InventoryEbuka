"use client";
import { useState, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

export default function ViewProduct() {
  const [products, setProducts] = useState<any[]>([]); // Use `any` for dynamic data
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Fetch products when the component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      const userId = localStorage.getItem("userId"); // Get userId from localStorage
      if (!userId) {
        toast({
          title: "Error",
          description: "User ID not found. Please log in.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.post(
          "https://ebuka-backend.onrender.com/product/all-products",
          { userId } // Send userId in the payload
        );

        // Ensure the response data is an array
        if (Array.isArray(response.data)) {
          setProducts(response.data);
        } else {
          toast({
            title: "Error",
            description: "Invalid data format received from the server.",
            variant: "destructive",
          });
          setProducts([]); // Set products to an empty array to avoid errors
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch products.",
          variant: "destructive",
        });
        setProducts([]); // Set products to an empty array to avoid errors
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [toast]);

  // Dynamically extract table headers from the first product (if available)
  const headers = products.length > 0 ? Object.keys(products[0]) : [];

  return (
    <section className="p-8 w-full h-screen">
      <Link href="/">
        <ChevronLeft size={30} className="bg-white rounded-full p-1" />
      </Link>
      <h1 className="text-center text-2xl font-serif">Your products</h1>
      <div className="h-screen flex flex-col w-full justify-center items-center">
        {isLoading ? (
          <p>Loading products...</p>
        ) : products.length === 0 ? (
          <p>No products found.</p>
        ) : (
          <Table>
            <TableCaption>A list of your added products.</TableCaption>
            <TableHeader>
              <TableRow>
                {headers.map((header) => (
                  <TableHead key={header} className="capitalize">
                    {header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product, index) => (
                <TableRow key={index}>
                  {headers.map((header) => (
                    <TableCell key={header}>
                      {typeof product[header] === "object"
                        ? JSON.stringify(product[header]) // Handle nested objects
                        : product[header]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </section>
  );
}