from flink:1.8-scala_2.11

# setting environment variables
env JOB_MANAGER_RPC_ADDRESS=flink-jobmanager

# adding file to the image
add . /flink-analyzer

copy run_flink_jobs.sh /
copy docker-entrypoint.sh /

run chmod +x /run_flink_jobs.sh
run chmod +x /docker-entrypoint.sh

entrypoint ["/docker-entrypoint.sh"]
