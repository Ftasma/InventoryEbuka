"use client";
import { useState, useEffect } from "react";
import withAuth from "../../../withAuth";
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
import { Skeleton } from "@/components/ui/skeleton"; // For loading states

const ViewProduct = () => {
  const [orders, setOrders] = useState<any[]>([]); // Store the orders
  const [isLoading, setIsLoading] = useState(true); // Loading state for initial data fetch
  const [selectedProduct, setSelectedProduct] = useState<any>(null); // Store the selected product
  const [isModalOpen, setIsModalOpen] = useState(false); // Manage modal visibility
  const [isModalLoading, setIsModalLoading] = useState(false); // Loading state for modal data fetch
  const { toast } = useToast();

  // Fetch orders when the component mounts
  useEffect(() => {
    const fetchOrders = async () => {
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

        // Check if the response has the expected structure
        if (response.data && Array.isArray(response.data.data)) {
          setOrders(response.data.data); // Set the orders
        } else {
          toast({
            title: "Error",
            description: "Invalid data format received from the server.",
            variant: "destructive",
          });
          setOrders([]); // Set orders to an empty array to avoid errors
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch orders.",
          variant: "destructive",
        });
        setOrders([]); // Set orders to an empty array to avoid errors
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [toast]);

  // Handle product click
  const handleProductClick = async (itemId: string) => {
    setIsModalLoading(true); // Start loading for modal
    setIsModalOpen(true); // Open the modal immediately

    try {
      const response = await axios.post(
        "https://ebuka-backend.onrender.com/product/single-product",
        { id: itemId, userId: localStorage.getItem("userId") }
      );

      if (response.data) {
        setSelectedProduct(response.data); // Set the selected product
      } else {
        toast({
          title: "Error",
          description: "Product details not found.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch product details.",
        variant: "destructive",
      });
    } finally {
      setIsModalLoading(false); // Stop loading for modal
    }
  };

  // Close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  // Dynamically extract table headers from the first item (if available)
  const headers =
    orders.length > 0 && orders[0].items.length > 0
      ? Object.keys(orders[0].items[0])
      : [];

  return (
    <section className="p-8 w-full min-h-screen bg-gray-50">
      <Link href="/">
        <ChevronLeft size={30} className="bg-white rounded-full p-1 shadow-md hover:bg-gray-100" />
      </Link>
      <h1 className="text-center text-2xl font-serif font-bold text-gray-800 mt-4">
        Your Products
      </h1>
      <div className="mt-8 w-full max-w-6xl mx-auto">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, index) => (
              <Skeleton key={index} className="h-12 w-full bg-gray-200 rounded-lg" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <p className="text-center text-gray-600">No products found.</p>
        ) : (
          <Table className="bg-white rounded-lg shadow-md">
            <TableCaption className="text-gray-600 mt-4">
              A list of your added products.
            </TableCaption>
            <TableHeader>
              <TableRow>
                {headers.map((header) => (
                  <TableHead key={header} className="capitalize font-bold text-gray-800">
                    {header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) =>
                order.items.map((item: any) => (
                  <TableRow
                    key={item.id} // Use item.id as the key
                    onClick={() => handleProductClick(item.id)} // Pass item.id to handleProductClick
                    className="cursor-pointer hover:bg-gray-100 transition-colors"
                  >
                    {headers.map((header) => (
                      <TableCell key={header} className="py-3">
                        {item[header] === null || item[header] === undefined
                          ? "N/A" // Handle null or undefined values
                          : typeof item[header] === "object"
                          ? JSON.stringify(item[header]) // Handle objects
                          : item[header]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Modal for displaying product details */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
          <div className="bg-white p-6 rounded-lg w-11/12 max-w-md shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Product Details</h2>
            {isModalLoading ? (
              <div className="space-y-2">
                {[...Array(5)].map((_, index) => (
                  <Skeleton key={index} className="h-6 w-full bg-gray-200 rounded" />
                ))}
              </div>
            ) : selectedProduct ? (
              <div className="space-y-2">
                {Object.entries(selectedProduct).map(([key, value]:any) => (
                  <div key={key} className="text-gray-700">
                    <strong className="capitalize">{key}:</strong>{" "}
                    {value === null || value === undefined
                      ? "N/A" // Handle null or undefined values
                      : typeof value === "object"
                      ? JSON.stringify(value) // Handle objects
                      : value}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No product details available.</p>
            )}
            <button
              onClick={closeModal}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default withAuth(ViewProduct);