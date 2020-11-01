import { getProductsList } from "../functions/getProductsList";

test('Correct number of products', () => {
    expect(JSON.parse(getProductsList().body).length).toBe(5);
});