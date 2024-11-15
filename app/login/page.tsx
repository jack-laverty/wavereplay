import { Metadata } from "next"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { Icons } from "@/components/ui/icons"
import { buttonVariants } from "@/components/ui/button"
import { UserAuthForm } from "./user-auth-form"

export const metadata: Metadata = {
  title: "wavereplay | login",
}

export default function LoginPage() {
  return (
    <>
      <div className="container relative hidden md:flex h-[800px] flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
        <Icons.wavereplay className=""/>
        <Link
          href="/register"
          className={cn(
            buttonVariants({ variant: "link", size: "sm" }),
            "absolute right-4 top-4 md:right-8 md:top-8"
          )}
        >
          Create Account
        </Link>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
            </div>
            <UserAuthForm />
          </div>
        </div>
      </div>
    </>
  )
}
