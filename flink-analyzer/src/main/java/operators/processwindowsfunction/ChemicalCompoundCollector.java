package operators.processwindowsfunction;

import org.apache.flink.streaming.api.functions.windowing.ProcessWindowFunction;
import org.apache.flink.streaming.api.windowing.windows.TimeWindow;
import org.apache.flink.util.Collector;
import util.TimeStampConverter;

import java.text.Format;
import java.text.SimpleDateFormat;
import java.util.Date;

public class ChemicalCompoundCollector extends ProcessWindowFunction<Double, String, String, TimeWindow>{


    @Override
public void process(String s, Context context, Iterable<Double> elements, Collector<String> out) throws Exception {
        StringBuilder sb = new StringBuilder();
        String date = TimeStampConverter.fromEpochToDate(context.window().getStart());
        sb.append(date + " ");
        sb.append("sensorId: "+s+"\t");
        for (Double d: elements) {
            sb.append(d);
        }
        out.collect(sb.toString());
        }
}
