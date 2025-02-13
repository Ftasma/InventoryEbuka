"use client";
import { useState } from "react";
import { Camera, ChevronLeft, Plus, Trash } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
export default function ViewProduct() {
  
    return (
        <section className="p-8 w-full h-screen">
            <Link href="/"><ChevronLeft size={30} className="bg-white rounded-full p-1"/></Link> 
            <h1 className='text-center text-2xl font-serif'>Your products</h1>
            <div className='h-screen flex flex-col w-full justify-center items-center'>
            <Table>
                <TableCaption>A list of your added products.</TableCaption>
                <TableHeader>
                    <TableRow>
                    <TableHead className="w-[100px]">Invoice</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                    <TableCell className="font-medium">INV001</TableCell>
                    <TableCell>Paid</TableCell>
                    <TableCell>Credit Card</TableCell>
                    <TableCell className="text-right">$250.00</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
            </div>
        </section>
    );
}
