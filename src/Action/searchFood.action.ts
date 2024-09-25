"use server"
import { connect } from '@/dbConfig/dbConfig';
import UserMeal from '@/models/userMeal.model';
import UserNutrition from '@/models/userNutrition.model';

connect();
// Function to get recent entries for a user
export async function getRecentMeals(userId : string, limit = 7) {
  try {
    const recentMeals = await UserNutrition.find({ userId }).sort({ date: -1 }) // Sort by the most recent date
    .limit(limit);    // Limit the number of results

    return recentMeals;
  } catch (error) {
    console.error("Error fetching recent meals:", error);
    throw new Error("Error fetching recent meals");
  }
}



export const fetchWeeklyMeals = async (userId: string) => {
  const weeklyMeals = await getRecentMeals(userId);


   const dataForGraph = weeklyMeals.reverse().map(meal => ({
    date: new Date(meal.date).toLocaleDateString(),
    totalCalories: meal.totalCalories,
  })); 

  return dataForGraph;
};
