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


});