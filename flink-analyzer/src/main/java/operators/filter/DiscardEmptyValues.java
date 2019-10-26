package operators.filter;

import org.apache.flink.api.common.functions.FilterFunction;
import sdcc1819.model.Data;
import sdcc1819.model.Sensor;

import java.util.Iterator;

public class DiscardEmptyValues implements FilterFunction<Data>{


    @Override
    public boolean filter(Data value) throws Exception {
    // Se Array measurements è vuoto, scarta
        if(value.getMeasurements().isEmpty()){
            return false;
        }

    // Se non è vuoto, ciclo su tutti i sensori e per ogni sensore devo controllare che values sia non vuoto, se è vuoto lo scarto
        Iterator<Sensor> iter = (value.getMeasurements()).iterator();
        while (iter.hasNext()) {
            Sensor s = iter.next();
            if (s.getValues().isEmpty()) {
                iter.remove();
            }
        }

    // Se measurements ora è vuoto, scartalo
        if(value.getMeasurements().isEmpty()){
            return false;
        }
        return true;
    }
}
