package sdcc1819;

import com.amazonaws.auth.EnvironmentVariableCredentialsProvider;
import com.amazonaws.services.sqs.AmazonSQS;
import com.amazonaws.services.sqs.AmazonSQSClientBuilder;
import com.amazonaws.services.sqs.model.AmazonSQSException;
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
import operators.processwindowsfunction.ChemicalCompoundCollector2;
import org.apache.flink.api.common.serialization.SimpleStringSchema;
import org.apache.flink.core.fs.FileSystem;
import org.apache.flink.streaming.api.datastream.DataStreamSource;
import org.apache.flink.streaming.api.datastream.KeyedStream;
import org.apache.flink.streaming.api.environment.StreamExecutionEnvironment;
import org.apache.flink.streaming.api.windowing.time.Time;
import org.apache.flink.streaming.connectors.kafka.FlinkKafkaConsumer;
import scala.Tuple3;
import sdcc1819.model.Data;
import sdcc1819.model.Sensor;
import sdcc1819.serializers.json.AirDataJsonSerializer;
import time.DateTimeAscendingAssigner;
import util.SDCCExecutionEnvironment;
import util.SplitStreamByChemicalCompound;
import util.StringToTimeUnit;

import java.io.Serializable;
import java.util.Properties;

public class Query2 implements Serializable {

    private static final String QUEUE_NAME = "air-monitoring-query2";
    private static AmazonSQS sqs;
    private static String queueUrl;
    private static CreateQueueRequest createQueueRequest;

    public Query2(){
        init();
    }

    private static void init(){
        sqs = AmazonSQSClientBuilder.standard().withCredentials(new EnvironmentVariableCredentialsProvider()).build();

        try {
            System.out.println("Inizializzo SQS");
            createQueueRequest = new CreateQueueRequest(QUEUE_NAME);
        } catch (AmazonSQSException e) {
            if (!e.getErrorCode().equals("QueueAlreadyExists")) {
                throw e;
            }
        }
        queueUrl = sqs.createQueue(createQueueRequest).getQueueUrl();
        System.out.println("Queue created, queueUrl: " + queueUrl);
    }

    public static void main(String[] args) {

        StreamExecutionEnvironment env = SDCCExecutionEnvironment.getExecutionEnvironment();

        Properties properties = new Properties();
        properties.setProperty("bootstrap.servers", "kafka:9092");
        properties.setProperty("zookeeper.connect", "zookeper:2181");
        properties.setProperty("group.id", "test");
        //properties.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG,"earliest");

        FlinkKafkaConsumer consumer = new FlinkKafkaConsumer<String>("JSONPROTO", new SimpleStringSchema(), properties);

        DataStreamSource<String> stream = env.addSource(consumer);

        LimitValueMap limitValueMap = new LimitValueMap();

        KeyedStream<Sensor, String> originalStream = stream
                .map(s -> AirDataJsonSerializer.deserialize(s)).returns(Data.class)
                .assignTimestampsAndWatermarks(new DateTimeAscendingAssigner())
                .filter(new DiscardEmptyValues())
                .flatMap(new SensorExtractor())
                .keyBy(new KeyBySensorID());

        FluxesMap fluxesMap = SplitStreamByChemicalCompound.split(originalStream);
        fluxesMap.forEach((compoundString,compoundStream)->{
            Tuple3<Double, String, String> limitTupleForCompound = limitValueMap.getLimitValue(compoundString);
            Time averagingPeriod = StringToTimeUnit.stringToFlinkTimeUnit(limitTupleForCompound._2());
            compoundStream
                    .keyBy(new KeyBySensorID())
                    //.timeWindow(averagingPeriod,Time.hours(1))
                    .timeWindow(averagingPeriod,Time.minutes(15))
                    .aggregate(new ChemicalCompoundMean(compoundString), new ChemicalCompoundCollector2(compoundString))
                    .writeAsText("/flink-analyzer/output_query2_" + compoundString + ".txt", FileSystem.WriteMode.OVERWRITE)
                    .setParallelism(1);
        });

        try {
            env.execute();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private JsonObject sendMessagesSQS(JsonObject jsonObject){
        System.out.println("queueUrl: " + queueUrl);
        init();
        SendMessageRequest send_msg_request = new SendMessageRequest()
                .withQueueUrl(queueUrl)
                .withMessageBody(String.valueOf(jsonObject))
                .withDelaySeconds(5);
        sqs.sendMessage(send_msg_request);
        return jsonObject;
    }
}