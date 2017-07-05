module.exports = function Cart(initItems) {
    this.items = initItems || {};;// initItems used from old cart items
    this.totalQty = 0;
    this.totalPrice = 0;
    // console.log("From CART()");
    // console.log(this.items);

    if (this.items) {
        for (var key in this.items) {
            this.totalQty += this.items[key].qty;
            this.totalPrice = this.totalPrice + (this.items[key].qty * this.items[key].item.price);
            // var mul =10 + (5*6);
            console.log(this.totalPrice);
            console.log(this.items[key].qty);
            console.log(this.items[key].item.price);
            // console.log(mul);
        }
    }

    this.add = function (item, id) {
        var storedItem = this.items[id];
        if (!storedItem) {
            storedItem = this.items[id] = {qty: 0, item: item, price: 0};
        }
        storedItem.qty++;
        storedItem.price = storedItem.item.price * storedItem.qty;
        this.totalQty++;
        this.totalPrice += storedItem.price;
    };

    this.generateArray = function () {
        var arr = [];
        for (var id in this.items) {
            arr.push(this.items[id]);
        }
        return arr;
    };
};