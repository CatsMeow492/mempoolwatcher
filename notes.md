$ curl --data '{"method":"parity_pendingTransactions","params":[],"id":1,"jsonrpc":"2.0"}' -H "Content-Type: application/json" -X https://responsive-dark-mountain.ethereum-goerli.discover.quiknode.pro/098290c301d6e1e94245618de1d4b8ac4faaa1da/
npm install aws-sdk

Database = NoSQL DynamoDB
Amazon API Gateway

# Create Table
`
aws dynamodb create-table --table-name AddressList --attribute-definitions AttributeName=Id,AttributeType=S AttributeName=Address,AttributeType=S --key-schema AttributeName=Id,KeyType=HASH AttributeName=Address,KeyType=RANGE --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5
`
# Create Role for Lambda service

/backend/trusted_entity.js
`
aws iam create-role --role-name lambda-role --assume-role-policy-document file://trusted_entity.json
`

# Create and attach policy
### Note that the ARN comes from the table creation in step 1

/backend/policy.json
`
aws iam put-role-policy --role-name lambda-role --policy-name dynamodb-access --policy-document file://policy.json
`

# Create Lambda Functions

/backend/get.js
/backend/post.js
### Zip the file
`
zip function.zip get.js
zip function2.zip post.js
`
### Role ARN
arn:aws:iam::500532294210:role/lambda-role
### Create lambda function
`
aws lambda create-function --function-name get-addresses --zip-file fileb://function.zip --runtime nodejs16.x --role arn:aws:iam::500532294210:role/lambda-role --handler get.getAllAddresses --environment Variables={TABLE_NAME=Addresses}
aws lambda create-function --function-name add-addresses --zip-file fileb://function2.zip --runtime nodejs16.x --role arn:aws:iam::500532294210:role/lambda-role --handler post.addAddress --environment Variables={TABLE_NAME=Addresses}
`

# Create API Endpoint
`
aws apigateway create-rest-api --name 'Contract Addresses'
`
Endpoint ID: pesnn3wxa9

# Add the ID to the root path 

`
aws apigateway get-resources --rest-api-id pesnn3wxa9
`
ID for Root Path: eanhonfzm9
`
`
aws apigateway create-resource --rest-api-id pesnn3wxa9 --parent-id eanhonfzm9 --path-part addresses
`
### Returns 
`
{
    "id": "t041pf",
    "parentId": "eanhonfzm9",
    "pathPart": "addresses",
    "path": "/addresses"
}
`
### Add get method to api gateway
`
aws apigateway put-method \
> --rest-api-id pesnn3wxa9 \
> --resource-id t041pf \
> --http-method GET \
> --authorization-type NONE
`
### Add post method to api gateway
`
aws apigateway put-method --rest-api-id pesnn3wxa9 --resource-id t041pf --http-method POST --authorization-type NONE
`
`
aws apigateway put-method-response --rest-api-id pesnn3wxa9 --resource-id t041pf --http-method GET --status-code 200
aws apigateway put-method-response --rest-api-id pesnn3wxa9 --resource-id t041pf --http-method POST --status-code 200
`

`
aws apigateway put-integration-response --rest-api-id pesnn3wxa9 --resource-id t041pf --http-method GET --status-code 200 --selection-pattern ""
aws apigateway put-integration-response --rest-api-id pesnn3wxa9 --resource-id t041pf --http-method POST --status-code 200 --selection-pattern ""
`
# Deploy API
`
aws apigateway create-deployment --rest-api-id pesnn3wxa9 --stage-name api
`

`
curl -X GET https://pesnn3wxa9.execute-api.us-east-1.amazonaws.com/api/addresses
curl -X POST -d '{"Address":"0x01.."}' https://pesnn3wxa9.execute-api.us-east-1.amazonaws.com/api/addresses
`

aws lambda addAddress --function-name add-addresses --action lambda:InvokeFunction --statement-id sns \
--principal sns.amazonaws.com --output text




