import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import UserStreak from "@/models/userStreak.model";
import { format } from "date-fns";

connect();

export async function  POST(request : NextRequest){
  try {
  

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user');
  

    if (!userId ) {
      return NextResponse.json({ message: "userId or date is not provided" }, { status: 400 });
    }

    // Find the existing log for the user on the same date
    const userLog = await UserStreak.findOne({ userId });

    const logDate = new Date(); // The incoming log date
    const lastLogDate = new Date(userLog?.lastMealLogged);

    // Check if the user log exists for the provided date and update streak
    if (userLog) {
      const differenceInTime = logDate.getTime() - lastLogDate.getTime(); 
      const diffInDays = differenceInTime / (1000 * 3600 * 24);
      if (diffInDays === 1) {
        userLog.streak += 1;
        userLog.lastMealLogged = logDate;
        await userLog.save();
        return NextResponse.json({ message: "Streak updated", streak: userLog.streak }, { status: 200 });
      } else if (diffInDays > 1) {
        userLog.streak = 1; // Reset streak since more than 1 day has passed
        userLog.lastMealLogged = logDate;
        await userLog.save();
        return NextResponse.json({ message: "Streak reset", streak: userLog.streak }, { status: 200 });
      } else {
        return NextResponse.json({ message: "Invalid log date. Cannot log for the past." }, { status: 200 });
      }
    }

    // If no log exists for the user, create a new one
    const newLog = new UserStreak({
      userId: userId,
      lastMealLogged: logDate,
      streak: 1,
    });

    const savedLog = await newLog.save();
    return NextResponse.json({ message: "User Log added", savedLog }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to add to user logs", error }, { status: 200 });
  }
}
export async function GET(request :NextRequest ){
    try {
      const { searchParams } = new URL(request.url);
      const userId = searchParams.get('user');
      const streakData = await UserStreak.findOne({ userId });

      if (!streakData) {
        return NextResponse.json({message : "Track food for mantaining the streak"},{status :200})
      }

        // Calculate and return 
        return NextResponse.json({ message: "Food data logged", streak :  streakData.streak }, { status: 200 });
      } catch (error) {
        console.error("Error while logging food data:", error);
        return NextResponse.json({ message: "Error while logging food data" }, { status: 500 });
      }
    
}

  
  
