import express from 'express'
const app = express()
import { config } from 'dotenv'
import { initapp } from './src/initapp.js'
config()
initapp(app,express)

//mongodb+srv://Eyad:LONWaZ48AZvX8FMz@cluster0.np6wx.mongodb.net/grad-project