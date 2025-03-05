package vttp.batch5.day35.server.repositories;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Repository;

import jakarta.json.Json;
import jakarta.json.JsonObject;

import static vttp.batch5.day35.server.utils.RedisConstants.*;

import java.io.StringReader;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Repository
public class WeatherRepository {

    @Autowired @Qualifier(REDIS_STRING)
    private RedisTemplate<String, String> template;

    // save weather result json to redis for 15 mins
    // redis command
    // SET <cityUnits> <resultJson>
    public void saveWeather(JsonObject resultJson) {
        template.opsForValue().set(
            String.format("%s+%s", resultJson.getString("city"), resultJson.getString("units")), 
            resultJson.toString(), Duration.ofMinutes(15)
        );
    }

    // retrieve weather jsonString from redis
    // redis command
    // GET <cityUnits>
    public String retrieveWeather(String cityUnits) {
        return template.opsForValue().get(cityUnits);
    }

    // check redis for existing key
    // redis command
    // EXISTS <cityUnits>
    public boolean checkStorage(String cityUnits) {
        return template.hasKey(cityUnits);
    }
    
    // check redis db size
    public int checkNum() {
        return template.keys("*").size();
    }

    // retrieve all from redis
    // keys *
    public List<JsonObject> retrieveRedis() {

        Set<String> keys = template.keys("*"); 
        List<JsonObject> list = new ArrayList<>();

        for (String k : keys) {
            String jsonString = retrieveWeather(k);
            JsonObject jsonObj = Json.createReader(new StringReader(jsonString)).readObject();
            list.add(jsonObj);
        }

        return list;

    }

    // clear all from redis
    public void clearRedis() {
        Set<String> keys = template.keys("*");
        template.delete(keys);
    }

}
