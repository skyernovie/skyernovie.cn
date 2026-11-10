# skyernovie.cn

天真SkyerNovie 的主站（独立仓库 / 独立域名）。主站只有一个页面：他的个人主页，底部另有「页面推荐」入口，指向一份独立制作的静态页。

- 线上地址：[https://skyernovie.cn](https://skyernovie.cn)
- 仓库地址：[https://github.com/skyernovie/skyernovie.cn](https://github.com/skyernovie/skyernovie.cn)
- 联系邮箱：[ZHCOOL520@qq.com](mailto:ZHCOOL520@qq.com)

---

## 页面结构

| 路径 | 内容 |
| --- | --- |
| `/` | 天真主页：头像与简介、数据卡片、精选视频（含在线播放器）、整合包平台外链、粉丝社区、联系方式、页面推荐 |
| `/GTLEnhanced` | 独立静态页「GTL 增强核心 · 玩家手册」，由另一位作者制作，设计与本站无关（见下文「GTL 增强核心介绍页」） |
| `/tz` | 旧地址，直接跳回 `/` |
| 其它 | 404 页，可一键回主页 |

没有资源下载页，也没有任何指向其它站点的「主站 / 返回上级」入口：整合包只做 MC百科 / CurseForge / Modrinth 的外链导航。

主页区块从上到下依次为：

```
Hero（首屏）→ Stats（数据卡片）→ Ticker（跑马灯）→ Videos（视频/合集）
→ Platforms（整合包平台）→ Community（粉丝社区）→ Contact（联系与开源）→ Recommend（页面推荐）
```

---

## 技术栈

| 类别 | 技术 | 说明 |
| --- | --- | --- |
| 框架 | React 18 | 函数组件 + Hooks |
| 构建 | Vite 5 | 开发服务器 / 生产构建 |
| 样式 | Tailwind CSS 3 | 深色模式用 `class` 策略，主题色走 CSS 变量 |
| 路由 | React Router 7 | `BrowserRouter` + 懒加载路由 |
| 动画 | GSAP 3 | 开场时间线 / 鼠标视差 / 磁吸按钮 / 3D 倾斜卡片 |
| Head | react-helmet-async | 管理 title / meta |
| 图标 | react-icons | Fi 系列 + Si 品牌图标 |
| 字体 | 自托管 | `public/fonts/Geist-Variable.woff2`、`GeistMono-Variable.woff2` |
| 图标资源 | 自动生成 | 站点图标由 `public/images/avatar.webp` 生成（`favicon.ico`、`favicon-32.png`、`favicon-64.png`、`apple-touch-icon.png`） |

---

## 快速开始

需要 **Node.js 20+**（CI 使用 Node 24）。

```bash
# 1. 安装依赖（推荐用 npm ci 保证与 lockfile 一致）
npm install

# 2. 本地开发（默认 http://localhost:5173）
npm run dev

# 3. 生产构建，产物输出到 dist/
npm run build

# 4. 本地预览构建结果
npm run preview

# 5. 从 B 站抓取最新粉丝数，写入 src/data/stats.json
npm run sync:stats
```

> 提交前建议本地跑一遍 `npm run build`，确认能正常构建。

---

## 目录结构

```
.github/workflows/deploy.yml   # GitHub Pages 构建与发布
docs/                          # 设计方案与截图（非站点内容）
src/
  App.jsx                 # 路由与全局外壳（含滚动修复、入场兜底）
  main.jsx                # 入口
  index.css               # 字体 @font-face、Tailwind 指令、动画 keyframes
  components/
    Navbar.jsx            # 导航（视频 / 社区 / 联系）+ 显示设置（主题切换）
    Footer.jsx            # 页脚
    Ticker.jsx            # 跑马灯信息带
    ParticleBackground.jsx # 像素孢子粒子 + 深色模式流星
    ScrollToTopFab.jsx    # 返回顶部按钮
    Loading.jsx           # 路由懒加载占位
    ui/                   # Button / Card / PixelIcon / SectionHeading / Toast
    shared/               # NotFound
  context/ThemeContext.jsx # 主题（明/暗）状态管理
  data/
    site.js               # ★ 站点文案与各类配置（改内容主要看这里）
    easter-eggs.js        # 头像点击彩蛋文案库
    stats.json            # 粉丝数快照（构建期自动更新，勿手写死）
  pages/
    TzXyz.jsx             # 天真主页（组装各区块）
    tz-sections/          # Hero / Stats / Videos / Platforms / Community / Contact / Recommend / TdButton
  utils/
    gsap.js               # GSAP 单例与动效偏好判断（reduceMotion / coarsePointer）
    useTilt.js            # 卡片 3D 倾斜
    useGlow.js            # 卡片光斑追踪
    magnetic.js           # 按钮磁吸
    useReveal.js          # 区块入场（IntersectionObserver）
    clipboard.js          # 复制文本（含降级方案）
public/
  CNAME  404.html  favicon.ico  fonts/  images/
  GTLEnhanced/            # 独立静态页（不参与 React 构建，原样复制到站点根）
    index.html            # 页面本体（HTML + CSS + 内联脚本）
    guide-index.json      # 文稿 / 图标 / 结构元信息 / 纹理图集
    guide-photos.json     # 园区实景照片（滚动到附近才加载）
    models/               # 67 个多方块结构几何，每台机器一个 json
scripts/
  fetch-stats.mjs         # 抓取 B 站粉丝数
```

---

## 内容配置指南（改内容看这里）

站点文案、视频、群号等**所有内容**集中在 [`src/data/site.js`](src/data/site.js)，组件只负责展示。改内容基本不需要动组件代码。

### 核心导出对象

| 导出 | 用途 |
| --- | --- |
| `profile` | 头像、名字、简介、直播时间、社交链接（B站 / 直播间 / QQ群 / 抖音） |
| `stats` | 4 个数据卡片（粉丝数 / 系列 / 更新频率 / 领域） |
| `statsNote` | 「更新频率」卡片的悬浮免责说明 |
| `videos` | 视频与合集卡片（封面、标题、播放量、外链） |
| `featuredVideo` | 站长精选在线播放器（封面、B 站嵌入地址、播放量、时长） |
| `platforms` | 整合包平台卡（MC百科 / CurseForge / Modrinth） |
| `communities` | 粉丝社区（QQ 群 / QQ 频道，含满员状态） |
| `contacts` | 联系方式（B 站 / QQ） |
| `repo` | 仓库信息与联系邮箱 |
| `recommendation` | 「页面推荐」卡片：标题、简介、跳转地址、图标 |

### 常见修改场景

**改粉丝数**：不要手写 `stats.json`，运行 `npm run sync:stats` 自动抓取（见下文「粉丝数数据」）。

**新增 / 修改视频卡**：编辑 `site.js` 的 `videos` 数组。每项字段：

```js
{
  key: 'ep1',            // 唯一标识
  tag: 'EP.01',          // 左上角像素标签
  badge: '最新',          // 可选角标
  title: '视频标题',
  desc: '视频描述',
  image: '/images/video1.webp',  // 封面（16:9，webp）
  url: 'https://www.bilibili.com/video/...',
  views: '16.0万',        // 播放量（展示用文本）
  tone: 'accent',        // 配色：accent / diamond / gold
}
```

合集卡片额外加 `collection: true`。

**改精选在线播放器**：编辑 `featuredVideo`。`cover` 为 16:9 封面，默认停在封面 + 「开始」按钮，点击后才挂载 B 站 iframe 并开始播放；`embed` 填 B 站官方 `player.html` 嵌入地址。

> 约定：视频系列条目只标注「完结」状态，**不显示集数编号或总集数**；合集标签用「完结合集」，描述统一「已全部完结」。

**改 QQ 群 / 频道**：编辑 `communities` 数组。`state` 字段控制状态：

| `state` | 表现 |
| --- | --- |
| `'full'` | 显示「已满员」，按钮不可点 |
| `'open'` | 可加入，主按钮 + 复制群号 |
| `'official'` | 官方频道样式 |

**改社交链接 / 联系方式**：编辑 `profile.socials` 与 `contacts`。

**改头像点击彩蛋文案**：编辑 [`src/data/easter-eggs.js`](src/data/easter-eggs.js)，往数组里加字符串即可。逻辑会自动一轮内不重复、抽完后重洗。

**改 TD 阈值提示语**：编辑 [`TdButton.jsx`](src/pages/tz-sections/TdButton.jsx) 里的 `MILESTONES` / `MILESTONE_TEXT`。这套文案按访问者自己的点击次数触发，和头像彩蛋是两套独立内容。

### 内容约定

- 视频、合集、平台、社区等卡片统一使用 **webp 封面**（16:9），懒加载 + 异步解码。
- 粉丝数等**非实时指标**必须保留「非实时、仅从 B 站更新」的说明。
- 数据卡片的免责说明通过**悬浮提示**展示，不要直接铺在页面上。

---

## 粉丝数数据

粉丝数来自 [`src/data/stats.json`](src/data/stats.json)，**不要写死在组件里**：

```json
{
  "mid": 25770857,
  "follower": 39574,
  "updatedAt": "2026-11-03"
}
```

[`scripts/fetch-stats.mjs`](scripts/fetch-stats.mjs) 负责抓取：

1. 请求 `https://api.bilibili.com/x/relation/stat?vmid=25770857`（带 UA / Referer，15 秒超时）；
2. 校验响应，失败则**保留旧值**并以退出码 0 结束（不阻断部署）；
3. 粉丝数有变化才写文件，并更新 `updatedAt`。

`site.js` 顶部会读取该文件动态生成粉丝文案（≥1 万显示「X.XX万」，否则千分位）。

> 粉丝数为部署时的 B 站快照，**并非实时数据**。

---

## 主题与样式系统

- 深色模式：Tailwind `darkMode: 'class'`，由 `ThemeContext` 切换，`localStorage` 持久化。
- 防闪烁：[`index.html`](index.html) 顶部内联脚本在 React 挂载前读取主题偏好，提前给 `<html>` 加 `.dark` 类。
- 配色：语义色（`ink` / `muted` / `line` / `accent` 等）指向 CSS 变量，随明暗切换；MC 主题色（`grass` / `diamond` / `gold` / `redstone` / `bili`）为固定值。
- 字体：`Geist`（正文）与 `Geist Mono`（展示 / 标题），均自托管并预加载。
- 圆角、缓动曲线在 [`tailwind.config.js`](tailwind.config.js) 的 `theme.extend` 中定义。

分层配色约定：直播状态用 redstone 红、合集标签用 gold 金、开源平台用 diamond 青、主强调用 grass 草绿。

---

## 动画系统

- GSAP 通过 [`src/utils/gsap.js`](src/utils/gsap.js) 单例导出，刻意不引 ScrollTrigger。
- 入场：`useReveal` 用 IntersectionObserver 给区块加 `.is-in` 触发 CSS 动画；`App.jsx` 有 3 秒兜底，强制显示未触发的 `.reveal` 元素。
- 交互：`useTilt`（3D 倾斜）、`useGlow`（光斑追踪）、`magnetic`（按钮磁吸）。
- **无障碍**：所有动画尊重 `prefers-reduced-motion`；触屏设备（`pointer: coarse`）自动禁用视差 / 倾斜 / 光斑等鼠标效果。

新增动画时请沿用上述工具并保留这两条降级判断。

---

## 路由与深链接

GitHub Pages 是静态托管，深链接刷新会 404。本项目用「404 中转」方案解决：

1. 访问深链接（如 `/tz`）时，Pages 返回 [`public/404.html`](public/404.html)；
2. `404.html` 把路径转成 `/?path=/tz`（保留 search / hash）跳回主页；
3. [`index.html`](index.html) 顶部脚本读取 `path` 参数，用 `history.replaceState` 还原真实路径；
4. React Router 正常匹配渲染。

路由表（[`src/App.jsx`](src/App.jsx)）：

| 路径 | 组件 | 说明 |
| --- | --- | --- |
| `/` | `TzXyz`（懒加载） | 主页 |
| `/tz` | `Navigate → /` | 旧地址重定向 |
| `/GTLEnhanced` | `StaticPageRedirect → /GTLEnhanced/` | 独立静态页兜底跳转（线上由目录 `index.html` 直接命中） |
| `*` | `NotFound` | 404 页 |

---

## GTL 增强核心介绍页

`/GTLEnhanced` 是一份**独立静态页**（GTL 增强核心 · 玩家手册），由另一位作者制作，设计语言和文案都与本站无关。本站只负责在主页底部「页面推荐」分栏给出入口：

- 卡片文案在 [`src/data/site.js`](src/data/site.js) 的 `recommendation`；
- 分栏组件为 [`Recommend.jsx`](src/pages/tz-sections/Recommend.jsx)，以整页跳转方式打开；
- 页面本体放在 `public/GTLEnhanced/`，构建时原样复制到 `dist/GTLEnhanced/`，**不经过 React / Vite 打包**。

### 数据拆分

原始版本是 16.8 MB 的单文件（内联 JSON 占 16.29 MB），部署到 GitHub Pages 后首屏需要等 12.5 MB（gzip）下载完才渲染，表现为大量骨架和加载动画长时间转圈。现已拆分为：

| 文件 | 体积 | 加载时机 |
| --- | --- | --- |
| `index.html` | ≈0.5 MB | 立即 |
| `guide-index.json` | ≈0.74 MB | 立即（文稿、图标、结构元信息、纹理图集） |
| `guide-photos.json` | ≈2.2 MB | 滚动到「私人园区」附近时加载 |
| `models/<结构名>.json` | 单个 0.1–1.2 MB | 选中某台机器 / 首屏结构时按需加载 |

页面内的对应逻辑：主脚本改为异步 `fetch('guide-index.json')` 引导；`StructureViewer.setModel` 在缺少 `quads` 时拉取 `models/<结构名>.json`（文件名规则：`key.replace(/[^a-zA-Z0-9_-]/g, '_') + '.json'`）；园区照片用 `IntersectionObserver` 懒加载。

### 修改注意

- 改文案直接改 `index.html` 里的静态标记，或 `guide-index.json` 内的字段；
- 新增结构时，需要同时补 `guide-index.json` 中 `models.models` 的元信息（`size` / `quadCount` / `blockCount` / `surfaceArea`）和对应的 `models/*.json`（`quads` 为 gzip 数据的 base64）；
- **不要把数据重新内联回 `index.html`**，否则会退回单文件、首屏再次变慢。

---

## 构建配置

[`vite.config.js`](vite.config.js) 关键点：

- `base: '/'`：根路径部署（GitHub Pages 自定义域名）。
- 手动分块：`react-vendor` / `gsap-vendor` / `icons-vendor`，减小首屏体积。
- `minify: 'terser'`、`target: 'es2020'`、生产不生成 sourcemap。
- 4KB 以下资源内联为 base64。

---

## 部署

**GitHub Pages**。仓库根目录的 `CNAME` 与 `public/CNAME` 均指向 `skyernovie.cn`。

### 流程（`.github/workflows/deploy.yml`）

触发条件：推送 `master` 分支，或手动 `workflow_dispatch`。

**Build 任务：**

1. `actions/checkout@v4` 拉代码；
2. `actions/setup-node@v4`：Node 24 + npm 缓存；
3. `npm ci` 按 lockfile 安装依赖；
4. `npm run sync:stats` 刷新粉丝数（`continue-on-error: true`，抓取失败沿用旧值，**不会让部署失败**）；
5. `npm run build` 打包到 `dist/`；
6. `actions/configure-pages@v4` + `upload-pages-artifact@v3` 上传产物。

**Deploy 任务：** `actions/deploy-pages@v4` 发布到 `github-pages` 环境。

### 网络加速

CDN 与域名解析 DNS 均由**阿里云**提供，两者都已付费开通加速包：

- DNS 以 CNAME（`skyernovie.github.io`）接入；
- 流量走阿里云 CDN 边缘节点。

---

## 贡献指南

想修改这个网站，欢迎按下面的方式参与：

### 1. Fork + Pull Request（推荐）

1. Fork 本仓库，在自己的仓库里改好并提交；
2. 向上游 `master` 发起 Pull Request；
3. 把 PR 链接发到邮箱 [ZHCOOL520@qq.com](mailto:ZHCOOL520@qq.com)，方便及时看到。

### 2. 申请协作权限

- 如果你在舰长群里，可以把你的 GitHub 账号发到上面的邮箱；
- 审核后会直接给你仓库的协作权限，之后可以在分支上提交。

### 提交前检查清单

- [ ] 本地 `npm run build` 能正常构建
- [ ] 改内容只动了 `src/data/`，没有把文案写死在组件里
- [ ] 粉丝数没有手写死（走 `stats.json`）
- [ ] 新动画保留了 `prefers-reduced-motion` 与触屏降级

---

## 说明与注意事项

- 主页里「TD」按钮的点击数走 `https://api.zhcool520.xyz` 的计数接口（与旧站共用同一个总数）；接口不可用时自动回落到 localStorage，并在按钮上显示离线标记。按钮上的数字是全站总数，阈值提示按访问者自己的点击次数（10 / 50 / 100 / …）触发。
- 数据卡片里的「更新频率」与粉丝数说明以悬浮提示展示；粉丝数为部署时的 B 站快照，并非实时数据。
- 若站点标注的更新频率（3 天 / 期）与主播本人公开说法不一致，以主播说法为准。
