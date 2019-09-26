var AWS = require('aws-sdk');

var dynamodb = new AWS.DynamoDB({
    apiVersion: '2012-08-10',
    endpoint: 'http://​dynamodb​:8000',
    region: 'us-west-2',
    credentials: {
        accessKeyId: '2345',
        secretAccessKey: '2345'
    }
});

var docClient = new AWS.DynamoDB.DocumentClient({
    apiVersion: '2012-08-10',
    service: dynamodb
});

console.log('funciona');
// dynamodb.listTables((params = {}), (err, data) => console.log(data));

getEnviosPendientes = () => {
    var params = {
        TableName: 'Envio',
        Limit: 25  
    };
    console.log("Calling the Scan API on the Image table");
    docClient.scan(params, function (err, data) {
        if (err) {
            ppJson(err); 
        } else {
            console.log("The Scan call evaluated " + data.ScannedCount + " items");
            ppJson(data); 
        }
    });
}

crearEnvio = (body) => {
    var params = {
        TableName: "Envio",
        Item: {
            id: Date.now().toString(),
            fechaAlta: new Date().toJSON(),
            destino: body.destino,
            email: body.email,
            pendiente: "no"
        }
    };
    return new Promise((resolve, reject) => {
        docClient.put(params, (err, data) => {
            if (err) reject(err);
            else resolve("Se ha creado con exito!");
        });
    });
};


getEnvio = (body) => {
    var params = {
        TableName: "Envio",
        KeyConditionExpression: "id = :var",
        ExpressionAttributeValues: {
            ":var": body
        }
    };
    return new Promise((resolve, reject) => {
        docClient.query(params, (err, data) => {
            if (err) reject(err);
            else resolve(data);
        });
    });
};

setEnvioEntregado = (body) => {
    var params = {
        TableName: "Envio",
        Key: { id: body },
        UpdateExpression: "remove pendiente"
    };
    return new Promise((resolve, reject) => {
        docClient.update(params, (err, data) => {
            if (err) reject(err);
            else resolve(data);
        });
    });
};

exports.handler = async event => {
    try {
        await dynamodb.list(params).promise()
            .then(data => {
                console.log(data);
                return {
                    statusCode: 200,
                    body: JSON
                };
            })
            .catch(err => {
                console.log(err);
                return ({ statusCode: 400 })
            })
        switch (event.resource) {
            case '/envios':

                break;
            case '/envios/pendientes':
                return { body: JSON.stringify(await getEnviosPendientes()) }
            case '/envios/{id}':

                break;
            case '/envios/{idEnvio}/entregado':

                break;
            default:
                break;
        }
    } catch (error) {
        console.log(error);

    }
}