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
    <div className="min-h-screen flex flex-col">

      <nav className="w-full flex justify-end p-4">
        <Link
          href="/register"
          className={cn(
            buttonVariants({ variant: "link", size: "sm" })
          )}
        >
          Create Account
        </Link>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">

          <div className="flex justify-center">
            <Icons.wavereplay className="w-auto h-12 sm:h-16" />
          </div>

          <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 rounded-lg shadow-lg p-6 space-y-6">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Welcome back
              </h1>
              <p className="text-sm text-muted-foreground">
                Sign in to your account
              </p>
            </div>
            <UserAuthForm />
          </div>

        </div>
      </main>
    </div>
  )
}