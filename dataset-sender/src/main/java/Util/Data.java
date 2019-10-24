package Util;

import java.time.LocalDateTime;
import java.util.ArrayList;

public class Data {

    private LocalDateTime datetime;
    private long sensing_group_id;
    private ArrayList<Sensor> measurements = null;

    public Data(LocalDateTime dateTime, long sensing_group_id) {
        this.datetime = dateTime;
        this.sensing_group_id = sensing_group_id;
    }

    @Override
    public String toString() {
        return "Data{" +
                "dateTime=" + datetime +
                ", sensing_group_id=" + sensing_group_id +
                ", measurements=" + measurements +
                '}';
    }

    public String toJson() {
        return "{" +
                "\"date\":\"" + datetime + "\"" +
                ", \"NO\":" + "NO" +
                '}';
    }

    public LocalDateTime getDatetime() {
        return datetime;
    }

    public void setDatetime(LocalDateTime datetime) {
        this.datetime = datetime;
    }

    public void setSensing_group_id(long sensing_group_id) {
        this.sensing_group_id = sensing_group_id;
    }

    public void setMeasurements(ArrayList<Sensor> measurements) {
        this.measurements = measurements;
    }

    public long getSensing_group_id() {
        return sensing_group_id;
    }

    public ArrayList<Sensor> getMeasurements() {
        return measurements;
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
