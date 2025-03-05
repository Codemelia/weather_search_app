package vttp.batch5.day35.server.models;

public class SearchResult {

    private String id;
    private String city;
    private String units;
    private String weather;
    private String description;
    private String icon;
    private double temperature;
    private double feelsLike;
    private int pressure;
    private int humidity;
    private int visibility;
    private double windspeed;
    private String sunrise;
    private String sunset;
    
    public String getId() {
        return id;
    }
    public void setId(String id) {
        this.id = id;
    }
    public String getCity() {
        return city;
    }
    public void setCity(String city) {
        this.city = city;
    }
    public String getUnits() {
        return units;
    }
    public void setUnits(String units) {
        this.units = units;
    }
    public String getWeather() {
        return weather;
    }
    public void setWeather(String weather) {
        this.weather = weather;
    }
    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }
    public String getIcon() {
        return icon;
    }
    public void setIcon(String icon) {
        this.icon = icon;
    }
    public double getTemperature() {
        return temperature;
    }
    public void setTemperature(double temperature) {
        this.temperature = temperature;
    }
    public double getFeelsLike() {
        return feelsLike;
    }
    public void setFeelsLike(double feelsLike) {
        this.feelsLike = feelsLike;
    }
    public int getPressure() {
        return pressure;
    }
    public void setPressure(int pressure) {
        this.pressure = pressure;
    }
    public int getHumidity() {
        return humidity;
    }
    public void setHumidity(int humidity) {
        this.humidity = humidity;
    }
    public int getVisibility() {
        return visibility;
    }
    public void setVisibility(int visibility) {
        this.visibility = visibility;
    }
    public double getWindspeed() {
        return windspeed;
    }
    public void setWindspeed(double windspeed) {
        this.windspeed = windspeed;
    }
    public String getSunrise() {
        return sunrise;
    }
    public void setSunrise(String sunrise) {
        this.sunrise = sunrise;
    }
    public String getSunset() {
        return sunset;
    }
    public void setSunset(String sunset) {
        this.sunset = sunset;
    }
    
    public SearchResult() {
    }

    public SearchResult(String id, String city, String units, String weather, String description, String icon,
            double temperature, double feelsLike, int pressure, int humidity, int visibility, double windspeed,
            String sunrise, String sunset) {
        this.id = id;
        this.city = city;
        this.units = units;
        this.weather = weather;
        this.description = description;
        this.icon = icon;
        this.temperature = temperature;
        this.feelsLike = feelsLike;
        this.pressure = pressure;
        this.humidity = humidity;
        this.visibility = visibility;
        this.windspeed = windspeed;
        this.sunrise = sunrise;
        this.sunset = sunset;
    } 
    
}
