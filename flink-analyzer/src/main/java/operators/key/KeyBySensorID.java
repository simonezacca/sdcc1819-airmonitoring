package operators.key;

import org.apache.flink.api.java.functions.KeySelector;
import sdcc1819.model.Sensor;

public class KeyBySensorID implements KeySelector<Sensor, String> {

    @Override
    public String getKey(Sensor s) throws Exception {
        return s.getSensorId();
    }
}
