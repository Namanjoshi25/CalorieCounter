const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define a schema for food macros
const foodMacrosSchema = new Schema({
  calories: { type: Number, required: true },
  carbs: { type: Number, required: true },
  fat: { type: Number, required: true },
  protein: { type: Number, required: true }
}, { _id: false });

// Define a schema for total macros
const totalMacrosSchema = new Schema({
  totalCalories: { type: Number, required: true },
  totalCarbs: { type: Number, required: true },
  totalFat: { type: Number, required: true },
  totalProtein: { type: Number, required: true }
}, { _id: false });

// Define a schema for each meal item
const mealItemSchema = new Schema({
  itemName: { type: String, required: true },
  quantity: { type: Number, required: true },
  foodMacros: { type: foodMacrosSchema, required: true },
  totalMacros: { type: totalMacrosSchema, required: true }
}, { _id: false });

// Define the main schema for user meals
const UserMealSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  Breakfast: [mealItemSchema],
  MorningSnack: [mealItemSchema],
  Lunch: [mealItemSchema],
  EveningSnack: [mealItemSchema],
  Dinner: [mealItemSchema],
  date: {
    type: Date,
    default: Date.now,
    required:true
  }
});

// Create the model from the schema
 const UserMeal =  mongoose.models.usermeals ||   mongoose.model('usermeals', UserMealSchema);
export default UserMeal

