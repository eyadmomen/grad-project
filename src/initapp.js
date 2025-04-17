import { connectionDB } from "../connections/dbconnection.js"
import { feedbackRouter, userRouter } from "./allroutes.js"


export const initapp = (app, express)=>{
    const port =  5000
app.use(express.json())
connectionDB()
app.use('/user', userRouter)
app.use('/feedback', feedbackRouter)
app.all('*', (req, res, next) =>
    res.status(404).json({ message: '404 Not Found URL' }),
  )
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
}