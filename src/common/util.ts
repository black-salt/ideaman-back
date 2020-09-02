/**
 * deep copy
 * @param {Object} p 
 * @param {Object} c 
 */
function deepCopy(p: object, c: object = {}): object {
  for (let i in p) {
    if (typeof p[i] === 'object') {
      c[i] = (p[i].constructor === Array) ? [] : {};
      deepCopy(p[i], c[i]);
    } else if (typeof p[i] === 'function') {
      c[i] = p[i].prototype.constructor;
    } else c[i] = p[i];
  }
  return c;
}

/**
 * stringFormat('xx$1x $3 xxx$2', 11,22,33)
 * @param {String} str 
 * @param  {...any} args 
 */
function stringFormat(str: string, ...args: any[]): string {
  // args = args.flat();// Array can be Array, because flat function
  return str.replace(/\$(\d+)/g, function (match, num) {
    let m = args[parseInt(num, 10) - 1];
    return m ? ('' + m) : match;
  });
}

/**
 * 格式化日期
 * @param str 日期格式字符串
 */
function formatTime(str: string): string {
  const d = new Date(str); //提供的时间字符串，str是个参数
  const n = new Date(); //当前时间
  const r = n.getTime() - d.getTime(); //获取毫秒时间戳的差
  const dateStr = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`; //获取日期，年月日
  const timeStr = ('0' + d.getHours()).slice(-2) + ':'
    + ('0' + d.getMinutes()).slice(-2) + ':' + ('0' + d.getSeconds()).slice(-2);//获取时间，时分秒
  const just = 1000 * 10; //十秒
  const min = 1000 * 60; //六十秒
  const hour = 1000 * 60 * 60; //一小时
  const day = hour * 24; //一天
  const month = day * 30; //一个月，定死为30天

  let i = timeStr; //i初始化为时分秒的字符串

  // r是时间戳的差值
  if (r < day && n.getDate() - d.getDate() == 0) { //毫秒差小于一天且日期相同，因为可能毫秒差小于一天但两个时间点分别在两个日期
    if (r < just) { // 小于十秒的为 '刚刚'
      i = '刚刚';
    } else if (r < min) {// 大于十小于六十秒的为 'XX秒前'
      i = Math.floor(r / 1000) + '秒前';
    } else if (r < hour) {// 大于一分钟小于一个小时的为 'XX分钟前'
      i = Math.floor(r / min) + '分钟前';
    } else if (r < hour * 24) {// 大于一个小时小于24小时的为 'XX分钟前'
      i = Math.floor(r / hour) + '小时前';
    }
  } else if (r < day * 2 && new Date(n.getTime() - day).getDate() - d.getDate() == 0) {
    i = `昨天 ${timeStr}`;
  } else if (r < day * 3 && new Date(n.getTime() - day * 2).getDate() - d.getDate() == 0) {
    i = `前天 ${timeStr}`;
  } else if (r < day * 8) {
    i = Math.floor(r / day) + '天前';
  } else if (r < day * 30) {
    i = dateStr;
  } else if (r < month * 12) {
    i = Math.floor(r / month) + '个月前';
  } else if (r < day * 365 * 5) {
    i = Math.floor(r / (day * 365)) + '年前';
  } else {
    i = `${dateStr} ${timeStr}`;
  }
  return i;
}

/**
 * html encode
 * html转码
 * @param  {String} str [description]
 * @return {String}     [description]
 */
function htmlEncode(str: string): string {
  if (!str) return '';
  return str.replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/ /g, '&nbsp;')
    .replace(/'/g, '&#39;')
    .replace(/"/g, '&quot;');
}

/**
 * html decode
 * html解码
 * @param  {String} str [description]
 * @return {String}     [description]
 */
function htmlDecode(str: string = ''): string {
  if (!str) return '';
  return str.replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#39;/g, '\'')
    .replace(/&quot;/g, '"');
}

/**
 * Intercept the first n strings
 * @param {String} str 
 * @param {Number} n 
 */
function getContentSummary(str: string, n: number): string {
  let replaceHtmlTags = (str: string) => str.replace(/<\s*\/?\s*\w+[\S\s]*?>/g, ''),//过滤掉html标签
    pattern = /^[a-zA-Z0-9_\u0392-\u03c9\u0410-\u04F9]+/,
    ret = '', count = 0, m;
  str = replaceHtmlTags(htmlDecode(str));

  while (str.length) {
    if ((m = str.match(pattern))) {//拉丁文字
      count++;
      ret += m[0];
      str = str.substr(m[0].length);
    } else {
      if (str.charCodeAt(0) >= 0x4E00) {//中日韩文字
        count++;
      }
      ret += str.charAt(0);
      str = str.substr(1);
    }
    if (count > n) {
      ret += '...';
      break;
    }
  }
  return ret;
}

/**
 * Count the number of string
 * 计算字符串文字数量(拉丁中日韩字符)
 * @param  {String} str
 * @return {Number} string number
 */
function wordCount(str: string): number {
  const pattern = /[a-zA-Z0-9_\u0392-\u03c9\u0410-\u04F9]+|[\u4E00-\u9FFF\u3400-\u4dbf\uf900-\ufaff\u3040-\u309f\uac00-\ud7af]+|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g;
  const m = str.match(pattern);
  let count = 0;
  if (m === null) return count;
  for (let i = 0; i < m.length; i++) {
    if (m[i].charCodeAt(0) >= 0x4E00) {
      count += m[i].length;
    } else {
      count += 1;
    }
  }
  return count;
}

/**
 * 计算包含双字节字符和emoji的准确长度
 * @param str 字符串
 */
function charCount(str: string): number {
  const reg = /[\u4E00-\u9FFF\u3400-\u4dbf\uf900-\ufaff\u3040-\u309f\uac00-\ud7af]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g;
  return str.replace(reg, 'a').length;
}

/**
 * 压缩图像
 * @param {Image} img 
 * @param {Number} size 
 */
function compressPicture(img: HTMLImageElement, size: number = 400): HTMLCanvasElement {
  const canvas = document.createElement('canvas'),
    ctx = canvas.getContext('2d'),
    w = img.width,
    h = img.height;
  if (Math.max(w, h) > size) {
    if (w > h) {
      canvas.width = size;
      canvas.height = (h / w) * size;
    } else {
      canvas.height = size;
      canvas.width = (w / h) * size;
    }
  } else {
    canvas.width = w;
    canvas.height = h;
  }
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas;
}

function compressPictureToBase64(img: HTMLImageElement, size = 400): string {
  return compressPicture(img, size).toDataURL('image/jpeg');
}

function compressPictureToBlob(img: HTMLImageElement, size = 400): Promise<Blob> {
  return new Promise(resolve => {
    compressPicture(img, size).toBlob(resolve, 'image/jpeg');
  });
}

/**
 * base64 装换为 Blob 对象
 * @param {String} base64 
 */
function dataURLtoBlob(base64: string): Blob {
  let arr = base64.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

type ShareArg = { url: string; title: string; pic?: string; desc?: string };
/**
 * sns分享链接
 * @param type sns type
 * @param opts sns option
 */
function shareUrl(type: string, opts: ShareArg): string {
  const configs = {
    weibo: ({ url, title, pic }: ShareArg) => `http://service.weibo.com/share/share.php?url=${encodeURI(url)}&title=${title}&pic=${encodeURIComponent(pic || '')}`,
    qq: ({ url, title, desc }: ShareArg) => `http://connect.qq.com/widget/shareqq/index.html?url=${encodeURI(url)}&title=${title}&source=${desc || ''}`,
    douban: ({ url, title, pic, desc }: ShareArg) => `https://www.douban.com/share/service?href=${encodeURI(url)}&name=${title}&image=${encodeURIComponent(pic || '')}&text=${desc || ''}`,
    qzone: ({ url, title, pic, desc }: ShareArg) => `http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=${encodeURI(url)}&title=${title}&pics=${encodeURIComponent(pic || '')}&summary=${desc || ''}&desc=${desc || ''}&site=${encodeURI(url)}`,
    facebook: ({ url }: ShareArg) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURI(url)}`,
    twitter: ({ url, title }: ShareArg) => `https://twitter.com/intent/tweet?text=${title}&url=${encodeURI(url)}&via=${encodeURI(url)}`,
  }
  return configs[type](opts);
}

/**
 * 获取不同时区的时间
 * @param type sns type
 * @param opts sns option
 */
function getTimeByTimeZone(timeZone: number): Date {
  let d = new Date();
  let localTime = d.getTime();
  let localOffset = d.getTimezoneOffset() * 60000; //获得当地时间偏移的毫秒数,这里可能是负数
  let utc = localTime + localOffset; //utc即GMT时间
  let offset = timeZone; //时区，北京市+8  美国华盛顿为 -5
  let localSecondTime = utc + (3600000 * offset);  //本地对应的毫秒数
  var date = new Date(localSecondTime);
  // console.log("根据本地时间得知" + timeZone + "时区的时间是 " + date.toLocaleString());
  // console.log("系统默认展示时间方式是：" + date)
  return date;
}


export {
  deepCopy,
  stringFormat,
  formatTime,
  htmlEncode,
  htmlDecode,
  getContentSummary,
  charCount,
  wordCount,
  compressPicture,
  compressPictureToBase64,
  compressPictureToBlob,
  dataURLtoBlob,
  shareUrl,
  getTimeByTimeZone
};