import mongoose from "mongoose"
import cors from "cors"
import { feedbackRouter, userRouter } from "./allroutes.js"
export const initapp = (app, express)=>{
    const port =  process.env.PORT
app.use(express.json())
app.use(cors())
app.use('/user', userRouter)
app.use('/feedback', feedbackRouter)
app.all('*', (req, res, next) =>
    res.status(404).json({ message: '404 Not Found URL' }),
  )

mongoose.connect(process.env.DB_URL || "").then(()=>{
  console.log("connected to database")
})
app.listen(port, () => console.log(`Example app listening on port ${port}!`))


}
