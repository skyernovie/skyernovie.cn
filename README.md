# skyernovie.cn

天真SkyerNovie 的主站（独立仓库 / 独立域名）。整站只有一个页面：他的个人主页。

## 结构

| 路径 | 内容 |
| --- | --- |
| `/` | 天真主页：头像与简介、数据卡片、精选视频与合集、整合包平台外链、粉丝社区、联系方式 |
| `/tz` | 旧地址，直接跳回 `/` |
| 其它 | 404 页，可一键回主页 |

没有资源下载页，也没有任何指向其它站点的“主站 / 返回上级”入口：整合包只做 MC百科 / CurseForge / Modrinth 的外链导航。

## 技术栈

- React 18 + Vite 5
- Tailwind CSS 3
- React Router 7（`BrowserRouter` + 懒加载路由）
- GSAP / ScrollTrigger 动画
- react-helmet-async 管理页面 head
- 字体自托管（`public/fonts/Geist-Variable.woff2`、`GeistMono-Variable.woff2`）
- 站点图标由 `public/images/avatar.webp` 生成（`favicon.ico`、`favicon-32.png`、`favicon-64.png`、`apple-touch-icon.png`）

## 开发

```bash
npm install
npm run dev      # 本地开发
npm run build    # 产物输出到 dist/
npm run preview  # 预览构建结果
```

## 部署

GitHub Pages，仓库根目录的 `CNAME` 与 `public/CNAME` 均指向 `skyernovie.cn`。
`public/404.html` 负责把深链接重定向到 `/?path=...`，再由 `index.html` 顶部的脚本还原路径，保证刷新和直接访问不 404。

## 目录结构

```
src/
  App.jsx                 # 路由与全局外壳
  main.jsx
  index.css               # 字体 @font-face、Tailwind 指令、动画 keyframes
  components/
    Navbar.jsx            # 导航（视频 / 社区 / 联系）+ 显示设置（主题、鼠标光效）
    Footer.jsx            # 页脚（B站空间入口）
    ParticleBackground.jsx / MouseGlow.jsx / ScrollToTopFab.jsx
    Loading.jsx
    shared/               # AnimatedLink / NotFound / PageLayout
  context/ThemeContext.jsx
  pages/
    TzXyz.jsx             # 天真主页
  utils/gsapAnimations.js
public/
  CNAME  404.html  favicon.ico  fonts/  images/
```

## 说明

- 主页里“TD”按钮的点击数走 `https://api.zhcool520.xyz` 的计数接口（与旧站共用同一个总数）；接口不可用时自动回落到 localStorage，并在按钮上显示离线标记。
