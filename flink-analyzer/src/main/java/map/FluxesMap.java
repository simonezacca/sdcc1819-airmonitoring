package map;

import org.apache.flink.streaming.api.datastream.KeyedStream;
import org.apache.flink.streaming.api.datastream.SingleOutputStreamOperator;
import sdcc1819.model.Sensor;

import java.util.HashMap;

public class FluxesMap extends HashMap<String, SingleOutputStreamOperator<Sensor>> {




}
