import { FiArrowUpRight } from 'react-icons/fi'
import SectionHeading from '../../components/ui/SectionHeading'
import { contacts } from '../../data/site'

const TONES = {
  bili: 'border-bili/25 bg-bili/10 text-bili',
  diamond: 'border-diamond-500/25 bg-diamond-500/10 text-diamond-700 dark:text-diamond-500',
}

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
                className="reveal card card-hover group flex items-center gap-4 p-5"
                style={{ transitionDelay: `${index * 90}ms` }}
              >
                <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl border ${TONES[item.tone]}`}>
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
      </div>
    </section>
  )
}
