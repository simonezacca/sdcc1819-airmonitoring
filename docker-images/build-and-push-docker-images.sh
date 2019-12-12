#!/bin/bash

#os=$(lsb_release -d)

PS3='Choose the Docker image that you want to update: '
options=("Zookeeper" "Kafka" "Kafka-producer" "Influxdb" "Telegraf" "Chronograf" 
	"Flink-jobmanager" "Flink-taskmanager" "All images" "Quit")
select opt in "${options[@]}"
do
    case $opt in
        "Zookeeper")
            echo "you choose to update Zookeeper image"
            path=$(pwd)
            gnome-terminal -e './docker-image-update.sh' --working-directory="${path}/Zookeeper/"
            #osascript -e 'tell app "Terminal" to do script' "cd ./Zookeeper"'./docker-image-update.sh'
            ;;
        "Kafka")
            echo "you choose to update Kafka image"
            path=$(pwd)
            gnome-terminal -e './docker-image-update.sh' --working-directory="${path}/Kafka/"
            ;;
        "Kafka-producer")
            echo "you choose to update Kafka-producer image"
            path=$(pwd)
            gnome-terminal -e './docker-image-update.sh' --working-directory="${path}/Kafka-producer/"
            ;;
        "Influxdb")
        	echo "you choose to update Influxdb image"
        	path=$(pwd)
            gnome-terminal -e './docker-image-update.sh' --working-directory="${path}/Influxdb/"
            ;;
        "Telegraf")
            echo "you choose to update Telegraf image"
            path=$(pwd)
            gnome-terminal -e './docker-image-update.sh' --working-directory="${path}/Telegraf/"
            ;;
        "Chronograf")
            echo "you choose to update Chronograf image"
            path=$(pwd)
            gnome-terminal -e './docker-image-update.sh' --working-directory="${path}/Chronograf/"
            ;;
        "Flink-jobmanager")
            echo "you choose to update Flink-jobmanager image"
            path=$(pwd)
            gnome-terminal -e './docker-image-update.sh' --working-directory="${path}/Flink-jobmanager/"
            ;;
        "Flink-taskmanager")
            echo "you choose to update Flink-taskmanager image"
            path=$(pwd)
            gnome-terminal -e './docker-image-update.sh' --working-directory="${path}/Flink-taskmanager/"
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