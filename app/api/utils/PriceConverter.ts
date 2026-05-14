const MIN_BASE_RATE = 2;
const MIN_GB_RATE = 0.575;
const USD_TO_MNT = 6000;
const BASE_7_1 = 7000;

function Round(num) {
    const base = Math.floor(num);
    if (num - base > 0.7) {
        return base + 1;
    } else {
        return base;
    }
}

const GB_MAP = {};

function SingleConvert(
    initPrice: number,
    baseRate: number,
    gb: number,
    data: number
) {
    let price = (initPrice / 10000) * USD_TO_MNT;
    let multiplier = baseRate;
    multiplier *= Math.max(MIN_GB_RATE, GetGBMultiplier(gb, data));
    // multiplier = 1.4;
    price *= multiplier;
    price /= 1000;
    price = Round(price) * 1000;
    return price ;
}
function GetGBDataMultiplier(gb: number) {
    if (gb >= 50) {
        return 0.5;
    }
    if (gb >= 30) {
        return 0.55;
    }
    if (gb >= 20) {
        return 0.6;
    }
    if (gb >= 10) {
        return 0.7;
    }
    if (gb >= 5) {
        return 0.8;
    }
    if (gb >= 1) {
        return 0.9;
    }

    return 1;
}
function GetGBMultiplier(time: number, data: number): number {
    const d = GetGBDataMultiplier(data);

    if (time >= 180) return 0.7 * d;

    if (time >= 60) return 0.8 * d;

    if (time >= 30) return 0.85 * d;

    if (time >= 15) return 0.85 * d;
    if (time >= 7) return 1 * d;
    if (time >= 1) {
        return 0.6 * d;
    }
    console.log(time);

    return 1 * d;
}
function filterInefficientPackages(packages) {
    // 按流量分组
    const groupedByData = new Map();

    for (const pkg of packages) {
        if (!groupedByData.has(pkg.data)) {
            groupedByData.set(pkg.data, []);
        }
        groupedByData.get(pkg.data)!.push(pkg);
    }
    const result = [];

    for (const [data, pkgs] of groupedByData.entries()) {
        // 按时间升序（短时间优先）
        pkgs.sort((a, b) => b.time - a.time);

        // 记录到当前为止的最优价格
        let minPriceSoFar = Infinity;

        for (const pkg of pkgs) {
            if (pkg.price < minPriceSoFar) {
                result.push(pkg);
                minPriceSoFar = pkg.price;
            }
        }
    }

    return result;
}
export default function PriceConverter(
    initData: { slug: string; price: number; data: number; time: number }[]
) {
    const data = filterInefficientPackages(initData);
    let initPrice =
        data.find((item) => {
            const res = item.slug.split("_");
            return res[1] + res[2] == "17";
        })?.price || data.sort((a, b) => a.time - b.time)[0].price;
    initPrice = (initPrice / 10000) * USD_TO_MNT;
    // initPrice = initPrice / 7;
    const baseRate = Math.max(MIN_BASE_RATE, BASE_7_1 / initPrice);
    data.map((i) => {
        i.price = SingleConvert(i.price, baseRate, i.time, i.data);
    });

    return data;
}
