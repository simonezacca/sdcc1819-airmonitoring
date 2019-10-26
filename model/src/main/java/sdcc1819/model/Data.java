package sdcc1819.model;

import com.google.gson.annotations.SerializedName;
import java.time.LocalDateTime;
import java.util.ArrayList;

@lombok.Data
public class Data {

    private LocalDateTime datetime;

    @SerializedName("sensing_group_id")
    private String sensingGroupId;
    private ArrayList<Sensor> measurements = null;

    public Data(LocalDateTime dateTime, String sensingGroupId) {
        this.datetime = dateTime;
        this.sensingGroupId = sensingGroupId;
    }

    @Override
    public String toString() {
        return "Data{" +
                "dateTime=" + datetime +
                ", sensing_group_id=" + sensingGroupId +
                ", measurements=" + measurements +
                '}';
    }

    public String toJson() {
        return "{" +
                "\"date\":\"" + datetime + "\"" +
                ", \"NO\":" + "NO" +
                '}';
    }

    /*{
            "sensing_group_id":1,
                "datetime":"2019-10-21 00:00:03",
                "measurements":[
            {
                "sensor_id":2,
                    "values":[
                {
                    "BEN":0
                },
                {
                    "CH42":0
                }
         ]
            },
            {
                "sensor_id":4,
                    "values":[
                {
                    "NO":0
                },
                {
                    "O_3":0
                }
         ]
            }
   ]
        }*/
}
