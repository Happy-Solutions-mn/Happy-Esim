const MIN_BASE_RATE = 2;
const MIN_GB_RATE = 0.6;
const USD_TO_MNT = 5000;

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
    price *= multiplier;
    price /= 1000;
    price = Math.floor(price) * 1000;
    return price + 1000 + multiplier;
}
function GetGBDataMultiplier(gb: number) {
    if (gb >= 50) {
        return 0.6;
    }
    if (gb >= 30) {
        return 0.7;
    }
    if (gb >= 20) {
        return 0.8;
    }
    if (gb >= 10) {
        return 0.9;
    }
    if (gb >= 5) {
        return 0.95;
    }
    return 1;
}
function GetGBMultiplier(time: number, data: number): number {
    const d = GetGBDataMultiplier(data);

    if (time >= 180) return 0.5 * d;

    if (time >= 60) return 0.6 * d;

    if (time >= 30) return 0.7 * d;

    if (time >= 15) return 0.8 * d;

    return 1 * d;
}

export default function PriceConverter(
    initData: { slug: string; price: number; data: number; gbData: number }[]
) {
    let initPrice =
        initData.find((item) => {
            const res = item.slug.split("_");
            return res[1] + res[2] == "17";
        })?.price || initData.sort((a, b) => a.gbData - b.gbData)[0].price;
    initPrice = (initPrice / 10000) * USD_TO_MNT;
    const baseRate = Math.max(MIN_BASE_RATE, 14000 / initPrice);
    initData.map((i) => {
        i.price = SingleConvert(i.price, baseRate, i.gbData, i.data);
    });

    return initData;
}
