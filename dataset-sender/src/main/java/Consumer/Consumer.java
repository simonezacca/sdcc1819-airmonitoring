package Consumer;

import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.apache.kafka.clients.consumer.KafkaConsumer;

import java.util.Arrays;
import java.util.Properties;

public class Consumer {

    // Configure the consumer
    private KafkaConsumer<String, String> consumer;
    public static final String KAFKA_SERVER_URL = "kafka";
    public static final int KAFKA_SERVER_PORT = 9092;
    private static final String topicName = "LINEPROTO";

    public Consumer() {
        init();
    }


    private void init() {
        Properties properties = new Properties();
        // Point it to the brokers
        properties.setProperty("bootstrap.servers", KAFKA_SERVER_URL + ":" + KAFKA_SERVER_PORT);
        // Set the consumer group (all consumers must belong to a group).
        properties.setProperty("group.id", "test");
        // Set how to serialize key/value pairs
        properties.setProperty("key.deserializer","org.apache.kafka.common.serialization.StringDeserializer");
        properties.setProperty("value.deserializer","org.apache.kafka.common.serialization.StringDeserializer");
        // When a group is first created, it has no offset stored to start reading from. This tells it to start
        // with the earliest record in the stream.
        properties.setProperty("auto.offset.reset","earliest");
        consumer = new KafkaConsumer<>(properties);
    }

    public void readStream(){
        consumer.subscribe(Arrays.asList(topicName));
        int count = 0;
        while(true) {
            // Poll for records
            ConsumerRecords<String, String> records = consumer.poll(200);
            // Did we get any?
            if (records.count() == 0) {
                // timeout/nothing to read
            } else {
                // Yes, loop over records
                for(ConsumerRecord<String, String> record: records) {
                    // Display record and count
                    count += 1;
                    System.out.println( count + ": " + record.value());
                }
            }
        }

    }


}


