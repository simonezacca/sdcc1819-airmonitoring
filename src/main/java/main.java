import Consumer.Consumer;
import Producer.Producer;

public class main {

    public static String path = "../../../dataset/madrid_2018.csv";
    public static void main(String[] args) {
        if(args[0].equals("p")) {
            Producer producer = new Producer(path, 2.0f);
            producer.produceRecords();
        } else {
            Consumer consumer = new Consumer();
            consumer.readStream();
        }
    }
}
