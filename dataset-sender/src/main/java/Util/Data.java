package Util;

import java.time.LocalDateTime;
import java.util.ArrayList;

public class Data {

    private LocalDateTime date;
    private long sensing_group_id;
    private ArrayList<Sensor> sensors = null;

    public Data(LocalDateTime date, long sensing_group_id) {
        this.date = date;
        this.sensing_group_id = sensing_group_id;
    }

    @Override
    public String toString() {
        return "Data{" +
                "date=" + date +
                ", sensing_group_id=" + sensing_group_id +
                ", sensors=" + sensors +
                '}';
    }

    public String toJson() {
        return "{" +
                "\"date\":\"" + date + "\"" +
                ", \"NO\":" + "NO" +
                '}';
    }

    public LocalDateTime getDate() {
        return date;
    }

    public void setDate(LocalDateTime date) {
        this.date = date;
    }

    public void setSensing_group_id(long sensing_group_id) {
        this.sensing_group_id = sensing_group_id;
    }

    public void setSensors(ArrayList<Sensor> sensors) {
        this.sensors = sensors;
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
