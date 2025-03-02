package vttp.batch5.day35.server.repositories;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Repository;

import jakarta.json.JsonObject;

import static vttp.batch5.day35.server.utils.RedisConstants.*;

import java.time.Duration;

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
    
}
