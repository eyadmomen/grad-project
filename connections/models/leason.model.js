import mongoose, { Schema } from 'mongoose'



const leasonSchema = new mongoose.Schema(
    {
 
    title:{
        type:String
    },
    description:{
        type:String
    },
    courseId:{
        type: Schema.Types.ObjectId,
        ref:'Course',
        required:true,
            },
    video:{
      
            secure_url: String,
            public_id: String,
        },
        assignments: [
            {
              userId: {
                type: Schema.Types.ObjectId,
                ref: 'User',
              },
              file: {
                secure_url: String,
                public_id: String,
              },
              submittedAt: {
                type: Date,
                default: Date.now,
              },
            },
          ],

},
{
    timestamps:true
}
);
export const leasonModel = mongoose.model('leason', leasonSchema)