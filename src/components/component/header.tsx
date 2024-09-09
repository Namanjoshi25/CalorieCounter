'use client'
import { Button } from "@/components/ui/button"
import { useAppSelector } from "@/lib/store/store"
import Link from "next/link"
import { ClassNameValue } from "tailwind-merge"
import axios from "axios"
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/lib/store/store";
import { logout } from "@/lib/store/authSlice"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBars, faClose, faHamburger } from "@fortawesome/free-solid-svg-icons"
import { useState } from "react"

export default function Header(){
  const userStatus = useAppSelector(state => state.auth.authStatus)
  const [isOpen, setIsOpen] = useState(false);



    const navLinks = [{
        name : "Set Goal",
        page : "/yourgoal",
        status : userStatus
    },
    {
        name : "Track Food",
        page : "/trackfood",
        status : userStatus
    },
    

]

const router = useRouter()
const dispatch = useAppDispatch()

const handleLogout= async()=>{
    try {
        
        const res = await axios.get('/api/users/logout')
        console.log("Login Success",res.data);
        dispatch(logout( ))
        router.push("/login")
        
    } catch (error) {
        console.log("Login failed " ,error);
    }finally{
      
    }

}
    return (
        <main className=" relative ">
        <header className="bg-primary  relative  overflow-hidden w-full text-primary-foreground px-10 py-4 flex items-center  justify-between">
       <Link href={"/"}>
        <h1 className="text-2xl font-bold ">Calorie Tracker</h1>
        </Link>
        
       
          <ul className=" flex  gap-3 items-center justify-center  max-sm:hidden ">
            {navLinks.filter(link=>link.status).map((link,index)=>(
                <Link href={link.page} key={index}>
                <li className=" font-semibold"  >{link.name}</li>
                </Link>
            ))}
            {userStatus ?
               <Button  onClick={handleLogout}>
               <li className=" !font-semibold  text-base">Logout</li>
               </Button>
            
              : <>
               <Link href={'/login'}>
                <li className=" font-semibold">Login</li>
                </Link>
                <Link href={'/signup'}>
                <li className=" font-semibold">Signup</li>
                </Link>
            </>}
          </ul>
          <ul className=" max-sm:visible sm:hidden flex flex-col z-40">
            <button onClick={()=> setIsOpen(!isOpen)}>
                {!isOpen ?   <FontAwesomeIcon icon={faBars} size="lg"
                  /> : <FontAwesomeIcon icon={faClose} size="lg"/>}
                 </button>
         
        

          </ul>
      
      </header>
      {isOpen && ( 
            <div className="  transition-transform transform l ease-in-out duration-300   w-52  bg-background h-auto flex flex-col gap-4  absolute shadow-md z-10  right-0">
            <ul className="  w-full flex flex-col  items-center ">
            {navLinks.filter(link=>link.status).map((link,index)=>(
                <Link onClick={()=> setIsOpen(!isOpen)}  className=" w-full text-center" href={link.page} key={index}>
                <li className=" border  py-3  w-full font-semibold"  >{link.name}</li>
                </Link>
            ))}
            {userStatus ?
               <button className=" w-full flex flex-col  items-center"  onClick={handleLogout}>
               <li className="  border  py-3  w-full font-semibold">Logout</li>
               </button>
            
              : <>
              <ul className=" w-full flex flex-col  items-center">
               <Link onClick={()=> setIsOpen(!isOpen)}  className=" w-full text-center" href={'/login'}>
                <li className="  border  py-3  w-full font-semibold">Login</li>
                </Link>
                <Link onClick={()=> setIsOpen(!isOpen)}  className=" w-full text-center" href={'/signup'}>
                <li className=" border  py-3  w-full font-semibold">Signup</li>
                </Link>
                </ul>
            </>}
            </ul>
            </div>
         ) }
      </main>
    )
}



  