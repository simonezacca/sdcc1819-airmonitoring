package util;

import org.apache.flink.streaming.api.windowing.time.Time;

import java.util.concurrent.TimeUnit;

public class StringToTimeUnit {


    private static final char days = 'd';
    private static final char hours = 'h';

    public static Time stringToFlinkTimeUnit(String s){
        char c = s.charAt(0);
        String p = s.substring(1);
        Long l = Long.parseLong(p);
        if(Character.compare(c, days) == 0){
            return Time.days(l);
        } else if(Character.compare(c, hours) == 0){
            return Time.hours(l);
        }
        return null;
    }

    public static Double stringToExcessForCompound(String s){
        String p = s.substring(1);
        Double d = Double.parseDouble(p);
        return d;
    }
}
