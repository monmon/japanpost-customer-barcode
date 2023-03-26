import assert = require('assert');

import { CustomerBarcode } from '../src/customer_barcode';

describe('CustomerBarcode', () => {
  describe('https://www.post.japanpost.jp/zipcode/zipmanual/p25.html', () => {
    [{
      postalCode: "263-0023",
      address: "千葉市稲毛区緑町3丁目30-8　郵便ビル403号",
      expected: [
        "STC", "2", "6", "3", "0", "0", "2", "3", "3", "-", "3", "0", "-", "8", "-", "4", "0", "3", "CC4", "CC4", "CC4", "5", "SPC",
      ],
    }, {
      postalCode: "014-0113",
      address: "秋田県大仙市堀見内　南田茂木　添60-1",
      expected: [
        "STC", "0", "1", "4", "0", "1", "1", "3", "6", "0", "-", "1", "CC4", "CC4", "CC4", "CC4", "CC4", "CC4", "CC4", "CC4", "CC4", "CC8", "SPC",
      ],
    }, {
      postalCode: "110-0016",
      address: "東京都台東区台東5-6-3　ABCビル10F",
      expected: [
        "STC", "1", "1", "0", "0", "0", "1", "6", "5", "-", "6", "-", "3", "-", "1", "0", "CC4", "CC4", "CC4", "CC4", "CC4", "9", "SPC",
      ],
    }, {
      postalCode: "060-0906",
      address: "北海道札幌市東区北六条東4丁目　郵便センター6号館",
      expected: [
        "STC", "0", "6", "0", "0", "9", "0", "6", "4", "-", "6", "CC4", "CC4", "CC4", "CC4", "CC4", "CC4", "CC4", "CC4", "CC4", "CC4", "9", "SPC",
      ],
    }, {
      postalCode: "065-0006",
      address: "北海道札幌市東区北六条東8丁目　郵便センター10号館",
      expected: [
        "STC", "0", "6", "5", "0", "0", "0", "6", "8", "-", "1", "0", "CC4", "CC4", "CC4", "CC4", "CC4", "CC4", "CC4", "CC4", "CC4", "9", "SPC",
      ],
    }, {
      postalCode: "407-0033",
      address: "山梨県韮崎市龍岡町下條南割　韮崎400",
      expected: [
        "STC", "4", "0", "7", "0", "0", "3", "3", "4", "0", "0", "CC4", "CC4", "CC4", "CC4", "CC4", "CC4", "CC4", "CC4", "CC4", "CC4", "-", "SPC",
      ],
    }, {
      postalCode: "273-0102",
      address: "千葉県鎌ケ谷市右京塚　東3丁目-20-5　郵便・A&bコーポB604号",
      expected: [
        "STC", "2", "7", "3", "0", "1", "0", "2", "3", "-", "2", "0", "-", "5", "CC1", "1", "6", "0", "4", "CC4", "CC4", "0", "SPC",
      ],
    }, {
      postalCode: "198-0036",
      address: "東京都青梅市河辺町十一丁目六番地一号　郵便タワー601",
      expected: [
        "STC", "1", "9", "8", "0", "0", "3", "6", "1", "1", "-", "6", "-", "1", "-", "6", "0", "1", "CC4", "CC4", "CC4", "CC8", "SPC",
      ],
    }, {
      postalCode: "027-0203",
      address: "岩手県宮古市大字津軽石第二十一地割大淵川480",
      expected: [
        "STC", "0", "2", "7", "0", "2", "0", "3", "2", "1", "-", "4", "8", "0", "CC4", "CC4", "CC4", "CC4", "CC4", "CC4", "CC4", "CC5", "SPC",
      ],
    }, {
      postalCode: "590-0016",
      address: "大阪府堺市堺区中田出井町四丁六番十九号",
      expected: [
        "STC", "5", "9", "0", "0", "0", "1", "6", "4", "-", "6", "-", "1", "9", "CC4", "CC4", "CC4", "CC4", "CC4", "CC4", "CC4", "CC2", "SPC",
      ],
    }, {
      postalCode: "080-0831",
      address: "北海道帯広市稲田町南七線　西28",
      expected: [
        "STC", "0", "8", "0", "0", "8", "3", "1", "7", "-", "2", "8", "CC4", "CC4", "CC4", "CC4", "CC4", "CC4", "CC4", "CC4", "CC4", "CC7", "SPC",
      ],
    }, {
      postalCode: "317-0055",
      address: "茨城県日立市宮田町6丁目7-14　ABCビル2F",
      expected: [
        "STC", "3", "1", "7", "0", "0", "5", "5", "6", "-", "7", "-", "1", "4", "-", "2", "CC4", "CC4", "CC4", "CC4", "CC4", "CC1", "SPC",
      ],
    }, {
      postalCode: "650-0046",
      address: "神戸市中央区港島中町9丁目7-6　郵便シティA棟1F1号",
      expected: [
        "STC", "6", "5", "0", "0", "0", "4", "6", "9", "-", "7", "-", "6", "CC1", "0", "1", "-", "1", "CC4", "CC4", "CC4", "5", "SPC",
      ],
    }, {
      postalCode: "623-0011",
      address: "京都府綾部市青野町綾部6-7　LプラザB106",
      expected: [
        "STC", "6", "2", "3", "0", "0", "1", "1", "6", "-", "7", "CC2", "1", "CC1", "1", "1", "0", "6", "CC4", "CC4", "CC4", "4", "SPC",
      ],
    }, {
      postalCode: "064-0804",
      address: "札幌市中央区南四条西29丁目1524-23　第2郵便ハウス501",
      expected: [
        "STC", "0", "6", "4", "0", "8", "0", "4", "2", "9", "-", "1", "5", "2", "4", "-", "2", "3", "-", "2", "-", "3", "SPC",
      ],
    }, {
      postalCode: "910-0067",
      address: "福井県福井市新田塚3丁目80-25　J1ビル2-B",
      expected: [
        "STC", "9", "1", "0", "0", "0", "6", "7", "3", "-", "8", "0", "-", "2", "5", "CC1", "9", "1", "-", "2", "CC1", "9", "SPC",
      ],
    }].forEach(testCase => {
      context(`${testCase.postalCode} ${testCase.address}`, () => {
        it('対応したデータを生成できるべき',  () => {
          const customerBarcode = new CustomerBarcode(testCase.postalCode, testCase.address)

          assert.deepEqual(customerBarcode.data, testCase.expected);
        })
      })
    })
  });

  describe('toBase64', () => {
    [{
      postalCode: "263-0023",
      address: "千葉市稲毛区緑町3丁目30-8　郵便ビル403号",
      expected: [
        'R0lGODdhDAAMAIAAAAAAAP///yH5BAAAAAAALAAAAAAMAAwAQAIZjANwe2nOIFyTPYUwxfXa/TWcJnrRaElYAQA7',
        'R0lGODlhDAAMAPAAAAAAAP///yH5BAAAAAAALAAAAAAMAAwAAAIZBIJpuMkXmmtSQXrz21F3joHQ5JGc+TlBAQA7',
        'R0lGODdhDAAMAIAAAAAAAP///yH5BAAAAAAALAAAAAAMAAwAQAIZjANguXoNkWNPRoqne5TraoXZ9YnbMVZUAQA7',
        'R0lGODdhDAAMAIAAAAAAAP///yH5BAAAAAAALAAAAAAMAAwAQAIZjANguYp+XptRWnYdxvVs6Gki9ZGjFZVVAQA7',
        'R0lGODdhDAAMAIAAAAAAAP///yH5BAAAAAAALAAAAAAMAAwAQAIXBIKpph38TkTQUQmztJN3rl1iF3qVVQAAOw==',
        'R0lGODdhDAAMAIAAAAAAAP///yH5BAAAAAAALAAAAAAMAAwAQAIXBIKpph38TkTQUQmztJN3rl1iF3qVVQAAOw==',
        'R0lGODlhDAAMAPAAAAAAAP///yH5BAAAAAAALAAAAAAMAAwAAAIZBIJpuMkXmmtSQXrz21F3joHQ5JGc+TlBAQA7',
        'R0lGODdhDAAMAIAAAAAAAP///yH5BAAAAAAALAAAAAAMAAwAQAIZjANguYp+XptRWnYdxvVs6Gki9ZGjFZVVAQA7',
        'R0lGODdhDAAMAIAAAAAAAP///yH5BAAAAAAALAAAAAAMAAwAQAIZjANguYp+XptRWnYdxvVs6Gki9ZGjFZVVAQA7',
        'R0lGODdhDAAMAIAAAAAAAP///yH5BAAAAAAALAAAAAAMAAwAQAIYjANwe8mooHGMLorj1U/2yYGil43bZx4FADs=',
        'R0lGODdhDAAMAIAAAAAAAP///yH5BAAAAAAALAAAAAAMAAwAQAIZjANguYp+XptRWnYdxvVs6Gki9ZGjFZVVAQA7',
        'R0lGODdhDAAMAIAAAAAAAP///yH5BAAAAAAALAAAAAAMAAwAQAIXBIKpph38TkTQUQmztJN3rl1iF3qVVQAAOw==',
        'R0lGODdhDAAMAIAAAAAAAP///yH5BAAAAAAALAAAAAAMAAwAQAIYjANwe8mooHGMLorj1U/2yYGil43bZx4FADs=',
        'R0lGODdhDAAMAIAAAAAAAP///yH5BAAAAAAALAAAAAAMAAwAQAIZBIJpqRf7HJyOUXRZxLI2rm1iRnqgaHVIAQA7',
        'R0lGODdhDAAMAIAAAAAAAP///yH5BAAAAAAALAAAAAAMAAwAQAIYjANwe8mooHGMLorj1U/2yYGil43bZx4FADs=',
        'R0lGODdhDAAMAIAAAAAAAP///yH5BAAAAAAALAAAAAAMAAwAQAIYBBKGm8eNFJxSsurwo9ndvmlcBE4fGToFADs=',
        'R0lGODdhDAAMAIAAAAAAAP///yH5BAAAAAAALAAAAAAMAAwAQAIXBIKpph38TkTQUQmztJN3rl1iF3qVVQAAOw==',
        'R0lGODdhDAAMAIAAAAAAAP///yH5BAAAAAAALAAAAAAMAAwAQAIZjANguYp+XptRWnYdxvVs6Gki9ZGjFZVVAQA7',
        'R0lGODdhDAAMAIAAAAAAAP///yH5BAAAAAAALAAAAAAMAAwAQAIYjG8AmMvaIkMw1Otonm9PLIGWU2ncUR4FADs=',
        'R0lGODdhDAAMAIAAAAAAAP///yH5BAAAAAAALAAAAAAMAAwAQAIYjG8AmMvaIkMw1Otonm9PLIGWU2ncUR4FADs=',
        'R0lGODdhDAAMAIAAAAAAAP///yH5BAAAAAAALAAAAAAMAAwAQAIYjG8AmMvaIkMw1Otonm9PLIGWU2ncUR4FADs=',
        'R0lGODdhDAAMAIAAAAAAAP///yH5BAAAAAAALAAAAAAMAAwAQAIZBIJpuMkXmoTNzYcjtHSr7mSXJoJkOHJIAQA7',
        'R0lGODdhDAAMAIAAAAAAAP///yH5BAAAAAAALAAAAAAMAAwAQAIZjANwl9aLVITwrWeZzJRXeW2g5ozl+aFLAQA7',
      ],
    }].forEach(testCase => {
      context(`${testCase.postalCode} ${testCase.address}`, () => {
        it('base64のデータが返るべき',  () => {
          const customerBarcode = new CustomerBarcode(testCase.postalCode, testCase.address)

          assert.deepEqual(customerBarcode.toBase64(), testCase.expected);
        })
      })
    })
  });
})
