import mongoose ,{Mongoose, Schema} from 'mongoose' 

const streakSchema = new  Schema({
 userId : {
    type : Schema.Types.ObjectId,
    required : true
 },
 lastMealLogged : {
    type : Date,
    required : true
 }
})

const UserStreak = mongoose.models.userstreaks || mongoose.model("userstreaks" , streakSchema)

export default UserStreak;