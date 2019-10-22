package Producer;

import Util.Data;
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.ProducerRecord;
import java.util.ArrayList;
import java.util.Properties;

import static java.lang.Thread.sleep;


public class Producer {

    private ParserCSV parserCSV;
    public static final String KAFKA_SERVER_URL = "kafka";
    public static final int KAFKA_SERVER_PORT = 9092;
    private static final String topicName = "topicProva";
    private KafkaProducer kafkaProducer;


    public Producer(String aCsvFilePath, float aServingSpeed) {
        parserCSV = new ParserCSV(aCsvFilePath);
        init();
    }



    private void init() {
        Properties properties = new Properties();
        properties.put("bootstrap.servers", KAFKA_SERVER_URL + ":" + KAFKA_SERVER_PORT);
        properties.put("group.id", "test");
        properties.put("key.serializer", "org.apache.kafka.common.serialization.IntegerSerializer");
        properties.put("value.serializer", "org.apache.kafka.common.serialization.StringSerializer");
        kafkaProducer = new KafkaProducer(properties);
    }


    private void sendToTopic(Data value) {
        ProducerRecord record = new ProducerRecord(topicName, value.toJson());
        try {
            kafkaProducer.send(record);
            System.out.println("Producer send: " + value.toString());
        }
        catch (Exception e){
            e.printStackTrace();
        }
    }


    public void produceRecords() {

        ArrayList<Data> records = parserCSV.parseFile();
        System.out.println("file parsato!!");
        for( Data d : records){

            try {
                sleep(2000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            sendToTopic(d);
        }
    }


}