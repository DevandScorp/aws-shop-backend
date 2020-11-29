import type { Serverless } from 'serverless/aws';

const serverlessConfiguration: Serverless = {
  service: {
    name: 'import-service',
    // app and org for use with dashboard.serverless.com
    // app: your-app-name,
    // org: your-org-name,
  },
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true
    }
  },
  // Add the serverless-webpack plugin
  resources: {
    Outputs: {
      SQSQueueArn: {
        Value: {
          'Fn::GetAtt': ['SQSQueue', 'Arn']
        }
      }
    },
    Resources: {
      SQSQueue: {
        Type: 'AWS::SQS::Queue',
        Properties: {
          QueueName: 'catalogItemsQueue'
        }
      },
      GatewayResponseDefault400: {
        Type: 'AWS::ApiGateway::GatewayResponse',
        Properties: {
          ResponseParameters: {
            'gatewayresponse.header.Access-Control-Allow-Origin': "'*'",
            'gatewayresponse.header.Access-Control-Allow-Headers': "'*'",
          },
          ResponseType: 'DEFAULT_4XX',
          RestApiId: {
            Ref: 'ApiGatewayRestApi',
          },
        },
      }
    }
  },
  plugins: ['serverless-webpack'],
  provider: {
    name: 'aws',
    runtime: 'nodejs12.x',
    apiGateway: {
      minimumCompressionSize: 1024,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      BUCKET_NAME: 'rs-app-task-5-bucket',
      SQS_URL: {
        Ref: 'SQSQueue'
      }
    },
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: 's3:ListBucket',
        Resource: 'arn:aws:s3:::rs-app-task-5-bucket'
      },
      {
        Effect: 'Allow',
        Action: 's3:*',
        Resource: 'arn:aws:s3:::rs-app-task-5-bucket/*'
      },
      {
        Effect: 'Allow',
        Action: 'sqs:*',
        Resource: {
          'Fn::GetAtt': ['SQSQueue', 'Arn']
        }
      }],
    region: 'eu-west-1',
    stage: 'dev'
  },
  functions: {
    importProductsFile: {
      handler: 'handler.importProductsFileHandler',
      events: [
        {
          http: {
            method: 'get',
            path: 'import',
            cors: true,
            request: {
              parameters: {
                querystrings: {
                  name: true
                }
              }
            },
            authorizer: {
              name: 'basicAuthorizer',
              arn: 'arn:aws:lambda:eu-west-1:071136134726:function:authorization-service-dev-basicAuthorizer',
              resultTtlInSeconds: 0,
              identitySource: 'method.request.header.Authorization',
              type: 'token'
            }
          }
        }
      ]
    },
    importFileParser: {
      handler: 'handler.importFileParserHandler',
      events: [{
        s3: {
          bucket: 'rs-app-task-5-bucket',
          event: 's3:ObjectCreated:*',
          rules: [{
            prefix: 'uploaded/',
            suffix: '.csv'
          }],
          existing: true,
        }
      }]
    }
  }
}

module.exports = serverlessConfiguration;
