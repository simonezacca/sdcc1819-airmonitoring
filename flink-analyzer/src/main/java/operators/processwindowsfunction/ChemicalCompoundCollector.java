package operators.processwindowsfunction;

import map.CounterMap;
import map.LimitValueMap;
import org.apache.flink.streaming.api.functions.windowing.ProcessWindowFunction;
import org.apache.flink.streaming.api.windowing.windows.TimeWindow;
import org.apache.flink.util.Collector;
import util.TimeStampConverter;

import java.text.Format;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

public class ChemicalCompoundCollector extends ProcessWindowFunction<Double, String, String, TimeWindow>{

    LimitValueMap limitValueMap = new LimitValueMap();
    Double limitValue;
    String compoundName;
    CounterMap counterMap;

    public ChemicalCompoundCollector(String compoundName) {
        this.compoundName= compoundName;
        this.limitValue = this.limitValueMap.getLimitValue(this.compoundName)._1();
        this.counterMap = new CounterMap();
    }

    @Override
    public void process(String s, Context context, Iterable<Double> elements, Collector<String> out) {
        StringBuilder sb = new StringBuilder();
        String date = TimeStampConverter.fromEpochToDate(context.window().getStart());
        sb.append(date + " ");
        sb.append("sensorId: "+s+"\t");

        for (Double d: elements) {
            sb.append(d+"\t");
            if(d.longValue() >= this.limitValue){
                // TODO Bisogna gestire hit multiple
                this.counterMap.hit(s);
            }
        }
        if (counterMap.containsKey(s)) {
            sb.append("Limit Value Counter: " + this.counterMap.get(s));
        }
        out.collect(sb.toString());
        }
}
