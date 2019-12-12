#!/bin/bash
#docker-image-update.sh

#copiare jar e file di configurazione di ogni container dalla cartelal docker compose alle varei sotto cartelle docker images
SOURCE=../../docker-compose/flink-analyzer/
DESTINATION=./

if [ -d "$SOURCE" ]; then 
	cp -r "$SOURCE"* "$DESTINATION"
fi
#per ogni immagine in docker images lancio il relativo build col dockerfile
#buildResult=$()
docker build -t air-monitoring-flink-jobmanager .
#echo "$buildResult"

#push su ECR
#if "%buildResult%"==""  (
#$(aws ecr get-login --no-include-email --region eu-central-1)
#docker tag air-monitoring-flink-jobmanager:latest 402165574974.dkr.ecr.eu-central-1.amazonaws.com/air-monitoring:Flink-jobmanager
#docker push 402165574974.dkr.ecr.eu-central-1.amazonaws.com/air-monitoring:Flink-jobmanager
#)
docker tag air-monitoring-flink-jobmanager:latest andrealeo93/sdcc-repository:Flink-jobmanager
docker push andrealeo93/sdcc-repository:Flink-jobmanager

echo -e "Image builded and pushed.\n"