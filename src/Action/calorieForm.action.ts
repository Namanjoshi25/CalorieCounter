"use server"
import { connect } from "@/dbConfig/dbConfig";
import UserGoal from "@/models/userGoal.model";

interface MacrosType {
  carb: number;
  protein: number;  // Fixed typo here
  fats: number;
}

connect();

export default async function storeUserGoal(totalCalories: number, macros: MacrosType, userId: string) {
  try {
    // Find the existing user goal
    let userGoal = await UserGoal.findOne({ userId });

    // If the user goal exists, update it
    if (userGoal) {
      userGoal = await UserGoal.findOneAndUpdate(
        { userId },
        {
          totalCalories,
          totalProtein: macros.protein,  // Fixed typo here
          totalCarbs: macros.carb,
          totalFats: macros.fats,
        },
        { new: true } // Return the updated document
      );
    } else {
      // If the user goal does not exist, create a new one
      userGoal = await UserGoal.create({
        userId,
        totalCalories,
        totalProtein: macros.protein,  // Fixed typo here
        totalCarbs: macros.carb,
        totalFats: macros.fats,
      });
    }

    return true;

  } catch (error) {
    console.error("Error in user goal creation:", error);
    throw error; // Optionally rethrow the error or handle it as needed
  }
}
