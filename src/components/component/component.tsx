
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"
import axios from "axios"
import { useAppSelector } from "@/lib/store/store"
import { format } from "date-fns"
import DateSlider from "./dateSlider"
import { getRecentMeals } from "@/Action/searchFood.action"
import FoodEntries from "./foodEntries"
import CaloriesGraph from "./nutritionGraph"
interface TotalFoodMacros {
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFats: number;
}
interface ComponentProps {
  userGoal: TotalFoodMacros;
}

export function Component({userGoal} : ComponentProps) {
  const userId = useAppSelector(state => state.auth.userInfo?._id)
  const [date, setDate] = useState<Date> ( new Date());
  const [dates, setDates] = useState<Date[]>([]);
const [dateLimit,setDateLimit] = useState(7)
  const [streak,setStreak] = useState(0)// This will track the start date for the current view

  const [userMacros ,setUserMacros] = useState({
    totalCalories: 0,
    totalProtein:0 ,
    totalCarbs:0,
    totalFat:0 ,
  })
   
 

  function getProgress(){
    if(userMacros){
      const progress = Math.floor(( userMacros.totalCalories /userGoal.totalCalories ) * 100);
      
      return progress
    }else return 0;
   
   
  }
  useEffect(()=>{
    async function fetchUserMacros(){
      const formatedDate =format(date , "MM/dd/yy")
    const res = await axios.get(`/api/nutrition/saveFoodMacros?user=${userId}&date=${formatedDate}`)
    if(res.data ){
      setUserMacros(res.data.userNutrition)
      
    }
    const res2 = await axios.get(`/api/users/streak?user=${userId}`)
 
    if(res2.data) setStreak(res2.data.streak)

      
    }
    fetchUserMacros()

  },[date])
  
  useEffect(() => {
    // Function to set the limit based on screen size
    const updateDateLimit = () => {
      const width = window.innerWidth;
      if (width < 650) setDateLimit(1);  // Only show 1 date on small screens
      else if (width >= 650 && width < 950) setDateLimit(3); 
      else if (width >= 950 && width < 1150) setDateLimit(5)// Show 3 dates on medium screens
      else setDateLimit(7);  // Show 7 dates on large screens
    };

    // Initialize the slider with the date range
    const today = new Date();
    updateDateLimit();
    setDates(generateDateRange(today, dateLimit));

    // Update the dateLimit when resizing the window
    window.addEventListener('resize', updateDateLimit);

    return () => {
      window.removeEventListener('resize', updateDateLimit);
    };
  }, [dateLimit]);

  // Function to generate an array of dates for the given range with today's date in the middle
  const generateDateRange = (centerDate: Date, days: number): Date[] => {
    const datesArray: Date[] = [];
    const startDate = new Date(centerDate);
    const midPoint = Math.floor(days / 2);

    // Start from the date before the midpoint
    startDate.setDate(centerDate.getDate() - midPoint);

    for (let i = 0; i < days; i++) {
      datesArray.push(new Date(startDate));
      startDate.setDate(startDate.getDate() + 1);
    }

    return datesArray;
  };

  const handlePrevious = () => {
    const newStartDate = new Date(dates[0]);
    newStartDate.setDate(newStartDate.getDate() - dateLimit);
    const previousDates = generateDateRange(newStartDate, dateLimit);
    setDates(previousDates);
  };

  const handleNext = () => {
    const newStartDate = new Date(dates[Math.floor(dateLimit / 2)]);
    newStartDate.setDate(newStartDate.getDate() + dateLimit);
    const nextDates = generateDateRange(newStartDate, dateLimit);
    setDates(nextDates);
  };

  const fetchDataForDate = async (date: Date) => {
    setDate(date);
    // Fetch data logic here based on the selected date
  };


  return (
    <div className="flex flex-col items-center justify-center ">
     <DateSlider
        dates={dates}
        onDateSelect={fetchDataForDate}
        onPrevious={handlePrevious}
        onNext={handleNext}
        
      />
     
      <main className="flex-1 bg-background p-6 grid gap-6 sm:flex-col ">
        <div className="grid grid-cols-3 gap-6  max-sm:grid-cols-1">
          <Card className="bg-card text-card-foreground p-4 flex flex-col gap-2">
            <CardHeader>
              <CardTitle>Daily Calories</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex items-center justify-center">
              <div className="text-4xl font-bold">{userMacros.totalCalories}</div>
            </CardContent>
            <CardFooter>
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground font-bold">Goal:{userGoal.totalCalories}</div>
                <div className="text-sm text-muted-foreground">| {Math.round(userGoal.totalCalories - userMacros.totalCalories)} left</div>
              </div>
            </CardFooter>
          </Card>
          <Card className="bg-card text-card-foreground p-4 flex flex-col gap-2">
            <CardHeader>
              <CardTitle>Protein</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex items-center justify-center">
              <div className="text-4xl font-bold">{userMacros.totalProtein}</div>
            </CardContent>
            <CardFooter>
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground font-bold">Goal: {userGoal.totalProtein}</div>
                <div className="text-sm text-muted-foreground">| {Math.round(userGoal.totalProtein - userMacros.totalProtein)}g left</div>
              </div>
            </CardFooter>
          </Card>
          <Card className="bg-card text-card-foreground p-4 flex flex-col gap-2">
            <CardHeader>
              <CardTitle>Carbs</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex items-center justify-center">
              <div className="text-4xl font-bold">{userMacros.totalCarbs}</div>
            </CardContent>
            <CardFooter>
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground font-bold">Goal: {userGoal.totalCarbs} </div>
                <div className="text-sm text-muted-foreground"> | {Math.round(userGoal.totalCarbs - userMacros.totalCarbs)}g left</div>
              </div>
            </CardFooter>
          </Card>
        </div>
        <div className="grid grid-cols-3 gap-6 max-sm:grid-cols-1" >
          <Card className="bg-card text-card-foreground p-4 flex flex-col gap-2">
            <CardHeader>
              <CardTitle>Fat</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex items-center justify-center">
              <div className="text-4xl font-bold">{userMacros.totalFat}</div>
            </CardContent>
            <CardFooter>
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground font-bold">Goal: {userGoal.totalFats}</div>
                <div className="text-sm text-muted-foreground">| {Math.round(userGoal.totalFats - userMacros.totalFat)}g left</div>
              </div>
            </CardFooter>
          </Card>
          <Card className="bg-card text-card-foreground rounded-lg p-4 flex flex-col gap-2">
            <CardHeader>
              <CardTitle>Progress</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col items-center justify-center">
              <Progress value={getProgress()} className="w-full rounded-md " />
              <div className="text-sm text-muted-foreground mt-2"><span className=" font-bold">{getProgress()} %</span>  of goal</div>
            </CardContent>
          </Card>
          <Card className="bg-card text-card-foreground p-4 flex flex-col gap-2">
            <CardHeader>
              <CardTitle>Streak</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex items-center justify-center">
              <div className="text-4xl font-bold">{streak}</div>
            </CardContent>
            <CardFooter>
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">Days</div>
              </div>
            </CardFooter>
          </Card>
        </div>
        <CaloriesGraph userId={userId!} goalCalories={userGoal.totalCalories} />
        
      </main>
    </div>
  )
}



