package operators.processwindowsfunction;

import com.amazonaws.auth.EnvironmentVariableCredentialsProvider;
import com.amazonaws.services.sns.AmazonSNS;
import com.amazonaws.services.sns.AmazonSNSClientBuilder;
import com.amazonaws.services.sns.model.PublishRequest;
import com.amazonaws.services.sns.model.PublishResult;
import com.amazonaws.services.sns.model.Topic;
import com.google.gson.JsonObject;
import map.CounterMap;
import map.LimitValueMap;
import org.apache.flink.streaming.api.functions.windowing.ProcessWindowFunction;
import org.apache.flink.streaming.api.windowing.windows.TimeWindow;
import org.apache.flink.util.Collector;
import util.TimeStampConverter;

import static util.StringToTimeUnit.stringToExcessForCompound;

public class ChemicalCompoundCollector extends ProcessWindowFunction<Double, JsonObject, String, TimeWindow>{

    LimitValueMap limitValueMap = new LimitValueMap();
    Double limitValue;
    String compoundName;
    CounterMap counterMap;
    private static AmazonSNSClientBuilder builder;
    AmazonSNS client;
    String topicArn;

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
                double excessValue = stringToExcessForCompound(this.limitValueMap.getLimitValue(this.compoundName)._3());
                if(this.counterMap.get(s) >= 0) {
                    init();
                    // Publish a message to an Amazon SNS topic.
                    JsonObject jsonAlarm = writeJsonAlarm(compoundName, s, excessValue, context.window().getStart());

                    final PublishRequest publishRequest = new PublishRequest(topicArn, String.valueOf(jsonAlarm));
                    final PublishResult publishResponse = client.publish(publishRequest);

                    // Print the MessageId of the message.
                    System.out.println("MessageId: " + publishResponse.getMessageId());
                }
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

    private JsonObject writeJsonAlarm(String chemicalCompound,String sensor_id, double excess_value, long timestamp) {
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
        for (Topic topic : client.listTopics().getTopics()) {
            if (topic.getTopicArn().contains("chemicalcompound-alarm")) {
                topicArn = topic.getTopicArn();
                break;
            }
        }

    }
}
