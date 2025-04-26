import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  ScanCommand,
  PutCommand,
  GetCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);
const tableName = "http-gabrielreynolds-items";

export const handler = async (event, context) => {
  let body;
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*", // Enable CORS
    "Access-Control-Allow-Methods": "OPTIONS,GET,PUT,DELETE",
  };

  try {
    switch (event.routeKey) {
      case "DELETE /items/{id}":
        await dynamo.send(
          new DeleteCommand({
            TableName: tableName,
            Key: {
              id: event.pathParameters.id,
            },
          })
        );
        body = `Deleted item ${event.pathParameters.id}`;
        break;

      case "GET /items/{id}":
        const result = await dynamo.send(
          new GetCommand({
            TableName: tableName,
            Key: {
              id: event.pathParameters.id,
            },
          })
        );
        body = result.Item || {};
        break;

      case "GET /items":
        const scanResult = await dynamo.send(
          new ScanCommand({ TableName: tableName })
        );
        body = scanResult.Items;
        break;

      case "PUT /items":
        const requestJSON = JSON.parse(event.body);

        // Validate required fields
        const requiredFields = ["id", "title", "description", "dueDate", "priority", "status"];
        for (let field of requiredFields) {
          if (!requestJSON[field]) {
            throw new Error(`Missing required field: ${field}`);
          }
        }

        // Construct task item
        const task = {
          id: requestJSON.id,
          title: requestJSON.title,
          description: requestJSON.description,
          dueDate: requestJSON.dueDate,
          priority: requestJSON.priority,
          status: requestJSON.status,
          createdAt: requestJSON.createdAt || new Date().toISOString()
        };

        await dynamo.send(
          new PutCommand({
            TableName: tableName,
            Item: task,
          })
        );

        body = `Saved item ${task.id}`;
        break;

      default:
        throw new Error(`Unsupported route: "${event.routeKey}"`);
    }
  } catch (err) {
    statusCode = 400;
    body = err.message;
  } finally {
    body = JSON.stringify(body);
  }

  return {
    statusCode,
    body,
    headers,
  };
};
