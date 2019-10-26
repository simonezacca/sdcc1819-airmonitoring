package util;

import org.apache.flink.streaming.api.TimeCharacteristic;
import org.apache.flink.streaming.api.environment.StreamExecutionEnvironment;

public class SDCCExecutionEnvironment {

    public static StreamExecutionEnvironment getExecutionEnvironment() {

        final StreamExecutionEnvironment env = StreamExecutionEnvironment.getExecutionEnvironment();

        // TIME CHARACTERISTIC
        env.setStreamTimeCharacteristic(TimeCharacteristic.EventTime);

        return env;
    }
}