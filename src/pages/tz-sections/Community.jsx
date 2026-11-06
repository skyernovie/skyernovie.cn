import { FiCopy } from 'react-icons/fi'
import Button from '../../components/ui/Button'
import PixelIcon from '../../components/ui/PixelIcon'
import SectionHeading from '../../components/ui/SectionHeading'
import { useToast } from '../../components/ui/Toast'
import { copyText } from '../../utils/clipboard'
import { communities } from '../../data/site'

const STATE_BADGE = {
  full: 'status-badge--full',
  open: 'status-badge--open',
  official: 'status-badge--official',
}

export default function Community() {
  const toast = useToast()

  const handleCopy = async (item) => {
    if (!item.code) return
    const ok = await copyText(item.code)
    toast(ok ? `群号 ${item.code} 已复制` : '复制失败，请手动选择', {
      title: ok ? '复制成功' : '复制失败',
      icon: ok ? 'grass' : 'redstone',
      duration: 2000,
    })
  }

  return (
    <section id="tz-community" className="scroll-mt-24 px-5 py-16 sm:py-20" aria-labelledby="community-title">
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          align="center"
          icon="sign"
          label="Community"
          title={<span id="community-title">粉丝社区</span>}
          desc="加群获取开播提醒、模组包更新和直播通知"
        />

        <div className="mt-9 grid gap-4 sm:grid-cols-2">
          {communities.map((item, index) => (
            <div
              key={item.key}
              className="reveal card card-hover flex flex-col gap-3 p-5"
              style={{ transitionDelay: `${index * 70}ms` }}
            >
              <div className="flex min-w-0 items-center gap-2.5 pr-[74px]">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[10px] bg-line/[0.05] dark:bg-white/[0.06]">
                  <PixelIcon name={item.icon} size={16} />
                </span>
                <span className="truncate text-[14.5px] font-semibold text-ink">{item.name}</span>
              </div>
              <span className={`status-badge ${STATE_BADGE[item.state]}`}>{item.status}</span>

              <p className="text-[12.5px] leading-relaxed text-muted">{item.desc}</p>

              <div className="mt-auto flex flex-wrap items-center gap-2 pt-1">
                {item.code && (
                  <code className="num rounded-lg border border-line/10 bg-line/[0.04] px-2.5 py-1 text-[12px] text-ink dark:bg-white/[0.04]">
                    {item.code}
                  </code>
                )}

                {item.code && (
                  <button
                    type="button"
                    onClick={() => handleCopy(item)}
                    className="btn btn-ghost btn-sm"
                    aria-label={`复制${item.name}群号 ${item.code}`}
                  >
                    <FiCopy size={13} aria-hidden="true" />
                    复制
                  </button>
                )}

                {item.state === 'full' ? (
                  <span
                    className="btn btn-ghost btn-sm ml-auto cursor-not-allowed opacity-60"
                    aria-disabled="true"
                  >
                    已满员
                  </span>
                ) : (
                  item.url && (
                    <Button
                      href={item.url}
                      variant={item.state === 'open' ? 'primary' : 'secondary'}
                      size="sm"
                      className="ml-auto"
                    >
                      {item.action}
                    </Button>
                  )
                )}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-7 text-center text-[12px] text-muted">
          每晚 20:00 – 22:00 直播，特殊情况可能暂停，详见 B 站动态或 QQ 群通知
        </p>
      </div>
    </section>
  )
}
