package util;

import map.FluxesMap;
import org.apache.flink.streaming.api.datastream.DataStreamSource;
import org.apache.flink.streaming.api.datastream.KeyedStream;
import org.apache.flink.streaming.api.datastream.SingleOutputStreamOperator;
import sdcc1819.model.Sensor;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class SplitStreamByChemicalCompound {

    private static List<String> compounds = Arrays.asList("PM10", "CO", "NO_2", "SO_2");

    public static FluxesMap split(KeyedStream<Sensor, String> originalStream){
        FluxesMap fluxesMap = new FluxesMap();
        for (String c : compounds) {
            SingleOutputStreamOperator<Sensor> filteredStream = originalStream.filter(s -> s.containsAgent(c));
            fluxesMap.put(c,filteredStream);
        }
        return fluxesMap;
    }
}
