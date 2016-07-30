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
    for (let i = 0; i < promotionItems.length; i++) {
        primalItemstype.push(Object.assign({}, primalItems[i], {type: promotionItems[i].type}));
    }
    for (let i = 0; i < primalItems.length; i++) {
        primalSubtotal.push(Object.assign({}, primalItemstype[i], {primalSubtotal: (primalItems[i].price * primalItems[i].count)}));
    }
    return primalSubtotal;
}

module.exports={getItemAmount,getPromotionItems,calculatePrimalSubtotal};
