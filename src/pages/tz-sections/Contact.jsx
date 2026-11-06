import { FiArrowUpRight, FiGithub } from 'react-icons/fi'
import SectionHeading from '../../components/ui/SectionHeading'
import { contacts, repo } from '../../data/site'

const TONES = {
  bili: 'border-bili/25 bg-bili/10 text-bili group-hover:border-bili/45 group-hover:bg-bili group-hover:text-white',
  diamond:
    'border-diamond/25 bg-diamond/10 text-diamond group-hover:border-diamond/45 group-hover:bg-diamond group-hover:text-[#06201d]',
}

const MAILTO = `mailto:${repo.email}?subject=${encodeURIComponent('网站修改：Pull Request 提交')}&body=${encodeURIComponent('PR 链接：\n\n改动说明：\n')}`

export default function Contact() {
  return (
    <section id="tz-contact" className="scroll-mt-24 px-5 py-16 sm:py-20" aria-labelledby="contact-title">
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          align="center"
          icon="spark"
          label="Get in touch"
          title={<span id="contact-title">与我联系</span>}
          desc="直播通知 · 催更讨论 · 商务合作"
        />

        <div className="mt-9 grid max-w-2xl gap-4 sm:mx-auto sm:grid-cols-2">
          {contacts.map((item, index) => {
            const Icon = item.icon
            return (
              <a
                key={item.key}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="reveal card group flex items-center gap-4 p-5 hover:border-accent/30"
                style={{ transitionDelay: `${index * 90}ms` }}
              >
                <span
                  className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl border transition-colors duration-300 ${TONES[item.tone]}`}
                >
                  <Icon size={22} aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[15px] font-semibold text-ink">{item.name}</span>
                  <span className="mt-0.5 block text-[12.5px] text-muted">{item.desc}</span>
                </span>
                <FiArrowUpRight
                  size={16}
                  aria-hidden="true"
                  className="shrink-0 text-muted transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                />
              </a>
            )
          })}
        </div>

        <div className="mx-auto mt-4 max-w-2xl">
          <div className="reveal card p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-diamond/25 bg-diamond/10 text-diamond">
                  <FiGithub size={22} aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="block text-[15px] font-semibold text-ink">本站已开源</span>
                  <span className="mt-0.5 block truncate text-[12.5px] text-muted">{repo.label}</span>
                </span>
              </div>
              <a
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-accent/30 bg-accent/10 px-3.5 py-2 text-[12.5px] font-semibold text-accent transition hover:bg-accent/15"
              >
                GitHub 仓库
                <FiArrowUpRight
                  size={14}
                  aria-hidden="true"
                  className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </a>
            </div>

            <p className="mt-4 text-[12.5px] leading-relaxed text-muted">
              想修改这个网站？可以先 Fork 仓库、提交改动，再把 Pull Request 链接发到
              <a href={MAILTO} className="mx-1 font-semibold text-accent underline-offset-2 hover:underline">
                {repo.email}
              </a>
              。如果你在舰长群里，也可以把 GitHub 账号发给我，我给你开协作权限。
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
