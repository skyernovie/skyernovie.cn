/**
 * 抓取 B 站的粉丝数，写进 src/data/stats.json。
 *
 * 用法：npm run sync:stats
 *
 * 为什么是构建前手动/CI 跑，而不是页面里实时请求：
 *   api.bilibili.com 不返回 Access-Control-Allow-Origin，浏览器里直接 fetch 会被 CORS 拦掉，
 *   要么自己搭个代理 Worker，要么像现在这样在构建期抓一次写死进包，简单可靠、页面零请求。
 * GitHub Actions 部署时会先跑一次（见 .github/workflows/deploy.yml），所以线上数字会跟着构建更新。
 *
 * 抓不到就保持原文件不动、退出码 0：接口偶尔抽风不该让整次部署失败。
 */
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const MID = 25770857;
const OUT = fileURLToPath(new URL('../src/data/stats.json', import.meta.url));
const API = `https://api.bilibili.com/x/relation/stat?vmid=${MID}`;

const today = () => new Date().toISOString().slice(0, 10);

async function readLocal() {
  try {
    return JSON.parse(await readFile(OUT, 'utf8'));
  } catch {
    return { mid: MID, follower: 0, updatedAt: '' };
  }
}

async function main() {
  const local = await readLocal();
  let follower = null;

  try {
    const res = await fetch(API, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        Referer: `https://space.bilibili.com/${MID}`,
      },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (json?.code !== 0) throw new Error(`code ${json?.code} ${json?.message ?? ''}`);
    follower = Number(json?.data?.follower);
    if (!Number.isFinite(follower) || follower <= 0) throw new Error('follower 字段异常');
  } catch (err) {
    console.log(`[sync:stats] 抓取失败：${err.message}`);
    console.log(`[sync:stats] 保留现有数据：${local.follower}（${local.updatedAt || '未知日期'}）`);
    return;
  }

  if (follower === local.follower) {
    console.log(`[sync:stats] 粉丝数没变：${follower}`);
    return;
  }

  const next = { mid: MID, follower, updatedAt: today() };
  await writeFile(OUT, `${JSON.stringify(next, null, 2)}\n`, 'utf8');
  const delta = follower - (local.follower || 0);
  console.log(
    `[sync:stats] 粉丝数 ${local.follower || '?'} -> ${follower}（${delta >= 0 ? '+' : ''}${delta}），已写入 ${OUT}`,
  );
}

await main();
