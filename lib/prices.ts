export type PriceItem = {
  name: string
  note?: string
  min: number
  max?: number
  /** Show «от» before a single price. */
  from?: boolean
  unit: string
}

export type PriceGroup = {
  id: 'wallpaper' | 'floors' | 'screed'
  title: string
  href: string
  items: PriceItem[]
}

const M2 = '₽/м²'

export const priceGroups: PriceGroup[] = [
  {
    id: 'wallpaper',
    title: 'Обои',
    href: '/services#wallpaper',
    items: [
      { name: 'Монтаж обоев', min: 600, max: 1300, unit: M2 },
      { name: 'Монтаж моющих и антивандальных обоев', note: 'Один слой', min: 250, unit: M2 },
      { name: 'Демонтаж обоев', note: 'Один слой', min: 150, unit: M2 },
      { name: 'Фреска', note: 'Размер до 2,5 × 3 м', min: 18000, unit: '₽ за изделие' },
      { name: 'Фотообои', note: 'Одно изображение', min: 10000, unit: '₽ за фото' },
    ],
  },
  {
    id: 'floors',
    title: 'Полы',
    href: '/services#floors',
    items: [
      { name: 'Ламинат', min: 700, max: 1200, unit: M2 },
      { name: 'Кварцвинил', min: 1200, max: 2500, unit: M2 },
      { name: 'Керамогранит', min: 3500, max: 12000, unit: M2 },
      { name: 'Линолеум', min: 400, max: 1500, unit: M2 },
    ],
  },
  {
    id: 'screed',
    title: 'Стяжка',
    href: '/services#screed',
    items: [{ name: 'Стяжка пола', note: 'Полусухая, слой до 80 мм', min: 700, from: true, unit: M2 }],
  },
]

export const formatRub = (value: number) => new Intl.NumberFormat('ru-RU').format(Math.round(value))

export function formatPriceItem({ min, max, from }: PriceItem) {
  if (max !== undefined && max !== min) return `${formatRub(min)} – ${formatRub(max)}`
  return from ? `от ${formatRub(min)}` : formatRub(min)
}
