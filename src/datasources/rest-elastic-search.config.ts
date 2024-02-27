module.exports = {
  "name": "restElasticSearch",
  "connector": "rest",
  "crud": false,
  "options": {
    "headers": {
      "accept": "application/json",
      "content-type": "application/json"
    },
    "strictSSL": false
  },
  "operations": [
    {
      "template": {
        "method": "POST",
        "url": `http://${process.env.ELASTICSEARCH_HOST}:${process.env.ELASTICSEARCH_PORT}/_search`,
        "headers": {
          "accepts": "application/json",
          "content-type": "application/json"
        },
        "body": {
          "query": {
            "bool": {
              "filter": [
                {
                  "term": {
                    "valueType": "JOB"
                  }
                },
                {
                  "term": {
                    "value.workflowInstanceKey": "{id}"
                  }
                },
                {
                  "term": {
                    "value.bpmnProcessId": "tramite-alicuota"
                  }
                },
                {
                  "term": {
                    "intent": "CREATED"
                  }
                }
              ]
            }
          }
        },
        "responsePath": "$.hits.hits"
      },
      "functions": {
        "getStateTramite": [
          "id"
        ]
      }
    }
  ]
};

