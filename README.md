# skyernovie.cn

天真SkyerNovie 的主站（独立仓库 / 独立域名）。整站只有一个页面：他的个人主页。

- 线上地址：[https://skyernovie.cn](https://skyernovie.cn)
- 仓库地址：[https://github.com/skyernovie/skyernovie.cn](https://github.com/skyernovie/skyernovie.cn)

## 结构

| 路径 | 内容 |
| --- | --- |
| `/` | 天真主页：头像与简介、数据卡片、精选视频与合集、整合包平台外链、粉丝社区、联系方式 |
| `/tz` | 旧地址，直接跳回 `/` |
| 其它 | 404 页，可一键回主页 |

没有资源下载页，也没有任何指向其它站点的「主站 / 返回上级」入口：整合包只做 MC百科 / CurseForge / Modrinth 的外链导航。

## 技术栈

- React 18 + Vite 5
- Tailwind CSS 3
- React Router 7（`BrowserRouter` + 懒加载路由）
- GSAP / ScrollTrigger 动画
- react-helmet-async 管理页面 head
- 字体自托管（`public/fonts/Geist-Variable.woff2`、`GeistMono-Variable.woff2`）
- 站点图标由 `public/images/avatar.webp` 生成（`favicon.ico`、`favicon-32.png`、`favicon-64.png`、`apple-touch-icon.png`）

## 开发

需要 Node.js 20+（CI 使用 Node 24）。

```bash
npm install
npm run dev      # 本地开发
npm run build    # 产物输出到 dist/
npm run preview  # 预览构建结果
npm run sync:stats  # 从 B 站抓取最新粉丝数，写入 src/data/stats.json
```

站点文案、视频、群号等内容集中在 `src/data/site.js`，组件只负责展示；粉丝数来自 `src/data/stats.json`，不要写死。

## 部署

GitHub Pages，仓库根目录的 `CNAME` 与 `public/CNAME` 均指向 `skyernovie.cn`。

- 推送 `master` 分支后，`.github/workflows/deploy.yml` 自动构建并发布
- 推送前会尝试刷新粉丝数，抓取失败则沿用仓库里的旧值，不会让部署失败
- CDN 加速：域名 NS 托管在 Cloudflare，DNS 以 CNAME（`skyernovie.github.io`）+ 代理模式接入，流量走 Cloudflare 边缘节点

`public/404.html` 负责把深链接重定向到 `/?path=...`，再由 `index.html` 顶部的脚本还原路径，保证刷新和直接访问不 404。

## 目录结构

```
.github/workflows/deploy.yml   # GitHub Pages 构建与发布
src/
  App.jsx                 # 路由与全局外壳
  main.jsx
  index.css               # 字体 @font-face、Tailwind 指令、动画 keyframes
  components/
    Navbar.jsx            # 导航（视频 / 社区 / 联系）+ 显示设置（主题）
    Footer.jsx            # 页脚
    ParticleBackground.jsx / ScrollToTopFab.jsx
    Loading.jsx
    ui/                   # Button / PixelIcon / SectionHeading 等
    shared/               # AnimatedLink / NotFound / PageLayout
  context/ThemeContext.jsx
  data/
    site.js               # 站点文案与各类配置
    stats.json            # 粉丝数快照
  pages/
    TzXyz.jsx             # 天真主页
    tz-sections/          # 首屏、数据卡片、视频、平台、社区、联系等区块
  utils/gsapAnimations.js
public/
  CNAME  404.html  favicon.ico  fonts/  images/
scripts/
  fetch-stats.mjs         # 抓取 B 站粉丝数
```

## 一起维护

想修改这个网站，欢迎按下面的方式参与：

1. **Fork + Pull Request（推荐）**
   - Fork 本仓库，在自己的仓库里改好并提交；
   - 向上游 `master` 发起 Pull Request；
   - 把 PR 链接发到邮箱 [ZHCOOL520@qq.com](mailto:ZHCOOL520@qq.com)，方便及时看到。

2. **申请协作权限**
   - 如果你在舰长群里，可以把你的 GitHub 账号发到上面的邮箱；
   - 审核后会直接给你仓库的协作权限，之后可以在分支上提交。

提交前建议本地跑一遍 `npm run build`，确认能正常构建。

## 说明

- 主页里“TD”按钮的点击数走 `https://api.zhcool520.xyz` 的计数接口（与旧站共用同一个总数）；接口不可用时自动回落到 localStorage，并在按钮上显示离线标记。
- 数据卡片里的「更新频率」与粉丝数说明以悬浮提示展示；粉丝数为部署时的 B 站快照，并非实时数据。
