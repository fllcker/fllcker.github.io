/* ============================================================================
 *  ВЕСЬ ТЕКСТ И ВСЕ ДАННЫЕ САЙТА ЖИВУТ ЗДЕСЬ.
 *
 *  ⚠  ВСЁ НИЖЕ — ЗАГЛУШКА (PLACEHOLDER). Ни одна цифра, дата, компания,
 *     ссылка и метрика не подтверждены. Ищите пометку PLACEHOLDER и
 *     заменяйте на правду перед тем, как показывать сайт кому-либо.
 *
 *  Как дополнять:
 *    • новый проект   → добавить объект в `projects`, он сам появится
 *                       в индексе, в работах и получит страницу /work/<slug>
 *    • новый блок в проекте → добавить объект в `blocks` этого проекта
 *    • новая технология     → добавить строку в `stack` и проставить `tier`
 *                             (ступени и их определения — в `tiers`)
 *    • новый контакт        → добавить строку в `contacts`
 *  Вёрстку при этом трогать не нужно.
 * ========================================================================= */

export type Locale = 'ru' | 'en';

/** Строка на двух языках. Оба языка обязательны — это не перевод, а контент. */
export type L<T = string> = Record<Locale, T>;

/** Узел схемы архитектуры. Координаты — в клетках сетки, не в пикселях. */
export type SchematicNode = {
  id: string;
  label: string;
  note?: string;
  x: number;
  y: number;
  w?: number;
  /** Единственный узел, который несёт смысл всей схемы. Рисуется белым. */
  emphasis?: boolean;
};

export type SchematicEdge = {
  from: string;
  to: string;
  label?: string;
  /** Пунктир — для асинхронных и фоновых связей. */
  async?: boolean;
};

export type Schematic = {
  cols: number;
  rows: number;
  nodes: SchematicNode[];
  edges: SchematicEdge[];
};

export type Block =
  | { kind: 'prose'; heading: L; body: L<string[]> }
  | { kind: 'points'; heading: L; items: { term: L; body: L }[] }
  | { kind: 'figures'; heading: L; items: { value: string; label: L }[] }
  | { kind: 'schematic'; heading: L; schematic: Schematic; caption: L };

export type Project = {
  slug: string;
  /** Номер в коллекции. Это идентификатор работы, а не декоративная нумерация. */
  code: string;
  name: string;
  period: string;
  role: L;
  stack: string[];
  /** Одна строка для индекса. Держите её короткой в обоих языках. */
  summary: L;
  /** Абзац для главной. Два-три предложения. */
  lede: L;
  links: { label: string; href: string }[];
  blocks: Block[];
};

/* -------------------------------------------------------------------------- */
/*  Кто                                                                        */
/* -------------------------------------------------------------------------- */

export const identity = {
  handle: 'fllcker',
  /** Строка состава — как на лейбле одежды. Читается в первом экране. */
  composition: {
    ru: ['Бэкенд-инженер', 'Go', 'Распределённые системы'],
    en: ['Backend engineer', 'Go', 'Distributed systems'],
  } satisfies L<string[]>,
  /* PLACEHOLDER — статус занятости */
  availability: {
    ru: 'Открыт к предложениям',
    en: 'Open to offers',
  } satisfies L,
  /* PLACEHOLDER — город и часовой пояс */
  location: {
    ru: 'Удалённо · UTC+3',
    en: 'Remote · UTC+3',
  } satisfies L,
  /* PLACEHOLDER — год начала работы */
  since: '2019',
};

export const intro: L<string[]> = {
  ru: [
    'Пишу серверную часть на Go: подписки, доставка видео, деньги и всё, что должно продолжать работать в три часа ночи.',
    'Работ здесь две, и это честное число. Обе я вёл от пустого репозитория до продакшена и в обеих отвечал за бэкенд и инфраструктуру один — поэтому про каждую есть что рассказать глубже одной строчки.',
  ],
  en: [
    'I write server-side Go: subscriptions, video delivery, money, and everything that has to keep working at three in the morning.',
    'There are two projects here, and that is the honest number. I took both from an empty repository to production and was the only person answering for backend and infrastructure in each — which is why every one of them has more to say than a single line.',
  ],
};

/* -------------------------------------------------------------------------- */
/*  Работы                                                                     */
/*  PLACEHOLDER — названия, даты, метрики и ссылки вымышленные.                */
/* -------------------------------------------------------------------------- */

export const projects: Project[] = [
  {
    slug: 'anitype',
    code: '01',
    name: 'AniType',
    period: '2023—2026',
    role: {
      ru: 'Основной разработчик: бэкенд, инфраструктура, видеопайплайн',
      en: 'Lead developer: backend, infrastructure, video pipeline',
    },
    stack: ['Go', 'PostgreSQL', 'Redis', 'NestJS', 'Docker', 'Kubernetes', 'Elasticsearch'],
    summary: {
      ru: 'Стриминговый сервис: 990К аккаунтов, свой CDN и API-шлюз',
      en: 'Streaming service: 990K accounts, in-house CDN and API gateway',
    },
    lede: {
      ru: 'Сервис для просмотра аниме, где платной частью стал AI-апскейл до 4K. Около тридцати микросервисов на Go и NestJS, собственный API-шлюз, свои кеш-серверы и видеопайплайн. За три года — 990 тысяч зарегистрированных аккаунтов и 40 терабайт видео в хранилищах.',
      en: 'An anime streaming service where the paid product was AI upscaling to 4K. Around thirty microservices in Go and NestJS, an in-house API gateway, our own cache servers and video pipeline. Over three years it reached 990 thousand registered accounts and 40 terabytes of video in storage.',
    },
    /* Ссылки появятся, когда из публичных репозиториев будут вычищены
     * рабочие секреты и адреса серверов. */
    links: [],
    blocks: [
      {
        kind: 'prose',
        heading: { ru: 'Задача', en: 'The problem' },
        body: {
          ru: [
            'Проект начинался обычным аниме-сайтом и приносил тысяч десять в месяц. Всё изменил AI-апскейл: 4K стал тем, за что люди платили подписку, и одновременно тем, что упёрлось в единственный ресурс, который нельзя докупить по щелчку, — интернет-канал серверов с хранилищем.',
            'Сорок терабайт видео, до трёх тысяч одновременных зрителей на пике и подписка в двести рублей, из которой нужно было оплатить раздачу. Cloudflare, закрывавший часть трафика бесплатно, стал недоступен части пользователей в России — и бесплатный CDN, и защита серверов пропали одновременно.',
            'Дальше три года работы сводились к одному вопросу: как доставить тяжёлое видео большему числу людей, не упершись в канал и не разорившись на трафике.',
            'Отдельный контекст: проект начат в семнадцать лет. В восемнадцать я оформил ИП, подключил эквайринг и перевёл приём платежей в белую — с вебхуками, подтверждением оплаты и возвратами. Решения по бэкенду и инфраструктуре все три года принимал один человек.',
          ],
          en: [
            'It started as an ordinary anime site making about ten thousand roubles a month. AI upscaling changed that: 4K became the thing people paid a subscription for, and at the same time the thing that ran into the one resource you cannot simply buy more of — the network capacity of the storage servers.',
            'Forty terabytes of video, up to three thousand concurrent viewers at peak, and a subscription of two hundred roubles that had to cover delivery. Cloudflare, which had been absorbing part of the traffic for free, became unreachable for many users in Russia — the free CDN and the origin protection disappeared at the same moment.',
            'Three years of work after that came down to a single question: how to deliver heavy video to more people without saturating the channel or going broke on bandwidth.',
            'Some context: I started the project at seventeen. At eighteen I registered a sole proprietorship, connected acquiring and moved payments onto a proper legal footing — webhooks, payment confirmation, refunds. For all three years, every backend and infrastructure decision was made by one person.',
          ],
        },
      },
      {
        kind: 'schematic',
        heading: { ru: 'Как устроено', en: 'How it works' },
        caption: {
          ru: 'Два независимых пути от одного клиента. Обычные запросы идут через шлюз, который знает топологию из базы. Видео шлюза не касается: плеер обращается к кеш-ноде напрямую, и до хранилища доходит только то, чего на ноде нет.',
          en: 'Two independent paths from the same client. Ordinary requests go through the gateway, which reads its topology from a database. Video never touches the gateway: the player talks to a cache node directly, and only what the node is missing ever reaches storage.',
        },
        schematic: {
          cols: 14,
          rows: 7,
          nodes: [
            /* Верхний ряд — путь видео, нижний — путь API. Клиент стоит между
             * ними именно потому, что обращается в оба, а не в один через другой.
             * cache nodes стоят ровно над microservices: связь «key check» рисуется
             * тогда честной вертикалью, а не коленом с незаметными усиками. */
            { id: 'cdn', label: 'cache nodes', note: 'сегменты на диске', x: 7, y: 0, w: 3, emphasis: true },
            { id: 'origin', label: 'storage', note: '40 TB · HLS', x: 11, y: 0, w: 3 },
            { id: 'client', label: 'clients', note: 'web · mobile · TV', x: 0, y: 3, w: 2 },
            { id: 'gw', label: 'API gateway', note: 'Go · маршруты в БД', x: 3, y: 6, w: 2 },
            { id: 'svc', label: 'microservices', note: 'Go · NestJS · ~30', x: 7, y: 6, w: 3 },
            { id: 'data', label: 'PostgreSQL · Redis', note: 'по инстансу на контур', x: 11, y: 6, w: 2 },
          ],
          edges: [
            { from: 'client', to: 'cdn', label: 'video' },
            { from: 'cdn', to: 'origin', label: 'on miss', async: true },
            { from: 'client', to: 'gw', label: 'api' },
            { from: 'gw', to: 'svc', label: 'prefix' },
            { from: 'svc', to: 'data', label: 'query' },
            { from: 'cdn', to: 'svc', label: 'key check', async: true },
          ],
        },
      },
      {
        kind: 'points',
        heading: { ru: 'Решения, которые определили систему', en: 'Decisions that shaped it' },
        items: [
          {
            term: {
              ru: 'Свой CDN — после того, как посчитал чужие',
              en: 'Our own CDN, after doing the maths on the alternatives',
            },
            body: {
              ru: 'Сначала отвалился Cloudflare, до этого бесплатно закрывавший часть трафика. Потом был месяц на коммерческих CDN — Selectel и Yandex Cloud: они работали, но при наших объёмах стоили больше, чем приносила подписка. Своё появилось только после этого счёта. Между зрителем и хранилищем встали кеш-ноды: сегмент отдаётся клиенту и параллельно ложится на диск ноды, а до хранилища доходит только первый запрос. Географии эта система не решала — задача была ровно одна, разгрузить канал origin. Диск конечный, поэтому срок жизни файла считается от его заполненности: на пустом час, на почти полном десять минут.',
              en: 'First Cloudflare went away, which until then had been absorbing part of the traffic for free. Then came a month on commercial CDNs — Selectel and Yandex Cloud: they worked, but at our volumes they cost more than the subscription brought in. Building our own came only after that arithmetic. Cache nodes went between the viewer and storage: a segment is served to the client and written to the node\'s disk in parallel, so only the first request ever reaches the origin. It solved nothing about geography — the goal was exactly one thing, taking load off the origin channel. Disk is finite, so a file\'s lifetime is derived from how full it is: an hour on an empty disk, ten minutes on a nearly full one.',
            },
          },
          {
            term: {
              ru: 'Шлюз хранит топологию в базе, а не в конфиге',
              en: 'The gateway keeps its topology in a database, not a config',
            },
            body: {
              ru: 'Собственный шлюз на Go маршрутизирует по первому сегменту пути, а карту «префикс — адреса реплик» читает из таблицы и перечитывает на ходу. Добавить сервис или реплику — это строка в базе, без пересборки и рестарта. Отдельный цикл раз в пятьдесят секунд опрашивает реплики и пишет статус туда же, откуда берётся маршрут: мёртвая реплика перестаёт участвовать в балансировке, а статусы отдаются наружу как страница состояния.',
              en: 'A gateway written in Go routes by the first path segment and reads the map of prefix to replica addresses from a table, refreshing it while running. Adding a service or a replica is a row in the database — no rebuild, no restart. A separate loop polls the replicas every fifty seconds and writes their status back to the same table the route comes from: a dead replica drops out of balancing, and the statuses are served as a public status page.',
            },
          },
          {
            term: {
              ru: 'Базы разделены по горячести пути, а не по доменам',
              en: 'Databases were split by how hot the path is, not by domain',
            },
            body: {
              ru: 'Сначала все сервисы жили в одном PostgreSQL, каждый со своей базой внутри. Когда этого перестало хватать, отдельные инстансы получили четыре: пользователи, каталог, эпизоды и видеосервис. Выбор был не по красоте границ, а по нагрузке: каталог постоянно парсит обновления со сторонних API, а эпизоды принимают запись прогресса просмотра каждые десять секунд от каждого зрителя — восемь миллионов строк «пользователь, серия, озвучка, секунда» к сегодняшнему дню.',
              en: 'At first every service lived in one PostgreSQL, each with its own database inside it. When that stopped being enough, four of them got their own instances: users, catalogue, episodes and the video service. The split was not about clean boundaries but about load: the catalogue constantly parses updates from third-party APIs, and episodes take a progress write every ten seconds from every viewer — eight million rows of “user, episode, dub, second” by today.',
            },
          },
          {
            term: {
              ru: 'Доступ к видео — по короткому токену, а не по JWT',
              en: 'Video access runs on a short token, not a JWT',
            },
            body: {
              ru: 'Класть пользовательский JWT в ссылку на видео не хотелось: она уходит в плеер, в историю браузера и целиком попадает в чужие руки вместе с доступом ко всему аккаунту. Вместо этого видеосервис выдаёт короткий токен, привязанный к пользователю; кеш-нода достаёт его из ссылки, спрашивает видеосервис и держит ответ в Redis. На том же токене считается трафик: больше двухсот мегабайт в минуту — временный бан, чтобы один скрипт не занял канал целиком.',
              en: 'Putting a user JWT into a video link was not an option: the link travels to the player, into browser history, and hands over the whole account if it leaks. Instead the video service issues a short token bound to the user; the cache node pulls it out of the link, asks the video service about it and keeps the answer in Redis. Traffic is metered on that same token: more than two hundred megabytes a minute earns a temporary ban, so one script cannot take the whole channel.',
            },
          },
          {
            term: {
              ru: 'Автовыбор качества — рядом с ручным, а не вместо него',
              en: 'Automatic quality next to the manual choice, not instead of it',
            },
            body: {
              ru: 'Мастер-плейлист собирается на лету из переданных вариантов, с объявленным битрейтом и разрешением для каждого — от 360p при 650 Кбит/с до 2160p при 16 Мбит/с. Ручной выбор качества при этом остался: зритель по-прежнему ставит нужное сам, а «Авто» — отдельный режим, в котором плеер держит то, что тянет канал. Все прежние приёмы уменьшали число обращений к хранилищу; этот уменьшает сам объём, доходящий до зрителя, — у тех, кто выбор плееру отдал.',
              en: 'The master playlist is assembled on the fly from the variants passed in, each with a declared bandwidth and resolution — from 360p at 650 Kbps to 2160p at 16 Mbps. Manual quality selection stayed where it was: the viewer still picks a level directly, and Auto is a separate mode where the player holds whatever the connection sustains. Every earlier technique reduced the number of trips to storage; this one reduces the volume that reaches the viewer at all — for those who hand the choice to the player.',
            },
          },
        ],
      },
      {
        kind: 'figures',
        heading: { ru: 'Чем закончилось', en: 'Where it landed' },
        items: [
          { value: '990K', label: { ru: 'зарегистрированных аккаунтов', en: 'registered accounts' } },
          { value: '40 TB', label: { ru: 'видео в хранилищах', en: 'of video in storage' } },
          { value: '3K+', label: { ru: 'одновременных зрителей на пике', en: 'concurrent viewers at peak' } },
        ],
      },
      {
        kind: 'prose',
        heading: { ru: 'Что бы сделал иначе', en: 'What I would do differently' },
        body: {
          ru: [
            'Измерялось ровно одно — онлайн. Живое число зрителей считалось по открытым WebSocket-сессиям, срезы складывались в базу, и цифра пика взята оттуда. А инженерных метрик не было ни одной: ни попаданий в кеш, ни времени ответа, ни нагрузки на базы, ни алертов. Поэтому про эффект половины оптимизаций я честно могу говорить только оценочно. Сегодня я начал бы с измерения того, что собираюсь оптимизировать: без цифр не отличить решение, которое помогло, от решения, которое просто добавило кода.',
            'При превышении лимита трафика сервер отдавал 429 не сразу, а после двадцатисекундной паузы — я хотел, чтобы для скрапера это выглядело поломкой, а не лимитом. Приём сомнительный: он удерживает соединение и горутину ровно в тот момент, когда сервер и без того под нагрузкой.',
            'Кеш-ноды с дисками по восемьдесят гигабайт — решение от бюджета, а не от задачи. У конкурентов кеш-слой был устроен как частичная реплика хранилища: несколько серверов по паре терабайт, перекрывающих архив с запасом. Это заметно дороже и снимает с хранилища заметно больше.',
          ],
          en: [
            'Exactly one thing was measured: concurrency. The live number of viewers was counted from open WebSocket sessions, snapshots were written to the database, and the peak figure comes from there. Engineering metrics did not exist at all: no cache hit rate, no response times, no database load, no alerts. So I can only speak about the effect of half these optimisations as an estimate. Today I would start by measuring the thing I intend to optimise: without numbers there is no telling a change that helped from a change that merely added code.',
            'When the traffic limit was exceeded, the server did not return 429 straight away but waited twenty seconds first — I wanted it to look like a malfunction to a scraper rather than a limit. The trick is questionable: it holds a connection and a goroutine open at exactly the moment the server is already under load.',
            'Cache nodes with eighty-gigabyte disks were a decision made by the budget, not by the problem. Competitors ran their cache layer as a partial replica of storage: several servers of a couple of terabytes each, covering the archive with room to spare. That costs noticeably more and takes noticeably more off the origin.',
          ],
        },
      },
    ],
  },
  {
    slug: 'magix-vpn',
    code: '02',
    name: 'Magix VPN',
    period: '2026 — настоящее время',
    role: {
      ru: 'Автор и разработчик бэкенда',
      en: 'Author and backend developer',
    },
    stack: ['Go', 'PostgreSQL', 'Redis', 'gRPC', 'RabbitMQ', 'Xray', 'Docker'],
    summary: {
      ru: 'VPN по подписке: четыре сервиса, события, детект шаринга',
      en: 'Subscription VPN: four services, events, sharing detection',
    },
    lede: {
      ru: 'VPN-сервис с продажей доступа по подписке через Telegram-бота. Четыре сервиса на Go, разделённые по домену: пользователи и подписки, VPN-серверы и устройства, платежи и кошелёк, бот. Синхронное общение по gRPC, асинхронное — через RabbitMQ с outbox, доступ на нодах выдаётся управлением Xray по его API.',
      en: 'A VPN service selling subscription access through a Telegram bot. Four Go services split by domain: users and subscriptions, VPN servers and devices, payments and wallet, and the bot. Synchronous calls over gRPC, asynchronous ones over RabbitMQ with an outbox, and access on the nodes granted by driving Xray through its API.',
    },
    links: [],
    blocks: [
      {
        kind: 'prose',
        heading: { ru: 'Задача', en: 'The problem' },
        body: {
          ru: [
            'Продавать доступ по подписке — значит уметь отличать две внешне одинаковые вещи: человека, который включил VPN на телефоне, ноутбуке и планшете, и человека, который раздал свою подписку десяти знакомым. Первого трогать нельзя, второй съедает выручку и канал.',
            'Отличать их приходится по единственному, что видно серверу: набору адресов, с которых пришли подключения. А этот набор врёт. Мобильный оператор меняет клиенту адрес несколько раз за вечер, домашний провайдер выдаёт адрес из общего пула, и одно честное устройство выглядит в логах как небольшая толпа.',
            'Второй проект после AniType я делал уже с оглядкой на то, чему тот научил: домены разделены с самого начала, общение между сервисами описано контрактами, а критичные переходы состояния не теряются при падении соседа.',
            'Проект молодой: три месяца в продакшене и несколько десятков активных подписок. Хвастаться масштабом нечем — зато на такой дистанции хорошо видно, как принимались решения и что из них уже пришлось переделать.',
          ],
          en: [
            'Selling access by subscription means telling apart two things that look identical from outside: a person who turned the VPN on across a phone, a laptop and a tablet, and a person who handed their subscription to ten friends. The first must not be touched; the second eats both revenue and bandwidth.',
            'The only evidence available is the set of addresses the connections came from — and that set lies. A mobile carrier rotates a client address several times an evening, a home ISP hands out addresses from a shared pool, and one honest device shows up in the logs as a small crowd.',
            'This second project was built with what the first one taught: domains separated from the start, contracts between services written down, and critical state transitions that survive a neighbour going down.',
            'The project is young: three months in production and a few dozen active subscriptions. There is no scale to boast about — but at this distance it is easy to see how the decisions were made, and which of them already had to be redone.',
          ],
        },
      },
      {
        kind: 'schematic',
        heading: { ru: 'Как устроено', en: 'How it works' },
        caption: {
          ru: 'Синхронно сервисы разговаривают по gRPC, асинхронно — событиями через RabbitMQ. Подписку активирует один сервис, доступ на нодах выдаёт другой, и связывает их не общий вызов, а событие.',
          en: 'Services talk over gRPC synchronously and by events through RabbitMQ asynchronously. One service activates the subscription, another grants access on the nodes, and what connects them is an event rather than a shared call.',
        },
        schematic: {
          cols: 14,
          rows: 7,
          nodes: [
            { id: 'users', label: 'users-service', note: 'auth · подписки', x: 7, y: 0, w: 3 },
            { id: 'pay', label: 'payments-service', note: 'платежи · кошелёк', x: 11, y: 0, w: 3 },
            { id: 'client', label: 'clients', note: 'Telegram · apps', x: 0, y: 3, w: 2 },
            { id: 'gw', label: 'nginx', note: 'роутинг по префиксу', x: 3, y: 3, w: 2 },
            { id: 'mq', label: 'RabbitMQ', note: 'события · outbox', x: 7, y: 3, w: 3 },
            { id: 'srv', label: 'servers-service', note: 'девайсы · трафик', x: 7, y: 6, w: 3, emphasis: true },
            { id: 'xray', label: 'Xray nodes', note: 'VPN-серверы', x: 11, y: 6, w: 3 },
          ],
          edges: [
            { from: 'client', to: 'gw', label: 'https' },
            { from: 'gw', to: 'users', label: 'auth' },
            { from: 'gw', to: 'srv', label: 'sub' },
            { from: 'pay', to: 'users', label: 'grpc' },
            { from: 'users', to: 'mq', label: 'events', async: true },
            { from: 'mq', to: 'srv', label: 'consume', async: true },
            { from: 'srv', to: 'xray', label: 'add/remove' },
          ],
        },
      },
      {
        kind: 'points',
        heading: { ru: 'Решения, которые определили систему', en: 'Decisions that shaped it' },
        items: [
          {
            term: {
              ru: 'Детект шаринга считает подсети, а не адреса',
              en: 'Sharing detection counts subnets, not addresses',
            },
            body: {
              ru: 'Адреса схлопываются в подсеть — по умолчанию /24 для IPv4 и /64 для IPv6, длина настраивается. Смена адреса внутри пула оператора перестаёт быть вторым «подключением». Группа считается активной, только если хотя бы один её адрес видели в окне активности; в лог детекта пишутся оба числа — сколько групп было активно и сколько адресов вообще отдал Xray. Большой разрыв между ними и есть подпись мобильного оператора.',
              en: 'Addresses collapse into a subnet — by default /24 for IPv4 and /64 for IPv6, with the prefix length configurable. An address change inside a carrier pool stops counting as a second connection. A group counts as active only if at least one of its addresses was seen inside the activity window, and the detection log records both numbers: how many groups were active and how many addresses Xray reported at all. A large gap between them is the signature of a mobile carrier.',
            },
          },
          {
            term: {
              ru: 'Наказание — за устойчивость, а не за всплеск',
              en: 'Punishment follows persistence, not a spike',
            },
            body: {
              ru: 'Одно превышение больше ничего не значит. Каждая выборка с превышением кладёт страйк в отсортированное множество Redis с меткой времени; наказание срабатывает, только когда в скользящем окне набралось нужное их число, и порог задаётся конфигом. Отдельно решён отказ: если Redis недоступен и счётчик страйков недостижим, система намеренно не наказывает никого — отличить устойчивое превышение от единичного в этот момент нечем.',
              en: 'A single excess no longer means anything. Every sample over the limit adds a strike to a sorted set in Redis with a timestamp; enforcement fires only once enough strikes accumulate inside a sliding window, and the threshold is configurable. Failure is handled deliberately: if Redis is unreachable and the strike counter cannot be read, the system punishes nobody — at that moment there is no way to tell sustained abuse from a one-off spike.',
            },
          },
          {
            term: {
              ru: 'Xray по его API, а не через готовую панель',
              en: 'Xray through its own API, not a ready-made panel',
            },
            body: {
              ru: 'Панели вроде remnawave я на старте не смотрел вовсе: хотел разобраться уровнем ниже и иметь доступ ко всему, а не к тому, что панель решила отдать наружу. Изучил их уже потом — и выбор подтвердился на конкретном примере. Детект шаринга в панели опирается на HWID устройства, а HWID присылает сам клиент: я собрал свой и отправил произвольный. Признак, который подделывается за вечер, защитой считаться не может — поэтому счёт идёт по адресам, которые видит сервер, а не по тому, что о себе сообщил клиент.',
              en: 'I did not look at panels like remnawave at the start at all: I wanted to work a level lower and have access to everything, not to whatever the panel chose to expose. I studied them later — and the choice held up on a concrete example. Sharing detection in a panel rests on the device HWID, and the HWID is sent by the client itself: I built my own client and sent an arbitrary one. A signal that can be forged in an evening cannot count as protection — so the count runs on addresses the server observes, not on what the client says about itself.',
            },
          },
          {
            term: {
              ru: 'Несколько способов подключения в одной подписке',
              en: 'Several connection types in a single subscription',
            },
            body: {
              ru: 'Один протокол в России живёт до ближайшей волны блокировок, поэтому в подписку кладутся сразу несколько: VLESS поверх TCP с Reality, VLESS поверх XHTTP с Reality и Hysteria2. Выбор оставлен человеку — клиент показывает список, и когда один способ перестаёт работать, пользователь переключается сам, не дожидаясь, пока это заметят. Параметры инбаунда — fingerprint, ALPN, транспорт, маршрутизация — вынесены в настройки и правятся без релиза; сам конфиг ноды пока правится руками, и это ближайшее, что стоит перенести в админку.',
              en: 'A single protocol in Russia survives until the next wave of blocking, so a subscription carries several at once: VLESS over TCP with Reality, VLESS over XHTTP with Reality, and Hysteria2. The choice is left to the person — the client shows the list, and when one method stops working the user switches without waiting for anyone to notice. Inbound parameters — fingerprint, ALPN, transport, routing — live in settings and change without a release; the node config itself is still edited by hand, and that is the nearest thing worth moving into the admin panel.',
            },
          },
          {
            term: {
              ru: 'Подписка и доступ живут в разных сервисах и связаны событием',
              en: 'Subscription and access live in different services, joined by an event',
            },
            body: {
              ru: 'Оплата активирует подписку в одном сервисе, а ключи на VPN-нодах выдаёт другой. Прямого вызова между ними нет: users-service публикует событие через outbox, servers-service его потребляет и приводит ноды в нужное состояние. Падение сервиса серверов в момент оплаты не оставляет пользователя без доступа — событие дождётся его в очереди. Отдельная фоновая задача добирает подписки, застрявшие между состояниями.',
              en: 'Payment activates a subscription in one service, while another hands out keys on the VPN nodes. There is no direct call between them: users-service publishes an event through an outbox, servers-service consumes it and brings the nodes to the required state. The servers service being down at the moment of payment does not leave the user without access — the event waits in the queue. A separate background job picks up subscriptions stuck between states.',
            },
          },
          {
            term: {
              ru: 'Платёжные провайдеры настраиваются, а не вкомпиливаются',
              en: 'Payment providers are configured, not compiled in',
            },
            body: {
              ru: 'Провайдеров несколько, и появляются они быстрее, чем выходят релизы: их конфигурация лежит в базе и правится из админки, а список доступных способов оплаты бот запрашивает у сервиса платежей на лету. Рядом — кошелёк с журналом проводок, блокировками средств и заявками на вывод, потому что реферальные выплаты и возвраты иначе превращаются в ручную сверку.',
              en: 'There are several providers, and they appear faster than releases ship: their configuration lives in the database and is edited from the admin panel, while the bot asks the payments service for the list of available methods on the fly. Alongside sits a wallet with a ledger of entries, fund locks and withdrawal requests — otherwise referral payouts and refunds turn into manual reconciliation.',
            },
          },
        ],
      },
      {
        kind: 'prose',
        heading: { ru: 'Три поколения одного детектора', en: 'Three generations of one detector' },
        body: {
          ru: [
            'Первая версия молча не работала. Счётчик подключений брался из Xray вызовом QueryStats, а тот обходит только счётчики трафика и до карты онлайна не достаёт — поэтому число подключений всегда выходило нулевым, и детект не срабатывал ни разу. Нашлось это не по жалобе и не по алерту, а при разборе того, почему в админке пусто.',
            'Вторая версия работала слишком хорошо. Она сравнивала сырое число адресов из Xray с лимитом устройства и при первом же превышении удаляла устройство. Для домашнего интернета это было терпимо, для мобильного — нет: оператор менял адрес, счёт рос, и человек лишался доступа, ничего не нарушив.',
            'Третья версия — та, что описана выше: подсети вместо адресов, окно активности, страйки в скользящем окне, настраиваемые пороги и намеренный отказ наказывать при недоступном Redis. Вместе с ней в проект пришли тесты именно на этот сценарий: около четырёхсот строк проверок на то, что честное устройство с прыгающим адресом не считается нарушителем.',
          ],
          en: [
            'The first version quietly did nothing. The connection count came from Xray via QueryStats, which only walks traffic counters and never reaches the online map — so the count was always zero and the detector never fired once. It surfaced not through a complaint or an alert, but while working out why the admin panel was empty.',
            'The second version worked too well. It compared the raw number of addresses from Xray against the device limit and removed the device on the very first excess. For home connections that was tolerable; for mobile it was not — the carrier rotated the address, the count grew, and a person lost access without doing anything wrong.',
            'The third version is the one described above: subnets instead of addresses, an activity window, strikes in a sliding window, configurable thresholds, and a deliberate refusal to punish while Redis is unreachable. It arrived together with tests for exactly this scenario — some four hundred lines checking that an honest device on a rotating address is not treated as an offender.',
          ],
        },
      },
    ],
  },
];

/* -------------------------------------------------------------------------- */
/*  Стек                                                                       */
/*                                                                             */
/*  Ступень — это глубина участия, а не самооценка «уровня владения».          */
/*  Три ступени, а не пять и не проценты: границу между «4» и «5» объяснить    */
/*  на собеседовании нельзя, а границу между «ядром» и «прикладным» — можно,   */
/*  и она проверяется вопросом. Ступень рисуется кеглем и подписывается        */
/*  словом; цифр и полосок прогресса на странице нет намеренно.                */
/* -------------------------------------------------------------------------- */

export type Tier = 'core' | 'working' | 'applied';

/** Порядок здесь задаёт и порядок легенды, и порядок сортировки списка. */
export const tiers: { id: Tier; name: L; gloss: L }[] = [
  {
    id: 'core',
    name: { ru: 'Ядро', en: 'Core' },
    gloss: {
      ru: 'Пишу каждый день, отвечаю за решения в архитектуре',
      en: 'Daily work; I own the architectural decisions',
    },
  },
  {
    id: 'working',
    name: { ru: 'В работе', en: 'Working' },
    gloss: {
      ru: 'Регулярно в проде, типовые задачи закрываю сам',
      en: 'Regularly in production; I close the usual tasks alone',
    },
  },
  {
    id: 'applied',
    name: { ru: 'Прикладное', en: 'Applied' },
    gloss: {
      ru: 'Брал под задачу, разберусь, когда понадобится снова',
      en: 'Picked up for a task; I can get back up to speed',
    },
  },
];

export type StackEntry = { name: string; tier: Tier; note: L };

export const stack: StackEntry[] = [
  {
    name: 'Go',
    tier: 'core',
    note: { ru: 'основной язык', en: 'primary language' },
  },
  {
    name: 'PostgreSQL',
    tier: 'core',
    note: { ru: 'схемы, запросы, разделение нагрузки', en: 'schemas, queries, load splitting' },
  },
  {
    name: 'Redis',
    tier: 'core',
    note: { ru: 'кеш, счётчики, лимиты', en: 'cache, counters, limits' },
  },
  {
    name: 'gRPC',
    tier: 'working',
    note: { ru: 'контракты между сервисами', en: 'contracts between services' },
  },
  {
    name: 'RabbitMQ',
    tier: 'working',
    note: { ru: 'события и outbox', en: 'events and outbox' },
  },
  {
    name: 'NestJS',
    tier: 'working',
    note: { ru: 'половина сервисов', en: 'half of the services' },
  },
  {
    name: 'Docker',
    tier: 'working',
    note: { ru: 'сборка и деплой', en: 'builds and deploys' },
  },
  {
    name: 'Nginx',
    tier: 'working',
    note: { ru: 'фронт, TLS, лимиты', en: 'edge, TLS, limits' },
  },
  {
    name: 'Kubernetes',
    tier: 'applied',
    note: { ru: 'реплики важных сервисов', en: 'replicas of the hot services' },
  },
  {
    name: 'Elasticsearch',
    tier: 'applied',
    note: { ru: 'поиск по каталогу', en: 'catalogue search' },
  },
];

/* -------------------------------------------------------------------------- */
/*  Контакты                                                                   */
/*  PLACEHOLDER — ни один адрес не настоящий.                                  */
/* -------------------------------------------------------------------------- */

export const contacts = [
  { label: 'Email', value: 'hey@fllcker.dev', href: 'mailto:hey@fllcker.dev' },
  { label: 'Telegram', value: '@fllcker', href: 'https://t.me/fllcker' },
  { label: 'GitHub', value: 'github.com/fllcker', href: 'https://github.com/fllcker' },
];

/* -------------------------------------------------------------------------- */
/*  Интерфейсные строки                                                        */
/* -------------------------------------------------------------------------- */

export const ui = {
  index: { ru: 'Индекс', en: 'Index' },
  work: { ru: 'Работы', en: 'Work' },
  about: { ru: 'О себе', en: 'About' },
  stack: { ru: 'Стек', en: 'Stack' },
  /* Оговорка стоит у самого списка: без неё разный кегль читается как
   * декоративная иерархия, а не как заявление, за которое надо отвечать. */
  stackScale: {
    ru: 'Глубина участия, не самооценка',
    en: 'Depth of involvement, not self-rating',
  },
  contact: { ru: 'Связаться', en: 'Contact' },
  role: { ru: 'Роль', en: 'Role' },
  period: { ru: 'Период', en: 'Period' },
  readMore: { ru: 'Смотреть работу', en: 'View work' },
  backToIndex: { ru: 'В индекс', en: 'Back to index' },
  nextWork: { ru: 'Следующая работа', en: 'Next work' },
  notFound: { ru: 'Такой страницы нет', en: 'No such page' },
  notFoundBody: {
    ru: 'Возможно, ссылка устарела. Индекс работ на месте.',
    en: 'The link may be stale. The index of work is where it always was.',
  },
  placeholderNotice: {
    ru: 'Черновик: содержание временное',
    en: 'Draft: placeholder content',
  },
  /* Отдельная пометка для блоков с цифрами. Общая приписка в подвале не
   * работает: число выглядит как проверяемый факт ровно в той точке, где
   * его читают, поэтому оговорка обязана стоять рядом с ним. */
  placeholderFigures: {
    ru: 'Цифры вымышлены — черновик',
    en: 'Invented figures — draft',
  },
} satisfies Record<string, L>;

/**
 * Сколько последних работ показывать на главной целиком.
 * Остальные уходят в компактные строки индекса — вся глубина у них уже есть
 * на собственных страницах /work/<slug>. Без этого правила страница растёт
 * примерно на 2200px за проект, и на восьми работах «Стек» и «Связаться»
 * уезжают за 15000px.
 */
export const featuredCount = 3;
