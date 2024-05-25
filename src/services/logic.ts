import dotenv from "dotenv";
import {Weather} from "../models/weather.model";
import nodemailer from 'nodemailer';

import axios from "axios";
import {WeatherData, WeatherResponse,getapiresponse,MailOptions} from "../types/types";
dotenv.config({
    path: "./.env",
});




async function fetchWeatherData(cities: WeatherData[]): Promise<WeatherResponse[]> {
const weatherData: WeatherResponse[] = [];

for (const city of cities) {


    const geoResponse = await axios.get('https://api.api-ninjas.com/v1/geocoding', {
    params: { city: city.city, country: city.country },
    headers: { 'X-Api-Key': process.env.GEO_API_KEY }
    });
    console.log("this is geolocation api respone=======>>>>>",geoResponse)

    const { latitude, longitude } = geoResponse.data[0];


    const weatherResponse = await axios.get('https://weatherapi-com.p.rapidapi.com/current.json', {
    params: { q: `${latitude},${longitude}` },
    headers: {
        'X-RapidAPI-Key': process.env.WEATHER_API_KEY,
        'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com'
    }
    });

    const weather = weatherResponse.data.current.condition.text;
    const time = new Date();

    weatherData.push({
    city: city.city,
    country: city.country,
    weather,
    time,
    longitude,
    latitude
    });

     await Weather.create({
       city: city.city,
       country: city.country,
       weather,
       time,
       Longitude: longitude,
       Latitude: latitude
     });
}

return weatherData;
}



async function getWeatherData(city?: string): Promise<getapiresponse[]> {
    const attributesToExclude = ['Longitude', 'Latitude']; // Defined attributes to exclude
  
    if (city) {
        return  (await Weather.findAll({
                where: { city: city },
                order: [['time', 'ASC']],
                attributes: { exclude: attributesToExclude }, // Exclude specified attributes
        })).map((data:any) => ({
            // ...data.dataValues,      //this can also be done instead of below code
            id: data.id,
            city: data.city,
            country: data.country,
            weather: data.weather,
            date: data.time, // Rename the key to date
        }));
    } else {
        return  (await Weather.findAll({
                order: [['time', 'ASC']],
                attributes: { exclude: attributesToExclude }, // Exclude specified attributes
        })).map((data:any) => ({
            id: data.id,
            city: data.city,
            country: data.country,
            weather: data.weather,
            date: data.time, // Rename the key to date
        }));
    }
  }


  // Create a transporter object
const transporter = nodemailer.createTransport({
    service: 'gmail.com',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });




const sendEmail = async (mailOptions: MailOptions) => {
    try {
        const attributesToExclude = ['Longitude', 'Latitude']; // Defined attributes to exclude

      // Fetch data from the database
      const weatherData = await Weather.findAll({
        order: [['time', 'ASC']],
        attributes: { exclude: attributesToExclude }, // Exclude specified attributes
      });
  
      // Create an HTML table for the weather data
      const tableRows = weatherData.map((data: any) => `
        <tr>
          <td>${data.id}</td>
          <td>${data.city}</td>
          <td>${data.country}</td>
          <td>${data.weather}</td>
          <td>${data.time}</td>
        </tr>
      `).join('');
  
      const table = `
        <table>
          <tr>
            <th>ID</th>
            <th>City</th>
            <th>Country</th>
            <th>Weather</th>
            <th>Date</th>
          </tr>
          ${tableRows}
        </table>
      `;
  
      // Add the table to the email text
      const emailText = `${mailOptions.text}\n\nWeather Data:\n${table}`;
  
      // Update the mailOptions with the new email text
      const updatedMailOptions: MailOptions = {
        ...mailOptions,
        text: emailText,
        html: emailText, // Include the HTML content

      };
  
      // Send the email with the updated mailOptions
      const info = await transporter.sendMail(updatedMailOptions);
      console.log('Email sent: ' + info.response);
      return 'Email sent';
    } catch (error) {
      console.error(error);
      throw new Error('Error sending email');
    }
  };
  




export { fetchWeatherData,getWeatherData,transporter ,sendEmail};