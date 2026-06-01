// 单文件门户构建脚本 v6
// base64 存储 + Blob URL + Font Awesome 父页面内联一次（iframe 注入共享）
const fs = require('fs');
const https = require('https');
const path = require('path');
const dir = path.join(__dirname);

function httpGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location)
        return httpGet(res.headers.location).then(resolve).catch(reject);
      let data = '';
      res.on('data', d => data += d);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function httpGetBuffer(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location)
        return httpGetBuffer(res.headers.location).then(resolve).catch(reject);
      const chunks = [];
      res.on('data', d => chunks.push(d));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    }).on('error', reject);
  });
}

async function main() {
  // 1. 下载 Font Awesome，内联到父页面（仅此一份！）
  console.log('1/3 下载 Font Awesome（父页面内联一份，iframe 共享）...');
  const faUrl = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css';
  let css = await httpGet(faUrl);

  const fontRE = /url\(([^)]+\.woff2[^)]*)\)/g;
  const fontFiles = [...new Set([...css.matchAll(fontRE)].map(m => {
    let u = m[1].replace(/^["']|["']$/g, '').replace(/\?.*/, '');
    if (!u.startsWith('http')) u = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/' + u.replace(/^\.\.?\//, '');
    return u;
  }))];

  for (const fu of fontFiles) {
    const name = fu.split('/').pop().split('?')[0];
    const buf = await httpGetBuffer(fu);
    const b64 = buf.toString('base64');
    const mime = name.endsWith('.woff2') ? 'font/woff2' : 'font/woff';
    const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    css = css.replace(new RegExp('url\\([^)]*' + escaped + '[^)]*\\)', 'g'), 'url(data:' + mime + ';base64,' + b64 + ')');
    console.log('   字体: ' + name + ' (' + Math.round(b64.length / 1024) + ' KB)');
  }

  const cdnLink = '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">';
  // 父页面内联（给 id 方便 iframe 克隆）
  const inlineFA = '<style id="fa-inline">' + css + '</style>';

  // 2. 构建门户
  console.log('2/3 构建...');
  let html = fs.readFileSync(path.join(dir, '统一门户.html'), 'utf-8');
  html = html.replace(cdnLink, inlineFA);

  const mods = {
    rs: '人事通/人事通.html', xz: '行政通/行政通.html',
    sc: '生产通/生产通.html', zx: '制造资讯/制造资讯.html',
    sj: '数据服务/数据服务.html', gr: '个人中心/个人中心.html'
  };

  // 父页面添加 postMessage 监听，收到 iframe 请求时回传 FA CSS
  const faRelay = '<script>window.addEventListener("message",function(e){if(e.data&&e.data.type==="needFontCSS"){var s=document.getElementById("fa-inline");if(s)e.source.postMessage({type:"fontCSS",css:s.textContent},"*");}});</script>';
  html = html.replace('</head>', faRelay + '\n</head>');

  // 子模块的 CDN link 替换为：向父页面请求 FA CSS（postMessage，跨 iframe 安全）
  const faInject = '<script>(function(){if(window.parent===window)return;window.addEventListener("message",function(e){if(e.data&&e.data.type==="fontCSS"){var s=document.createElement("style");s.textContent=e.data.css;document.head.appendChild(s);}});window.parent.postMessage({type:"needFontCSS"},"*");})();</script>';

  let embedJS = '\nvar __MODULES__={};\n';
  embedJS += 'function __MODULE_URL__(key){var s=atob(__MODULES__[key]),a=new Uint8Array(s.length);for(var i=0;i<s.length;i++)a[i]=s.charCodeAt(i);return URL.createObjectURL(new Blob([a],{type:"text/html"}));}\n';

  for (const [k, m] of Object.entries(mods)) {
    let modHtml = fs.readFileSync(path.join(dir, m), 'utf-8');
    modHtml = modHtml.replace(cdnLink, faInject);
    const b64 = Buffer.from(modHtml, 'utf-8').toString('base64');
    embedJS += '__MODULES__.' + k + '="' + b64 + '";\n';
    console.log('   ' + m + ' (' + Math.round(b64.length / 1024) + ' KB base64)');
  }

  html = html.replace('var modPaths = {', 'var __INLINE__=true;\nvar modPaths={');
  const lastScriptEnd = html.lastIndexOf('</script>');
  html = html.slice(0, lastScriptEnd) + embedJS + '\n' + html.slice(lastScriptEnd);

  html = html.replace(
    /document\.getElementById\('frameMobile'\)\.src\s*=\s*path\s*\+\s*hash;/g,
    "document.getElementById('frameMobile').src=(__INLINE__?__MODULE_URL__(currentModule):path)+hash;");
  html = html.replace(
    /document\.getElementById\('framePC'\)\.src\s*=\s*path\s*\+\s*hash;/g,
    "document.getElementById('framePC').src=(__INLINE__?__MODULE_URL__(currentModule):path)+hash;");
  html = html.replace(
    /document\.getElementById\('framePortal'\)\.src\s*=\s*path\s*\+\s*hash;/g,
    "document.getElementById('framePortal').src=(__INLINE__?__MODULE_URL__(currentModule):path)+hash;");

  const outFile = path.join(dir, '统一门户-单文件.html');
  fs.writeFileSync(outFile, html, 'utf-8');
  const kb = Math.round(fs.statSync(outFile).size / 1024);
  console.log('\n✅ 单文件门户: ' + outFile + ' (' + kb + ' KB)');
  console.log('   策略: Font Awesome 父页面内联(500KB)，子模块零网络请求克隆共享');
}

main().catch(e => { console.error('❌', e.message); process.exit(1); });
