export const generatePolicy = (principalId, resource, effect = 'Allow') => {
    return {
        principalId,
        policyDocument: {
            Version: '2012-10-17',
            Statement: [
                {
                  Action: 'execute-api:Invoke',
                  Effect: effect,
                  Resource: resource  
                }]
        }
    }
}