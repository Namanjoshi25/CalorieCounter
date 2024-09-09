import mongoose,{Schema} from "mongoose";

const UserNutritionSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId, // This will store the user's unique ID
    ref: 'User', // Reference to the User model (if you have one)
    required: true
  },
 totalCalories: {
    type: Number,
    required: true
  },
 totalProtein: {
    type: Number,
    required: true
  },
 totalCarbs: {
    type: Number,
    required: true
  },
 totalFat: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});
const  UserNutrition = mongoose.models.usernutritions ||  mongoose.model('usernutritions', UserNutritionSchema);

export default UserNutrition;