#!/bin/bash
PROGNAME=$0

usage() {
cat << EOF >&2
Usage: $PROGNAME -t <recordtype> -f <csvfilename>
-t : type of record to send on kafka topic [J|LP]
     J for JSON record type
     LP for InfluxDB line protocol record type
-f : csv source dataset filename
EOF
exit 1
}
# valori di default
#queryname=query1 context=local fileformat=csv

while getopts t:f:r o; do
case $o in
 (t) recordtype=$OPTARG;;
 (f) filename=$OPTARG;;
 (*) usage
esac
done
shift "$((OPTIND - 1))"

#echo Remaining arguments: "$@"
wrong_recordtype_name() {
 echo "ERROR: Record type not allowed";
 usage
}
# #set query class name
# query_class="erreesse.query.Query1"
case $recordtype in
 ("J") KAFKATOPIC="JSONPROTO";;
 ("LP") KAFKATOPIC="LINEPROTO";;
 (*) wrong_recordtype_name
esac

GENDER=p
echo "record type: "$recordtype;
echo "destination kafka topic name: "$KAFKATOPIC;
echo "csv source dataset filename: "$filename;

start_sender_app() {
java -cp dataset-sender-1.0-SNAPSHOT.jar main $GENDER $KAFKATOPIC $filename
}

start_sender_app