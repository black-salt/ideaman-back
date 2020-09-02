const https = require('https')
const cheerio = require('cheerio')
const fs = require('fs')

/**
 * @description: 爬虫Service层类
 */
class CrawlerService {

  /**
   * @description: 爬虫
   * @param  
   * @return: Promise
   */
  static startCrawler<T>(): Promise<T> {
    const ARXIV_HOST_NAME = 'arxiv.org'
    const ARXIV_BASE_URL = 'https://arxiv.org'
    // const ARXIV_HOST_NAME = 'blog.lskreno.top'
    // const ARXIV_BASE_URL = 'https://arxiv.org'

    // const ARXIV_HOST_NAME = 'www.baidu.com'
    // const ARXIV_BASE_URL = 'https://baidu.com'

    // const ARXIV_API_URL = 'https://export.arxiv.org'

    return new Promise((resolve: Function, reject: Function) => {
      console.log(`***开始爬取 ${ARXIV_HOST_NAME} ***`)
      // get news from arXiv
      let count_per_page = 200

      var option = {
        hostname: ARXIV_HOST_NAME,
        path: '/list/cs/pastweek?show=' + count_per_page,
        headers: {
          'Accept': '*/*',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive',
          'Cache-Control': 'no-cache',
          'User-Agent': 'PostmanRuntime/7.26.1',
          // 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.61 Safari/537.36',
          'Cookie': 'browser=172.105.232.40.1597760576441394',
          'Host': `${ARXIV_HOST_NAME}`,
          'Referer': ARXIV_BASE_URL
        }
      };

      https.get(option, function (response: any) {
        var chunks: any[] = [];
        var size: number = 0;
        // 监听数据流入
        response.on('data', function (chunk: any) {
          chunks.push(chunk);
          size += chunk.length;
        });
        // 监听数据流结束
        response.on('end', function () {
          let data = Buffer.concat(chunks, size);
          let html = data.toString();

          let $ = cheerio.load(html);

          // // get total entries
          // let countPattern = /total of [0-9]* entries/g
          // let count = parseInt(html.match(countPattern)[0])

          // let idsPattern = /<a href="\/abs\/[0-9]{4}\.[0-9]{5}" title="Abstract">arXiv:[0-9]{4}\.[0-9]{5}<\/a>/g
          // let ids = html.match(idsPattern)

          // let n_ids = new Set()

          // ids.forEach(item => {
          //   n_ids.add(item.match(/\(<a href="\/abs\/[0-9]{4}\.[0-9]{5}" title="Abstract">|arXiv:|<\/a>\)/g)[0])
          // })

          // let skip = count_per_page

          // while (skip < count) {
          //   console.log(`skip：${skip}`)

          //   var subOption = {
          //     hostname: ARXIV_HOST_NAME,
          //     path: `/list/cs/pastweek?show=${count_per_page}&skip=${skip}`,
          //     headers: {
          //       'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.108 Safari/537.36',
          //       'Referer': ARXIV_BASE_URL
          //     }
          //   };
          //   https.get(subOption, function (response: any) {
          //     let idsPattern = /<a href="\/abs\/[0-9]{4}\.[0-9]{5}" title="Abstract">arXiv:[0-9]{4}\.[0-9]{5}<\/a>/g
          //     let ids = html.match(idsPattern)

          //     let n_ids = new Set()

          //     ids.forEach(item => {
          //       n_ids.add(item.match(/\(<a href="\/abs\/[0-9]{4}\.[0-9]{5}" title="Abstract">|arXiv:|<\/a>\)/g)[0])
          //     })

          //     skip += count_per_page
          //   })
          // }

          // console.log(n_ids.size)

          // console.log($('#main-title').text())
          console.log($('a').attr('href'))

          fs.writeFile('./cache/crawler/jobs.txt', JSON.stringify(html), {
            'flag': 'a'
          }, function (err: any) {
            if (err) {
              reject(err)
            }
            console.log('写入成功');
            resolve(html)
          });
        });
      });
    });
  }
}

export default CrawlerService




// $('.sojob-list').find('.job-info').each(i => {
//     let map = {}
//         //  个人基本信息
//     map.name = $('.job-info').eq(i).find('h3').attr('title');

//     let baseOthersInfo = $('.job-info').eq(i).find('.condition').attr('title');
//     baseOthersInfo = baseOthersInfo.split("_");

//     map.reward = baseOthersInfo[0];
//     map.area = baseOthersInfo[1];
//     map.experience = baseOthersInfo[2];

//     //  公司信息
//     let companyTagDom = $('.company-info').eq(i).find('.temptation').find('span');
//     let companyTag = [];
//     companyTagDom.each(i => {
//         companyTag.push(companyTagDom.eq(i).text());
//     });
//     let companyInfo = {
//         name: $('.company-info').eq(i).find('.company-name a').attr('title'),
//         href: $('.company-info').eq(i).find('.company-name a').attr('href'),
//         type: $('.company-info').eq(i).find('.industry-link a').text(),
//         tag: companyTag.join(',')
//     }
//     map.company = companyInfo;
//     result.push(map);
//     map = {};
// });
// console.log(result);