import { NextRequest, NextResponse } from "next/server";
import UserNutrition from '@/models/userNutrition.model';
import { connect } from "@/dbConfig/dbConfig";

connect();

export async function POST(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('user');
        const date = searchParams.get("date");
        const data = await request.json();
        
        if (!userId || !date) {
            return NextResponse.json({ message: "userId or date is not provided" }, { status: 400 });
        }
    
        console.log(date);
    
        const userMacros = await UserNutrition.findOne({ userId, date });
 
        if (!userMacros) {
            // Create new record
            const macros = await UserNutrition.create({
                userId,
                date,
                ...data // Ensure that data conforms to the schema
            });
            if (!macros) {
                return NextResponse.json({ message: "Failed to save user nutrition details" }, { status: 500 });
            }
            return NextResponse.json({ message: "User Nutrition Created", macros }, { status: 201 });
        } else {
            // Update existing record
            
            userMacros.set(data);
            const res = await userMacros.save();
            return NextResponse.json({ message: "User Nutrition updated", res }, { status: 200 });
        }
    } catch (error) {
        console.error("Error while working with user meals:", error);
        return NextResponse.json({ message: "Error while working with user nutrition" }, { status: 500 });
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

        const userNutrition = await UserNutrition.findOne({ userId, date }).select(" -_id -userId");
    
        if (!userNutrition) {

          return NextResponse.json({ message: "no User nutrition found" , userNutrition:{
            totalCalories: 0,
            totalProtein:0 ,
            totalCarbs:0,
            totalFat:0 ,
          }} , { status: 200 });
        } else {
    
    
          return NextResponse.json({ message: "User nutrition found",userNutrition}, { status: 200 });
        }
      } catch (error) {
        console.error("Error while working with user nutrition:", error);
        return NextResponse.json({ message: "Error while working with user nutrition" }, { status: 500 });
      }
}