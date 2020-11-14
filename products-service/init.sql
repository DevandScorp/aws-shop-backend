insert into products (image, title, description, price)
values ('https://clothes-images-bucket.s3-eu-west-1.amazonaws.com/1.jpeg', 'Pants',
        'Green and comfortable pants', 2),
       ('https://clothes-images-bucket.s3-eu-west-1.amazonaws.com/2.jpg', 'Hoodie',
        'Beige and comfortable hoodie', 10),
       ('https://clothes-images-bucket.s3-eu-west-1.amazonaws.com/3.jpg', 'Pants',
        'Grey and comfortable hoodie', 23),
       ('https://clothes-images-bucket.s3-eu-west-1.amazonaws.com/4.jpeg', 'Pants',
        'Beige and comfortable pants', 15),
       ('https://clothes-images-bucket.s3-eu-west-1.amazonaws.com/5.jpg', 'Pants',
        'Green and comfortable hoodie', 20);

insert into stocks (product_id, count)
values ('375220e6-9453-4041-be48-370adcb68c03', 4),
       ('9054e8ab-e732-4195-a4db-3177ef7ae846', 6),
       ('e19cb282-5000-42cc-a1d5-aec15c08a2a7', 7),
       ('2f941b9b-cad6-4fc8-a786-5a21e3b968d2', 12),
       ('a7c592fd-a7fc-496a-bd2f-4d0164961bdf', 7);