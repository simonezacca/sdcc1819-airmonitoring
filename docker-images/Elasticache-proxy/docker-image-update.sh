#!/bin/bash
#docker-image-update.sh


docker build -t air-monitoring-elasticache-proxy .
#echo "$buildResult"

#push su ECR
#if "%buildResult%"==""  (
#$(aws ecr get-login --no-include-email --region eu-central-1)
#docker tag air-monitoring-flink-jobmanager:latest 402165574974.dkr.ecr.eu-central-1.amazonaws.com/air-monitoring:Flink-jobmanager
#docker push 402165574974.dkr.ecr.eu-central-1.amazonaws.com/air-monitoring:Flink-jobmanager
#)
docker tag air-monitoring-elasticache-proxy:latest andrealeo93/sdcc-repository:Elasticache-proxy
docker push andrealeo93/sdcc-repository:Elasticache-proxy

echo -e "Image builded and pushed.\n"