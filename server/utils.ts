import axios from 'axios'
import * as cheerio from 'cheerio'
import cache from './data'

const RESULTS_URL = 'https://hgw666.tv/app/member/Lottery/list.php?t='

export const transformAudienceNumber = text => {
    return text.indexOf('万') > 0 ? text.replace(/万/, '') * 10000 : text;
}

export const isHttps = url => {
    return typeof url === "string" && url.indexOf('https') > -1
}

export const objectSort = (obj: { [key: string]: string }) => {
    return obj
}

export const objKeySort = (arys) => {
    var newkey = Object.keys(arys).sort();
    var newObj = {};
    for (var i = 0; i < newkey.length; i++) {
        newObj[newkey[i]] = arys[newkey[i]];
    }
    return newObj;
}

export const getUrl = (t: number = 1) => {
    return `${RESULTS_URL}${t}`
}

export const genToSL = (arr: number[]): string[] => {
    return arr.map ? arr.map(i => {
        return i <= 22 ? '小' : '大'
    }) : []
    // return arr.map ? arr.map(i => {
    //     return i % 2 === 0 ? '双' : '单'
    // }) : []
}

export const genToSLS = (arr: number[]): string[] => {
    return arr.map ? arr.map(i => {
        return i % 2 === 0 ? '双' : '单'
    }) : []
}


export const statistics = (arr: number[]) => {
    const initArr = genToSL(arr)
    initArr.push('占位')
    let pre_i = 0, pre_v = initArr[0], next, result = {}
    initArr.forEach((v, i) => {
        if (v !== pre_v) {
            if (result[`${i - pre_i}连${pre_v}`]) {
                result[`${i - pre_i}连${pre_v}`]++
            } else {
                result[`${i - pre_i}连${pre_v}`] = 1
            }
            pre_i = i
            pre_v = v
        }
    })
    return result
}

export const getData = async (t: number = 1) => {
    if (cache[t] && cache[t].length) {
        return cache[t]
    }
    const ret = await axios.get(getUrl(t))
    const $ = cheerio.load(ret.data)
    const newArr = []
    $('.line_list').each((index: number, ele: CheerioElement) => {
        const text = $($(ele).children()[3]).html()
        if (text) {
            newArr.push(text.slice(0, 2))
        }
    })
    newArr.reverse()
    return newArr
}
//赢10，输10，10，15，15。。
export const statisticsWithMoney132 = (arr: number[], baseChoose: string = '大', basePayoff: number = 10, maxSeries: number = 4, percent = 1.95) => {
    const initArr = genToSL(arr)
    let currMoney = 0, pre_v = '大', pre_i = 0;
    initArr.forEach((v, i) => {
        if (v === baseChoose && pre_v === v) {
            currMoney -= basePayoff * 1
            currMoney += basePayoff * 1 * 1.95
        } else if (v === baseChoose && pre_v !== v) {
            if (i - pre_i === 1) {
                currMoney -= basePayoff * 1
                currMoney += basePayoff * 1 * 1.95
            } else if (i - pre_i === 2) {
                currMoney -= basePayoff * 1 * 1.5
                currMoney += basePayoff * 1 * 1.5 * 1.95
            } else if (i - pre_i === 3) {
                currMoney -= basePayoff * 1 * 1.5
                currMoney += basePayoff * 1 * 1.5 * 1.95
            }
            pre_v = v
            pre_i = i
        } else if (v !== baseChoose && pre_v === v) {
            if (i - pre_i === 1) {
                currMoney -= basePayoff * 1
            } else if (i - pre_i === 2) {
                currMoney -= basePayoff * 1 * 1.5
            } else if (i - pre_i === 3) {
                currMoney -= basePayoff * 1 * 1.5
            }
        } else if (v !== baseChoose && pre_v !== v) {
            currMoney -= basePayoff * 1
            pre_v = v
            pre_i = i
        }
    })
    return currMoney
}

//赢 10，10，15，15xx，输10，10，15，15xx
export const statisticsWithMoney = (arr: number[], baseChoose: string = '大', basePayoff: number = 10, maxSeries: number = 4, percent = 1.95) => {
    const initArr = genToSL(arr)
    let currMoney = 0, pre_v = '大', pre_i = 0;
    initArr.forEach((v, i) => {
        if (v === baseChoose && pre_v === v) {
            if (i - pre_i === 1) {
                currMoney -= basePayoff * 1
                currMoney += basePayoff * 1 * 1.95
            } else if (i - pre_i === 2) {
                currMoney -= basePayoff * 1 
                currMoney += basePayoff * 1  * 1.95
            } else if (i - pre_i === 3) {
                currMoney -= basePayoff * 1 
                currMoney += basePayoff * 1  * 1.95
            } else if (i - pre_i === 0) {
                currMoney -= basePayoff * 1
                currMoney += basePayoff * 1 * 1.95
            }
        } else if (v === baseChoose && pre_v !== v) {
            if (i - pre_i === 1) {
                currMoney -= basePayoff * 1
                currMoney += basePayoff * 1 * 1.95
            } else if (i - pre_i === 2) {
                currMoney -= basePayoff * 1 * 1.5
                currMoney += basePayoff * 1 * 1.5 * 1.95
            } else if (i - pre_i === 3) {
                currMoney -= basePayoff * 1 * 1.5
                currMoney += basePayoff * 1 * 1.5 * 1.95
            }
            pre_v = v
            pre_i = i
        } else if (v !== baseChoose && pre_v === v) {
            if (i - pre_i === 1) {
                currMoney -= basePayoff * 1
            } else if (i - pre_i === 2) {
                currMoney -= basePayoff * 1 * 1.5
            } else if (i - pre_i === 3) {
                currMoney -= basePayoff * 1 * 1.5
            }
        } else if (v !== baseChoose && pre_v !== v) {
            if (i - pre_i === 1) {
                currMoney -= basePayoff * 1
            } else if (i - pre_i === 2) {
                currMoney -= basePayoff * 1 
            } else if (i - pre_i === 3) {
                currMoney -= basePayoff * 1
            } else if (i - pre_i === 0) {
                currMoney -= basePayoff * 1
            }
            pre_v = v
            pre_i = i
        }
    })
    return currMoney
}

//连三升级版
export const statisticsWithMoney_02 = (arr: number[], baseChoose: string = '大', basePayoff: number = 10, maxSeries: number = 3, percent = 1.95) => {
    const initArr = genToSL(arr)
    let currMoney = 0, pre_v = '大', pre_i = 0;
    initArr.forEach((v, i) => {
        if (v === baseChoose && pre_v === v) {
            if (i - pre_i >= 3) {
                currMoney -= basePayoff * 2
                currMoney += basePayoff * 1.95 * 2
            } else {
                currMoney -= basePayoff
                currMoney += basePayoff * 1.95
            }
        } else if (v === baseChoose && pre_v !== v) {
            if (i - pre_i === 1) {
                currMoney -= basePayoff * 1
                currMoney += basePayoff * 1 * 1.95
            } else if (i - pre_i === 2) {
                currMoney -= basePayoff * 2
                currMoney += basePayoff * 2 * 1.95
            } else if (i - pre_i >= 3) {
                currMoney -= basePayoff * 4
            }
            pre_v = v
            pre_i = i
        } else if (v !== baseChoose && pre_v === v) {
            if (i - pre_i === 1) {
                currMoney -= basePayoff * 1
            } else if (i - pre_i === 2) {
                currMoney -= basePayoff * 2
            } else if (i - pre_i >= 3) {
                currMoney -= basePayoff * 4
                currMoney += basePayoff * 4 * 1.95
            }
        } else if (v !== baseChoose && pre_v !== v) {
            if (i - pre_i >= 3) {
                currMoney -= basePayoff * 2
            } else {
                currMoney -= basePayoff
            }
            pre_v = v
            pre_i = i
        }
    })
    return currMoney
}

//无脑跟 todo
export const statisticsWithMoney01 = (arr: number[], basePayoff: number = 10, baseChoose: string = '小', maxSeries: number = 3, percent = 1.95) => {
    const initArr = genToSL(arr)
    let currMoney = 0, pre_v = initArr[0], pre_i = 0, transport = 0;
    initArr.forEach((v, i) => {
        if (v === baseChoose && pre_v === v) {
            transport = (2 * transport + basePayoff) * 1.1
            currMoney -= basePayoff
            currMoney += basePayoff * 1.95
            transport = 0
        } else if (v === baseChoose && pre_v !== v) {
            transport = (2 * transport + basePayoff) * 1.1
            currMoney -= transport
            currMoney += transport * 1.95
            transport = 0
            pre_v = v
            pre_i = i
        } else if (v !== baseChoose && pre_v === v) {
            const newTransport = (transport + basePayoff) * 1.1
            currMoney -= newTransport
            transport += newTransport
        } else if (v !== baseChoose && pre_v !== v) {
            const newTransport = (transport + basePayoff) * 1.1
            currMoney -= transport
            transport += newTransport
            pre_v = v
            pre_i = i
        }
    })
    return currMoney
}

//连三升级版
export const statisticsWithMoney22 = (arr: number[], basePayoff: number = 10, baseChoose: string = '双', maxSeries: number = 3, percent = 1.95) => {
    const initArr = genToSL(arr)
    let currMoney = 0, pre_v = initArr[0], pre_i = 0;
    initArr.forEach((v, i) => {
        if (v === baseChoose && pre_v === v) {
            if (i - pre_i >= 3) {
                currMoney -= basePayoff * 4
                currMoney += basePayoff * 4 * 1.95
            } else {
                currMoney -= basePayoff
                currMoney += basePayoff * 1.95
            }
        } else if (v === baseChoose && pre_v !== v) {
            if (i - pre_i === 1) {
                currMoney -= basePayoff * 1
                currMoney += basePayoff * 1 * 1.95
            } else if (i - pre_i === 2) {
                currMoney -= basePayoff * 2
                currMoney += basePayoff * 2 * 1.95
            } else if (i - pre_i >= 3) {
                currMoney -= basePayoff * 4
            }
            pre_v = v
            pre_i = i
        } else if (v !== baseChoose && pre_v === v) {
            if (i - pre_i === 1) {
                currMoney -= basePayoff * 1
            } else if (i - pre_i === 2) {
                currMoney -= basePayoff * 2
            } else if (i - pre_i >= 3) {
                currMoney -= basePayoff * 4
                currMoney += basePayoff * 4 * 1.95
            }
        } else if (v !== baseChoose && pre_v !== v) {
            if (i - pre_i >= 3) {
                currMoney -= basePayoff * 4
            } else {
                currMoney -= basePayoff
            }
            pre_v = v
            pre_i = i
        }
    })
    return currMoney
}

//连输三把 跟进连续的
export const statisticsWithMoney_1 = (arr: number[], basePayoff: number = 10, baseChoose: string = '大', maxSeries: number = 3, percent = 1.95) => {
    const initArr = genToSL(arr)
    let currMoney = 0, pre_v = initArr[0], pre_i = 0;
    initArr.forEach((v, i) => {
        if (v === baseChoose && pre_v === v) {
            currMoney -= basePayoff
            currMoney += basePayoff * 1.95
        } else if (v === baseChoose && pre_v !== v) {
            if (i - pre_i === 1) {
                currMoney -= basePayoff * 2
                currMoney += basePayoff * 2 * 1.95
            } else if (i - pre_i === 2) {
                currMoney -= basePayoff * 4
                currMoney += basePayoff * 4 * 1.95
            } else if (i - pre_i >= 3) {
                currMoney -= basePayoff * 4
            }
            pre_v = v
            pre_i = i
        } else if (v !== baseChoose && pre_v === v) {
            if (i - pre_i === 0) {
                currMoney -= basePayoff * 1
            } else if (i - pre_i === 1) {
                currMoney -= basePayoff * 2
            } else if (i - pre_i === 2) {
                currMoney -= basePayoff * 4
            } else if (i - pre_i >= 3) {
                currMoney -= basePayoff * 4
                currMoney += basePayoff * 4 * 1.95
            }
        } else if (v !== baseChoose && pre_v !== v) {
            currMoney -= basePayoff
            pre_v = v
            pre_i = i
        }
    })
    return currMoney
}


//错误翻倍法 ，肯定不行
export const statisticsWithMoney11 = (arr: number[], basePayoff: number = 10, baseChoose: string = '大', maxSeries: number = 3, percent = 1.95) => {
    const initArr = genToSL(arr)
    let currMoney = 0, pre_v = initArr[0], pre_i = 0;
    initArr.forEach((v, i) => {
        if (v === baseChoose && pre_v === v) {
            currMoney -= basePayoff
            currMoney += basePayoff * 1.95
        } else if (v === baseChoose && pre_v !== v) {
            if (i - pre_i === 1) {
                currMoney -= basePayoff * 2
                currMoney += basePayoff * 2 * 1.95
            } else if (i - pre_i >= 2) {
                currMoney -= basePayoff * 2 * (i - pre_i)
                currMoney += basePayoff * 2 * (i - pre_i) * 1.95
            }
            pre_v = v
            pre_i = i
        } else if (v !== baseChoose && pre_v === v) {
            if (i - pre_i === 0) {
                currMoney -= basePayoff * 1
            } else if (i - pre_i >= 1) {
                currMoney -= basePayoff * 2 * (i - pre_i)
            }
        } else if (v !== baseChoose && pre_v !== v) {
            currMoney -= basePayoff
            pre_v = v
            pre_i = i
        }
    })
    return currMoney
}