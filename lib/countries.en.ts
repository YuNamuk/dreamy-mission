/**
 * 6개국 시드의 영어 번역 오버레이(부분값). lib/content.ts 가 locale=en 일 때 덮어쓴다.
 * 여기 없는 값은 ko(시드)로 폴백. mn·km·id 등은 같은 구조로 파일을 추가하면 된다.
 */
import type { Country } from './countries';
import type { Locale } from './i18n';

type CountryI18n = Partial<Pick<Country,
  'capital' | 'pop' | 'area' | 'religion' | 'language' | 'government' | 'currency' | 'climate' | 'timezone' | 'intro'>> & {
  themes?: { t?: string; d?: string }[];
  timeline?: { items?: string[] }[];
};

const EN: Record<string, CountryI18n> = {
  mongolia: {
    capital: 'Ulaanbaatar',
    pop: '3.54 million',
    area: '1.564 million ㎢ · 7.1× the Korean Peninsula',
    religion: 'Buddhism (Lamaism) 51.7% · none 40.6% · Islam 3.2% · Christian 1.3%',
    language: 'Mongolian',
    government: 'Semi-presidential republic',
    currency: 'Tögrög (MNT)',
    climate: 'Continental arid · harsh winters',
    timezone: '1 hour behind Korea',
    intro: 'A vast landlocked nation between Russia and China. Dreamy School raises up Mongolian Christian leaders and, by the principle of the public nature of the gospel, supports the growth of public-school education. Through partnership with Bright Future School, the 3P Festival, character-education publishing, local mission, and teacher training, it helps teachers and students grow.',
    themes: [
      { t: '3P EDU Festival', d: 'A project-based education festival that began with five schools in one Ulaanbaatar district and spread nationwide. Students and teachers are invited to share their work and learn from one another — a place of learning, sharing, meeting, and growth that also nurtures a love for creation.' },
      { t: 'Dreamy Teachers Academy', d: 'Teacher training for the growth of public-school education. Each vacation, learner-centered methods and the use of character-education materials are shared in Ulaanbaatar, and each term Mongolian teachers and students come to Dreamy School to train.' },
      { t: 'Bright Future School · Character Education', d: 'Partnering since 2022 with Mongolia’s first Christian primary–secondary school, founded in 1997. Dreamy’s “forming” course is adapted for Mongolian students into character-education materials, published and shared as Dreamy Books, fostering whole-person growth.' },
      { t: 'Under-served Regions', d: 'Mongolia, seven times the size of the Korean Peninsula, has many regions isolated and cut off from educational and cultural access. Each year Dreamy students visit local schools with character and project education, offering a challenge, and hold gospel camps.' },
    ],
    timeline: [
      { items: ['Confirmed Bright Future School as ministry partner', 'Discussed Bio campground · Bright Future School education cooperation'] },
      { items: ['Sent a teacher family · dispatched 2 graduate interns', 'Online Korean-language education · 3P school modeling'] },
      { items: ['Gospel·Korean camp, sent 3 interns', 'Introduced the “forming” (self-management) course · Ulaanbaatar teacher training'] },
      { items: ['Public-school principals’ training visit (21 schools · 40 people) · ~400 practicing teachers trained', 'Joint 3P Festival of 6 schools · Övs region mission'] },
      { items: ['Cooperation with the Ministry’s teacher-training agency · 16-school 3P Festival (1,200 people)', 'Curriculum MOU with two schools · founded Dreamy Books publishing'] },
      { items: ['Sent 2 interns · 20-school 3P Edu Festival in Ulaanbaatar (1,200 people)', 'Christian leadership education for ~50 · local gospel camp'] },
    ],
  },
  philippines: {
    capital: 'Metro Manila',
    pop: '115.59 million',
    area: '300,000 ㎢ · 1.3× the Korean Peninsula',
    religion: 'Catholic 79% · Protestant 7% · Islam 6%, etc.',
    language: 'Filipino (Tagalog) · English',
    government: 'Presidential republic',
    currency: 'Philippine peso (PHP)',
    climate: 'Tropical monsoon · wet and dry seasons',
    timezone: '1 hour behind Korea',
    intro: 'A land where, amid rapid urbanization and economic disparity, the marginalized have lost their chance to learn through poverty and educational inequality. In San Isidro on the outskirts of Manila, Dreamy School was established, challenging local leaders through educational exchange. It is here that God’s dream began.',
    themes: [
      { t: 'Dreamy School Philippines', d: 'Opened in Montalban, a migrant slum near Manila, the Philippine Dreamy School is a ground of hope raised in a harsh educational environment. Its vision is to provide quality Christian education and nurture the next generation that will lead the Philippines’ future.' },
      { t: 'Labor', d: 'Philippine education mission was shaped by countless hands and drops of sweat. With the support of many organizations, Dreamy School students took part in the construction themselves, refurbishing spaces in need of repair and engraving their love for the Philippines everywhere.' },
      { t: 'Smokey Mountain', d: 'The Ranfil area is a garbage-mountain village formed by the poor forcibly relocated from Manila, cut off from educational opportunity by weak basic infrastructure. Dispatched teachers, together with Dreamy students, enter this barren village to share the chance to learn.' },
      { t: 'Intern Teachers', d: 'Teacher families from Korea’s Dreamy School and graduate intern missionaries are sent to the field to take charge of school operation and education, building a living model of education mission.' },
      { t: 'Our Dream', d: 'Now the students of the Philippine Dreamy School take up the baton of learning and write their own stories with their lives. The dream they dream is a life that joins God’s mission and lives out its calling.' },
    ],
    timeline: [
      { items: ['Teacher training, school construction', 'Curriculum plan (5-No, forming, character education, Korean, electives)', 'August, student education mission'] },
      { items: ['Sent 1 teacher family · 4 graduate intern missionaries', 'Dreamy School Philippines (Junior High School) opened', 'Curriculum exchange · January, student education mission'] },
      { items: ['Sent 3 graduate intern missionaries', 'Developed a 12-year curriculum including high school', 'Teacher training: methods, forming, 5-No, character education · January, student education mission'] },
      { items: ['Sent 2 graduate intern missionaries', 'Dreamy School Philippines (Senior High School) opened', 'Full exchange and visit program with Korea’s Dreamy School · January, student education mission'] },
      { items: ['Sent 3 graduate intern missionaries · ran the Dreamy Edu-Center in term 1', 'Philippine Christian schools joint teacher seminar (150 people)', 'Teacher training: subject redesign and Christian education · January, student education mission'] },
    ],
  },
  cambodia: {
    capital: 'Phnom Penh',
    pop: '18.05 million',
    area: '181,000 ㎢ · 0.8× the Korean Peninsula',
    religion: 'Buddhism 95% · Christian 3% · other 2%',
    language: 'Khmer',
    government: 'Constitutional monarchy',
    currency: 'Riel (KHR) · US dollar widely used',
    climate: 'Tropical monsoon',
    timezone: '2 hours behind Korea',
    intro: 'A land that passed through the brilliant Angkor era of Hinduism and Mahayana Buddhism, settled into Theravada Buddhism, and rose from the religious annihilation of the Killing Fields to rebuild Buddhism as its state religion. Centered on Siem Reap, we build a community where education and healthcare meet, leading healthy families and the next generation to Christ.',
    themes: [
      { t: 'Mustard Seed Primary School', d: 'Started with 7 students in Siem Reap in 2009, now some 90 students across six classes in grades 1–6. Through reading classes, Bible camps, Book Fest, and Korean-culture camps with graduates, it helps children imagine their own future.' },
      { t: 'Kindergarten Ministry', d: 'Five kindergartens under the Cambodia branch of NIBCM (Shalom·Kontrak·Rainbow·Kompong Thom annex·Dream Vill workers’ children). With clay, colored pencils, and stickers, children enjoy art activities rarely available — the moments when Dreamy students laugh the most.' },
      { t: 'NIBI', d: 'An institution (founded 2008, Siem Reap) that raises next-generation leaders and kindergarten teachers to serve Southeast Asian Christian communities. After 2 years of basic training, students prepare their path by calling, with hope of forming a youth network across the Indochina peninsula.' },
      { t: 'Dream Vill Project', d: 'A mixed community complex centered on “education” and “healthcare,” led by NIBC. It offers a model where a church-centered community center healthily runs 1,800 households, and builds an international K–12 school within the complex (groundbreaking 2024 – phased completion 2028).' },
    ],
    timeline: [
      { items: ['Began partnership with NIBC · visited Vietnam HQ and Siem Reap field', 'Conceived the town project and began cooperation'] },
      { items: ['Siem Reap town design and groundbreaking', 'Education-mission cooperation · May, student education mission'] },
      { items: ['May, student education mission'] },
      { items: ['School-founding preparation · Dreamy Teacher Academy training (September)', 'School-founding seminar · May, student education mission'] },
      { items: ['Town and school open', 'Town sales and phased school opening'] },
    ],
  },
  indonesia: {
    capital: 'Jakarta',
    pop: '287.2 million',
    area: '1.917 million ㎢ · about 9× the Korean Peninsula',
    religion: 'Islam 87% · Protestant 7% · Catholic 3% · Hindu 2% · Buddhist 1%',
    language: 'Indonesian',
    government: 'Presidential republic',
    currency: 'Rupiah (IDR)',
    climate: 'Tropical rainforest',
    timezone: '2 hours behind Korea (Jakarta)',
    intro: 'A multi-ethnic, multi-religious nation of 280 million. Jakarta’s JIU and CGA raise the next generation with a Christian worldview. Dreamy School shares an educational philosophy and broadens the horizon of education mission through teacher and student exchange.',
    themes: [
      { t: 'JIU & CGA', d: 'Jakarta’s JIU (university) and CGA (a grade 1–12 Christian school) raise the next generation with a Christian worldview. In Danvit Hall, completed with Atomy’s support, a “Dreamy Library” was created as a space of learning and exchange where primary, secondary, and university students gather.' },
      { t: 'Meeting, Relationship', d: 'Dreamy School shares an educational philosophy with the two institutions and broadens mission through student and teacher exchange. After the first meeting in 2024, 26 CGA teachers visited Korea, and Dreamy students visit CGA for after-school programs and the Academic Festival.' },
      { t: 'Serving Together', d: 'Dreamy students and CGA grade-12 students run camps together for Indonesian children, serving the community. They share learning and love with neighbors beyond the classroom.' },
      { t: 'Toward the Same Place', d: 'CGA students and teachers join Korea’s DIF (Dreamy International Festival), sharing projects with Philippine and Mongolian students. The two schools press on toward a vision of building God’s kingdom together.' },
    ],
    timeline: [
      { items: ['Formed the founding committee of Jakarta International University (JIU)'] },
      { items: ['Founded Cornerstone Global Academy (CGA), a Christian primary–secondary school'] },
      { items: ['Completed the main building of the K-Eduplex campus'] },
      { items: ['JIU opening and matriculation · founded MCLC kindergarten'] },
      { items: ['JIU promoted to a full university (3 colleges · 6 departments) · 1st graduation'] },
      { items: ['First Dreamy–CGA meeting · 26 teachers visited Korea (training·vision trip)', 'Dreamy Foundation gifted $400k to CGA ministry'] },
      { items: ['May, student education mission · gifted $1M for CGA dormitory construction', 'December, CGA students and teachers joined DIF'] },
      { items: ['May, student education mission · children’s camp'] },
    ],
  },
  india: {
    capital: 'New Delhi',
    pop: 'about 1.43 billion',
    area: '3.28 million ㎢ · about 15× the Korean Peninsula',
    religion: 'Hindu 79.8% · Islam 14.2% · Christian 2.3%, etc.',
    language: 'Hindi · English, etc. (22 official languages)',
    government: 'Parliamentary federal republic',
    currency: 'Indian rupee (INR)',
    climate: 'Tropical monsoon · large regional variation',
    timezone: '3 hours 30 minutes behind Korea',
    intro: 'A vast subcontinent of many gods and many tongues. Dreamy schools established in Bangalore, Nagaland, and Manipur become a home of learning for orphaned and marginalized children.',
    themes: [
      { t: 'Dreamy School · Bangalore', d: 'Opened in 2019. A Dreamy School teacher serves on dispatch, and two local Indian teachers work in Korea, exchanging education.' },
      { t: 'Little Flower School · Nagaland', d: 'A Nagaland school founded in 2006. 643 students, 18 teachers. A dormitory for orphans, a futsal court, and equipment were supported.' },
      { t: 'Dreamy International · Manipur', d: 'Opened in 2024. A new ground of learning with 286 students and 17 teachers.' },
    ],
    timeline: [
      { items: ['Founded Nagaland Little Flower Dreamy School (643 students · 18 teachers)'] },
      { items: ['Dreamy School (Bangalore) opened', 'Dreamy teacher dispatched · 2 local teachers working in Korea'] },
      { items: ['Built an orphans’ dormitory at Little Flower School · supported futsal court and equipment'] },
      { items: ['Dreamy Academy International (Manipur) opened (286 students · 17 teachers)'] },
    ],
  },
  pakistan: {
    capital: 'Islamabad',
    pop: '245 million',
    area: '796,000 ㎢ · about 3.5× the Korean Peninsula',
    religion: 'Islam 96.4% (Sunni majority) · Christian 1.6% · Hindu 1%, etc.',
    language: 'Urdu · English',
    government: 'Parliamentary federal republic',
    currency: 'Pakistani rupee (PKR)',
    climate: 'Arid · semi-arid',
    timezone: '4 hours behind Korea',
    intro: 'In a land where 96% are Muslim, PGI — a university for minority and Christian communities — was established. Carrying on the will of Shahbaz Bhatti, the minorities minister martyred in 2011, it builds a community of love, peace, justice, and service.',
    themes: [
      { t: 'Pakistan Global Institute', d: 'The first higher-education institution directly founded by foreigners since Pakistan’s independence. Built for minority and Christian communities, carrying on the will of the martyred minister Shahbaz Bhatti. Campus completed in 2022; opened as a government-accredited university in 2023.' },
      { t: 'Dreamy Teacher Academy', d: 'Teacher training sharing Christian education, future education, and curriculum design. Participation grew to 35 in 2024, 56 in 2025, and 82 in 2026.' },
      { t: "Dreamy Women's Dormitory", d: 'A women’s dormitory and staff housing completed in March 2025 with the support of Atomy chairman Park Han-gil. The heart of a “company that loves people” became a ground of learning.' },
      { t: 'Aman, the Dove', d: 'PGI’s mascot symbolizing love, peace, and service. It carries the confession, “we, being many, are one body in Christ” (Rom 12:5).' },
    ],
    timeline: [
      { items: ['Obtained founding approval from Pakistan’s Higher Education Commission'] },
      { items: ['Completed the PGI campus construction', 'Partnered with Dreamy Foundation for flood-disaster relief'] },
      { items: ['Opened as an officially accredited Pakistani university'] },
      { items: ['Selected Mongsang scholars · special lecture by Dr. Park Han-gil (leadership and entrepreneurship)', 'Dreamy Teacher Academy: 35 people'] },
      { items: ['Completed the Dreamy women’s dormitory and staff housing', 'Dr. Park Han-gil inaugurated as endowed chair professor of business · 56 trained'] },
      { items: ['Founded Dreamy Higher Secondary School · primary English-centered international education', 'Teacher training: 82 people · Christian education in a Muslim society'] },
    ],
  },
};

export const COUNTRY_I18N: Record<string, Record<Locale, CountryI18n>> = Object.fromEntries(
  Object.entries(EN).map(([id, v]) => [id, { en: v }]),
);
