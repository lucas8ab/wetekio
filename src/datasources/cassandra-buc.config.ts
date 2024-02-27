module.exports = {
  "name": "cassandra_buc",
  "connector": "cassandra",
  "host": `${process.env.CASSANDRA_HOST}`,
  "port": `${process.env.CASSANDRA_PORT}` || 9042,
  "user": `${process.env.CASSANDRA_USER}` || '',
  "password": `${process.env.CASSANDRA_PASSWORD}` || '',
  "database": `${process.env.CASSANDRA_DB}` || 'readside',
  "connectTimeout": 30000,
  "readTimeout": 30000
}
