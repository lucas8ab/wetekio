# Web-bff
API Rest para consumidor Web.
### Alcance de entidades:
- Sujeto
- Objeto
- Obligacion
- Sujeto Domicilio
- Objeto Domicilio
- Actividades Sujeto
- Contactos Sujeto
- Declaraciones Juradas
- Etapas Procesales
- Exenciones
- Juicios
- Param Plan
- Param Recargo
- Planes Pago
- Subastas
- Tramites

## Swagger
Para visualizar la documentacion de la API Rest, previamente deben tener el microservicio web-bff **corriendo**. Y luego ingresar en un navegador a la siguiente URL:

&nbsp;
 http://localhost:3000/explorer


## RUN
1- Clonar el repositorio en su maquina
```
git clone git@gitlab.com:wetekio_pcs/web-bff.git
```

2- Ubicarse en el directorio del proyecto
```
cd web-bff
```

3- Instalar dependencias
  - Si no tienes NodeJs instalado
    ```
    apt-get update

    apt-get install build-essential libssl-dev

    curl https://raw.githubusercontent.com/creationix/nvm/v0.35.0/install.sh | bash

    source ~/.profile

    nvm --version

    nvm install v10.0.0

    nvm use 10
    ```

  - Instalar dependencias del proyecto
    ```
    npm i
    ```

4- Levantar Cassandra

&nbsp;
Antes de levantar el servicio web-bff tiene que tener corriendo la base de datos Cassandra, hay dos opciones:

  - Crear un tunel con la VM
    ```
    ssh -N -L 9042:localhost:9042 root@IP_VM
    ```
  - Levantar localmente el servicio de Cassandra

    &nbsp;Repositorio de [Cassandra](https://gitlab.com/wetekio_pcs/cassandra-buc/blob/master/README.md), en el mismo tiene sus indicaciones.

5- Levantar el microservicio
```
npm run local
```

&nbsp;

## Comandos Utiles
- Debuging de peticiones a los connectores, por ejemplo obtener las query a cassandra.
```
DEBUG=loopback:connector* node .
```

[![LoopBack](https://github.com/strongloop/loopback-next/raw/master/docs/site/imgs/branding/Powered-by-LoopBack-Badge-(blue)-@2x.png)](http://loopback.io/)
