import { SignIn } from "@clerk/nextjs";


export default function SignInPage() {
  return (
    <div>
      <div className="flex justify-center items-center h-screen">
      <SignIn />
      </div>
    </div>
  )
}