import { APIGatewayTokenAuthorizerHandler } from "aws-lambda";
import { generatePolicy } from "../utils";

export const basicAuthorizer: APIGatewayTokenAuthorizerHandler = async (event, _context, callback) => {
    console.log('Event: ', JSON.stringify(event));

    if (event['type'] != 'TOKEN') callback('Unauthorized');

    try {
        const authorizationToken = event.authorizationToken;

        const encodedCredentials = authorizationToken.split(' ')[1];
        const plainCredentials = Buffer.from(encodedCredentials, 'base64').toString('utf-8').split(':');
        const [username, password] = plainCredentials;

        console.log(`username ${username} and password ${password}`);

        const storedPassword = process.env[username];
        const effect = !storedPassword || storedPassword !== password ? 'Deny' : 'Allow';
        const policy = generatePolicy(encodedCredentials, event.methodArn, effect);
        return policy;
    } catch(err) {
        callback('Unauthorized');
    }
  }