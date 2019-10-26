package sdcc1819.model;

import com.google.gson.annotations.SerializedName;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class Sensor {

    @SerializedName("sensorid")
    private String sensorId;
    public List<AirAgent> values = new ArrayList();

    public Sensor(String sensorId) {
        this.sensorId = sensorId;
    }

}
