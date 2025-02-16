"use client";
import { useState } from "react";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const SignUp = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "USER", 
    fullName: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  
  const signUpMutation = useMutation({
    mutationFn: (payload: any) =>
      axios.post("https://ebuka-backend.onrender.com/user/register", payload),
    onSuccess: (response) => {
      toast({
        title: "Success",
        description: "Account created successfully!",
        variant: "success",
      });
      router.push("/sign-in");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "An error occurred",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsLoading(false); 
    },
  });


  const handleSubmit = () => {
    setIsLoading(true);
    signUpMutation.mutate(formData);
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <section className="pt-6 md:px-16 px-8 flex w-full flex-col gap-4 md:w-[50%]">
        <div className="flex flex-col gap-3 w-full mx-auto">
          <h1 className="text-[#1F2223] text-2xl font-satoshi">
            Create your account!
          </h1>
          <p className="w-[80%] text-[#57595A] text-sm font-satoshi">
            Please enter your credentials to create your account
          </p>

          <aside className="flex flex-col gap-3">

            <label className="flex flex-col gap-2">
              <p className="font-satoshi">Full name</p>
              <input
                required
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                className="widthMd bg-[#EAEAEA] focus:outline-none placeholder:font-satoshi placeholder:pl-2 pl-2 md:w-full w-[80%] h-10 border-2 border-[#E5E5E5] rounded-md"
                type="text"
                placeholder="John Doe"
              />
            </label>

            <label className="flex flex-col gap-2">
              <p className="font-satoshi">Email</p>
              <input
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="widthMd bg-[#EAEAEA] focus:outline-none placeholder:font-satoshi placeholder:pl-2 pl-2 md:w-full w-[80%] h-10 border-2 border-[#E5E5E5] rounded-md"
                type="email"
                placeholder="john.doe@example.com"
              />
            </label>

      
            <label className="flex flex-col gap-2">
              <p className="font-satoshi">Role</p>
              <select
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                className="widthMd bg-[#EAEAEA] focus:outline-none placeholder:font-satoshi placeholder:pl-2 pl-2 md:w-full w-[80%] h-10 border-2 border-[#E5E5E5] rounded-md"
              >
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </label>


            <label className="flex flex-col gap-2 relative">
              <p className="font-satoshi">Password</p>
              <div className="relative widthMd md:w-[100%] w-[80%]">
                <input
                  placeholder="********"
                  required
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="widthMd bg-[#EAEAEA] focus:outline-none placeholder:pl-2 placeholder:font-satoshi pl-2 w-full h-10 border-2 border-[#E5E5E5] rounded-md"
                  type={showPassword ? "text" : "password"}
                />
                <button
                  type="button"
                  onClick={toggleShowPassword}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </label>

           
            <Button
              disabled={
                isLoading ||
                !formData.email ||
                !formData.password ||
                !formData.fullName
              }
              onClick={handleSubmit}
              className={cn(
                "widthMd w-[80%] md:w-full text-white bg-[#0654B0] h-10 rounded",
                isLoading && "bg-opacity-40"
              )}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="animate-spin" size={20} />
                </div>
              ) : (
                "Sign Up"
              )}
            </Button>

          
            <p className="text-sm font-satoshi">
              Already have an account?{" "}
              <Link href="/sign-in">
                <span className="text-[#0654B0]">Login</span>
              </Link>
            </p>
          </aside>
        </div>
      </section>
    </div>
  );
};

export default SignUp;