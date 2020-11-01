import { getProductById } from '../functions/getProductById';

test('Product not found', () => {
    expect(getProductById('/products/1').body).toBe(JSON.stringify({ message: 'Product not found' }));
});

test('Correct image url', () => {
    expect(JSON.parse(getProductById('/products/7567ec4b-b10c-48c5-9345-fc73c48a80aa').body).imageUrl).toBe('https://clothes-images-bucket.s3-eu-west-1.amazonaws.com/1.jpeg');
});