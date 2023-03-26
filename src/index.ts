export class CustomerBarcode {
  postalCode: string;
  address: string;
  data: string[];

  constructor(postalCode: string, address: string) {
    this.postalCode = postalCode.replace(/[^\d]/g, "");
    this.address = address;

    this.data = this._build();
  }

  _build() {
    const a = this.postalCode.split("");

    const kanjiToNumber: { [key: string]: number } = {
      一: 1,
      二: 2,
      三: 3,
      四: 4,
      五: 5,
      六: 6,
      七: 7,
      八: 8,
      九: 9,
      十: 10,
      百: 100,
      千: 1000,
    };
    const kanjiToNumberRegExpConverter = new RegExp(
      `([${Object.keys(kanjiToNumber).join("|")}]+)([${[
        "丁目",
        "丁",
        "番地",
        "番",
        "号",
        "地割",
        "線",
        "の",
        "ノ",
      ].join("|")}])`,
      "g"
    );

    const normalizedAddress = String(this.address)
      .replace(/[Ａ-Ｚａ-ｚ０-９]/g, (s) =>
        String.fromCharCode(s.charCodeAt(0) - 0xfee0)
      )
      .toUpperCase()
      // &/・.は取り除く
      .replace(/[&/・.]+/g, "")
      // "丁目" "丁" "番地" "番" "号" "地割" "線" "の" "ノ" の前の漢数字は算用数字に変換される
      .replace(kanjiToNumberRegExpConverter, (match, p1, p2) => {
        const arabicNumerals = p1.split("").reduce(
          (acc: { pre: number; result: number }, cur: number) => {
            const number = kanjiToNumber[cur];
            if (number % 10 === 0) {
              return acc.pre > 0
                ? {
                    pre: 0,
                    // note.
                    // 一旦加算した分は違ったので減算する必要がある
                    result: acc.result - acc.pre + acc.pre * number,
                  }
                : {
                    pre: 0,
                    result: acc.result + number,
                  };
            } else {
              return {
                pre: number,
                // note.
                // その後に十百千が来るかもしれないが、来ないかもしれないので一旦加算
                result: acc.result + number,
              };
            }
          },
          {
            pre: 0,
            result: 0,
          }
        ).result;

        return `${arabicNumerals}${p2}`;
      })
      // 数字の後のアルファベットは消す
      // ただしその後ろがアルファベットか数字なら消さない
      .replace(/(\d)[A-Z]([^A-Z0-9]|$)/g, "$1")
      .trim();

    const hyphenatedAddress = normalizedAddress
      .replace(/[^A-Z0-9]/g, "-")
      // 抜き出し文字、アルファベット、抜き出し文字の並びの場合にはハイフンにする
      .replace(/(\d)[A-Z](\d)/g, "$1-$2")
      // 2文字以上連続したアルファベットはハイフンにする
      .replace(/[A-Z]{2,}/g, "-")
      // 連続するハイフンは1つにする
      .replace(/-+/g, "-")
      // ハイフンは抜き出し文字の前にあるものなので最後のハイフンは取り除く
      .replace(/-$/, "")
      // アルファベットの前後にあるハイフンは取り除き詰める
      .replace(/-?([A-Z])-?/g, "$1")
      // 先頭のハイフンは取り除き詰める
      .replace(/^-/, "");

    const b = hyphenatedAddress.split("").flatMap((e: string) => {
      if (/[A-J]/.test(e)) {
        return ["CC1", String(e.charCodeAt(0) - "A".charCodeAt(0))];
      } else if (/[K-T]/.test(e)) {
        return ["CC2", String(e.charCodeAt(0) - "K".charCodeAt(0))];
      } else if (/[U-Z]/.test(e)) {
        return ["CC3", String(e.charCodeAt(0) - "U".charCodeAt(0))];
      }
      return e;
    });

    // note.
    // a7文字 + b で20文字にしないといけないので、b が13文字以上の場合には CC4 で埋める、
    // 20文字より多い場合には削る
    const lackLength = 13 - b.length;
    const barcodeCharacters = ((a, b, lackLength) => {
      if (lackLength >= 0) {
        const lack = [...Array(lackLength)].map(() => "CC4");
        return [...a, ...b, ...lack];
      } else {
        return [...a, ...b.slice(0, lackLength)];
      }
    })(a, b, lackLength);

    const checkDigit = this._calculateCheckDigit(barcodeCharacters);

    return ["STC", ...barcodeCharacters, checkDigit, "SPC"];
  }

  _calculateCheckDigit(barcodeCharacters: string[]) {
    // - は10
    // CC がついているものは 11以降
    // https://www.post.japanpost.jp/zipcode/zipmanual/p21.html
    const forDigit = barcodeCharacters.map((e: string) => {
      if (Number(e) < 10) {
        return e;
      }

      return e === "-" ? "10" : e.replace("CC", "1");
    });
    const total = forDigit.reduce(
      (acc: number, cur: string) => acc + Number(cur),
      0
    );

    // https://www.post.japanpost.jp/zipcode/zipmanual/p21.html
    const remainder = total % 19;
    const checkDigit = ((remainder) => {
      if (remainder === 0) {
        return String(0);
      }

      const sub = 19 - remainder;
      if (sub < 10) {
        return String(sub);
      }

      return sub === 10 ? "-" : String(sub).replace(/^1/, "CC");
    })(remainder);

    return checkDigit;
  }

  toBase64() {
    const codeToBase64: { [key: string]: string } = {
      "0": "R0lGODdhDAAMAIAAAAAAAP///yH5BAAAAAAALAAAAAAMAAwAQAIXBIKpph38TkTQUQmztJN3rl1iF3qVVQAAOw==",
      "1": "R0lGODdhDAAMAIAAAAAAAP///yH5BAAAAAAALAAAAAAMAAwAQAIYBBKGm9eM1JtSsupwdDfzpUHh6G2mWEIFADs=",
      "2": "R0lGODlhDAAMAPAAAAAAAP///yH5BAAAAAAALAAAAAAMAAwAAAIZBIJpuMkXmmtSQXrz21F3joHQ5JGc+TlBAQA7",
      "3": "R0lGODdhDAAMAIAAAAAAAP///yH5BAAAAAAALAAAAAAMAAwAQAIZjANguYp+XptRWnYdxvVs6Gki9ZGjFZVVAQA7",
      "4": "R0lGODdhDAAMAIAAAAAAAP///yH5BAAAAAAALAAAAAAMAAwAQAIYBBKGm8eNFJxSsurwo9ndvmlcBE4fGToFADs=",
      "5": "R0lGODdhDAAMAIAAAAAAAP///yH5BAAAAAAALAAAAAAMAAwAQAIZBIJpuMkXmoTNzYcjtHSr7mSXJoJkOHJIAQA7",
      "6": "R0lGODdhDAAMAIAAAAAAAP///yH5BAAAAAAALAAAAAAMAAwAQAIZjANguXoNkWNPRoqne5TraoXZ9YnbMVZUAQA7",
      "7": "R0lGODdhDAAMAIAAAAAAAP///yH5BAAAAAAALAAAAAAMAAwAQAIYBBKGy3mOFJxSsvrswjG/6zVUOHYi16AFADs=",
      "8": "R0lGODdhDAAMAIAAAAAAAP///yH5BAAAAAAALAAAAAAMAAwAQAIZBIJpqRf7HJyOUXRZxLI2rm1iRnqgaHVIAQA7",
      "9": "R0lGODdhDAAMAIAAAAAAAP///yH5BAAAAAAALAAAAAAMAAwAQAIYjANgeceo4IqvvUtzm3zjLYWfqIVWeXYFADs=",
      "-": "R0lGODdhDAAMAIAAAAAAAP///yH5BAAAAAAALAAAAAAMAAwAQAIYjANwe8mooHGMLorj1U/2yYGil43bZx4FADs=",
      CC1: "R0lGODdhDAAMAIAAAAAAAP///yH5BAAAAAAALAAAAAAMAAwAQAIYjANwl+uooGmOLoqjfTVy2U3aKJbgtz0FADs=",
      CC2: "R0lGODdhDAAMAIAAAAAAAP///yH5BAAAAAAALAAAAAAMAAwAQAIXjG8AuejKokMw1Nvq3EdvLIFWRnISVwAAOw==",
      CC3: "R0lGODdhDAAMAIAAAAAAAP///yH5BAAAAAAALAAAAAAMAAwAQAIZBIKpahv9TkTQUQlr0tdu6WXY2E0Ld4JJAQA7",
      CC4: "R0lGODdhDAAMAIAAAAAAAP///yH5BAAAAAAALAAAAAAMAAwAQAIYjG8AmMvaIkMw1Otonm9PLIGWU2ncUR4FADs=",
      CC5: "R0lGODdhDAAMAIAAAAAAAP///yH5BAAAAAAALAAAAAAMAAwAQAIXBIKpm4YeoDys0Vntoxn2C25ixFWeSRUAOw==",
      CC6: "R0lGODdhDAAMAIAAAAAAAP///yH5BAAAAAAALAAAAAAMAAwAQAIXjANwy5auUHyMLopjg81uz0lhFm6ieRYAOw==",
      CC7: "R0lGODdhDAAMAIAAAAAAAP///yH5BAAAAAAALAAAAAAMAAwAQAIXjG8AyKG5XHzt0DtjlRt2DmJeqFXURhUAOw==",
      CC8: "R0lGODdhDAAMAIAAAAAAAP///yH5BAAAAAAALAAAAAAMAAwAQAIUBBKGmtfrmIwU2ofn1bn27XFi6BUAOw==",
      STC: "R0lGODdhDAAMAIAAAAAAAP///yH5BAAAAAAALAAAAAAMAAwAQAIZjANwe2nOIFyTPYUwxfXa/TWcJnrRaElYAQA7",
      SPC: "R0lGODdhDAAMAIAAAAAAAP///yH5BAAAAAAALAAAAAAMAAwAQAIZjANwl9aLVITwrWeZzJRXeW2g5ozl+aFLAQA7",
    };

    return this.data.map((e: string) => codeToBase64[e]);
  }
}
