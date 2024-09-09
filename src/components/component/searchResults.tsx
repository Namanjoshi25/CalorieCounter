
export default function searchResults(item : any){

  const handleFoodClick =()=>{
    item.handleSubmit(item.item)
  }
return (
    <div className="  p-2   w-full h-20 flex  gap-10 overflow-hidden z-10 cursor-pointer " onClick={handleFoodClick}>
<h1>{item.item.food_name}</h1>
<p className=" flex">{item.item.food_description}</p>
    </div>
    
    
)
}