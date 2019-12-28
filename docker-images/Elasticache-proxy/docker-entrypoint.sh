#!/bin/bash

/etc/init.d/ssh start

sshpass -p docker ssh -L 0.0.0.0:${LOCAL_FORWARD_PORT}:${ELASTICACHE_REMOTE_HOST}:${ELASTICACHE_REMOTE_PORT} -o StrictHostKeyChecking=no root@localhost 

bash