import React, { useState } from 'react';
import axios from 'axios';
import { faCircleXmark, faCross, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faXmarkCircle } from '@fortawesome/free-regular-svg-icons';
import SearchResultBox from './searchResults';
import { extractNutrientValue } from '@/lib/utils';
import Loader from './loader/loader';

type Category = 'Breakfast' | 'MorningSnack' | 'Lunch' | 'EveningSnack' | 'Dinner';
export interface UserItem {
  itemName: string;
  foodMacros: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  quantity: number;
  totalMacros: {
    totalCalories: number;
   totalProtein: number;
    totalCarbs: number;
    totalFat: number;
  };
}
interface FoodSearchPopupProps {
  category:Category;
  onClose: () => void;
  onSelectItem: (category: Category, item: UserItem) => void;

}
interface foodInfo{
  food_description: string,

food_id
: 
string,
food_name
: 
string,
food_type
: 
string,
food_url
: 
string,
}
const FoodSearchPopup: React.FC<FoodSearchPopupProps> = ({ category, onClose, onSelectItem }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<object[]>([]);
  const [itemQuantity, setItemQuantity] = useState(1);
const[loading,setLoading ] = useState(false)

  const [selectedItem,setSelectedItem] = useState ({
    food_description: " ",

    food_id
    : 
   " ",
    food_name
    : 
    " ",
    food_type
    : 
    " ",
    food_url
    : 
    " ",
  })

  const debounce = (func: (...args: any[]) => void, delay: number) => {
    let timeout: NodeJS.Timeout | undefined;
    return function (this: any, ...args: any[]) {
      if (timeout) {
        clearTimeout(timeout);
      }
      timeout = setTimeout(() => func.apply(this, args), delay);
    };
  };
  
  // Search function that makes an API call
  const search = async (query: string) => {
    if (query === "") {
      setSearchResults([]);
      return;
    }
    try {
      const response = await axios.post(`/api/nutrition/trackfood`, null, {
        params: { food: query },
      });
      const data = response.data;
      setSearchResults(data.data.foods.food)
 
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  // Debounced version of the search function
  const fetchResult = debounce(search, 2000);

  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoading(true)
   
    setSearchQuery(e.target.value)

   if (e.target.value.length > 2) {
    
    fetchResult(e.target.value)
 
     
     
   }
   
  };
 

  const handleSelectItem = () => {
    let fetchInfo = selectedItem.food_description.split("|")
    const foodMacros = extractNutrientValue(fetchInfo)

    
  const totalCalories = foodMacros.calories * itemQuantity
    const totalProtein = foodMacros.protein * itemQuantity
 const   totalCarbs = foodMacros.carbs * itemQuantity
const   totalFat  =foodMacros.fat * itemQuantity



  
    
    onSelectItem(category, {itemName : searchQuery , quantity : itemQuantity, foodMacros ,totalMacros :{totalCalories,totalCarbs,totalFat,totalProtein}  });
    onClose()
   
  };

 
  // Example usage

 const handleSubmit=(item : foodInfo)=>{
  setSelectedItem(item)
 setSearchQuery(item.food_name)
 setSearchResults([])
 }
  
 

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-100 flex items-center justify-center  z-100">
      <div className="bg-white p-4 rounded shadow-lg    w-1/2">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Add  {category}  Item</h2>
          <button onClick={onClose} className="text-red-500">
          <FontAwesomeIcon icon={faXmarkCircle} size='xl' />
            </button>
        </div>
        <div className='  flex items-center '>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          className="border p-2 w-full"
          placeholder="Search food items..."
        />
         <input 
         onChange={(e: React.ChangeEvent<HTMLInputElement>)=>setItemQuantity(parseInt(e.target.value))}
          type="number"
      
          value={itemQuantity}
          className='border p-2 ml-3 w-16  '
            min={0}  />
         <button className=' w-20 ml-2 bg-foreground rounded-md p-2 text-background' onClick={handleSelectItem} >Add</button>
         </div>
        {searchResults.length > 0 ? (
          <ul className="border mt-2 max-h-40 overflow-y-auto   z-10">
            {searchResults.map((item, index) => (
             <SearchResultBox key={index} item={item}  handleSubmit ={handleSubmit}/>
            ))
            
            }
          </ul>
        
      ) :
      <div className=' flex items-center justify-center mt-4'>
        { loading &&
        <>
         <Loader/>
        <p className=' ml-3'> Fetching...</p>
        </>
}
      </div>
    }
      </div>
    </div>
  );
};

export default FoodSearchPopup;
