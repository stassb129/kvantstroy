export type ProjectType = 'floors' | 'wallpaper' | 'screed'

export type GalleryImage = {
  src: string
  alt: string
  caption?: string
}

export type PortfolioProject = {
  id: string
  title: string
  subtitle: string
  area: string
  year: string
  type: ProjectType
  /** Cover image for slides / first gallery frame. */
  image: string
  /** Extra photos shown in the project modal slider. */
  gallery: GalleryImage[]
  description: string
  details: string[]
  tone: string
}

const u = (id: string, w = 1600) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`

export const portfolioProjects: PortfolioProject[] = [
  {
    id: 'prime-park',
    title: 'СТЯЖКА + ПОЛЫ',
    subtitle: 'ЖК «Прайм Парк»',
    area: '184 м²',
    year: '2025',
    type: 'floors',
    image: u('photo-1616486338812-3dadae4b4ace'),
    gallery: [
      { src: u('photo-1616486338812-3dadae4b4ace'), alt: 'Гостиная после укладки', caption: 'Финишное покрытие' },
      { src: u('photo-1504307651254-35680f356dfd'), alt: 'Стяжка на объекте', caption: 'Устройство стяжки' },
      { src: u('photo-1560185127-6ed189bf02f4'), alt: 'Фактура паркета', caption: 'Деталь покрытия' },
      { src: u('photo-1600607687939-ce8a6c25118c'), alt: 'Интерьер с новым полом', caption: 'Общий вид' },
    ],
    description: 'Выполнены работы по устройству стяжки и укладке паркетной доски.',
    details: [
      'Полусухая стяжка с лазерным контролем',
      'Инженерная доска, масло-воск',
      'Срок работ — 18 дней',
    ],
    tone: 'from-[#2E2E2E] via-[#4A4A4A] to-[#242424]',
  },
  {
    id: 'presnya',
    title: 'ИНЖЕНЕРНАЯ ДОСКА',
    subtitle: 'Апартаменты на Пресне',
    area: '96 м²',
    year: '2025',
    type: 'floors',
    image: u('photo-1600210492486-724fe5c67fb0'),
    gallery: [
      { src: u('photo-1600210492486-724fe5c67fb0'), alt: 'Светлый пол в апартаментах', caption: 'После сдачи' },
      { src: u('photo-1631679706909-1844bb25fec6'), alt: 'Спальня с доской', caption: 'Спальня' },
      { src: u('photo-1618220179428-22790b461013'), alt: 'Коридор', caption: 'Прихожая' },
      { src: u('photo-1600585154340-be6161a56a0c'), alt: 'Гостиная', caption: 'Дневная зона' },
    ],
    description: 'Укладка инженерной доски с тонировкой под интерьер и плинтусом в цвет.',
    details: [
      'Подготовка основания и подложка',
      'Тонировка в три выкраски',
      'Фиксированная смета без доплат',
    ],
    tone: 'from-[#3A3430] via-[#5A4A3C] to-[#2A2522]',
  },
  {
    id: 'kvant-office',
    title: 'НАЛИВНОЙ ПОЛ',
    subtitle: 'Офис Kvant Group',
    area: '410 м²',
    year: '2024',
    type: 'screed',
    image: u('photo-1497366216548-37526070297c'),
    gallery: [
      { src: u('photo-1497366216548-37526070297c'), alt: 'Офис open-space', caption: 'Open-space' },
      { src: u('photo-1497366811353-6870744d04b9'), alt: 'Переговорная', caption: 'Переговорная' },
      { src: u('photo-1503387762-592deb58ef4e'), alt: 'Этап заливки', caption: 'Процесс' },
      { src: u('photo-1486406146926-c627a92ad1ab'), alt: 'Фасад здания', caption: 'Объект' },
    ],
    description: 'Промышленный наливной пол для open-space с ночным графиком работ.',
    details: [
      'Работы в ночную смену',
      'Сдача на неделю раньше срока',
      'Технадзор на каждой приёмке',
    ],
    tone: 'from-[#282828] via-[#404040] to-[#1F1F1F]',
  },
  {
    id: 'barvikha',
    title: 'МАССИВ ДУБА',
    subtitle: 'Дом в Барвихе',
    area: '320 м²',
    year: '2024',
    type: 'floors',
    image: u('photo-1631679706909-1844bb25fec6'),
    gallery: [
      { src: u('photo-1631679706909-1844bb25fec6'), alt: 'Массив в спальне', caption: 'Спальня' },
      { src: u('photo-1600607687644-c7171b42498f'), alt: 'Гостиная загородного дома', caption: 'Гостиная' },
      { src: u('photo-1560185127-6ed189bf02f4'), alt: 'Фактура дуба', caption: 'Фактура' },
      { src: u('photo-1600566753190-17f0baa2a6c3'), alt: 'Столовая', caption: 'Столовая' },
    ],
    description: 'Массив дуба с индивидуальной тонировкой для загородного дома.',
    details: [
      'Контроль влажности основания',
      'Тонировка под заказ',
      'Гарантия 5 лет на монтаж',
    ],
    tone: 'from-[#332B24] via-[#57453A] to-[#241E19]',
  },
  {
    id: 'simvol',
    title: 'ОБОИ ПОД ПОКРАСКУ',
    subtitle: 'ЖК «Символ»',
    area: '78 м²',
    year: '2024',
    type: 'wallpaper',
    image: u('photo-1618221195710-dd6b41faaea6'),
    gallery: [
      { src: u('photo-1618221195710-dd6b41faaea6'), alt: 'Гостиная со стенами', caption: 'Гостиная' },
      { src: u('photo-1617098900591-3f90913c2c55'), alt: 'Рельефная фактура', caption: 'Фактура' },
      { src: u('photo-1616486338812-3dadae4b4ace'), alt: 'Смежный пол', caption: 'Стык с полом' },
      { src: u('photo-1615529328331-f8917597711f'), alt: 'Коридор', caption: 'Коридор' },
    ],
    description: 'Подготовка стен Q4 и поклейка обоев под покраску без видимых стыков.',
    details: [
      'Шпаклёвка Q3–Q4',
      'Стеклохолст под покраску',
      'Допуск по стыкам до 0,3 мм',
    ],
    tone: 'from-[#2C2C2C] via-[#464646] to-[#222222]',
  },
  {
    id: 'veranda',
    title: 'ТЁПЛЫЙ ПОЛ ПОД КЛЮЧ',
    subtitle: 'Ресторан «Веранда»',
    area: '215 м²',
    year: '2023',
    type: 'screed',
    image: u('photo-1504307651254-35680f356dfd'),
    gallery: [
      { src: u('photo-1504307651254-35680f356dfd'), alt: 'Монтаж тёплого пола', caption: 'Монтаж' },
      { src: u('photo-1414235077428-338989a2e8c0'), alt: 'Зал ресторана', caption: 'Зал' },
      { src: u('photo-1559339352-11d035aa65de'), alt: 'Зона обслуживания', caption: 'Сервис' },
      { src: u('photo-1517248135467-4c7edcad34c4'), alt: 'Вечерний зал', caption: 'После открытия' },
    ],
    description: 'Стяжка с контуром тёплого пола и финишным покрытием для ресторана.',
    details: [
      'Контур тёплого пола в стяжке',
      'Коммерческое покрытие',
      'Сдача до открытия сезона',
    ],
    tone: 'from-[#352A20] via-[#5C4630] to-[#26201A]',
  },
]

export const typeLabels: Record<ProjectType, string> = {
  floors: 'Напольные покрытия',
  wallpaper: 'Обои',
  screed: 'Стяжка',
}
