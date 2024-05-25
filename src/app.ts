import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";

import { WeatherData ,MailOptions} from "./types/types";
import { fetchWeatherData,getWeatherData ,sendEmail} from "./services/logic";
dotenv.config({
    path: "./.env",
});
const app=express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());


app.get("/",(req:Request,res:Response)=>{
    res.send("this is testing server ...Viraj this side");
})



app.post("/api/SaveWeatherMapping", async (req: Request, res: Response) => {
    try {
      const cities: WeatherData[] = req.body;
      const weatherData = await fetchWeatherData(cities);
      res.status(200).json(weatherData);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal server error');
    }
  });


//given parameter!= still works 
app.get('/api/weatherDashboard/:city?', async (req: Request, res: Response) => {
    try {
      const { city } = req.params;
      const weatherData = await getWeatherData(city);
      res.status(200).json(weatherData);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal server error');
    }
  });
  




// Route handler
app.post('/api/MailApi', async (req:Request, res:Response) => {
  const { email } = req.body;

  // Validate email and message
  if (!email ) {
    return res.status(400).send('Please enter a proper email id ?');
  }

  // Setup email data
  const mailOptions: MailOptions = {
    from: process.env.EMAIL_USER || '', 
    to: email,
    subject: 'THIS IS A TEST EMAIL',
    text: 'This is a test email sent from the Node.js server'
  };

  // Send email using the sendEmail function
  try {
    await sendEmail(mailOptions);
    return res.status(200).send('Email sent');
  } catch (error) {
    console.error(error);
    return res.status(500).send('Error sending email');
  }
});


app.listen(process.env.PORT,()=>{
    console.log(`Server is running on port ${process.env.PORT}`);
})