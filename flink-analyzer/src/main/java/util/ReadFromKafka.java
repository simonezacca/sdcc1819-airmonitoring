package util;

import org.apache.flink.api.common.functions.MapFunction;
import org.apache.flink.streaming.api.datastream.DataStream;
import org.apache.flink.streaming.api.environment.StreamExecutionEnvironment;
import org.apache.flink.streaming.connectors.kafka.FlinkKafkaConsumer;
import org.apache.flink.api.common.serialization.SimpleStringSchema;

import java.util.Properties;

public class ReadFromKafka {


    public static void main(String[] args) throws Exception {
        // create execution environment
        StreamExecutionEnvironment env = StreamExecutionEnvironment.getExecutionEnvironment();

        Properties properties = new Properties();
        properties.setProperty("bootstrap.servers", "kafka:9092");
        properties.setProperty("zookeeper.connect", "zookeper:2181");
        properties.setProperty("group.id", "test");

        FlinkKafkaConsumer consumer = new FlinkKafkaConsumer<String>("topicProva", new SimpleStringSchema(), properties);
        DataStream<String> stream = env.addSource(consumer);

        stream.map(s -> s.toUpperCase())
                .writeAsText("/flink-analyzer/jar/output.txt");

        env.execute();
    }


}
