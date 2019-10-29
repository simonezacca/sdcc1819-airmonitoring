package sdcc1819;

import operators.filter.DiscardEmptyValues;
import org.apache.flink.api.common.functions.FlatMapFunction;
import org.apache.flink.api.common.functions.MapFunction;
import org.apache.flink.api.common.serialization.SimpleStringSchema;
import org.apache.flink.streaming.api.datastream.DataStreamSource;
import org.apache.flink.streaming.api.environment.StreamExecutionEnvironment;
import org.apache.flink.streaming.api.windowing.time.Time;
import org.apache.flink.streaming.connectors.kafka.FlinkKafkaConsumer;
import org.apache.flink.util.Collector;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import scala.Tuple1;
import sdcc1819.model.Data;
import sdcc1819.model.Sensor;
import sdcc1819.serializers.json.AirDataJsonSerializer;
import time.DateTimeAscendingAssigner;
import util.SDCCExecutionEnvironment;

import java.util.Properties;

public class TestQuery {
    public static void main(String[] args) {

        // Setup Environment
        StreamExecutionEnvironment env = SDCCExecutionEnvironment.getExecutionEnvironment();

        // Properties for attach to Kafka
        Properties properties = new Properties();
        properties.setProperty("bootstrap.servers", "kafka:9092");
        properties.setProperty("zookeeper.connect", "zookeper:2181");
        properties.setProperty("group.id", "test");
        properties.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG,"earliest");

        // Initialize KafkaConsumer (for Flink)
        FlinkKafkaConsumer consumer = new FlinkKafkaConsumer<String>("JSONPROTO", new SimpleStringSchema(), properties);

        // Creo sorgente attaccandoci il KafkaConsumer
        DataStreamSource<String> stream = env.addSource(consumer);

        stream
                //Deserializzo JSON
                .map(s -> AirDataJsonSerializer.deserialize(s)).returns(Data.class)
                //Scarto i sensori che hanno misurazioni vuote
                .filter(new DiscardEmptyValues())
                //Assegno Timestamp e Watermark
                .assignTimestampsAndWatermarks(new DateTimeAscendingAssigner())
                // Entra un Data ed escono N Sensor (FlatMap)
                .flatMap(new FlatMapFunction<Data, Sensor>() {
                    @Override
                    public void flatMap(Data value, Collector<Sensor> out) {
                        for (Sensor s : value.getMeasurements()) {
                            out.collect(s);
                        }
                    }
                }).returns(Sensor.class)
                // Filtriamo i sensori che hanno una misurazione per l'agente PM10
                .filter(s -> s.containsAgent("PM10"))
                // Emettiamo tuple 2 contenenti [ID Sensore, Valore PM10]
                //.map(s -> new Tuple1<>(s.getAgentByName("PM10").getValue()))
                .map(new MapFunction<Sensor, Tuple1<Double>>() {
                    @Override
                    public Tuple1<Double> map(Sensor value) {
                        return new Tuple1<>(value.getAgentByName("PM10").getValue());
                    }
                })
                .timeWindowAll(Time.days(1))
                //.aggregate(new ChemicalCompoundMean())

                //.writeAsText("/flink-analyzer/out.txt", org.apache.flink.core.fs.FileSystem.WriteMode.OVERWRITE);
        ;









        try {
            env.execute();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}