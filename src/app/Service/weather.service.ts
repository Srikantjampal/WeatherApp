import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocationDetails } from '../Models/LocationDetails';
import { WeatherDetails } from '../Models/WeatherDetails';
import { TodaysData } from '../Models/TodayData';
import { WeekData } from '../Models/WeekData';
import { TodaysHighlight } from '../Models/TodaysHighlight';
import { TemperatureData } from '../Models/TemperatureData';
import { Observable } from 'rxjs';
import { EnvironmentalVariables } from '../Environment/EnvironmentVariables';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  locationDetails?: LocationDetails;
  weatherDetials?: WeatherDetails;

  temperatureData: TemperatureData = new TemperatureData(); // left-Container-data

  // Right-container-data
  todayData?: TodaysData[] ;
  weekData?: WeekData[];
  todaysHighlight: TodaysHighlight ;

  // varibales ot be used for api calls
  cityName: string = 'Mumbai';
  language: string = 'en-US'; //default Language is English.
  date: string = '20200622';
  units: string = 'm';

  currentTime: Date;

  // variables to control tabs
  today:boolean = false;
  week:boolean = true;

  celsius:boolean = true;
  fahrenhiet:boolean = false;


  constructor(private httpClient: HttpClient) {
    this.getData();
  }

  getSummaryImage(summary: string): string {
    var baseAddress = 'assets/';
    var cloudySunny = 'cloudy-day.png';
    var rainy = 'rainy-day.png';
    var windy = 'windy.png';
    var sunrise = 'sunrise.png';
    var sunset = 'sunset.png';
    var heavyRain = 'storm.png';
    var sunny = 'sun.png';

    if (
      String(summary).includes('Partly Cloudy') ||
      String(summary).includes('P Cloudy')
    )
      return baseAddress + sunny;
    else if (
      String(summary).includes('Partly Rainy') ||
      String(summary).includes('P Rainy')
    )
      return baseAddress + rainy;
    else if (String(summary).includes('wind')) return baseAddress + windy;
    else if (String(summary).includes('rain')) return baseAddress + rainy;
    else if (String(summary).includes('Sun')) return baseAddress + sunny;

    return baseAddress + cloudySunny;
  }

  // method to create a chunk for left container using temperature data
  fillTemperatureDataModel() {
    this.currentTime = new Date();
    this.temperatureData.day =
      this.weatherDetials['v3-wx-observations-current'].dayOfWeek;
    this.temperatureData.time = `${String(this.currentTime.getHours()).padStart(
      2,
      '0'
    )}:${String(this.currentTime.getMinutes()).padStart(2, '0')}`;

    this.temperatureData.temperature =
      this.weatherDetials['v3-wx-observations-current'].temperature;
    this.temperatureData.location = `${this.locationDetails.location.city[0]},${this.locationDetails.location.country[0]}`;
    this.temperatureData.rainPercent =
      this.weatherDetials['v3-wx-observations-current'].precip24Hour;
    this.temperatureData.summaryPhrase =
      this.weatherDetials['v3-wx-observations-current'].wxPhraseShort;
    this.temperatureData.summaryImage = this.getSummaryImage(
      this.temperatureData.summaryPhrase
    );
  }

  fillWeekData() {
    let weekCount = 0;

    while (weekCount < 7) {
      this.weekData.push(new WeekData());
      this.weekData[weekCount].day = this.weatherDetials[
        'v3-wx-forecast-daily-15day'
      ].dayOfWeek[weekCount].slice(0, 3);
      this.weekData[weekCount].tempMax =
        this.weatherDetials[
          'v3-wx-forecast-daily-15day'
        ].calendarDayTemperatureMax[weekCount];
      this.weekData[weekCount].tempMin =
        this.weatherDetials[
          'v3-wx-forecast-daily-15day'
        ].calendarDayTemperatureMin[weekCount];
      this.weekData[weekCount].summaryImage = this.getSummaryImage(
        this.weatherDetials['v3-wx-forecast-daily-15day'].narrative[weekCount]
      );
      weekCount++;
    }
  }

  fillTodayData() {
    let todayCount = 0;

    while (todayCount < 7) {
      this.todayData.push(new TodaysData());
      this.todayData[todayCount].time = this.weatherDetials[
        'v3-wx-forecast-hourly-10day'
      ].validTimeLocal[todayCount].slice(11, 16);
      this.todayData[todayCount].temperature =
        this.weatherDetials['v3-wx-forecast-hourly-10day'].temperature[
          todayCount
        ];
      this.todayData[todayCount].summaryImage = this.getSummaryImage(
        this.weatherDetials['v3-wx-forecast-hourly-10day'].wxPhraseShort[
          todayCount
        ]
      );
      todayCount++;
    }
  }

  getTimeFromString(localTime:string):string{
    return localTime.slice(11,16);
  }
  // method to get today's highlight data from the base variable
  fillTodaysHighlight(){
    this.todaysHighlight.airQuality = this.weatherDetials['v3-wx-globalAirQuality'].globalairquality.airQualityIndex;
    this.todaysHighlight.humidity = this.weatherDetials['v3-wx-observations-current'].relativeHumidity;
    this.todaysHighlight.sunrise = this.getTimeFromString(this.weatherDetials['v3-wx-observations-current'].sunriseTimeLocal);
    this.todaysHighlight.sunset = this.getTimeFromString(this.weatherDetials['v3-wx-observations-current'].sunsetTimeLocal);
    this.todaysHighlight.uvIndex = this.weatherDetials['v3-wx-observations-current'].uvIndex;
    this.todaysHighlight.visiblity = this.weatherDetials['v3-wx-observations-current'].visibility;
    this.todaysHighlight.windStatus = this.weatherDetials['v3-wx-observations-current'].windSpeed;
  }

  // method to create usefull data chunks for ui using th e==e data recieved from the api
  prepareData(): void {
    // setting left container data model properties

    this.fillTemperatureDataModel();
    this.fillWeekData();
    this.fillTodayData();
    this.fillTodaysHighlight();
    // console.log(this.temperatureData);
    // console.log(this.weekData);
    // console.log(this.todayData);
  }


  // Conversion
    celsiusToFahrenheit(celsius:number):number{
      return +((celsius * 1.8) + 32).toFixed(2);
    }
    fahrenheitToCelsius(fahrenheit:number):number{
      return +((fahrenheit - 32) / 1.8).toFixed(2);
    }




  // method to get location details from the api using the variable cityname as the input.
  getLocationDetails(
    cityName: string,
    language: string
  ): Observable<LocationDetails> {
    return this.httpClient.get<LocationDetails>(
      EnvironmentalVariables.weatherApiLocationBaseURL,
      {
        headers: new HttpHeaders()
          .set(
            EnvironmentalVariables.xRapidApiKeyName,
            EnvironmentalVariables.xRapidApikeyValue
          )
          .set(
            EnvironmentalVariables.xRapidApiHostName,
            EnvironmentalVariables.xRapidApiHostValue
          ),
        params: new HttpParams()
          .set('query', cityName)
          .set('lannguage', language),
      }
    );
  }

  getWeatherReport(
    date: string,
    latitude: number,
    longitude: number,
    language: string,
    units: string
  ): Observable<WeatherDetails> {
    return this.httpClient.get<WeatherDetails>(
      EnvironmentalVariables.weatherApiForecastBaseURL,
      {
        headers: new HttpHeaders()
          .set(
            EnvironmentalVariables.xRapidApiKeyName,
            EnvironmentalVariables.xRapidApikeyValue
          )
          .set(
            EnvironmentalVariables.xRapidApiHostName,
            EnvironmentalVariables.xRapidApiHostValue
          ),
        params: new HttpParams()
          .set('date', date)
          .set('latitude', latitude)
          .set('longitude', longitude)
          .set('language', language)
          .set('units', units),
      }
    );
  }

  getData() {
    this.todayData = [];
    this.weekData = [];
    this.temperatureData = new TemperatureData();
    this.todaysHighlight = new  TodaysHighlight();
    let latitude = 0;
    let longitude = 0;
    this.getLocationDetails(this.cityName, this.language).subscribe({
      next: (response) => {
        this.locationDetails = response;
        latitude = this.locationDetails.location.latitude[0];
        latitude = this.locationDetails.location.latitude[0];

        // once we got the values of latitude and longitude then we can call other method
        this.getWeatherReport(
          this.date,
          latitude,
          longitude,
          this.language,
          this.units
        ).subscribe({
          next: (response) => {
            this.weatherDetials = response;

            this.prepareData();
          },
        });
      },
    });
  }
}
