import { SignIn } from './signin-button'

export default function Page() {

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <img src="/wavereplay.svg" alt="Logo" className="w-52 pb-10" />
      <SignIn />
    </div>
  )
}