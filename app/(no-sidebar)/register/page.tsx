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
    <div className="min-h-screen flex flex-col">

      <nav className="w-full flex justify-end p-4">
        <Link
          href="/login"
          className={cn(
            buttonVariants({ variant: "link", size: "sm" })
          )}
        >
          Login
        </Link>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">

          <div className="flex justify-center">
            <Icons.wavereplay className="w-auto h-12 sm:h-16" />
          </div>

          <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 rounded-lg shadow-lg p-6">
            <div className="flex flex-col space-y-4 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                The bar is closed. Sorry.
              </h1>
              <p className="text-sm text-muted-foreground">
                Registration is unavailable at this time
              </p>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}