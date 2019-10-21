import Consumer.Consumer;
import Producer.Producer;

public class main {

    public static String path = null;
    public static void main(String[] args) {
        System.out.println("path: " + args[0]);
        System.out.println("gender: " + args[1]);
        path = args[0];
        if(args[1].equals("p")) {
            Producer producer = new Producer(path, 2.0f);
            System.out.println("creato il producer");
            producer.produceRecords();
        } else {
            Consumer consumer = new Consumer();
            consumer.readStream();
        }
    }
}
