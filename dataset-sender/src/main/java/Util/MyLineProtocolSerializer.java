package Util;

import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;

public class MyLineProtocolSerializer {

    public static List<String> serialize(Data data){
        List<String> results = new ArrayList<>();
        StringBuilder sb = new StringBuilder();
        for(Sensor s: data.getMeasurements()){
            sb.append("air_monitoring,");
            sb.append("sensing_group_id=" + data.getSensing_group_id() + ",");
            sb.append("sensorid=" + s.getSensorid() + " ");
            int size = s.values.size();
            int i = 0;
            for(AirAgent ag: s.values){
                sb.append(ag.name + "=" + ag.value);
                i++;
                if(i < size){
                    sb.append(",");
                }
            }
            sb.append(" ");
            sb.append(data.getDatetime().toEpochSecond(ZoneOffset.ofHours(2))+"000000000");
            results.add(sb.toString());
            sb = new StringBuilder();
        }
        return results;
    }
}
