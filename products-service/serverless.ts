import type { Serverless } from 'serverless/aws';

const serverlessConfiguration: Serverless = {
  service: {
    name: 'products-service',
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
  resources: {
    Resources: {
      SNSTopic: {
        Type: 'AWS::SNS::Topic',
        Properties: {
          TopicName: 'createProductTopic' 
        }
      },
      SNSSubscription: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Endpoint: 'artemda4@gmail.com',
          Protocol: 'email',
          TopicArn: {
            Ref: 'SNSTopic'
          },
          FilterPolicy: {
            Type: ['Expensive']
          }
        }
      },
      SNSSubscriptionSecond: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Endpoint: 'artemda459@gmail.com',
          Protocol: 'email',
          TopicArn: {
            Ref: 'SNSTopic'
          },
          FilterPolicy: {
            Type: ['Cheap']
          }
        }
      }
    }
    
  },
  // Add the serverless-webpack plugin
  plugins: ['serverless-webpack'],
  provider: {
    name: 'aws',
    runtime: 'nodejs12.x',
    apiGateway: {
      minimumCompressionSize: 1024,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      SNS_ARN: {
        Ref: 'SNSTopic'
      }
    },
    iamRoleStatements:[
      {
        Effect: 'Allow',
        Action: 'sqs:*',
        Resource: "${cf:import-service-${self:provider.stage}.SQSQueueArn}"
      },
      {
        Effect: 'Allow',
        Action: 'sns:*',
        Resource: {
          Ref: 'SNSTopic'
        }
      }
    ],
    stage: 'dev',
    region: 'eu-west-1'
  },
  functions: {
    getProductsList: {
      handler: 'handler.getProductsListHandler',
      events: [
        {
          http: {
            method: 'get',
            path: 'products',
          }
        }
      ]
    },
    getProductById: {
      handler: 'handler.getProductByIdHandler',
      events: [
        {
          http: {
            method: 'get',
            path: 'products/{id}',
            request: {
              parameters: {
                paths: {
                  id: true
                }
              }
            }
          }
        }
      ]
    },
    createProduct: {
      handler: 'handler.createProductHandler',
      events: [
        {
          http: {
            method: 'post',
            path: 'products',
            cors: true
          }
        }
      ]
    },
    catalogBatchProcess: {
      handler: 'handler.catalogBatchProcessHandler',
      events: [{
        sqs: {
          batchSize: 5,
          arn: "${cf:import-service-${self:provider.stage}.SQSQueueArn}"
        }
      }]
    }
  }
}

module.exports = serverlessConfiguration;
