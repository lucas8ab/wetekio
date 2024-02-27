# Check out https://hub.docker.com/_/node to select a new base image
FROM node:10

ENV CASSANDRA_HOST=cassandra
ENV CASSANDRA_USER=app_bff
ENV CASSANDRA_PASS=app01
ENV CASSANDRA_DB=read_side

# Setear la url de elasticsearch
ENV ELASTICSEARCH_HOST=3.20.254.243
ENV ELASTICSEARCH_PORT=9200

# Setear el endpoint para el calculo de intereses
ENV CALCULO_INTERESES_JUICIOS_HOST=calculo-juicios:4040
# Setear url y topicos de kafka
# ENV KAFKA_HOST=18.216.37.203:9092
# ENV KAFKA_TOPIC_CONTACTOS=streaming.con.contactos
# ENV KAFKA_TOPIC_TRAMITES=streaming.con.tramites

# Setear la url de tramite-bff
ENV TRAMITEBFF_URL=http://3.132.40.225:3001/tramite

# Setear logs calculo intereses
# Values:
    # - ON-DEBUG
    # - ON-SIMPLE
    # - OFF
ENV INTERESES_LOG=ON-DEBUG

# Create app directory (with user `node`)
RUN mkdir -p /home/node/app

# Set the same time Zone from Host
RUN ln -sf /usr/share/zoneinfo/Etc/GMT+3  /etc/localtime
RUN echo "America/Argentina/Cordoba" > /etc/timezone
RUN dpkg-reconfigure -f noninteractive tzdata

WORKDIR /home/node/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN apt-get update && apt-get install -y \
    build-essential \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev

RUN npm install

# Bundle app source code
COPY . .

# Condifion para realizar es test
RUN if [ "$test" = "true" ] ; then npm run test; fi


RUN npm run build

# Bind to all network interfaces so that it can be mapped to the host OS
ENV HOST=0.0.0.0 PORT=3000

EXPOSE ${PORT}

CMD [ "node", "." ]
