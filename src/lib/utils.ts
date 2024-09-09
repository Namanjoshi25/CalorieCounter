import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface formDataObject  {
  age: string,
  sex: string,
  height: string,
  weight: string,
  goal: string,
  activityLevel: string,
};

export function calculateCalories(userData :formDataObject){
  const userWeight = parseInt(userData.weight)
  const userHeight=  parseInt(userData.height)
  const userAge = parseInt(userData.age)
  const userLifestyle = userData.activityLevel
  const userGoal = userData.goal
  
 
  let totalCalories

 if(userData.sex == 'male'){
   const bmr1 = (10*userWeight) +(6.25*userHeight) - ( 5*userAge ) +5 
 
   const bmr2 = (13.397*userWeight) +(4.799*userHeight) - ( 5.677*userAge ) + 88.362
   
   totalCalories = (bmr1 + bmr2 )/ 2 ;

  
   
 }else {
  const bmr1=(10*userWeight) +(6.25*userHeight) - ( 5*userAge ) -161
 
  const bmr2 = (9.247*userWeight) +(3.098*userHeight) - ( 4.330*userAge ) +447.593

   totalCalories = (bmr1 + bmr2 )/ 2 ;

  
  
 }
 switch(userLifestyle){
  case "sedentary":
  totalCalories = totalCalories*1.2

  break;
  case "light" :
    totalCalories = totalCalories*1.375
    break;
   case "moderate":
    totalCalories = totalCalories*1.55 
    break;
    case "veryActive":
      totalCalories = totalCalories*1.725
      break;
      case "extraActive" :
        totalCalories = totalCalories*1.9
   
 }
 
 if(userGoal == "gain"){
  totalCalories +=550
 }else if(userGoal == "lose") totalCalories -=550

 return Math.round(totalCalories)

}

export function calculateMacros(calories : number){
  const carb = Math.round( calories * 0.55 / 4)
  const protein  = Math.round(calories * 0.25 / 4)
  const fats = Math.round(calories * 0.20 / 9)

  return {carb,protein ,fats}

}


export const extractNutrientValue = (infoArray: string[]) => {
  let calories = 0, fat = 0, carbs = 0, protein = 0;

  infoArray.forEach(info => {
    if (info.includes('Calories')) {
      calories = parseInt(info.match(/(\d+\.?\d*)kcal/)?.[1] || '0', 10) 
    } else if (info.includes('Fat')) {
      fat = parseFloat(info.match(/(\d+\.?\d*)g/)?.[1] || '0') ;
    } else if (info.includes('Carbs')) {
      carbs = parseFloat(info.match(/(\d+\.?\d*)g/)?.[1] || '0') ;
    } else if (info.includes('Protein')) {
      protein = parseFloat(info.match(/(\d+\.?\d*)g/)?.[1] || '0') ;
    }
  });

  return { calories, fat, carbs, protein };
};


// Output: { calories: 389, fat: 6.9, carbs: 66.27, protein: 16.89 }
