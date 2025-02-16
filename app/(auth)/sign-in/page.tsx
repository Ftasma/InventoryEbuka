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

const SignIn = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [token, setToken] = useState("");

  
  const loginMutation = useMutation({
    mutationFn: (payload: any) =>
      axios.post("https://ebuka-backend.onrender.com/user/login", payload),
    onSuccess: (response) => {
      toast({
        title: "Success",
        description: "Logged in successfully!",
        variant: "success",
      });
      
      console.log(response.data.accessToken)
      setToken(response.data.accessToken)
      console.log(token)
      localStorage.setItem("userId",response.data.user.id)
      // localStorage.setItem("token", token);
      localStorage.setItem("token", response.data.token);
      router.push("/"); 
    },
    onError: (response: any) => {
      console.log(response)
      toast({
        title: "Error",
        description: response?.data?.error || "An error occurred",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsLoading(false); 
    },
  });


  const handleSubmit = () => {
    setIsLoading(true);
    loginMutation.mutate(formData);
  };

 
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <section className="pt-6 md:px-16 px-8 flex w-full flex-col gap-4 md:w-[50%]">
        <div className="flex flex-col gap-3 w-full mx-auto">
          <h1 className="text-[#1F2223] text-2xl font-satoshi">
            Welcome back!
          </h1>
          <p className="w-[80%] text-[#57595A] text-sm font-satoshi">
            Please enter your credentials to log in
          </p>

          <aside className="flex flex-col gap-3">
            
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
                  className="widthMd bg-[#EAEAEA] focus:outline-none placeholder:pl-2 placeholder:font-satoshi pl-2 w-full  h-10 border-2 border-[#E5E5E5] rounded-md"
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
              disabled={isLoading || !formData.email || !formData.password}
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
                "Login"
              )}
            </Button>

           
            <p className="text-sm font-satoshi">
              Don't have an account?{" "}
              <Link href="/sign-up">
                <span className="text-[#0654B0]">Sign up</span>
              </Link>
            </p>
          </aside>
        </div>
      </section>
    </div>
  );
};

export default SignIn;