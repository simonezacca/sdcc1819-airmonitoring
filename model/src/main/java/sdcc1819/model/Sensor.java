package sdcc1819.model;

import com.google.gson.annotations.SerializedName;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class Sensor {

    @SerializedName("sensorid")
    public String sensorId;
    public List<AirAgent> values = new ArrayList();

    public Sensor(String sensorId) {
        this.sensorId = sensorId;
    }

    public boolean containsAgent(String nameAgent){
        for (AirAgent a: values) {
            if(a.name.equals(nameAgent)){
                return true;
            }
        }
        return false;
    }

    public AirAgent getAgentByName(String nameAgent){
        for (AirAgent a: values) {
            if(a.name.equals(nameAgent)){
                return a;
            }
        }
        return null;
    }

}
