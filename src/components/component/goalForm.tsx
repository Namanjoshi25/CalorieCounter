"use client"
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { calculateCalories, calculateMacros } from "@/lib/utils";
import storeUserGoal from "@/Action/calorieForm.action";
import { useAppSelector } from "@/lib/store/store";
import { useRouter } from "next/navigation";



// Define the Zod schema for form validation
const schema = z.object({
  age: z.string().min(1, "Age is required"),
  sex: z.enum(["male", "female"], "Select your gender"),
  height: z.string(),
  weight: z.string(),
  goal: z.enum(["maintain", "lose", "gain"], "Select your goal"),
  activityLevel: z.enum([
    "sedentary",
    "light",
    "moderate",
    "veryActive",
    "extraActive"
  ], "Select your activity level"),

});

type FormData = z.infer<typeof schema>;

const CalorieCalculator: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  const router = useRouter()
const userData = useAppSelector(state => state.auth.userInfo)


  const onSubmit = async (data: FormData) => {
   
    const totalCalories  =calculateCalories(data);
    const macros = calculateMacros(totalCalories);

    const res =   await storeUserGoal(totalCalories, macros,userData._id)
    if(res){
      router.push("/")
    }

     
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-8 border border-gray-300 shadow-md rounded">
      <h1 className="text-2xl font-bold text-center mb-6">Calorie Calculator</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        
        {/* Age */}
        <div>
          <label className="block text-gray-700 font-semibold ">AGE</label>
          <input
            type="number"
            {...register("age")}
            className="w-full mt-1 p-2 border border-gray-300 rounded"
            min={0}
          />
          {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age.message}</p>}
        </div>
        
        {/* Sex */}
        <div>
          <label className="block text-gray-700">SEX</label>
          <div className="flex space-x-4 mt-1">
            <label className="flex items-center">
              <input type="radio" value="male" {...register("sex")} className="mr-2" />
              MALE
            </label>
            <label className="flex items-center">
              <input type="radio" value="female" {...register("sex")} className="mr-2" />
              FEMALE
            </label>
          </div>
          {errors.sex && <p className="text-red-500 text-sm mt-1">{errors.sex.message}</p>}
        </div>

        
        {/* Height */}
        <div>
          <label className="block text-gray-700">HEIGHT</label>
          <div className="flex space-x-4 mt-1">
            <div className=" w-full">
              <label className="text-gray-600 text-sm">CENTIMETERS</label>
              <input
                type="number"
                {...register("height")}
                className="w-full p-2 border border-gray-300 rounded"
                min={0}
              />
            </div>
           
          </div>
        </div>
        
        {/* Weight */}
        <div >
          <label className="block text-gray-700">WEIGHT</label>
          <div className="flex space-x-4 mt-1">
            <div className=" w-full">
            <label className="flex items-center text-sm">
              KILOGRAMS
            </label>
            <input
                type="number"
                {...register("weight")}
                className="w-full p-2 border border-gray-300 rounded"
                min={0}
              />
            </div>
           
          </div>
          {errors.weight && <p className="text-red-500 text-sm mt-1">{errors.weight.message}</p>}
        </div>
        
        {/* Goal */}
        <div>
          <label className="block text-gray-700">Goal</label>
          <div className="flex space-x-4 mt-1">
            <label className="flex items-center">
              <input type="radio" value="maintain" {...register("goal")} className="mr-2" />
              Maintain Current Weight
            </label>
            <label className="flex items-center">
              <input type="radio" value="lose" {...register("goal")} className="mr-2" />
              Lose Weight
            </label>
            <label className="flex items-center">
              <input type="radio" value="gain" {...register("goal")} className="mr-2" />
              Gain Weight
            </label>
          </div>
          {errors.goal && <p className="text-red-500  text-sm mt-1">{errors.goal.message}</p>}
        </div>
        
        {/* Activity Level */}
        <div>
          <label className="block text-gray-700">Current Activity Level</label>
          <div className="space-y-2 mt-1">
            <label className="flex items-center">
              <input type="radio" value="sedentary" {...register("activityLevel")} className="mr-2" />
              Sedentary (Little or no exercise)
            </label>
            <label className="flex items-center">
              <input type="radio" value="light" {...register("activityLevel")} className="mr-2" />
              Lightly active (Light exercise/sports 1-3 days a week)
            </label>
            <label className="flex items-center">
              <input type="radio" value="moderate" {...register("activityLevel")} className="mr-2" />
              Moderately active (Moderate exercise/sports 3-5 days a week)
            </label>
            <label className="flex items-center ">
              <input type="radio" value="veryActive" {...register("activityLevel")} className="mr-2" />
              Very active (Hard exercise/sports 6-7 days a week)
            </label>
            <label className="flex items-center">
              <input type="radio" value="extraActive" {...register("activityLevel")} className="mr-2 p-3 " />
              Extra active (Very hard exercise/sports & physical job)
            </label>
          </div>
          {errors.activityLevel && <p className="text-red-500 text-sm mt-1">{errors.activityLevel.message}</p>}
        </div>

        <button type="submit" className="w-full mt-2  bg-primary rounded-lg text-background text-white p-2 rounded hover:bg-blue-600">
          Calculate
        </button>
      </form>
    </div>
  );
};

export default CalorieCalculator;
