package sdcc1819.serializers.lineprotocol;

import sdcc1819.model.AirAgent;
import sdcc1819.model.Data;
import sdcc1819.model.Sensor;

import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;

public class AirDataLineProtocolSerializer {

    public static List<String> serialize(Data data){
        List<String> results = new ArrayList<>();
        StringBuilder sb = new StringBuilder();
        for(Sensor s: data.getMeasurements()){
            sb.append("air_monitoring,");
            sb.append("sensing_group_id=" + data.getSensingGroupId() + ",");
            sb.append("sensorid=" + s.getSensorId() + " ");
            int size = s.values.size();
            int i = 0;
            for(AirAgent ag: s.values){
                sb.append(ag.getName() + "=" + ag.getValue());
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
