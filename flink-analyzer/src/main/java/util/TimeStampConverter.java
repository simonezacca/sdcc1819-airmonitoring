package util;

import java.text.Format;
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.util.Date;

public class TimeStampConverter {

    public static String fromEpochToDate(Long unixTime){

        Date date = new Date(unixTime);
        Format format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        return format.format(date);
    }
}
