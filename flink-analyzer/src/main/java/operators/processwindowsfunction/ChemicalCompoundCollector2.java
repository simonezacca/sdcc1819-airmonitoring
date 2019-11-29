package operators.processwindowsfunction;

import map.CounterMap;
import map.LimitValueMap;
import org.apache.flink.streaming.api.functions.windowing.ProcessWindowFunction;
import org.apache.flink.streaming.api.windowing.windows.TimeWindow;
import org.apache.flink.util.Collector;
import util.TimeStampConverter;

public class ChemicalCompoundCollector2 extends ProcessWindowFunction<Double, String, String, TimeWindow>{

    LimitValueMap limitValueMap = new LimitValueMap();
    Double limitValue;
    String compoundName;
    Integer alarm;

    public ChemicalCompoundCollector2(String compoundName) {
        this.compoundName= compoundName;
        this.limitValue = this.limitValueMap.getLimitValue(this.compoundName)._1();
        this.alarm = 0;
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
                //TODO come gestire sliding window di 15 minuti?
                // Se il valore oltrepassa la soglia genero l'allarme
                this.alarm +=1;
                sb.append(this.alarm);
            }
        }

        out.collect(sb.toString());
        }
}
