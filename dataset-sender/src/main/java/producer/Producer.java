package producer;

import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.ProducerRecord;
import sdcc1819.model.Data;
import sdcc1819.serializers.json.AirDataJsonSerializer;
import sdcc1819.serializers.lineprotocol.AirDataLineProtocolSerializer;

import java.util.ArrayList;
import java.util.List;
import java.util.Properties;


public class Producer {

    private ParserCSV parserCSV;
    public static final String KAFKA_SERVER_URL = "kafka";
    public static final int KAFKA_SERVER_PORT = 9092;
    private String topicName;
    private KafkaProducer kafkaProducer;


    public Producer(String topicName,String aCsvFilePath, float aServingSpeed) {
        this.topicName = topicName;
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
        List<String> lines = null;
        if (topicName.equals("LINEPROTO"))
            lines = AirDataLineProtocolSerializer.serialize(value);
        if (topicName.equals("JSONPROTO")) {
            lines = AirDataJsonSerializer.serialize(value);
            try {
                Thread.sleep(3000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
        ProducerRecord record;
        try {
            for(String line: lines){
                record = new ProducerRecord(topicName, line);
                //Thread.sleep(2000);
                kafkaProducer.send(record);
            }
        }
        catch (Exception e){
            e.printStackTrace();
        }
    }


    public void produceRecords() {

        List<Data> records = parserCSV.parseFile();
        System.out.println("File parsato!!");
        //int i = 0;
        for( Data d : records){
            /*if (i==30){
                break;
            }*/
            try {
                Thread.sleep(500);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            //i++;
            sendToTopic(d);
        }
    }


}