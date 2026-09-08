import { useState } from 'react'

interface AccordionItem {
  q: string
  a: string
}

export function Accordion({ items }: { items: AccordionItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <div className="divide-y divide-teal-950/10 rounded-2xl border border-teal-950/10 bg-white">
      {items.map((item, i) => {
        const isOpen = openIndex === i
        return (
          <div key={item.q}>
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="group flex w-full items-center justify-between gap-4 px-5 py-4 text-start transition-colors duration-200 hover:bg-teal-50/60 sm:px-6 sm:py-5"
              aria-expanded={isOpen}
            >
              <span className="font-semibold text-teal-950 transition-colors duration-200 group-hover:text-teal-700">
                {item.q}
              </span>
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal-950/5 text-teal-950 transition-all duration-300 ease-out group-hover:bg-teal-700 group-hover:text-white ${
                  isOpen ? 'rotate-45 bg-teal-700 text-white' : ''
                }`}
              >
                +
              </span>
            </button>
            <div
              className={`grid transition-all duration-200 ease-out ${
                isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
              }`}
            >
              <div className="overflow-hidden">
                <p className="px-5 pb-5 text-sm leading-relaxed text-ink-700 sm:px-6">{item.a}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
