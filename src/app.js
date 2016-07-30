'use strict';
let app = require('../spec/fixture');
function getItemAmount(tags) {
    let itemsAmount = [];

    function formatTags(tags) {
        return tags.map(item => {
            let arrTags = item.split('-');
            return {
                barcode: arrTags[0],
                count: parseFloat(arrTags[1]) || 1
            }
        });
    }

    let formatedTags = formatTags(tags);

    function mergeBarcodes(formatedTags) {
        let result = formatedTags.reduce((cur, newval)=> {
            let exist = cur.find(item=> {
                return item.barcode === newval.barcode;
            });
            if (exist) {
                exist.count += newval.count;
            } else {
                cur.push(Object.assign({}, newval))
            }
            return cur;
        }, []);
        return result;
    }

    itemsAmount = mergeBarcodes(formatedTags);
    return itemsAmount;
}
function getPromotionItems(promotions, itemsAmount) {
    let promotionItems = [];
    itemsAmount.map(item=>{
        let promotion = promotions.find
        (promotion => promotion.barcodes.some(b => b === item.barcode));
        let type = promotion ? promotion.type : null;
        promotionItems.push(Object.assign({}, item, {type: type}));
    });
    return promotionItems;
}
function calculatePrimalSubtotal(allItems, itemsAmount, promotionItems) {
    let primalSubtotal = [];
    let primalItems = [];
    let primalItemstype = [];
    itemsAmount.map(item=>{
        allItems.map(itema=>{
            if (itema.barcode === item.barcode) {
                primalItems.push(Object.assign({}, itema, {count: item.count}));
            }});
    });
    promotionItems.map(item=> {
        primalItemstype.push(Object.assign({}, primalItems[promotionItems.indexOf(item)],
            {type: item.type}));
    });
    primalItems.map(item=> {
        primalSubtotal.push(Object.assign({},
            primalItemstype[primalItems.indexOf(item)],
            {primalSubtotal: (item.price * item.count)}));
    });
    return primalSubtotal;
}
function calculatePromotionSubtotal(primalSubtotal) {
    let promotionSubtotal = [];
    let promotionArr = [];
    primalSubtotal.map( item=>{
        let promtioncount = parseInt(item.count / 3);
        if (item.type === 'BUY_TWO_GET_ONE_FREE') {
            promotionArr[primalSubtotal.indexOf(item)] = parseFloat((item.count - promtioncount) * item.price);
        }
        else {
            promotionArr[primalSubtotal.indexOf(item)] = item.primalSubtotal;
        }
        promotionSubtotal.push(Object.assign({}, item, {promotionSubtotal: promotionArr[primalSubtotal.indexOf(item)]}))
    });
    return promotionSubtotal;
}
function calculateTotal(promotionSubtotal) {
    let total = [];
    let promotionTotal = 0;
    let primalTotal = 0;promotionSubtotal.map(item=> {
        primalTotal += item.primalSubtotal;
        promotionTotal += item.promotionSubtotal;
    });
    total.push(Object.assign({primalTotal: primalTotal}, {promotionTotal: promotionTotal}));
    return total;
}
function calculateSaveTotal(total) {
    let saveTotal = total[0].primalTotal - total[0].promotionTotal;
    return saveTotal;
}
function print(promotionSubtotal, total, saveTotal) {
    let header = '***<没钱赚商店>收据***\n';
    let footer = '----------------------\n' +
        '总计：' + total[0].promotionTotal.toFixed(2) + '(元)\n' +
        '节省：' + saveTotal.toFixed(2) + '(元)\n' +
        '**********************';
    let body = '';
    let receipt = '';
    promotionSubtotal.map(item=> {
        let itemReceipt = '名称：' + item.name +
            '，数量：' + item.count + item.unit +
            '，单价：' + item.price.toFixed(2) +
            '(元)，小计：' + item.promotionSubtotal.toFixed(2) + '(元)\n';
        body = body.concat(itemReceipt);
    });
    receipt = receipt.concat(header).concat(body).concat(footer);
    return receipt;
}
function printReceipt(tags) {
    let allItems = app.loadAllItems();
    let promotions = app.loadPromotions();
    let itemsAmount = getItemAmount(tags);
    let promotionItems = getPromotionItems(promotions, itemsAmount);
    let primalSubtotal = calculatePrimalSubtotal(allItems, itemsAmount, promotionItems);
    let promotionSubtotal = calculatePromotionSubtotal(primalSubtotal);
    let total = calculateTotal(promotionSubtotal);
    let saveTotal = calculateSaveTotal(total);
    let receipt = print(promotionSubtotal, total, saveTotal);
    return receipt;
}
module.exports={getItemAmount,getPromotionItems,calculatePrimalSubtotal,
    calculatePromotionSubtotal,calculateTotal,
    calculateSaveTotal,printReceipt};
