"use client"
import React, { useEffect, useState } from 'react';
import FoodSearchPopup, { UserItem } from '@/components/component/searchFood';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import {format} from 'date-fns'
import axios from 'axios';
import { useAppSelector } from '@/lib/store/store';
import { useRouter } from 'next/navigation';
import { IUserInfo } from '@/lib/store/authSlice';
import DateSlider from '@/components/component/dateSlider';


const TrackFoodPage: React.FC = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const userId = useAppSelector(state => state.auth.userInfo?._id)
  const [date, setDate] = useState<Date> ( new Date(new Date().toLocaleDateString()));
  const [dates, setDates] = useState<Date[]>([]);
  const [dateLimit,setDateLimit] = useState(3)
  const router =  useRouter()

  type Category = 'Breakfast' | 'MorningSnack' | 'Lunch' | 'EveningSnack' | 'Dinner';

  interface FoodMacros {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  }
   interface TotalFoodMacros {
    totalCalories: number;
    totalProtein: number;
    totalCarbs: number;
    totalFat: number;
  }
  // Define the type for an item
  interface Item {
    itemName: string;
    food_description: string;
    foodMacros: FoodMacros ;
    quantity: number;
    totalMacros: TotalFoodMacros;
  }
  
  // Define the type for selectedItems where each category has an array of items
  type SelectedItemsSubType = Item[];
  
  // Define the type for the selectedItems state
  type SelectedItemsType = {
    Breakfast: SelectedItemsSubType;
    MorningSnack: SelectedItemsSubType;
    Lunch: SelectedItemsSubType;
    EveningSnack: SelectedItemsSubType;
    Dinner: SelectedItemsSubType;
  };
 
  const [selectedItems, setSelectedItems] = useState<SelectedItemsType>({
    Breakfast: [],
    MorningSnack: [],
    Lunch: [],
    EveningSnack : [],
    Dinner : []
  });
  const [totalMacros,setTotalMacros] = useState({
  Breakfast: { totalCalories: 0, totalCarbs: 0, totalProtein: 0, totalFat: 0 },
   MorningSnack: { totalCalories: 0, totalCarbs: 0, totalProtein: 0, totalFat: 0 },
   Lunch: { totalCalories: 0, totalCarbs: 0, totalProtein: 0, totalFat: 0 },
    EveningSnack : { totalCalories: 0, totalCarbs: 0, totalProtein: 0, totalFat: 0 },
    Dinner : { totalCalories: 0, totalCarbs: 0, totalProtein: 0, totalFat: 0 }



  })

  

  const handleAddClick = (category: Category) => {
    setSelectedCategory(category);
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setSelectedCategory(null);
  };

  const handleSelectItem = (category:Category, item: UserItem) => {
    if(item.itemName &&  item.quantity){
    setSelectedItems((prev) => ({
      ...prev,
      [category]: [...prev[category], item ],
   
    }));
    }
  };
  const removeFoodItem = (category : Category , index : number)=>{
    setSelectedItems((prev)=>({
      ...prev,
      [category] : prev[category].filter((_, i) => i !== index)
    })
    
    )

  }
  const submitFood = async ()=>{


  const combinedTotalMacros = Object.values(totalMacros).reduce<TotalFoodMacros>((acc , current : TotalFoodMacros  )  => {
    return {
      totalCalories: acc.totalCalories + current.totalCalories,
      totalCarbs: acc.totalCarbs + current.totalCarbs,
      totalProtein: acc.totalProtein + current.totalProtein,
      totalFat: acc.totalFat + current.totalFat
    };
  }, {
    totalCalories: 0,
    totalCarbs: 0,
    totalProtein: 0,
    totalFat: 0
  });
 

  let formatedDate = format(date,"MM/dd/yy")
  

    const saveMeal  =  await axios.post(`/api/nutrition/saveUserMeal?user=${userId}&date=${formatedDate}` ,selectedItems)  
    const saveMealNutrition = await axios.post(`/api/nutrition/saveFoodMacros?user=${userId}&date=${formatedDate}` ,combinedTotalMacros)


    if(saveMeal && saveMealNutrition){ 
      
    
      const userLog = await axios.post(`/api/users/streak?user=${userId}`)
      if(userLog)  router.push("/")
      
      
   
    }

    
  }

 useEffect(() => {
    const calculateTotalMacros = (items :SelectedItemsSubType ) => {
      return items.reduce((acc, item) => {
        return {
          totalCalories: acc.totalCalories + item.totalMacros.totalCalories,
          totalCarbs: acc.totalCarbs + item.totalMacros.totalCarbs,
          totalProtein: acc.totalProtein + item.totalMacros.totalProtein,
          totalFat: acc.totalFat + item.totalMacros.totalFat,
        };
      }, {
        totalCalories: 0,
      totalCarbs: 0,
        totalProtein: 0,
        totalFat: 0,
      });
    };
     
    
  
    setTotalMacros({
      Breakfast: calculateTotalMacros(selectedItems["Breakfast"]),
      MorningSnack:calculateTotalMacros(selectedItems["MorningSnack"]),
      Lunch: calculateTotalMacros(selectedItems["Lunch"]),
       EveningSnack :calculateTotalMacros(selectedItems["EveningSnack"]),
      Dinner: calculateTotalMacros(selectedItems["Dinner"]),
    });
  }, [selectedItems]); 

  useEffect(()=>{
    let formatedDate =  format( date, "MM/dd/yyyy");
    async function fetchFoodLogs() {
      const res = await axios.get(`/api/nutrition/saveUserMeal?user=${userId}&date=${formatedDate}`) 
      if(res.data.userMeal)setSelectedItems(res.data.userMeal)
        else setSelectedItems({
          Breakfast: [],
          MorningSnack: [],
          Lunch: [],
          EveningSnack : [],
          Dinner : []
        })
    }
    fetchFoodLogs()

  },[date])


  //date slider functions
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

 

  const mealCategories: Category[] = ['Breakfast', 'MorningSnack', 'Lunch', 'EveningSnack', 'Dinner'];
 
  return (
    <div className="  max-w-7xl mx-auto p-4 items-center flex-col flex   z-0">
       <DateSlider
        dates={dates}
        onDateSelect={fetchDataForDate}
        onPrevious={handlePrevious}
        onNext={handleNext}
      
        
      />
      <div className='  w-full flex flex-col items-center mt-4 '>
      {mealCategories.map((category :Category ,index ) => (
        <div key={index} className="mb-6 w-full flex-col items-center justify-between">
          <div className=' flex items-center justify-between '>
          <h2 className="text-xl font-bold">
            {category}
            
            </h2>
            <div className=' flex items-center justify-center'>
            <p className=' font-semibold text-sm'>Total Cal- <span className=' bg-primary rounded-md text-background  px-1'> { totalMacros[category].totalCalories }</span></p>
            <button
            className="bg-blue-500 text-white px-4 py-2 hover:text-red-redColor"
            onClick={() => handleAddClick(category)}
          >
            <FontAwesomeIcon icon={faPlus}   size='lg' />
          </button>
            </div>
        
          </div>
       
          <ul>
            {selectedItems[category].map((item , index) => (
              <div key={index} className=' border h-14    rounded-lg flex justify-between  max-w-2xl  mb-3 '>
                
             <div className='ml-2 flex-col justify-between' >
              <div>
              <p className=' font-semibold'> {item.itemName}</p>
              </div>
              <div className='  gap-3 mt-2 items-end flex text-xs'>
              <p> cal- {item.foodMacros.calories}</p> 
            <p> p- {item.foodMacros.protein}</p> 
           <p> c- {item.foodMacros.carbs}</p> 
            <p>f- {item.foodMacros.fat}</p>

              </div>
            
         
            </div>

             <div className=' ml-2 flex justify-between items-center mt-1 '>
             
             <p  className=' mr-4 '> {item.quantity}</p>
             
             <button onClick={()=>removeFoodItem(category,index)} id={item.itemName} className=' text-xs mr-2  hover:text-red-redColor hover:underline  '> <FontAwesomeIcon icon={faMinus } size='lg'/></button>
            
            </div>
              </div>
            ))}
          </ul>
      
        </div>
      ))}
   
      <button onClick={submitFood} className=' p-2 rounded-lg text-background bg-primary' >Track</button>
 

      {showPopup && selectedCategory && (
        <FoodSearchPopup
          category={selectedCategory}
          onClose={handleClosePopup}
          onSelectItem={handleSelectItem}
       
        />
      )}
      </div>
    </div>
  );
};

export default TrackFoodPage;
