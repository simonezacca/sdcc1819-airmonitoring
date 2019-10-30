package operators.flatmap;

import org.apache.flink.api.common.functions.FlatMapFunction;
import org.apache.flink.util.Collector;
import sdcc1819.model.AirAgent;
import sdcc1819.model.Data;
import sdcc1819.model.Sensor;

public class SensorExtractor implements FlatMapFunction<Data, Sensor> {

    @Override
    public void flatMap(Data value, Collector<Sensor> out) {
        for (Sensor s: value.getMeasurements()) {
                out.collect(s);
            }
    }
}
