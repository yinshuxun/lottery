import * as Koa from 'koa'
import * as Router from 'koa-router'
import * as Logger from 'koa-logger'
import * as cheerio from 'cheerio'
import axios from 'axios'
import { objectSort, objKeySort } from './utils';

const app = new Koa()
const router = new Router()
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const RESULTS_URL = 'https://hgw666.tv/app/member/Lottery/list.php?t='

const getUrl = (t: number = 1) => {
    return `${RESULTS_URL}${t}`
}
const genToSL = (arr: number[]): string[] => {
    return arr.map(i => {
        return i <= 22 ? '小' : '大'
    })
}

const statistics = (arr: number[]) => {
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

const getData = async (t: number = 1) => {
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
    return statistics(newArr)
}

router.get('/page/:id', async ctx => {
    const ret = await axios.get(getUrl(ctx.params.id))
    ctx.body = ret.data
})

router.get('/total/:id/:end', async ctx => {
    const start = ctx.params.id
    const end = ctx.params.end
    let i = start, result = {};
    while (i <= end) {
        const curr = await getData(i++)
        Object.keys(curr).forEach(key => {
            if (result[key]) {
                result[key] += curr[key]
            } else {
                result[key] = curr[key]
            }
        })
    }
    ctx.body = {
        [`${end - start + 1}天的数据`]: objKeySort(result)
    }
})

router.get('/:id/:end', async ctx => {
    const start = ctx.params.id
    const end = ctx.params.end
    let i = start, result = {};
    while (i <= end) {
        result[`第${i}天的数据`] = objKeySort(await getData(i++))
    }
    ctx.body = result
})



router.get('/:id', async ctx => {
    ctx.body = objKeySort(await getData(ctx.params.id))
})


app.use(Logger())
    .use(router.routes())
    .use(router.allowedMethods())

app.listen(8088)





