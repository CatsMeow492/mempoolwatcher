// import aws sdk
const AWS = require('aws-sdk');
// require dotenv
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
let save = function () {
    let input = {
        "email_id": "example_write@example.com", "created_by": "clientUser", "created_on": new Date().toString(), "updated_by": "clientUser", "updated_on": new Date().toString(), "is_deleted": false 
    };
    let params = {
        TableName: "users",
        Item: input
    };
    docClient.put(params, function (err, data) {
        if (err) {
            console.log("users::save::error - " + JSON.stringify(err, null, 2));
        } else {
            console.log("users::save::success");
        }
    });
}

save();