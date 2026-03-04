This is the order history item api response sample
{
    "data": [
        {
            "orderDate": "2025-11-03T15:51:03.606Z",
            "id": "0aacb8ad-2a76-4a4d-a1cf-b41b2997541b",
            "storeId": "8a7a28dc-b54d-4841-b949-efe60dbae709",
            "customerId": "2b30a417-d18a-4928-9e52-955adcf2caec",
            "isDeleted": false,
            "status": "pending",
            "orderNumber": "0001-242060",
            "paymentReference": "ZUPA-1762184991843-692389",
            "originalDeliveryTypeId": "8468ba6c-77c0-40c6-9d25-cf691c2eb076",
            "specialNote": "",
            "deliveryLocation": {
                "address": "8a, Admirality Way",
                "latitude": 6.52,
                "longitude": 3.37,
                "customerId": "2b30a417-d18a-4928-9e52-955adcf2caec"
            },
            "recipient": {
                "name": "Adebayo Azeez",
                "phoneNumber": "08081602424"
            },
            "itemsCompletionStatus": null,
            "taxPercentage": 0,
            "discountType": null,
            "discountValue": 0,
            "discountValueGc": 0,
            "loyaltyPointsRedeemed": 0,
            "loyaltyPointsDiscountRedeemed": 0,
            "total": 42500,
            "grandTotal": 42500,
            "deliveryDate": null,
            "deliveryAmount": 0,
            "printDone": true,
            "isOnline": true,
            "glovoTrackingId": "",
            "dispatchService": null,
            "deliveryMethod": null,
            "createdAt": "2025-11-03T15:51:03.606Z",
            "updatedAt": "2025-11-03T15:51:03.606Z",
            "deliveryTypeId": "d052e43b-f01c-4eda-9593-1852a0810c12",
            "delivery_type": {
                "id": "d052e43b-f01c-4eda-9593-1852a0810c12",
                "name": "GTFREE",
                "price": 0,
                "state": "lagos",
                "type": "custom",
                "location": null,
                "isActive": true,
                "closestStore": "lekki",
                "storeId": "8a7a28dc-b54d-4841-b949-efe60dbae709",
                "createdAt": "2025-04-03T05:00:00.274Z",
                "updatedAt": "2025-11-12T00:52:23.522Z"
            },
            "order_items": [
                {
                    "id": "c0744815-e46a-4374-9968-1547a1d7bb79",
                    "productId": "617d7b45-3dc9-49b5-bd07-86876284ece0",
                    "quantity": 1,
                    "quantityAvailableForDispatch": 0,
                    "orderId": "0aacb8ad-2a76-4a4d-a1cf-b41b2997541b",
                    "createdAt": "2025-11-03T15:51:03.803Z",
                    "updatedAt": "2025-11-03T15:51:03.803Z",
                    "product": {
                        "id": "617d7b45-3dc9-49b5-bd07-86876284ece0",
                        "name": "Gluten Free Banana Bread ",
                        "unitPrice": 27000,
                        "isDeleted": false,
                        "isAvailable": false,
                        "isUnlimited": true,
                        "isInventoryLow": true,
                        "imageUrl": "https://s3.eu-west-2.amazonaws.com/zupa.dev.intelia.io/images/logos/A8ngdPaM-1743382877358-GLUTEN%20FREE%20BANANA.jpg",
                        "quantity": 0,
                        "departmentId": "17707b70-414e-40d0-8e0f-02b6b4d9ab14",
                        "originalBaseProductId": "2bf1195c-5cf9-47d6-9edb-965fca0f19e3",
                        "storeId": "8a7a28dc-b54d-4841-b949-efe60dbae709",
                        "createdAt": "2025-04-04T00:04:22.301Z",
                        "updatedAt": "2025-04-04T00:04:22.357Z",
                        "baseProductId": "2bf1195c-5cf9-47d6-9edb-965fca0f19e3",
                        "categorySizeId": "3e79eeb6-36b5-4ca5-832e-3aad3396f670",
                        "categorySize": {
                            "id": "3e79eeb6-36b5-4ca5-832e-3aad3396f670",
                            "name": "Extra Large",
                            "position": 5,
                            "createdAt": "2024-08-22T13:25:36.973Z",
                            "updatedAt": "2024-08-22T13:25:36.973Z",
                            "categoryId": "3179d303-fd50-48f9-95d4-72cfc89959cd"
                        }
                    },
                    "toppings": []
                },
                {
                    "id": "fa4d9b43-d922-478a-aa94-e37d771af3e1",
                    "productId": "ca91c6b2-d12f-48e2-9f03-290812b4176a",
                    "quantity": 1,
                    "quantityAvailableForDispatch": 0,
                    "orderId": "0aacb8ad-2a76-4a4d-a1cf-b41b2997541b",
                    "createdAt": "2025-11-03T15:51:03.806Z",
                    "updatedAt": "2025-11-03T15:51:03.806Z",
                    "product": {
                        "id": "ca91c6b2-d12f-48e2-9f03-290812b4176a",
                        "name": "Banana Bread ",
                        "unitPrice": 6500,
                        "isDeleted": false,
                        "isAvailable": false,
                        "isUnlimited": true,
                        "isInventoryLow": true,
                        "imageUrl": "https://s3.eu-west-2.amazonaws.com/zupa.dev.intelia.io/images/logos/jOPF11le-1743367828505-BANANA.jpg",
                        "quantity": 0,
                        "departmentId": "17707b70-414e-40d0-8e0f-02b6b4d9ab14",
                        "originalBaseProductId": "707aee3f-e174-46b4-b070-b29455f6eaee",
                        "storeId": "8a7a28dc-b54d-4841-b949-efe60dbae709",
                        "createdAt": "2025-04-03T23:27:45.294Z",
                        "updatedAt": "2025-04-03T23:27:45.348Z",
                        "baseProductId": "707aee3f-e174-46b4-b070-b29455f6eaee",
                        "categorySizeId": "ee3b35bc-695e-405e-90ee-f05c67c83e6a",
                        "categorySize": {
                            "id": "ee3b35bc-695e-405e-90ee-f05c67c83e6a",
                            "name": "Regular ",
                            "position": 3,
                            "createdAt": "2025-03-30T20:26:35.725Z",
                            "updatedAt": "2025-03-30T20:26:35.725Z",
                            "categoryId": "3179d303-fd50-48f9-95d4-72cfc89959cd"
                        }
                    },
                    "toppings": []
                }
            ]
        },
        {
            "orderDate": "2025-11-01T14:21:50.216Z",
            "id": "81e83ee0-4ed6-4cd9-85cd-97bc92f3ac70",
            "storeId": "8a7a28dc-b54d-4841-b949-efe60dbae709",
            "customerId": "2b30a417-d18a-4928-9e52-955adcf2caec",
            "isDeleted": false,
            "status": "pending",
            "orderNumber": "0001-242059",
            "paymentReference": "ZUPA-1762005147579-907769",
            "originalDeliveryTypeId": "9e569d9b-828b-4ee2-ad3a-1f39444a89bd",
            "specialNote": "",
            "deliveryLocation": {
                "address": "19B Fola Osibo, Lekki Phase 1, Lekki, Nigeria",
                "latitude": 6.430118879280349,
                "longitude": 3.4881381695005618,
                "customerId": "2b30a417-d18a-4928-9e52-955adcf2caec"
            },
            "recipient": {
                "name": "Adebayo Azeez",
                "phoneNumber": "08066916000"
            },
            "itemsCompletionStatus": null,
            "taxPercentage": 0,
            "discountType": null,
            "discountValue": 0,
            "discountValueGc": 0,
            "loyaltyPointsRedeemed": 8000,
            "loyaltyPointsDiscountRedeemed": 8000,
            "total": 23500,
            "grandTotal": 23500,
            "deliveryDate": "2025-11-01T13:52:20.952Z",
            "deliveryAmount": 0,
            "printDone": true,
            "isOnline": true,
            "glovoTrackingId": "",
            "dispatchService": null,
            "deliveryMethod": null,
            "createdAt": "2025-11-01T14:21:50.216Z",
            "updatedAt": "2025-11-01T14:21:50.216Z",
            "deliveryTypeId": "9e569d9b-828b-4ee2-ad3a-1f39444a89bd",
            "delivery_type": {
                "id": "9e569d9b-828b-4ee2-ad3a-1f39444a89bd",
                "name": "Pickup Lekki",
                "price": 0,
                "state": "lagos",
                "type": "custom",
                "location": null,
                "isActive": true,
                "closestStore": "lekki",
                "storeId": "8a7a28dc-b54d-4841-b949-efe60dbae709",
                "createdAt": "2025-04-08T16:30:08.768Z",
                "updatedAt": "2025-11-12T00:53:06.220Z"
            },
            "order_items": [
                {
                    "id": "a3325447-abfe-4f4b-9b67-612876cc6346",
                    "productId": "586fe776-e706-484d-b8dd-26254365bb0f",
                    "quantity": 5,
                    "quantityAvailableForDispatch": 0,
                    "orderId": "81e83ee0-4ed6-4cd9-85cd-97bc92f3ac70",
                    "createdAt": "2025-11-01T14:21:50.631Z",
                    "updatedAt": "2025-11-01T14:21:50.631Z",
                    "product": {
                        "id": "586fe776-e706-484d-b8dd-26254365bb0f",
                        "name": "Banana Bread ",
                        "unitPrice": 4700,
                        "isDeleted": false,
                        "isAvailable": false,
                        "isUnlimited": true,
                        "isInventoryLow": true,
                        "imageUrl": "https://s3.eu-west-2.amazonaws.com/zupa.dev.intelia.io/images/logos/7kO8AOGV-1743367803585-BANANA.jpg",
                        "quantity": 0,
                        "departmentId": "17707b70-414e-40d0-8e0f-02b6b4d9ab14",
                        "originalBaseProductId": "707aee3f-e174-46b4-b070-b29455f6eaee",
                        "storeId": "8a7a28dc-b54d-4841-b949-efe60dbae709",
                        "createdAt": "2025-04-03T23:27:45.294Z",
                        "updatedAt": "2025-04-03T23:27:45.348Z",
                        "baseProductId": "707aee3f-e174-46b4-b070-b29455f6eaee",
                        "categorySizeId": "1e21784d-2c48-4eb9-ad81-b2ef743b5882",
                        "categorySize": {
                            "id": "1e21784d-2c48-4eb9-ad81-b2ef743b5882",
                            "name": "Midi",
                            "position": 2,
                            "createdAt": "2024-08-22T13:25:36.973Z",
                            "updatedAt": "2024-08-22T13:25:36.973Z",
                            "categoryId": "3179d303-fd50-48f9-95d4-72cfc89959cd"
                        }
                    },
                    "toppings": []
                }
            ]
        },
      ]
}

add a re-order button on the order details page to add the orders to the cart.

this is the localStorage cart item sample

[
    {
        "uuid": "fa595b1c-7303-4d1e-8aec-6dddf2a53f09",
        "id": "617d7b45-3dc9-49b5-bd07-86876284ece0",
        "size": "Extra Large",
        "unitPrice": 27000,
        "imageUrl": "https://s3.eu-west-2.amazonaws.com/zupa.dev.intelia.io/images/logos/A8ngdPaM-1743382877358-GLUTEN%20FREE%20BANANA.jpg",
        "name": "Gluten Free Banana Bread ",
        "quantity": 1,
        "toppings": [],
        "totalCost": 27000
    },
    {
        "uuid": "27bddac8-eb03-4d0a-a162-5babd4479ec3",
        "id": "45437b75-93e7-4c4f-b5a4-3b9b46da0896",
        "size": "Regular ",
        "unitPrice": 7500,
        "imageUrl": "https://s3.eu-west-2.amazonaws.com/zupa.dev.intelia.io/images/logos/XIcZXcI3-1743380707462-COCONUT.jpg",
        "name": "Coconut Bread ",
        "quantity": 1,
        "toppings": [],
        "totalCost": 7500
    }
]