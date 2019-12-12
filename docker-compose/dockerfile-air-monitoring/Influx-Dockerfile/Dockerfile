from influxdb

# setting environment variables
env INFLUX_DB=db0
env INFLUXDB_CONFIG_PATH=/etc/influxdb/influxdb.conf

# adding file to the image
add . /var/lib/influxdb
add ./influxdb.conf /etc/influxdb/influxdb.conf
