package util;

import com.amazonaws.auth.EnvironmentVariableCredentialsProvider;
import com.amazonaws.services.sqs.AmazonSQS;
import com.amazonaws.services.sqs.AmazonSQSClientBuilder;
import com.amazonaws.services.sqs.model.AmazonSQSException;
import com.amazonaws.services.sqs.model.CreateQueueRequest;

public class InitAmazonSQS {

    private static InitAmazonSQS instance = null;
    private AmazonSQS sqs;
    private static CreateQueueRequest createQueueRequest;
    private static final String QUEUE_NAME = "air-monitoring";
    private static String queueUrl;

    private InitAmazonSQS() {init();} // costruttore

    public static InitAmazonSQS getInstance() {
        if(instance == null)
            instance = new InitAmazonSQS();
        return instance;
    }

    public InitAmazonSQS init() {
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
        return null;
    }

    public AmazonSQS getSqs() {
        return sqs;
    }

    public static CreateQueueRequest getCreateQueueRequest() {
        return createQueueRequest;
    }

    public static String getQueueName() {
        return QUEUE_NAME;
    }

    public static String getQueueUrl() {
        return queueUrl;
    }
}