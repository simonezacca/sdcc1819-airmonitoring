package util;

import com.amazonaws.auth.EnvironmentVariableCredentialsProvider;
import com.amazonaws.services.sns.AmazonSNS;
import com.amazonaws.services.sns.AmazonSNSClientBuilder;

public class InitAmazonSNS {

    private static InitAmazonSNS instance = null;
    private AmazonSNSClientBuilder builder;
    private AmazonSNS client;

    private InitAmazonSNS() {init();} // costruttore

    public static InitAmazonSNS getInstance() {
        if(instance == null)
            instance = new InitAmazonSNS();
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