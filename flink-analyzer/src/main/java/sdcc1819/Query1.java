package sdcc1819;

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
import org.apache.flink.api.common.serialization.SimpleStringSchema;
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
import util.InitAmazonSQS;
import util.SDCCExecutionEnvironment;
import util.SplitStreamByChemicalCompound;
import util.StringToTimeUnit;

import java.io.Serializable;
import java.util.Properties;

public class Query1 implements Serializable {

    private static final String QUEUE_NAME = "air-monitoring";
    private static AmazonSQS sqs;
    private static String queueUrl;
    private static CreateQueueRequest createQueueRequest;

    public Query1(){};
    
    public static void main(String[] args) {

        Query1 query1 = new Query1();

        // Inizializzo variabile d'ambiente
        StreamExecutionEnvironment env = SDCCExecutionEnvironment.getExecutionEnvironment();

        // Proprietà per attaccarsi al KafkaConsumer
        Properties properties = new Properties();
        properties.setProperty("bootstrap.servers", "kafka:9092");
        properties.setProperty("zookeeper.connect", "zookeper:2181");
        properties.setProperty("group.id", "test");

        // Istanza della classe Kafka Consumer (per Flink)
        FlinkKafkaConsumer consumer = new FlinkKafkaConsumer<String>("JSONPROTO", new SimpleStringSchema(), properties);

        // Creo un flusso attaccandoci il KafkaConsumer
        DataStreamSource<String> stream = env.addSource(consumer);

        // Istanzio una Map contenente <Nome del composto chimico, <valore limite, periodo medio di misurazione>>
        LimitValueMap limitValueMap = new LimitValueMap();

        /*
        * Con la Map trasformo il mio flusso di stringhe in oggetti di tipo Data
        * Assegno Timestamp e Watermark in maniera ascendente
        * Filtro gli oggetti Data del mio flusso in entrata scartando tutti quelli che hanno misurazioni vuote
        * Estraggo dall'oggetto Data tutti i Sensori non vuoti rimasti
        * Con KeyBy divido lo stream per chiave (dove la nostra chiave è il SensorID) in partizioni disgiunte
        * Tutti i record con lo stesso sensorID sono assegnati alla stessa partizione
        * */
        KeyedStream<Sensor, String> originalStream = stream
                //Deserializzo JSON
                .map(AirDataJsonSerializer::deserialize).returns(Data.class)
                .assignTimestampsAndWatermarks(new DateTimeAscendingAssigner())
                .filter(new DiscardEmptyValues())
                .flatMap(new SensorExtractor())
                .keyBy(new KeyBySensorID());

        /* Divido i flussi per composto chimico e li inserisco all'interno di una Map
        *  Per ogni nuovo flusso prendo (grazie alla LimitValueMap già popolata con i rispettivi dati):
        *  - Il valore limite del composto
        *  - Il tempo di aggregazione del composto
        *  Abbiamo un flusso per ogni composto, con il proprio tempo d'aggregazione
        *  Il traffico in entrata viene processato ed infine scritto su txt
        * */

        FluxesMap fluxesMap = SplitStreamByChemicalCompound.split(originalStream);
        fluxesMap.forEach((compoundString,compoundStream)->{
            Tuple3<Double, String, String> limitTupleForCompound = limitValueMap.getLimitValue(compoundString);
            Time averagingPeriod = StringToTimeUnit.stringToFlinkTimeUnit(limitTupleForCompound._2());
            compoundStream
                    .keyBy(new KeyBySensorID())
                    .timeWindow(averagingPeriod)
                    .aggregate(new ChemicalCompoundMean(compoundString), new ChemicalCompoundCollector(compoundString))
                    .map(query1::sendMessagesSQS); //passare variabile query1 inizializzata prima come  arogmento della funzione sendMessagesSQS
                    //.writeAsText("/flink-analyzer/output_query1_" + compoundString + ".txt", FileSystem.WriteMode.OVERWRITE)
                    //.setParallelism(1);
        });
        try {
            env.execute();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private JsonObject sendMessagesSQS(JsonObject jsonObject){
        System.out.println("queueUrl: " + queueUrl);
        InitAmazonSQS instanceSQS = InitAmazonSQS.getInstance();
        SendMessageRequest send_msg_request = new SendMessageRequest()
                .withQueueUrl(instanceSQS.getQueueUrl())
                .withMessageBody(String.valueOf(jsonObject))
                .withDelaySeconds(5);
        instanceSQS.getSqs().sendMessage(send_msg_request);
        return jsonObject;
    }

}