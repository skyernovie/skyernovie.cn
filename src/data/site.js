import { FiBookOpen, FiGlobe, FiGrid, FiMessageCircle, FiExternalLink, FiVideo } from 'react-icons/fi'
import { SiBilibili, SiTiktok } from 'react-icons/si'
import statsData from './stats.json'

/*
 * 站点内容集中在这里：改文案、换视频、加群都只动这个文件，组件只负责怎么展示。
 * 粉丝数来自 src/data/stats.json（scripts/fetch-stats.mjs 自动抓取，别在这里写死）。
 */

const FAN_COUNT = statsData.follower
const FAN_TEXT = FAN_COUNT >= 10000 ? `${(FAN_COUNT / 10000).toFixed(2)}万` : FAN_COUNT.toLocaleString('en-US')
const FAN_UPDATED = statsData.updatedAt ? `，更新于 ${statsData.updatedAt}` : ''

export const profile = {
  name: '天真SkyerNovie',
  avatar: '/images/avatar.webp',
  tagline: 'Minecraft 实况主 · 模组游戏达人',
  schedule: '每晚 20:00 – 22:00 直播',
  note: '特殊情况可能暂停，详见 B 站动态或 QQ 群通知',
  socials: [
    { key: 'bili', label: 'B站主页', url: 'https://space.bilibili.com/25770857', icon: SiBilibili, variant: 'primary' },
    { key: 'live', label: '直播间', url: 'https://live.bilibili.com/303427', icon: FiVideo, variant: 'secondary' },
    { key: 'qq', label: 'QQ群', url: 'https://qm.qq.com/q/xa0u5yocV4', icon: FiMessageCircle, variant: 'secondary' },
    { key: 'douyin', label: '抖音', url: 'https://v.douyin.com/TCPDQ1sFpEA/', icon: SiTiktok, variant: 'secondary' },
  ],
}

/*
 * 「3 天 / 期」的说明：这句话是主播自己在直播间说的，跟站长无关。
 * 站长只是听信了谗言、照搬了口头承诺。经核对，主播自己的 B 站简介写的是
 * 「视频 3–4 天更新」，前后口径本就不一致——真要追责，请批判主播。
 */
export const statsNote =
  '※「3 天 / 期」为主播本人在直播间所述，与本站站长无任何关系，站长只是听信了谗言。' +
  '经核对，主播自己的 B 站简介写的是「视频 3–4 天更新」，口径前后并不一致；' +
  '若实际更新节奏与该说法不符，请批判主播，别批判站长。'

export const stats = [
  {
    key: 'fans',
    icon: 'grass',
    value: FAN_TEXT,
    label: 'B站粉丝',
    compact: false,
    tipTitle: '数据说明',
    tipTone: 'accent',
    tip: `粉丝数为 ${FAN_COUNT.toLocaleString('en-US')}${FAN_UPDATED}。该数字不是实时更新的，只在每次部署时从 B 站（哔哩哔哩）抓取一次快照，也只同步哔哩哔哩这一侧的数据。`,
  },
  { key: 'series', icon: 'diamond', value: '《格雷空岛》', label: '主要系列', compact: true },
  {
    key: 'rate',
    icon: 'gold',
    value: '3 天 / 期',
    label: '更新频率',
    compact: false,
    tipTitle: '重点提示',
    tipTone: 'gold',
    tip: statsNote,
  },
  { key: 'field', icon: 'redstone', value: '整合包实况', label: '核心领域', compact: true },
]

export const videos = [
  {
    key: 'ep1',
    tag: '格雷科技',
    badge: 'EP.1',
    title: '蒸汽合金炉合出创造能源？开启AE2！格雷空岛爽包Ep1',
    desc: '格雷科技空岛整合包实况，蒸汽合金炉开启创造能源，全面启动 AE2 自动化！',
    image: '/images/video1.webp',
    url: 'https://www.bilibili.com/video/BV1mdCTBgEjZ',
    views: '16.0万',
  },
  {
    key: 'ep2',
    tag: '模块化',
    badge: 'EP.1',
    title: '模块化巅峰神包！开局送AE，做出创造飞行！新星工程EP1',
    desc: '模块化巅峰整合包实况，开局赠送 AE 系统，一步到位做出创造飞行！',
    image: '/images/video2.webp',
    url: 'https://www.bilibili.com/video/BV1tWVh6NEtz',
    views: '7.7万',
  },
  {
    key: 'ep3',
    tag: '蜜蜂空岛',
    badge: 'EP.1',
    title: '资源蜜蜂版无中生有 开局送创造马达！蜂蜂空坊Ep1',
    desc: '蜜蜂版无中生有整合包实况，开局赠送创造马达，开启蜂蜂空坊全新系列冒险！',
    image: '/images/video3.webp',
    url: 'https://www.bilibili.com/video/BV1xeSRBpEt9',
    views: '6.1万',
  },
  {
    key: 'col1',
    tag: '合集 · 全 6 集',
    badge: '合集',
    title: '新时代科技',
    desc: '高版本轮椅模组整合爽包，开局送 AE 一路爽到创造飞行，全 6 集完结。',
    image: '/images/collection1.jpg',
    url: 'https://space.bilibili.com/25770857/channel/collectiondetail?sid=8816969',
    views: '34.5万',
  },
  {
    key: 'col2',
    tag: '合集 · 全 6 集',
    badge: '合集',
    title: '无限遗产',
    desc: '无限遗产 II 私货版，AE 与创造蜜蜂一路爽飞，全 6 集完结。',
    image: '/images/collection2.jpg',
    url: 'https://space.bilibili.com/25770857/channel/collectiondetail?sid=9154355',
    views: '30.6万',
  },
]

export const moreVideosUrl = 'https://space.bilibili.com/25770857'

export const platforms = [
  {
    key: 'mcmod',
    name: 'MC百科',
    desc: '国内最全的 Minecraft 模组百科，整合包信息与下载索引。',
    url: 'https://www.mcmod.cn/modpack.html',
    icon: FiBookOpen,
    tone: 'grass',
    badge: '推荐',
  },
  {
    key: 'curseforge',
    name: 'CurseForge',
    desc: '全球最大的模组与整合包平台，作品量最大、更新最勤。',
    url: 'https://www.curseforge.com/minecraft/modpacks',
    icon: FiGlobe,
    tone: 'gold',
    badge: '全球最大',
  },
  {
    key: 'modrinth',
    name: 'Modrinth',
    desc: '新一代开源模组平台，整合包管理简洁高效。',
    url: 'https://modrinth.com/modpacks',
    icon: FiGrid,
    tone: 'diamond',
    badge: '开源',
  },
]

export const communities = [
  {
    key: 'g1',
    name: '催更①群',
    desc: 'Minecraft 模组交流，催更讨论。',
    code: '768587905',
    url: 'http://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=X1wN9HgYwSiPQoTOfFeQCIsvv1tJP1aR&authKey=Qvpoj8yGRb9KuEdyCHKj7uKe7ZmuQqphmvAoAIrDBGNgAX6BxVGB1wP1%2FGairuyE&noverify=0&group_code=768587905',
    status: '已满员',
    state: 'full',
    action: '已满员',
    icon: 'sign',
  },
  {
    key: 'g2',
    name: '催更②群',
    desc: '粉丝交流②群，更多讨论空间。',
    code: '564472763',
    url: 'http://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=mDc4o5DA6jJimZ_uR7wrN8VLq5NqClfJ&authKey=%2BV64u1ibJD5Ww%2FeEpxbajM%2FSgMfrmmYYaX9OBtlBanx%2FhaPSSCLsB4c17hEwLWP9&noverify=0&group_code=564472763',
    status: '已满员',
    state: 'full',
    action: '已满员',
    icon: 'sign',
  },
  {
    key: 'g3',
    name: '催更③群',
    desc: '③群已满，欢迎加入④群。',
    code: '694474933',
    url: 'https://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=o56dxRJfYHO8TN-XI5RdYip0Ofc5tP6x&authKey=hAw3ZnvNAsK51XCYi3ImJdxJtMmqzm2Lel%2BXjXekjlmshwnq8qHmMeAzyfhFUATJ&noverify=0&group_code=694474933',
    status: '已满员',
    state: 'full',
    action: '已满员',
    icon: 'sign',
  },
  {
    key: 'g4',
    name: '催更④群',
    desc: '新群开放中，欢迎加入！',
    url: 'https://qm.qq.com/q/xa0u5yocV4',
    status: '开放加入',
    state: 'open',
    action: '加入群聊',
    icon: 'sign',
  },
  {
    key: 'channel',
    name: 'QQ频道',
    desc: '获取最新动态、直播通知和独家内容。',
    code: 'pd39356778',
    url: 'https://pd.qq.com/s/pd39356778',
    status: '官方频道',
    state: 'official',
    action: '加入频道',
    icon: 'bed',
  },
]

export const contacts = [
  {
    key: 'bili',
    name: 'B 站私信',
    desc: '商务合作首选',
    url: 'https://space.bilibili.com/25770857',
    icon: SiBilibili,
    tone: 'bili',
  },
  {
    key: 'qq',
    name: 'QQ 群',
    desc: '粉丝交流互动',
    url: 'https://qm.qq.com/q/xa0u5yocV4',
    icon: FiMessageCircle,
    tone: 'diamond',
  },
]

export const externalIcon = FiExternalLink

/* 开源仓库信息：页面上展示仓库入口，并引导 fork / 提 PR / 申请协作权限 */
export const repo = {
  url: 'https://github.com/skyernovie/skyernovie.cn',
  label: 'skyernovie/skyernovie.cn',
  email: 'ZHCOOL520@qq.com',
}

