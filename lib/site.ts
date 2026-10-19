export const site = {
  name: 'КВАНТ-СТРОЙ',
  tagline: 'ТЕХНОЛОГИИ И КАЧЕСТВО',
  logo: '/logo.svg',
  phone: '+7 (995) 558-54-44',
  phoneHref: 'tel:+79955585444',
  schedule: 'Ежедневно с 9:00 до 21:00',
  email: 'kvant.stroi.msk@gmail.com',
  address: 'Москва, ул. Пресненская наб., 12',
} as const

export const profiles = [
  { label: 'Профи.ру', href: 'https://profi.ru/profile/AgafonovAV63' },
  { label: 'Авито', href: 'https://www.avito.ru/user/6936681bb81c3d11f709f8e84084cbb5/profile' },
] as const

export const extraWorksNote = 'Сопутствующие работы обговариваются по месту'

export const navLinks = [
  { label: 'Услуги', href: '/services' },
  { label: 'Наши работы', href: '/portfolio' },
  { label: 'Технологии', href: '/technologies' },
  { label: 'Цены и документы', href: '/prices' },
  { label: 'Контакты', href: '/#contacts' },
] as const

export const servicesNav = [
  { label: 'Устройство стяжки пола', href: '/services#screed' },
  { label: 'Напольные покрытия', href: '/services#floors' },
  { label: 'Поклейка обоев', href: '/services#wallpaper' },
  { label: 'Тёплый пол под ключ', href: '/services#screed' },
] as const

export const documents = [
  {
    title: 'Типовой договор',
    description: 'Условия, сроки и гарантийные обязательства',
    file: '#',
    fileName: 'kvant-stroy-dogovor.pdf',
    meta: 'PDF · 240 КБ',
  },
  {
    title: 'Коммерческое предложение',
    description: 'Состав работ и актуальные расценки',
    file: '#',
    fileName: 'kvant-stroy-kp.pdf',
    meta: 'PDF · 1,2 МБ',
  },
  {
    title: 'Презентация компании',
    description: 'Реализованные объекты, парк техники, команда',
    file: '#',
    fileName: 'kvant-stroy-presentation.pdf',
    meta: 'PDF · 4,8 МБ',
  },
] as const
