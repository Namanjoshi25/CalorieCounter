
import mongoose,{Schema} from "mongoose";


const userGoalSchema = new Schema({
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
  totalFats: {
    type: Number,
    required: true
  },

});


const UserGoal = mongoose.models.usergoals || mongoose.model("usergoals", userGoalSchema);

export default UserGoal;