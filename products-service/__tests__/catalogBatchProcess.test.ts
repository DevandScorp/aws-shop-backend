import { catalogBatchProcess } from '../functions/catalogBatchProcess';
import { Client } from 'pg';
import * as AWSMock from "aws-sdk-mock";
import * as AWS from "aws-sdk";

jest.mock('pg', () => {
    const mClient = {
        connect: jest.fn(),
        query: jest.fn(),
        end: jest.fn(),
    };
    return { Client: jest.fn(() => mClient) };
});

describe('catalogBatchProcess test', () => {
    let client;
    beforeEach(() => {
        AWSMock.setSDKInstance(AWS);
        AWSMock.mock('SNS','publish', (params,callback) => {
            return callback(null, true);
        });
        client = new Client();
    });
    afterEach(() => {
        jest.clearAllMocks();
        AWSMock.restore('SNS');
    });
    it('Check connection creation and closure', async () => {
        client.query.mockResolvedValue({ rows: [], rowCount: 0 });
        const sns = new AWS.SNS({ region: 'eu-west-1'});
        const catalogBatchProcessHandler = catalogBatchProcess(sns);
        await catalogBatchProcessHandler({ Records: [] }, null, null);
        expect(client.connect).toBeCalledTimes(1);
        expect(client.end).toBeCalledTimes(1);
        
    });
    it('Check database calls and sns work', async () => {
        client.query.mockResolvedValue({ rows: [{ id: 1 }], rowCount: 1 });
        const sns = new AWS.SNS({ region: 'eu-west-1'});
        const catalogBatchProcessHandler = catalogBatchProcess(sns);
        await catalogBatchProcessHandler({
            Records: [{
                body:
                    JSON.stringify({
                        title: 'Pants',
                        description: 'Beige and comfortable pants',
                        price: '15',
                        count: '5'
                    })
            }]
        }, null, null);
        expect(client.connect).toBeCalledTimes(1);
        expect(client.end).toBeCalledTimes(1);
        expect(client.query).toBeCalledTimes(2);
    });
});