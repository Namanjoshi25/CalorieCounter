import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import UserStreak from "@/models/userStreak.model";
import { format } from "date-fns";

connect();

export async function  POST(request : NextRequest){
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user');
    const date=  searchParams.get('date');
    if (!userId || !date) {
      return NextResponse.json({ message: "userId or date is not provided" }, { status: 400 });
    }
    const userLog = await UserStreak.findOne({userId, date});
    if(userLog) return NextResponse.json({message: "User Log updated"} , {status:200})

      const newLog = new UserStreak({
       userId  :  userId,
       lastMealLogged : date
      })

      const savedLog= await newLog.save();
      return NextResponse.json({message: "User Log added" , savedLog},{status:200})
  } catch (error) {
    return NextResponse.json({message : "Failed to add to user logs"} , {status:500})
  }
}
export async function GET(request :NextRequest ){
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('user');
        
        if (!userId) {
          return NextResponse.json({ message: "userId is not provided" }, { status: 400 });
        }
    
         const streak = await calculateStreak(userId) + 1 ;



        
        // Calculate and return 
        return NextResponse.json({ message: "Food data logged", streak  }, { status: 200 });
      } catch (error) {
        console.error("Error while logging food data:", error);
        return NextResponse.json({ message: "Error while logging food data" }, { status: 500 });
      }
}
async function calculateStreak(userId :string) {
  
    const today = format(new Date(),"MM/dd/yy");
    const formattedToday = format(today,"MM/dd/yy"); // YY-MM-DD
  
    // Fetch meals logged by the user in the last 7 days (up to today)
    const lastWeekMeals = await UserStreak.find({
      userId,
      date: { $lte: today } // Fetch logs only up to today
    }).sort({ date: -1 });  // Sort by date, most recent first
  
    let streak = 0;
    let currentDate = new Date(); // Start from today
  
    // Loop through up to 7 days and check if meals exist for each consecutive day
    for (let i = 0; i < 7; i++) {
      const dateToCheck = new Date(currentDate);
      dateToCheck.setDate(currentDate.getDate() - i);
  
      // Find a meal for the specific date
      const mealForDay = lastWeekMeals.find(meal => {
        const mealDate = new Date(meal.date);
        return mealDate.toDateString() === dateToCheck.toDateString();
      });
  
      if (mealForDay) {
        streak++; // Increment streak if a meal exists for this day
      } else {
        break; // Break the loop if no meal is found, ending the streak
      }
    }
  
    return streak;
  };
  
  
  function isOneDayBefore(date1 : any, date2 :any) {
    const oneDay = 24 * 60 * 60 * 1000; // Milliseconds in one day
    return Math.abs(date1 - date2) === oneDay;
  }
  
   function isSameDay(date1 :Date, date2 :Date) {
    return date1.toDateString() === date2.toDateString();
  } 
  