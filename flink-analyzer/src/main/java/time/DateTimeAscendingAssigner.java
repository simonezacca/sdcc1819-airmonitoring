package time;

import org.apache.flink.streaming.api.functions.timestamps.AscendingTimestampExtractor;
import sdcc1819.model.Data;

import java.time.ZoneOffset;
import java.util.logging.Logger;

public class DateTimeAscendingAssigner extends AscendingTimestampExtractor<Data>{


    public DateTimeAscendingAssigner() {
    }

    @Override
    public long extractAscendingTimestamp(Data element) {

        return element.getDatetime().toEpochSecond(ZoneOffset.UTC)*1000L;
    }


}
