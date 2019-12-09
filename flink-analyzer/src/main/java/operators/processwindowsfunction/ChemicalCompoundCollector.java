package operators.processwindowsfunction;

import com.google.gson.JsonObject;
import map.CounterMap;
import map.LimitValueMap;
import org.apache.flink.streaming.api.functions.windowing.ProcessWindowFunction;
import org.apache.flink.streaming.api.windowing.windows.TimeWindow;
import org.apache.flink.util.Collector;
import util.TimeStampConverter;

public class ChemicalCompoundCollector extends ProcessWindowFunction<Double, JsonObject, String, TimeWindow>{

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
    public void process(String s, Context context, Iterable<Double> elements, Collector<JsonObject> out) {
        StringBuilder sb = new StringBuilder();
        Double average = 0.0;
        String date = TimeStampConverter.fromEpochToDate(context.window().getStart());
        sb.append(date + " ");
        sb.append("sensorId: "+s+"\t");

        for (Double d: elements) {
            sb.append(d+"\t");
            if(d.longValue() >= this.limitValue){
                this.counterMap.hit(s);
            }
            average = new Double(d);
        }
        if (counterMap.containsKey(s)) {
            sb.append("Limit Value Counter: " + this.counterMap.get(s));
        }
        //out.collect(sb.toString());
        System.out.println("Stat: " + sb.toString());
        out.collect(writeToJson(compoundName, average, s, context.window().getStart()));
        }


    private JsonObject writeToJson(String chemicalCompound, double value, String sensor_id, long timestamp) {
        JsonObject jsonObject = new JsonObject();
        jsonObject.addProperty("chemical_compound", chemicalCompound);
        jsonObject.addProperty("value", Double.toString(value));
        jsonObject.addProperty("sensor_id", sensor_id);
        jsonObject.addProperty("timestamp", Long.toString(timestamp));
        return jsonObject;
    }
}
