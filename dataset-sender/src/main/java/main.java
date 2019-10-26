import consumer.Consumer;
import producer.Producer;

public class main {

    public static String path = null;
    public static String kafkaTopic = null;
    public static String actAs = null;

    public static void main(String[] args) {
        System.out.println("gender: " + args[0]);
        System.out.println("Destination kafka topic: " + args[1]);
        System.out.println("CSV dataset path: " + args[2]);

        actAs = args[0]; // producer or consumer
        kafkaTopic = args[1]; // topic destination, could be JSONPROTO or LINEPROTO
        path = args[2];


        if(actAs.equals("p")) {
            Producer producer = new Producer(kafkaTopic,path, 2.0f);
            System.out.println("Creato il producer");
            producer.produceRecords();
        } else {
            Consumer consumer = new Consumer();
            consumer.readStream();
        }
    }
}
