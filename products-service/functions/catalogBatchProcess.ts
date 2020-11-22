export const catalogBatchProcess = async (event) => {
    const users = event.Records.map(({ body }) => body);
    console.log(users);
}