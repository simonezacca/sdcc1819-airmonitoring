package operators.processwindowsfunction;

import com.amazonaws.auth.EnvironmentVariableCredentialsProvider;
import com.amazonaws.services.sns.AmazonSNS;
import com.amazonaws.services.sns.AmazonSNSClientBuilder;
import com.amazonaws.services.sns.model.PublishRequest;
import com.amazonaws.services.sns.model.PublishResult;
import com.google.gson.JsonObject;
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
    AmazonSNSClientBuilder builder;
    AmazonSNS client;
    String topicArn = "arn:aws:sqs:eu-central-1:402165574974:air-monitoring-query2";

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
                init();

                // Publish a message to an Amazon SNS topic.
                JsonObject jsonAlarm = writeJsonAlarm(compoundName, s, d.longValue(), context.window().getStart());
                PublishRequest publishRequest = new PublishRequest(this.topicArn, String.valueOf(jsonAlarm));
                PublishResult publishResponse = this.client.publish(publishRequest);
                // Print the MessageId of the message.
                System.out.println("MessageId: " + publishResponse.getMessageId());
            }
        }

        out.collect(sb.toString());
        }

    private JsonObject writeJsonAlarm(String chemicalCompound, String sensor_id, double excess_value, long timestamp) {
        JsonObject jsonObject = new JsonObject();
        jsonObject.addProperty("chemical_compound", chemicalCompound);
        jsonObject.addProperty("sensor_id", sensor_id);
        jsonObject.addProperty("excess_value", Double.toString(excess_value));
        jsonObject.addProperty("timestamp", Long.toString(timestamp));
        return jsonObject;
    }

    private void init(){
        builder = AmazonSNSClientBuilder.standard().withCredentials(new EnvironmentVariableCredentialsProvider());
        client = builder.build();
    }
}
