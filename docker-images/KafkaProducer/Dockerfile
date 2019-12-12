from wurstmeister/kafka

# setting environment variables
env KAFKA_ADVERTISED_HOST_NAME=kafka
env KAFKA_ZOOKEEPER_CONNECT=zookeeper:2181
env KAFKA_LOG_RETENTION_HOURS=1
env KAFKA_MESSAGE_MAX_BYTES=2000000000

# adding file to the image
add . /dataset-sender
