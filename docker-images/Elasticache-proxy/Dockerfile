FROM ubuntu

USER root

RUN echo "docker\ndocker" | passwd root

RUN apt-get update
RUN apt-get install -y openssh-server openssh-client sshpass net-tools netcat

RUN echo "PermitRootLogin yes" >> /etc/ssh/sshd_config

COPY docker-entrypoint.sh /
RUN chmod +x /docker-entrypoint.sh

RUN rm -rf /root/.ssh
RUN mkdir /root/.ssh
RUN chmod -R 600 /root/.ssh 

RUN ssh-keygen -A

ENV LOCAL_FORWARD_PORT 3456
ENV ELASTICACHE_REMOTE_HOST localhost
ENV ELASTICACHE_REMOTE_PORT 6379

EXPOSE 1-65535

ENTRYPOINT [ "/docker-entrypoint.sh" ]