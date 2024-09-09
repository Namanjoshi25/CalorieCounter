"use client";

import Link from "next/link";
import React , {useEffect, useState} from "react";
import { useRouter } from "next/navigation";
import axios  from "axios";
import { useAppDispatch } from "@/lib/store/store";
import { login } from "@/lib/store/authSlice";
export default function SignupPage(){
    const router  = useRouter()
    const [loading , setLoading] = useState(false)

    const [user, setUser] = useState({
        email : "",
        password : "",

    });
    const dispatch = useAppDispatch()
    const onLogin = async ()=>{
        try {
            setLoading(true)
            const res = await axios.post('/api/users/login',user)
         
            dispatch(login( res.data.savedUser))
            router.push("/")
            
        } catch (error) {
            console.log("Login failed " ,error);
        }finally{
            setLoading(false)
        }
    
    }

 
    return (
       <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <h1>{loading ? "Processing" : "Login"}</h1>
        <hr />
        <label htmlFor="email">Email</label>
        <input 
        className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
            id="email"
            type="text"
            value={user.email}
            onChange={(e) => setUser({...user, email: e.target.value})}
            placeholder="email"
            />
        <label htmlFor="password">Password</label>
        <input 
        className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
            id="password"
            type="password"
            value={user.password}
            onChange={(e) => setUser({...user, password: e.target.value})}
            placeholder="password"
            />
            <button
            onClick={onLogin}
            className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600"> Login</button>
            <Link href="/signup">Visit Signup page</Link>
  
        </div>
    )
}
