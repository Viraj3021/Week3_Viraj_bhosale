import { DataTypes, Model } from 'sequelize';
import sequelize from '../dbconnection/dbconn';

interface WeatherAttributes {
  id?: number;
  city: string;
  country: string;
  weather: string;
  time: Date;
  Longitude: number;
  Latitude: number;
}

class Weather extends Model<WeatherAttributes> implements WeatherAttributes {
  public id!: number;
  public city!: string;
  public country!: string;
  public weather!: string;
  public time!: Date;
  public Longitude!: number;
  public Latitude!: number;

  // You can define additional methods and associations here
}

Weather.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    weather: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    time: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    Longitude: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    Latitude: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'weather',
    timestamps: false, 
  }
);

export { Weather };
