import { useEffect, useRef } from 'react'
import { Helmet } from 'react-helmet-async'
import { useReveal } from '../utils/useReveal'
import Hero from './tz-sections/Hero'
import Stats from './tz-sections/Stats'
import Videos from './tz-sections/Videos'
import Platforms from './tz-sections/Platforms'
import Community from './tz-sections/Community'
import Contact from './tz-sections/Contact'

const SITE = 'https://skyernovie.cn'
const TITLE = '天真SkyerNovie - 个人主页'
const DESC =
  '天真SkyerNovie 的个人主页：Minecraft 模组实况主，格雷空岛 / 新星工程等整合包实况，每晚 20:00 – 22:00 直播。'

export default function TzXyz() {
  const rootRef = useRef(null)
  useReveal(rootRef)

  useEffect(() => {
    const previous = document.title
    document.title = TITLE
    return () => {
      document.title = previous
    }
  }, [])

  return (
    <>
      <Helmet prioritizeSeoTags>
        <title>{TITLE}</title>
        <meta name="description" content={DESC} />
        <link rel="canonical" href={`${SITE}/`} />
        <meta property="og:type" content="profile" />
        <meta property="og:title" content={TITLE} />
        <meta property="og:description" content={DESC} />
        <meta property="og:url" content={`${SITE}/`} />
        <meta property="og:image" content={`${SITE}/images/avatar.webp`} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={TITLE} />
        <meta name="twitter:description" content={DESC} />
        <meta name="twitter:image" content={`${SITE}/images/avatar.webp`} />
      </Helmet>

      <div ref={rootRef}>
        <Hero />
        <Stats />
        <Videos />
        <Platforms />
        <Community />
        <Contact />
      </div>
    </>
  )
}
