#!/bin/sh

sleep 30 #custom code
if [ -n "${FLINK_CLASS}" ] && [ -n "${FLINK_JAR}" ]; then
    OLDIFS=IFS
    IFS=',' 
    flink_classes=$FLINK_CLASS
    for element in $flink_classes
        do
        exec "$FLINK_HOME"/bin/flink run -c "$element" "$FLINK_JAR" &
    done
    IFS=$OLDIFS
fi