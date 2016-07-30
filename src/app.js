'use strict';
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
module.exports={getItemAmount,getPromotionItems,calculatePrimalSubtotal,
    calculatePromotionSubtotal,calculateTotal,
    calculateSaveTotal};
