/**
 * 6개국 시드의 영어 번역 오버레이(부분값). lib/content.ts 가 locale=en 일 때 덮어쓴다.
 * 여기 없는 값은 ko(시드)로 폴백. 구조(themes/timeline 개수·순서)는 countries.ts 와 정렬되어야 한다.
 */
import type { Country } from './countries';
import type { Locale } from './i18n';

type CountryI18n = Partial<Pick<Country,
  'capital' | 'pop' | 'area' | 'religion' | 'language' | 'government' | 'currency' | 'climate' | 'timezone' | 'intro'>> & {
  themes?: { t?: string; d?: string }[];
  timeline?: { y?: string; items?: string[] }[];
};

const EN: Record<string, CountryI18n> = {
  mongolia: {
    capital: 'Ulaanbaatar',
    pop: '3.54 million',
    area: '1.564 million ㎢ · about 7.1× the Korean Peninsula',
    religion: 'Buddhism (Tibetan/Lamaism) 51.7% · none 40.6% · Islam 3.2% · Christian 1.3%',
    language: 'Mongolian',
    government: 'Semi-presidential republic',
    currency: 'Tögrög (MNT)',
    climate: 'Continental arid · harsh winters',
    timezone: '1 hour behind Korea',
    intro: 'Mongolia is a vast land of 1.564 million ㎢ — about 7.1 times the Korean Peninsula — where 3.54 million people live. While half the population gathers in the capital Ulaanbaatar, the outer regions have long been distant from education and the gospel. Buddhism (Tibetan/Lamaism, 51.7%) and the non-religious (40.6%) form the majority, and Christians are only 1.3%. Dreamy School raises up Christian leaders and, by the principle of the public nature of the gospel, serves the growth of public-school education. Toward the day when teachers are raised, learning reaches the farthest steppe villages, and Mongolia’s next generation stands whole before God, we walk this road.',
    themes: [
      { t: '3P EDU Festival — A festival of learning spreading across Ulaanbaatar', d: 'Begun with five schools in one district of Ulaanbaatar, the 3P EDU Festival has grown into an education festival inviting students and teachers from across the city. Sharing the fruit of project-based learning and learning from one another, it has become a place of learning, meeting, and growth that helps students care for and love creation.' },
      { t: 'Dreamy Teachers Academy — Raising teachers to raise education', d: 'Dreamy Teachers Academy steadily continues teacher training for the growth of Mongolia’s public-school education. During vacations it holds training in Ulaanbaatar on learner-centered methods and the use of character-education materials, and each term Mongolian teachers and students visit Korea’s Dreamy School for training.' },
      { t: 'Bright Future School · Bit-eum Character Education — Shaped toward whole-person growth', d: 'Bright Future School is a Christian school founded by a Korean missionary, with a mission of gospel ministry and raising Christian leaders. Since 2022 Dreamy School has partnered through graduate intern-teacher dispatch, project-based learning, and Bit-eum character education, publishing content on time management, values, emotions, and self-esteem as materials (Dreamy Books) to help Mongolian students grow as whole persons.' },
      { t: 'Regional Mission — Love that travels to the farthest steppe villages', d: 'Across Mongolia — about 7.1 times the Korean Peninsula — many regions are hard for educational and cultural benefits to reach and are isolated by difficult travel. Each year Dreamy School students visit regional schools, offering a challenge through character and project-based education, and hold gospel camps that help students return to God.' },
    ],
    timeline: [
      { items: ['A Korean missionary founds Bright Future School, a Christian primary–secondary school, beginning gospel ministry and Christian-leader training'] },
      { items: ['Confirmed Bright Future School as a ministry partner; discussed education cooperation and support'] },
      { items: ['Sent 1 teacher family, 2 graduate intern teachers', 'Online Korean-language education, 3P education school modeling'] },
      { items: ['Sent 3 graduate intern teachers', 'Secondary-student education camps (gospel camp, Korean camp), introduced the Bit-eum course', 'Ulaanbaatar school teacher training'] },
      { items: ['Sent 2 graduate intern teachers', 'Whole-school Bit-eum·gospel camp at Bright Future School', 'Public-school principals’ training visit (21 schools, 40 people), practicing-teacher training (6 schools, ~400 people), joint 3P Festival, 3P expert-coach course (40 people)', 'Regional mission (Tes-Yalans soum, Övs aimag: gospel camp, Korean camp)'] },
      { items: ['Sent 2 graduate intern teachers', 'Produced character-education materials and taught by class, Christian leadership education (~40 people)', 'Partnership with the Ministry’s teacher-training agency, education training in Bayangol and Songinokhairkhan districts (300 teachers, 250 students, 250 parents), 16-school 3P Festival (1,200 people)', 'Curriculum MOU with two schools', 'Founded Dreamy Books publishing (2 character-education books, 6 children’s picture books)', 'Regional mission (education cooperation with schools in the Bayantsagaan region)'] },
      { items: ['Sent 2 graduate intern teachers', 'Distributed character-education materials, Christian leadership education (~50 people), joint 3P Festival', 'Ulaanbaatar teacher training (~300 people), 20-school 3P Edu Festival (1,200 people), teacher·student training visits', 'Regional mission (character education, problem-solving projects, gospel camp)'] },
    ],
  },
  philippines: {
    capital: 'Metro Manila',
    pop: '115.59 million',
    area: '300,000 ㎢ · about 1.3× the Korean Peninsula',
    religion: 'Catholic 79% · Protestant 7% · Islam 6%, etc.',
    language: 'Filipino (Tagalog) · English',
    government: 'Presidential republic',
    currency: 'Philippine peso (PHP)',
    climate: 'Tropical monsoon · wet and dry seasons',
    timezone: '1 hour behind Korea',
    intro: 'The Philippines is a nation of 115.59 million people living across islands of 300,000 ㎢ (about 1.3× the Korean Peninsula), centered on the capital Manila (Metro Manila) — a Christian-culture land where Catholics (79%) and Protestants (7%) form the majority. Yet amid rapid urbanization and economic disparity, poverty and educational inequality have deepened, and the children of the migrant slums on Manila’s outskirts have been pushed out of the chance to learn. Dreamy School joins the education mission of restoring that chance by building a school and sending teachers here. Toward the day when the children of the Philippines, having taken up the baton of learning, live out God’s mission with their own lives, Dreamy School keeps walking this road of partnership.',
    themes: [
      { t: 'Dreamy School Philippines — A ground of hope raised in a migrant slum', d: 'Opened in the Manila migrant slum of Montalban, the Philippine Dreamy School is a ground of hope raised in a harsh educational environment. Its vision is to nurture, through quality Christian education, the next generation that will lead the Philippines’ future.' },
      { t: 'School Construction Ministry — A school shaped by countless hands and drops of sweat', d: 'The Philippine Dreamy School was shaped by countless hands and drops of sweat gathered together. With the support of many organizations, Dreamy School students took part in the construction themselves, refurbishing educational spaces in need of repair and engraving their love for the Philippines everywhere.' },
      { t: 'Landfill Edu-Center — Love that entered the garbage-mountain village', d: 'The Landfill area is a garbage-mountain village formed by the poor forcibly relocated from Manila, cut off from the chance to learn by weak basic infrastructure. Dispatched teachers, together with Philippine Dreamy School students, enter this barren village to share the chance to learn with the children.' },
      { t: 'Sending Teachers — People who teach the gospel with their lives', d: 'Teacher families from Korea’s Dreamy School and graduate intern teachers are dispatched to the field, taking full charge of school operation and education and building a living model of education mission. Their devotion witnesses to the gospel as a life itself — walking the way of service, not success.' },
      { t: '3P Festival — Children who took up the baton of learning', d: 'Held on Dreamy School’s educational philosophy of 3P (Play, Performance, Practice), the 3P Festival is an education festival where students of both nations meet as equal partners beyond a sponsor relationship. Now the students of the Philippine Dreamy School take up the baton of learning and write that story with their own lives, and here the dream they dream is a life that joins God’s mission and lives out its calling.' },
    ],
    timeline: [
      { y: 'Earlier', items: ['Missionaries who had long served in a slum on Manila’s outskirts ran San Isidro Grace School (a primary program), laying a foundation for local education (year unknown)'] },
      { items: ['Teacher training, participation in school construction', 'Curriculum plan (5-No, Bit-eum, character education, Korean, electives)', 'August, student education mission'] },
      { items: ['Sent 1 teacher family, 4 graduate intern teachers', 'Dreamy School Philippines (Junior High School) opened', 'January, student education mission'] },
      { items: ['Sent 3 graduate intern teachers', 'Developed a 12-year curriculum including high school', 'Teacher training (methods, Bit-eum, 5-No, character education)', 'January, student education mission'] },
      { items: ['Sent 2 graduate intern teachers', 'Dreamy School Philippines (Senior High School) opened', 'Full exchange and visit program with Korea’s Dreamy School', 'Teacher training (student-agency education)', 'January, student education mission'] },
      { items: ['Sent 3 graduate intern teachers', 'Ran the Dreamy Edu-Center in term 1', 'Held a Philippine Christian schools’ joint teacher seminar (150 participants)', 'Teacher training (subject redesign and Christian education)', 'January, student education mission'] },
    ],
  },
  cambodia: {
    capital: 'Phnom Penh',
    pop: '17.848 million',
    area: '181,000 ㎢ · about 0.8× the Korean Peninsula',
    religion: 'Buddhism 95% · other 5%',
    language: 'Khmer',
    government: 'Constitutional monarchy',
    currency: 'Riel (KHR) · US dollar widely used',
    climate: 'Tropical monsoon',
    timezone: '2 hours behind Korea',
    intro: 'Cambodia is a nation of 17.848 million people living across 181,000 ㎢ (about 0.8× the Korean Peninsula), centered on the capital Phnom Penh, with Buddhism (95%) as its state religion. A land of the brilliant Angkor civilization, it passed through the anguish of the Killing Fields, where a generation’s intellect and faith collapsed. In Siem Reap, Dreamy School partners with local workers who raise the next generation through education. Longing for the day when, in the place of a collapsed generation, a new generation rises through learning and faith, we walk that road together with the school to be built in Dream Vill.',
    themes: [
      { t: 'Mustard Seed Primary School — A mustard seed grown from seven', d: 'Founded in Siem Reap in 2009, Mustard Seed Primary School began with 7 students and has grown into a school of some 90 students across six classes. Dreamy School continues a lasting relationship — reading classes, Bible camp, and Book Fest with current students, and Korean-language and Korean-culture camps with graduates.' },
      { t: 'Kindergarten Ministry — The moments of the most laughter', d: 'At the several kindergartens under the Cambodia branch of NIBCM, Dreamy School students share art activities rarely available to the children — with wooden puppets, clay, colored paper, and more. It is one of the times Dreamy students most look forward to and laugh the most.' },
      { t: 'NIBI — Next-generation leadership to serve Southeast Asia', d: 'NIBI (New International Bethany Institute) is an institution founded in Siem Reap in 2008 to raise next-generation leaders and kindergarten teachers who will serve Southeast Asian Christian communities. Some 30 students of various nationalities are in training, aiming to form a network of Christian youth across the Indochina peninsula. It partners with Dreamy School for education in Dream Vill.' },
      { t: 'Dream Vill Project — A healthy village built on education and healthcare', d: 'Dream Vill (DreamVil) is a mixed community complex of 1,800 households, planned around education and healthcare to give the people of Siem Reap a healthy life. Building an international school (kindergarten–high school) within the complex, it hopes to become a place that leads the children and families of Cambodia to the Lord, with Dreamy School partnering in the school’s founding.' },
    ],
    timeline: [
      { items: ['NIBC (Not I But Christ) begins as a Southeast Asia regional research team of Handong Global University'] },
      { items: ['Founded NIBI (New International Bethany Institute), beginning next-generation leadership training'] },
      { items: ['Founded an NIBC housing-development company (later supplying ~30,000 households across 10 cities in 3 countries)', 'Founded Mustard Seed Primary School (opened with 7 students)'] },
      { items: ['Dreamy School begins partnership with NIBC', 'Visited the ministry field', 'Conceived the town (Dream Vill) project and began cooperation'] },
      { items: ['Dream Vill town design and groundbreaking', 'Education-mission cooperation', 'May, student education mission'] },
      { items: ['May, student education mission'] },
      { items: ['School-founding preparation', 'Dreamy Teachers Academy teacher training (planned for September)', 'School-founding seminar', 'May, student education mission'] },
      { items: ['Dream Vill town and school scheduled to open'] },
    ],
  },
  indonesia: {
    capital: 'Jakarta',
    pop: '287.2 million',
    area: '1,916,820 ㎢ · about 9× the Korean Peninsula',
    religion: 'Islam 87% · Protestant 7% · Catholic 3% · Hindu 2% · Buddhist 1%',
    language: 'Indonesian',
    government: 'Presidential republic',
    currency: 'Rupiah (IDR)',
    climate: 'Tropical rainforest',
    timezone: '2 hours behind Korea (Jakarta)',
    intro: 'Indonesia is the world’s fourth most populous nation, with 287.2 million people living across vast islands of 1,916,820 ㎢ (about 9× the Korean Peninsula), centered on the capital Jakarta; Islam (87%) is the majority, with Protestants (7%) and Catholics (3%) as minorities. Here Christian education is a minority path, yet Dreamy School shares an educational philosophy with Jakarta’s Christian institutions and walks a road of partnership where students and teachers learn from one another. We hope this mutual-learning partnership keeps expanding beyond borders and languages into a vision of God’s kingdom for the next generation.',
    themes: [
      { t: 'JIU·CGA — A campus raising the next generation with a Christian worldview', d: 'Jakarta’s JIU (Jakarta International University) and CGA (Cornerstone Global Academy) are institutions that raise the next generation on a Christian worldview. Students of diverse national and cultural backgrounds learn together, growing in faith, character, and scholarship in balance.' },
      { t: 'Dreamy Library — A space where learning and exchange dwell', d: 'Created inside Danvit Hall, the Dreamy Library is a space of learning and exchange used together by primary, secondary, and university students. The Mini Library within it has become a warm place of learning where elementary students do homework after school, enjoy reading, and rest at ease.' },
      { t: 'Teacher Exchange — Partners who learn from one another', d: 'Since 2023, CGA teachers have visited Korea’s Dreamy School several times, sharing educational philosophy, curriculum, and school operation as a whole. Through class observation, teacher training, and education seminars, teachers of both nations are being built up together as partners of education mission for God’s kingdom.' },
      { t: 'Student Exchange (Academic Festival·DIF) — Beyond borders, toward the same place', d: 'From 2025 a full exchange between Dreamy School and CGA students began. Dreamy students visited CGA to hold after-school programs and the Academic Festival together, and CGA students joined the DIF (Dreamy International Festival) in Korea, sharing projects and vision. In 2026 students of both nations serve a camp for Indonesian children together, expanding the dream of building God’s kingdom together.' },
    ],
    timeline: [
      { items: ['Formed the founding committee of Jakarta International University (JIU)'] },
      { items: ['Founded Cornerstone Global Academy (CGA) (2015)', 'Completed the main building of the K-Eduplex campus (2017)', 'JIU opening and founding of MCLC kindergarten (2018)'] },
      { items: ['JIU promoted to a full university (3 colleges, 6 departments), 1st graduation'] },
      { items: ['June, first meeting with CGA leaders at Dreamy School, discussing possible cooperation', 'July, Dreamy School delegation visited CGA, education seminar and vision sharing', 'December, 26 CGA teachers visited Korea (teacher training·vision trip)'] },
      { items: ['March, CGA gospel Bible study', 'May, student education mission (10 students, 2 teachers visited CGA)', 'June, Danvit Hall completed and Dreamy Library created', 'December, 15 CGA students·8 teachers attended DIF'] },
      { items: ['May, student education mission (a camp for Indonesian children with CGA grade-12 students)'] },
    ],
  },
  india: {
    capital: 'New Delhi',
    pop: '1.456 billion',
    area: '3,287,782 ㎢ · about 15× the Korean Peninsula',
    religion: 'Hindu 79.8% · Islam 14.2% · Christian 2.3%, etc.',
    language: 'Hindi · English, etc. (22 official languages)',
    government: 'Parliamentary federal republic',
    currency: 'Indian rupee (INR)',
    climate: 'Tropical monsoon · large regional variation',
    timezone: '3 hours 30 minutes behind Korea',
    intro: 'India is the world’s most populous nation, with 1.456 billion people living across a continent-like land of 3,287,782 ㎢ (about 15× the Korean Peninsula), centered on the capital New Delhi; Hinduism (79.8%) and Islam (14.2%) form the majority, with Christianity as a minority. In this land of great gaps in language, culture, and educational environment from region to region, Dreamy School partners with schools in Bangalore and in Nagaland and Manipur. We hope this journey — where children’s lives and futures change wherever education reaches — continues in ever more places across India.',
    themes: [
      { t: 'Little Flower Dreamy School (Nagaland) — A ground of learning raised in a hill village', d: 'Founded in Nagaland in 2006, Little Flower Dreamy School has grown into a school of 643 students and 18 teachers. A dormitory for orphaned students and a futsal court have been built, embracing the children’s learning and life together.' },
      { t: 'Dreamy School Bangalore — A school built by teachers coming and going', d: 'Opened in Bangalore in 2019, Dreamy School was built by sharing education both ways — through the dispatch of a Dreamy School teacher and the placement of local teachers working in Korea.' },
      { t: 'Dreamy Academy International (Manipur) — A newly begun community of learning', d: 'Opened in Manipur in 2024, Dreamy Academy International took its first steps with 286 students and 17 teachers.' },
    ],
    timeline: [
      { items: ['Founded Little Flower Dreamy School in Nagaland (now 643 students, 18 teachers)'] },
      { items: ['Dreamy School (Bangalore) opened', 'Dreamy School teacher dispatched', '2 local Indian teachers placed to work in Korea'] },
      { items: ['Built an orphaned-students’ dormitory at Little Flower School, laid a futsal court, supported equipment'] },
      { items: ['Dreamy Academy International (Manipur) opened (286 students, 17 teachers)'] },
    ],
  },
  pakistan: {
    capital: 'Islamabad',
    pop: 'about 255 million',
    area: '796,000 ㎢ · about 3.5× the Korean Peninsula',
    religion: 'Islam 96.4% · Christian 1.6% · Hindu 1%, etc.',
    language: 'Urdu · English',
    government: 'Parliamentary federal republic',
    currency: 'Pakistani rupee (PKR)',
    climate: 'Arid · semi-arid',
    timezone: '4 hours behind Korea',
    intro: 'Pakistan is the world’s fifth most populous nation, with about 255 million people living across 796,000 ㎢ (about 3.5× the Korean Peninsula), centered on the capital Islamabad; in this land where Islam (96.4%) is the state religion, Christians live as a minority. PGI was established as a university opening the door of higher education for minority and Christian communities, and Dreamy School joins this journey through teacher training and curriculum cooperation. Hoping the once-closed door of learning opens earlier and to more people, we walk together.',
    themes: [
      { t: 'Pakistan Global Institute — A university begun in the place of martyrdom', d: 'PGI began in the wake of the 2011 martyrdom of Shahbaz Bhatti, Pakistan’s minister for minorities, when the founding of a university for minority and Christian communities was decided. In 2023 it opened as the first government-accredited higher-education institution directly founded by foreigners since Pakistan’s independence, educating the next generation in business, computer science, data analytics, and more.' },
      { t: 'Dreamy Teachers Academy — Teachers’ learning that grows year by year', d: 'Begun with 35 people in 2024, the Dreamy Teachers Academy teacher training grows each year — 56 in 2025 and 82 in 2026. It continues as training that builds both the inner life and the professionalism of teachers: Christian education, future education, curriculum design, writing a teacher mission statement, and more.' },
      { t: 'Mongsang Scholarship Ministry — Leadership education for the next generation', d: 'Through the selection of Mongsang scholars and lectures on leadership and entrepreneurship, PGI students are helped to continue their studies and calling. For young people to whom the chance to learn was closed, the road of higher education is opening.' },
      { t: 'Dreamy Higher Secondary School — A newly opening path of primary–secondary education', d: 'In 2026 the founding of Dreamy Higher Secondary School is under way, expanding the horizon of education mission from university to primary and secondary through English-centered international education at the elementary level.' },
    ],
    timeline: [
      { items: ['In the wake of the martyrdom of Shahbaz Bhatti, minister for minorities, the founding of a university (PGI) for minority and Christian communities is decided'] },
      { items: ['Obtained founding approval from Pakistan’s Higher Education Commission'] },
      { items: ['Completed the PGI campus construction', 'Partnered with Dreamy Foundation for Pakistan flood-disaster relief'] },
      { items: ['PGI opened as an officially accredited university (the first higher-education institution directly founded by foreigners since Pakistan’s independence)', 'Dreamy Foundation supported learning equipment'] },
      { items: ['Dreamy Teachers Academy teacher training (35 people)', 'Selected Mongsang scholars', 'Online lectures on leadership and entrepreneurship', 'Founded a data-analytics department'] },
      { items: ['Dreamy Teachers Academy teacher training (56 people)', 'Completed the women’s dormitory and staff housing'] },
      { items: ['Dreamy Teachers Academy teacher training (82 people: Christian education, future education, curriculum design, Dreamy School curriculum, writing a teacher mission statement)', 'Founding of Dreamy Higher Secondary School under way (English-centered international education at the elementary level)', 'AI department to be founded in September'] },
    ],
  },
};

export const COUNTRY_I18N: Record<string, Record<Locale, CountryI18n>> = Object.fromEntries(
  Object.entries(EN).map(([id, v]) => [id, { en: v }]),
);
