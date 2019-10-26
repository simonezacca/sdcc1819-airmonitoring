
DATASET=$2 #csvpath
GENDER=$1 #p
KAFKATOPIC="LINEPROTO" # per telegraf
KAFKATOPIC="JSONPROTO" # per flink


java -cp dataset-sender-1.0-SNAPSHOT.jar main $DATASET $GENDER $KAFKATOPIC