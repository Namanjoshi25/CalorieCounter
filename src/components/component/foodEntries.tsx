import { getRecentMeals } from "@/Action/searchFood.action";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"

import { useEffect } from "react"




export default function FoodEntries(userId : any){
const user = userId.userId
    useEffect(()=>{
        async function fetchFoodEntries(){
            const recentMeals = await getRecentMeals(user)
            console.log(recentMeals);
        }
        fetchFoodEntries()
       
    },[])
 return(
    <Card className="bg-card text-card-foreground p-4 flex flex-col gap-4">
          <CardHeader>
            <CardTitle>Recent Entries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="bg-muted rounded-full w-8 h-8 flex items-center justify-center">
                
                  </div>
                  <div>
                    <div className="font-medium">Cheeseburger</div>
                    <div className="text-sm text-muted-foreground">550 calories</div>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">Lunch</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="bg-muted rounded-full w-8 h-8 flex items-center justify-center">
                
                  </div>
                  <div>
                    <div className="font-medium">Apple</div>
                    <div className="text-sm text-muted-foreground">80 calories</div>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">Snack</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="bg-muted rounded-full w-8 h-8 flex items-center justify-center">
                    
                  </div>
                  <div>
                    <div className="font-medium">Caesar Salad</div>
                    <div className="text-sm text-muted-foreground">350 calories</div>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">Dinner</div>
              </div>
            </div>
          </CardContent>
        </Card>
 )
}