import { Metadata } from "next"
import Link from "next/link"

import { Icons } from "@/components/ui/icons"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "wavereplay | register",
}

export default function RegistrationPage() {
  return (
    <>
      <div className="container relative hidden md:flex h-[800px] flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
        <Icons.wavereplay className=""/>
        <Link
          href="/login"
          className={cn(
            buttonVariants({ variant: "link" }),
            "absolute right-4 top-4 md:right-8 md:top-8"
          )}
        >
          Login
        </Link>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                The bar is closed. Sorry.
              </h1>
              <p className="text-sm text-muted-foreground">
                Registration is unavailable at this time
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
