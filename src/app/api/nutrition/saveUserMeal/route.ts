import { NextRequest, NextResponse } from "next/server";
import UserMeal from '@/models/userMeal.model'
import { connect } from "@/dbConfig/dbConfig";

connect()
export async function POST (request :NextRequest){
    try {
        const { searchParams } = new URL(request.url);
      
        const userId = searchParams.get('user');
        const date = searchParams.get("date");
        
        
        if (!userId || !date) {
          return NextResponse.json({ message: "userId or date is not provided" }, { status: 400 });
        }
    
        // Parse the request body
        const data = await request.json();
   
        if (!data) {
          return NextResponse.json({ message: "No data provided" }, { status: 400 });
        }
    
        const userMeal = await UserMeal.findOne({ userId, date });
    
        if (userMeal) {
          userMeal.set(data);
        const res =  await userMeal.save();
          return NextResponse.json({ message: "User meal updated",res }, { status: 200 });
        } else {
          const newMeal = new UserMeal({
            userId,
            date,
            ...data
          });
    
          const res = await newMeal.save();
    
          if (!res) {
            return NextResponse.json({ message: "Failed to create the userMeal" }, { status: 500 });
          }
    
          return NextResponse.json({ message: "User meal created", res }, { status: 200 });
        }
      } catch (error) {
        console.error("Error while working with user meals:", error);
        return NextResponse.json({ message: "Error while working with user meals" }, { status: 500 });
      }
}

export async function GET(request : NextRequest){
    try {
        const { searchParams } = new URL(request.url);
      
        const userId = searchParams.get('user');
        const date = searchParams.get("date");
        
        
        if (!userId || !date) {
          return NextResponse.json({ message: "userId or date is not provided" }, { status: 400 });
        }
    
    
    
        const userMeal = await UserMeal.findOne({ userId, date }).select(" -_id -userId");
    
        if (!userMeal) {

          return NextResponse.json({ message: "no User meal found" , }, { status: 200 });
        } else {
    
    
          return NextResponse.json({ message: "User meal found",userMeal}, { status: 200 });
        }
      } catch (error) {
        console.error("Error while working with user meals:", error);
        return NextResponse.json({ message: "Error while working with user meals" }, { status: 500 });
      }
}