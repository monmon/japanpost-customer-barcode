# japanpost-customer-barcode

## Usage

```js
const postalCode = "263-0023";
const address = "千葉市稲毛区緑町3丁目30-8　郵便ビル403号";

const customerBarcode = new JapanpostCustomerBarcode(postalCode, address)

console.log(customerBarcode.data);
console.log(customerBarcode.toBase64());
```

See. https://www.post.japanpost.jp/zipcode/zipmanual/p25.html
