import Avatar from "./Avatar";
import HamburgerMenu from "./HamburgerMenu";

export default function Header() {

  return (
    <header>
      <header className="flex flex-row md:h-24 p-4 items-center justify-between relative">
         <div className="flex justify-start items-center">
           <HamburgerMenu />
         </div>
         <div className="flex justify-center items-center">
           <img src="/wavereplay.svg" alt="Logo" className="w-20 md:w-24" />
         </div>
         <div className="flex justify-end items-center">
           <button>
             <Avatar />
           </button>
         </div>
       </header>
    </header>
  )
}