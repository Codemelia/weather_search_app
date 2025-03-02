package vttp.batch5.day35.server.services;

import java.io.StringReader;
import java.time.Instant;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import jakarta.json.Json;
import jakarta.json.JsonObject;
import vttp.batch5.day35.server.repositories.WeatherRepository;

@Service
public class WeatherService {

    @Value("${my.api.key}")
    private String API_KEY;

    @Autowired
    private WeatherRepository weatherRepo;

    private RestTemplate template = new RestTemplate();

    final String BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

    // get weather details from api
    public JsonObject searchWeather(String citySearch, String units) {
        
        // build url to make call
        String fullUrl = UriComponentsBuilder.fromUriString(BASE_URL)
            .queryParam("q", citySearch)
            .queryParam("appid", API_KEY)
            .queryParam("units", units)
            .toUriString();

        // make request to API
        ResponseEntity<String> resp = template.getForEntity(fullUrl, String.class);

        // read string to json
        JsonObject respJson = Json.createReader(new StringReader(resp.getBody()))
            .readObject();

        // city name
        String city = respJson.getString("name");

        // weather main/desc/icon
        JsonObject weatherJson = respJson.getJsonArray("weather").getJsonObject(0);
        String weather = weatherJson.getString("main");
        String description = weatherJson.getString("description");
        String icon = weatherJson.getString("icon");

        // main temp/feels like/pressure/humidity
        JsonObject tempJson = respJson.getJsonObject("main");
        Double temperature = tempJson.getJsonNumber("temp").doubleValue();
        Double feelsLike = tempJson.getJsonNumber("feels_like").doubleValue();
        Integer pressure = tempJson.getInt("pressure");
        Integer humidity = tempJson.getInt("humidity");

        // visibility
        Integer visibility = respJson.getInt("visibility");

        // windspeed
        JsonObject windJson = respJson.getJsonObject("wind");
        Double windspeed = windJson.getJsonNumber("speed").doubleValue();

        // sunrise/sunset
        JsonObject sysJson = respJson.getJsonObject("sys");
        Long sunriseLong = sysJson.getJsonNumber("sunrise").longValue();
        Long sunsetLong = sysJson.getJsonNumber("sunset").longValue();
        Integer timezone = respJson.getInt("timezone"); // timezone

        ZonedDateTime sunrise = Instant.ofEpochSecond(sunriseLong).atZone(ZoneOffset.ofTotalSeconds(timezone));
        ZonedDateTime sunset = Instant.ofEpochSecond(sunsetLong).atZone(ZoneOffset.ofTotalSeconds(timezone));

        // dtf
        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("hh:mm:ss a");

        // gen a UUID for display purpose
        String id = UUID.randomUUID().toString().substring(0, 4);

        // build new json with desired fields
        JsonObject resultJson = Json.createObjectBuilder()
            .add("id", id)
            .add("city", city != null ? city : "Not Available")
            .add("units", units)
            .add("weather", weather != null ? weather : "Not Available")
            .add("description", description != null ? description : "Not Available")
            .add("icon", icon != null ? icon : "")
            .add("temperature", temperature != null ? temperature : 0.0)
            .add("feelsLike", feelsLike != null ? feelsLike : 0.0)
            .add("pressure", pressure != null ? pressure : 0)
            .add("humidity", humidity != null ? humidity : 0)
            .add("visibility", visibility != null ? visibility : 0)
            .add("windspeed", windspeed != null ? windspeed : 0.0)
            .add("sunrise", sunrise != null ? dtf.format(sunrise) : "Not Available")
            .add("sunset", sunset != null ? dtf.format(sunset) : "Not Available")
            .build();

        // return json obj
        return resultJson;

    }

    // save result to redis for 15 minutes
    public void saveWeather(JsonObject resultJson) {
        weatherRepo.saveWeather(resultJson);
    }

    // retrieve result from redis
    public JsonObject retrieveWeather(String cityUnits) {
        
        // get json string
        String weatherString = weatherRepo.retrieveWeather(cityUnits);

        // read json string to json obj
        JsonObject weatherJson = Json.createReader(new StringReader(weatherString))
            .readObject();
    
        return weatherJson;

    }

    // check if redis contains results for specified city + units
    public boolean checkStorage(String cityUnits) {
        return weatherRepo.checkStorage(cityUnits);
    }

    // evaluate retrieval from redis/api call
    public JsonObject getWeather(String city, String units) {

        // concat city name
        String cityUnits = String.format("%s+%s", city, units);

        // retrieve weatherjson from redis if it exists in storage
        // otherwise, make api call to retrieve weather json
        // finally save weather json to redis for 15 mins
        if (checkStorage(cityUnits)) {
            return retrieveWeather(cityUnits);
        } else {
            JsonObject weatherJson = searchWeather(city, units);
            saveWeather(weatherJson);
            return weatherJson;
        }

    }

    // to retrieve data for selective viewing
    public JsonObject retrieveData(String cityUnits) {
    
        try {
            
            // retrieve json string from redis
            String dataString = weatherRepo.retrieveWeather(cityUnits);

            // read json string to json object
            JsonObject dataJson = Json.createReader(new StringReader(dataString)).readObject();

            return dataJson;

        } catch (Exception e) {

            throw e; // throw exception if data does not exist in redis

        }
        

    }
    
}
