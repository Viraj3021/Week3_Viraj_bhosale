
interface WeatherData {
city: string;
country: string;
}

interface WeatherResponse {
city: string;
country: string;
weather: string;
time: Date;
longitude: number;
latitude: number;
}

interface getapiresponse {
    id: number;
    city: string;
    country: string;
    weather: string;
    date: Date;
  }

  interface MailOptions {
    from: string;
    to: string;
    subject: string;
    text: string;
    html?: string; // Make html property optional

  }
  

export { WeatherData, WeatherResponse,getapiresponse,MailOptions };