'use strict';
let app = require('../src/app.js');
describe('pos', () => {
    describe('getItemAmount', ()=> {
        const tags = [
            'ITEM000001',
            'ITEM000001',
            'ITEM000001',
            'ITEM000001',
            'ITEM000001',
            'ITEM000003-2.5',
            'ITEM000005',
            'ITEM000005-2',
        ];
        it('should get "amount" of items', ()=> {
            const itemsAmount = app.getItemAmount(tags);
            const expectedItemsAmount = [
                {
                    barcode: 'ITEM000001',
                    count: 5
                },
                {
                    barcode: 'ITEM000003',
                    count: 2.5
                },
                {
                    barcode: 'ITEM000005',
                    count: 3
                }
            ];
            expect(itemsAmount).toEqual(expectedItemsAmount);

        });
    });

    describe('getPromotionItems', ()=> {
        const promotions = [
            {
                type: 'BUY_TWO_GET_ONE_FREE',
                barcodes: [
                    'ITEM000000',
                    'ITEM000001',
                    'ITEM000005'
                ]
            }
        ];
        const itemsAmount = [
            {
                barcode: 'ITEM000001',
                count: 5
            },
            {
                barcode: 'ITEM000003',
                count: 2.5
            },
            {
                barcode: 'ITEM000005',
                count: 3
            }];
        it('should get "promotion" of items', ()=> {
            const promotionItems = app.getPromotionItems(promotions, itemsAmount);
            const expectedpromotionItems = [
                {
                    barcode: 'ITEM000001',
                    count: 5,
                    type: 'BUY_TWO_GET_ONE_FREE'
                },
                {
                    barcode: 'ITEM000003',
                    count: 2.5,
                    type: null
                },
                {
                    barcode: 'ITEM000005',
                    count: 3,
                    type: 'BUY_TWO_GET_ONE_FREE'
                }
            ];
            expect(promotionItems).toEqual(expectedpromotionItems);
        });
    });
});