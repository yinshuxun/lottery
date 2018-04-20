import * as Koa from 'koa'
import * as Router from 'koa-router'
import * as Logger from 'koa-logger'
import * as cheerio from 'cheerio'
import axios from 'axios'
import { objectSort, objKeySort, getUrl, getData, statisticsWithMoney, statistics, genToSL } from './utils';
import cache from './data'

const app = new Koa()
const router = new Router()
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const testData = [[0], [0, 0], [0, 0, 0], [0, 0, 0, 0], [23], [23, 23], [23, 23, 23], [23, 23, 23, 23], [0, 23, 0, 23], [0, 23, 23, 0], [0, 23, 23, 23, 0], [0, 23, 23, 23, 23, 0], [0, 23, 23, 23, 23, 23, 0, 23]]
const correctResult = [9.5, 19, 28.5, 38, -10, -30, -70, -32, 8.5, 17.5, -100.5, -62.5, -34.5]

router.get('/cache/:id/:end', async ctx => {
    const ret = await axios.get(getUrl(ctx.params.id))
    const start = ctx.params.id
    const end = ctx.params.end
    let i = start, result = {};
    while (i <= end) {
        if (cache[i]) {
            result[i] = cache[i]
        } else {
            result[i] = await getData(i)
        }
        console.log(`请求第${i}条数据`)
        i++
    }
    ctx.body = result
})

router.get('/page/:id', async ctx => {
    const ret = await axios.get(getUrl(ctx.params.id))
    ctx.body = ret.data
})

router.get('/lalala', async ctx => {
    const start = 1
    let end = 100
    let i = start, result = [];
    while (end >= i) {
        const curr = await getData(end--)
        result = result.concat(genToSL(curr))
    }
    const resultString = result.join('')
    const space = resultString.slice(resultString.length - 5);
    const littleTimes = resultString.match(new RegExp(space + '小', 'ig')).length
    const largeTimes = resultString.match(new RegExp(space + '大', 'ig')).length
    ctx.body = `
    <div style="flex:1;margin-bottom:20px;font-size:30px;color:grey;display:flex;text-align:center;">
    预测时间:${new Date().getHours()}：${new Date().getMinutes()}</div>
    <div style="flex:1;font-size:30px;display:flex;text-align:center;">大：出现${largeTimes}次，占比 ${Math.round(largeTimes / (largeTimes + littleTimes) * 100)}%;
    <br>小：出现${littleTimes}次，占比 ${Math.round(littleTimes / (largeTimes + littleTimes) * 100)}%<div>`
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

router.get('/string/:id/:end', async ctx => {
    const start = ctx.params.id
    let end = ctx.params.end
    let i = start, result = [];
    while (end >= i) {
        const curr = await getData(end--)
        result = result.concat(genToSL(curr))
    }
    ctx.body = result.join('')
})

router.get('/test', async (ctx) => {
    ctx.body = statisticsWithMoney([23, 23, 23, 0])
})

router.get('/money/:id/:end', async (ctx) => {
    const start = ctx.params.id
    let end = ctx.params.end
    let i = start, result = {}, totalD = 0, totalX = 0;
    while (end >= i) {
        const currD = statisticsWithMoney(await getData(end), '大')
        const currX = statisticsWithMoney(await getData(end), '小')
        totalD += currD
        totalX += currX
        result[`第${end}天的数据`] = `买大：${currD}, 买小：${currX}`
        end--
    }
    result['合计'] = `买大：${totalD}, 买小：${totalX}`
    ctx.body = result
})

router.get('/init/:id', async (ctx) => {
    ctx.body = await getData(ctx.params.id)
})

router.get('/money/:id', async (ctx) => {
    ctx.body = `盈亏：${statisticsWithMoney(await getData(ctx.params.id))}`
})

router.get('/moneytest', async (ctx) => {
    ctx.body = {
        from: testData.map(v => statisticsWithMoney(v)),
        exepct: correctResult
    }
})

router.get('/:id/:end', async ctx => {
    const start = ctx.params.id
    const end = ctx.params.end
    let i = start, result = {};
    while (i <= end) {
        result[`第${i}天的数据`] = objKeySort(statistics(await getData(i++)))
    }
    ctx.body = result
})

router.get('/:id', async ctx => {
    ctx.body = objKeySort(statistics(await getData(ctx.params.id)))
})

app.use(Logger())
    .use(router.routes())
    .use(router.allowedMethods())

app.listen(8088)





