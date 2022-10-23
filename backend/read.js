var AWS = require('aws-sdk');
require('dotenv').config()
// set up aws config
let awsConfig = {
    "region": "us-east-1",
    "endpoint": "http://dynamodb.us-east-1.amazonaws.com",
    "accessKeyId": process.env.AWS_ACCESSKEYID, "secretAccessKey": process.env.AWS_SECRETACCESSKEY
};
AWS.config.update(awsConfig);
// create a document client
let docClient = new AWS.DynamoDB.DocumentClient();
// read a single item
let fetchOneByKey = function () {
    let params = {
        TableName: "users",
        Key: {
            "email_id": "example@example.com"
        }
    };
    docClient.get(params, function (err, data) {
        if (err) {
            console.log("users::readSingleItem::error - " + JSON.stringify(err, null, 2));
        } else {
            console.log("users::readSingleItem::success - " + JSON.stringify(data, null, 2));
        }
    });
}

fetchOneByKey();