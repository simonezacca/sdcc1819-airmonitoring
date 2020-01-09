package sdcc1819;

import com.amazonaws.services.sns.model.PublishRequest;
import com.amazonaws.services.sns.model.PublishResult;
import com.amazonaws.services.sqs.AmazonSQS;
import com.amazonaws.services.sqs.model.CreateQueueRequest;
import com.amazonaws.services.sqs.model.SendMessageRequest;
import com.google.gson.JsonObject;
import map.FluxesMap;
import map.LimitValueMap;
import operators.aggregate.ChemicalCompoundMean;
import operators.filter.DiscardEmptyValues;
import operators.flatmap.SensorExtractor;
import operators.key.KeyBySensorID;
import operators.processwindowsfunction.ChemicalCompoundCollector;
import org.apache.flink.api.common.functions.RichAggregateFunction;
import org.apache.flink.api.common.serialization.SimpleStringSchema;
import org.apache.flink.api.java.functions.KeySelector;
import org.apache.flink.api.java.tuple.Tuple2;
import org.apache.flink.streaming.api.datastream.DataStreamSource;
import org.apache.flink.streaming.api.datastream.KeyedStream;
import org.apache.flink.streaming.api.datastream.SingleOutputStreamOperator;
import org.apache.flink.streaming.api.environment.StreamExecutionEnvironment;
import org.apache.flink.streaming.api.functions.KeyedProcessFunction;
import org.apache.flink.streaming.api.functions.ProcessFunction;
import org.apache.flink.streaming.api.functions.windowing.ProcessAllWindowFunction;
import org.apache.flink.streaming.api.functions.windowing.ProcessWindowFunction;
import org.apache.flink.streaming.api.windowing.time.Time;
import org.apache.flink.streaming.api.windowing.windows.TimeWindow;
import org.apache.flink.streaming.connectors.kafka.FlinkKafkaConsumer;
import org.apache.flink.util.Collector;
import scala.Tuple3;
import sdcc1819.model.Data;
import sdcc1819.model.Sensor;
import sdcc1819.serializers.json.AirDataJsonSerializer;
import time.DateTimeAscendingAssigner;
import util.*;

import java.io.Serializable;
import java.util.Iterator;
import java.util.Properties;

public class SensorFailure implements Serializable {

    public static final int EXPECTED_HIT_IN_ONE_DAY = 24;
    public static final int COUNTER_THRESHOLD = 5;

    public static final String topicArn = "arn:aws:sns:eu-central-1:402165574974:sensor-failure-alarm";

    public SensorFailure(){}

    private static JsonObject writeJsonFailureAlarm(String sensor_id, Long faultCounter, Long timestamp) {
        JsonObject jsonObject = new JsonObject();
        jsonObject.addProperty("sensor_id", sensor_id);
        jsonObject.addProperty("fault_counter", faultCounter);
        jsonObject.addProperty("timestamp", Long.toString(timestamp));
        return jsonObject;
    }

    public static void main(String[] args) {

        // Inizializzo variabile d'ambiente
        StreamExecutionEnvironment env = SDCCExecutionEnvironment.getExecutionEnvironment();

        // Proprietà per attaccarsi al KafkaConsumer
        Properties properties = new Properties();
        properties.setProperty("bootstrap.servers", "kafka:9092");
        properties.setProperty("zookeeper.connect", "zookeper:2181");
        properties.setProperty("group.id", "test");
        //properties.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG,"earliest");

        // Istanza della classe Kafka Consumer (per Flink)
        FlinkKafkaConsumer consumer = new FlinkKafkaConsumer<String>("JSONPROTO", new SimpleStringSchema(), properties);

        // Creo un flusso attaccandoci il KafkaConsumer
        DataStreamSource<String> stream = env.addSource(consumer);


        KeyedStream<Sensor, String> sensorStringKeyedStream = stream
                //Deserializzo JSON
                .map(AirDataJsonSerializer::deserialize).returns(Data.class)
                .assignTimestampsAndWatermarks(new DateTimeAscendingAssigner())
                .filter(new DiscardEmptyValues())
                .flatMap(new SensorExtractor())
                .keyBy(new KeyBySensorID());

        sensorStringKeyedStream
                .timeWindow(Time.days(1),Time.hours(1))
                .process(new ProcessWindowFunction<Sensor, Tuple2<String,Long>, String, TimeWindow>() {
                    @Override
                    public void process(String key, Context context, Iterable<Sensor> iterable, Collector<Tuple2<String,Long>> collector) throws Exception {
                        Long counter = 0L;
                        Iterator<Sensor> iterator = iterable.iterator();
                        while (iterator.hasNext()) {
                            iterator.next();
                            counter +=1;
                        }
                        collector.collect(new Tuple2<>(key,counter));
                    }
                })
                .keyBy((KeySelector<Tuple2<String, Long>, String>) stringLongTuple2 -> stringLongTuple2.f0)
                .process(new ProcessFunction<Tuple2<String, Long>, String>() {
                    @Override
                    public void processElement(Tuple2<String, Long> stringLongTuple2, Context context, Collector<String> collector) throws Exception {
                        String sensorId = stringLongTuple2.f0;
                        Long counterIn24h = stringLongTuple2.f1;

                        if (counterIn24h <= EXPECTED_HIT_IN_ONE_DAY - COUNTER_THRESHOLD) {
                            InitAmazonSNS instanceSNS = InitAmazonSNS.getInstance();

                            // Publish a message to an Amazon SNS topic.
                            JsonObject jsonAlarm = writeJsonFailureAlarm(sensorId,counterIn24h, context.timestamp());
                            PublishRequest publishRequest = new PublishRequest(topicArn, String.valueOf(jsonAlarm));
                            PublishResult publishResponse = instanceSNS.getClient().publish(publishRequest);
                        }
                    }
                });

        try {
            env.execute();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }



}