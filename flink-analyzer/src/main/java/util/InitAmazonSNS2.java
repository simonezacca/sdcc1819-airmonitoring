package util;

import com.amazonaws.auth.EnvironmentVariableCredentialsProvider;
import com.amazonaws.services.sns.AmazonSNS;
import com.amazonaws.services.sns.AmazonSNSClientBuilder;

public class InitAmazonSNS2 {

    private static InitAmazonSNS2 instance = null;
    private AmazonSNSClientBuilder builder;
    private AmazonSNS client;

    private InitAmazonSNS2() {init();} // costruttore

    public static InitAmazonSNS2 getInstance() {
        if(instance == null)
            instance = new InitAmazonSNS2();
        return instance;
    }

    public void init() {
        builder = AmazonSNSClientBuilder.standard().withCredentials(new EnvironmentVariableCredentialsProvider());
        client = builder.build();
    }

    public AmazonSNSClientBuilder getBuilder() {
        return builder;
    }

    public AmazonSNS getClient() {
        return client;
    }
}