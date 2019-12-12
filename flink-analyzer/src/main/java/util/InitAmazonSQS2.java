package util;

import com.amazonaws.auth.EnvironmentVariableCredentialsProvider;
import com.amazonaws.services.sqs.AmazonSQS;
import com.amazonaws.services.sqs.AmazonSQSClientBuilder;
import com.amazonaws.services.sqs.model.AmazonSQSException;
import com.amazonaws.services.sqs.model.CreateQueueRequest;

public class InitAmazonSQS2 {

    private static InitAmazonSQS2 instance = null;
    private AmazonSQS sqs;
    private static CreateQueueRequest createQueueRequest;
    private static final String QUEUE_NAME = "air-monitoring-query2";
    private static String queueUrl;

    private InitAmazonSQS2() {init();} // costruttore

    public static InitAmazonSQS2 getInstance() {
        if(instance == null)
            instance = new InitAmazonSQS2();
        return instance;
    }

    public void init() {
        sqs = AmazonSQSClientBuilder.standard().withCredentials(new EnvironmentVariableCredentialsProvider()).build();

        try {
            System.out.println("Inizializzo SQS");
            createQueueRequest = new CreateQueueRequest(QUEUE_NAME);
        } catch (AmazonSQSException e) {
            if (!e.getErrorCode().equals("QueueAlreadyExists")) {
                throw e;
            }
        }
        queueUrl = sqs.createQueue(createQueueRequest).getQueueUrl();
        System.out.println("Queue created, queueUrl: " + queueUrl);
    }
}