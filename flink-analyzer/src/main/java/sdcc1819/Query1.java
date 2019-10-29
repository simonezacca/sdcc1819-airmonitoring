package sdcc1819;

import map.FluxesMap;
import map.LimitValueMap;
import operators.aggregate.ChemicalCompoundMean;
import operators.filter.DiscardEmptyValues;
import operators.flatmap.SensorExtractor;
import operators.key.KeyBySensorID;
import operators.processwindowsfunction.ChemicalCompoundCollector;
import org.apache.flink.api.common.serialization.SimpleStringSchema;
import org.apache.flink.core.fs.FileSystem;
import org.apache.flink.streaming.api.datastream.DataStreamSource;
import org.apache.flink.streaming.api.datastream.KeyedStream;
import org.apache.flink.streaming.api.environment.StreamExecutionEnvironment;
import org.apache.flink.streaming.api.functions.windowing.ProcessWindowFunction;
import org.apache.flink.streaming.api.windowing.assigners.SlidingEventTimeWindows;
import org.apache.flink.streaming.api.windowing.time.Time;
import org.apache.flink.streaming.api.windowing.windows.TimeWindow;
import org.apache.flink.streaming.connectors.kafka.FlinkKafkaConsumer;
import org.apache.flink.util.Collector;
import scala.Tuple2;
import sdcc1819.model.Data;
import sdcc1819.model.Sensor;
import sdcc1819.serializers.json.AirDataJsonSerializer;
import time.DateTimeAscendingAssigner;
import util.SDCCExecutionEnvironment;
import util.SplitStreamByChemicalCompound;
import util.StringToTimeUnit;

import java.text.Format;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Map;
import java.util.Properties;

public class Query1 {
    public static void main(String[] args) {

        // Setup Environment
        StreamExecutionEnvironment env = SDCCExecutionEnvironment.getExecutionEnvironment();

        // Properties for attach to Kafka
        Properties properties = new Properties();
        properties.setProperty("bootstrap.servers", "kafka:9092");
        properties.setProperty("zookeeper.connect", "zookeper:2181");
        properties.setProperty("group.id", "test");
        //properties.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG,"earliest");

        // Initialize KafkaConsumer (for Flink)
        FlinkKafkaConsumer consumer = new FlinkKafkaConsumer<String>("JSONPROTO", new SimpleStringSchema(), properties);

        // Creo sorgente attaccandoci il KafkaConsumer
        DataStreamSource<String> stream = env.addSource(consumer);

        //Sliding Window
        SlidingEventTimeWindows windowSpec = SlidingEventTimeWindows.of(Time.hours(1), Time.minutes(5));

        LimitValueMap limitValueMap = new LimitValueMap();

        KeyedStream<Sensor, String> originalStream = stream
                //Deserializzo JSON
                .map(s -> AirDataJsonSerializer.deserialize(s)).returns(Data.class)
                .assignTimestampsAndWatermarks(new DateTimeAscendingAssigner())
                .filter(new DiscardEmptyValues())
                .flatMap(new SensorExtractor())
                //.filter(s -> s.containsAgent("NO_2"))
                .keyBy(new KeyBySensorID());

        FluxesMap fluxesMap = SplitStreamByChemicalCompound.split(originalStream);
        fluxesMap.forEach((compoundString,compoundStream)->{
            Tuple2<Double, String> limitTupleForCompound = limitValueMap.getLimitValue(compoundString);
            Time aggregationTime = StringToTimeUnit.stringToFlinkTimeUnit(limitTupleForCompound._2);
            compoundStream
                    .keyBy(new KeyBySensorID())
                    .timeWindow(aggregationTime,Time.hours(1))
                    .aggregate(new ChemicalCompoundMean(compoundString), new ChemicalCompoundCollector())
                    .writeAsText("/flink-analyzer/output_query1_" + compoundString + ".txt", FileSystem.WriteMode.OVERWRITE);

        });

        try {
            env.execute();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}