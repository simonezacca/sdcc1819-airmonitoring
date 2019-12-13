#!/bin/bash

#os=$(lsb_release -d)
#TODO controllo se gia si è registrati a docker hub
#controllo dell'OS per eseguire sia su Linux che su Mac
docker login docker.io
PS3='Choose the Docker image that you want to update: '
path=$(pwd)
print_menu() {
options=("Zookeeper" "Kafka" "Kafka-producer" "Influxdb" "Telegraf" "Chronograf" 
    "Flink-jobmanager" "All images" "Quit")

}

print_menu

select opt in "${options[@]}"
do
    case $opt in
        "Zookeeper")
            echo "you choose to update Zookeeper image"
            cd $path/Zookeeper/
            bash './docker-image-update.sh'
            #gnome-terminal -e './docker-image-update.sh' --working-directory="${path}/Zookeeper/"
            cd ..
            ;;
        "Kafka")
            echo "you choose to update Kafka image"
            
            cd $path/Kafka
            bash './docker-image-update.sh'
            cd ..
            ;;
        "Kafka-producer")
            echo "you choose to update Kafka-producer image"
            cd $path/KafkaProducer
            bash './docker-image-update.sh'
            cd ..
            ;;
        "Influxdb")
        	echo "you choose to update Influxdb image"
        	cd $path/Influxdb
            bash './docker-image-update.sh'
            cd ..
            ;;
        "Telegraf")
            echo "you choose to update Telegraf image"
            cd $path/Telegraf
            bash './docker-image-update.sh'
            cd ..
            ;;
        "Chronograf")
            echo "you choose to update Chronograf image"
            cd $path/Chronograf
            bash './docker-image-update.sh'
            cd ..
            ;;
        "Flink-jobmanager")
            echo "you choose to update Flink-jobmanager image"
            cd $path/Flink-jobmanager
            bash './docker-image-update.sh'
            cd ..
            ;;
        "All images")
            echo "you choose to update all images"
            ;;    
        "Quit")
            break
            ;;
        *) echo "invalid option $REPLY";;
    esac
done