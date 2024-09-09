"use client"

import { Component } from "@/components/component/component";
import MyForm from "@/components/component/goalForm";
import Loader from "@/components/component/loader/loader";
import { IUserInfo } from "@/lib/store/authSlice";
import { useAppSelector } from "@/lib/store/store";
import axios from "axios";
import Router from 'next/router';

import { useEffect, useState } from "react";

export default function Home() {

  const userId = useAppSelector(state=>state.auth.userInfo?._id  )
  interface TotalFoodMacros {
    totalCalories: number;
    totalProtein: number;
    totalCarbs: number;
    totalFat: number;
  }

   const [userGoal, setUserGoal] = useState<TotalFoodMacros>({
    totalCalories: 0,
    totalProtein: 0,
    totalCarbs: 0,
    totalFat: 0
   });
   
   
  useEffect(()=>{

    async function fetchUserGoal(){
      const res =  await axios.get(`/api/goal/getUserGoal?userId=${userId}`);
    
      setUserGoal(res.data.userGoal)
    
    }

    fetchUserGoal();

  },[userId])

 
  return (
    <div className=" w-screen h-screen ">
   
    {userGoal ? 
      <Component userGoal={userGoal}/>
       :
        <MyForm/>
      }
  </div>
  );
}
