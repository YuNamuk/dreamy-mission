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
    intro: 'Dreamy School carries out educational mission in Mongolia with two aims: to raise Christian leaders for the next generation, and to help Mongolian public education grow on the principle of the public nature of the gospel. Alongside continued partnership with Bright Future Global Academy, it holds the 3P Festival and teacher and student training for schools across the country, and spreads character education by adapting Dreamy School’s ‘Bijeum’ education to the local setting. Character-education textbooks are developed, published and distributed to local schools, and educational mission and gospel camps reach schools and villages in person, carrying education and the gospel together. Through this ongoing partnership and training, teachers and students are supported and new possibilities take shape in Mongolia’s classrooms.',
    themes: [
      { t: '3P Edu-Festival — a festival of learning spreading across Ulaanbaatar', d: 'Begun with five schools in one district of Ulaanbaatar, this festival now invites students and teachers from across Ulaanbaatar and all of Mongolia to share the fruit of project-based learning and learn from one another. It offers students a place of learning and sharing, meeting and growth, and helps them care for and love the created world through varied content and methods.' },
      { t: 'Dreamy Teacher Academy — raising teachers to raise education', d: 'Through the Dreamy Teacher Academy, teacher training continues in support of the growth of Mongolian public schools. Principals and teachers of public schools in Ulaanbaatar are trained in learner-centered methods and in the use of character-education textbooks, while practical 3P training and a 3P specialist coach course raise teachers’ professional capacity. Each semester Mongolian students and teachers also visit Dreamy School in Korea to experience its lessons and school life first-hand.' },
      { t: 'School partnership — learning that reaches the far steppe', d: 'Mongolia, about seven times the area of the Korean Peninsula, has wide regional gaps in educational and cultural opportunity, and many areas remain cut off by the difficulty of travel. Dreamy School students visit such schools and villages each year for character education and project-based learning, and gospel camps open new chances for learning and faith. Teacher and student training and the 3P Edu-Festival are held with 23 schools in Bayangol District and 16 in Songinokhairkhan District; at Schools No. 117 and No. 93 and School No. 172 in Bayangol, intern teachers lead 3P education, Bijeum character education and Korean-language classes; at School No. 10 in Bayanchandmani, character education, problem-solving projects and gospel camps for nearby villages continue.' },
      { t: 'Bright Future Global Academy — partners since 2022', d: 'Bright Future Global Academy, founded in 1997 by a Korean missionary, was Mongolia’s first Christian primary and secondary school, practicing education for mission and for raising Christian leaders. Partnership with Dreamy School began in 2022 and continues as mutual growth through education. Together with sending intern teachers and serving local schools, the two practice 3P and project-based education and Bijeum character education, making change in local classrooms. They also hold the 3P Festival jointly, develop and distribute character-education textbooks, and run online Korean classes and camps for Bijeum, the gospel, leadership and Korean language.' },
      { t: 'Publishing — learning that remains as a book', d: 'Part of Dreamy School’s Bijeum curriculum is offered in a form suited to the developmental stage of Mongolian students and the local educational setting, with character education in time management, values, emotions and self-esteem so that students may understand their own lives and grow well. The content is developed into systematic textbooks, published under Dreamy Books and distributed to local schools, with training for teachers on how to use them in class. Two secondary character-education textbooks and six primary picture books have been published so far.' },
    ],
    timeline: [
      { y: '2022', items: ['Teachers sent from Dreamy School: the Cho Youngmin and Lee Inhwa family', 'Graduate intern teachers sent: Kim Daeun, Lee Hyemin'] },
      { y: '2023', items: ['Project-Based Learning training begins for public-school teachers in Ulaanbaatar', '1st exchange students of Bright Future Global Academy', 'Mongolian youth church planted', 'Graduate intern teachers sent: Jung Yeeun, Oh Youngwon, Choi Yesol'] },
      { y: '2024', items: ['1st 3P Edu-Festival held (annual thereafter)', 'Partnership begins with 23 schools of Bayangol District: principals’ training visit to Korea, practical teacher training, 3P specialist coach course, student visit to Dreamy School', 'MOU with Schools No. 172 and No. 93 in Bayangol: 3P education, Bijeum character education and Korean classes by intern teachers', 'Graduate intern teachers sent: Kim Hyangju, Yoon Dahee'] },
      { y: '2025', items: ['Partnership begins with the Teacher Training Agency under the Ministry of Education: staff and researchers visit Dreamy School', 'Partnership begins with 16 schools of Songinokhairkhan District: practical 3P teacher training, student training', 'Dreamy Books publishing house founded', 'Participation in the 1st Dreamy International Festival in Korea', 'Graduate intern teachers sent: Park Yedam, Jung Pureum'] },
      { y: '2026', items: ['All staff of Bright Future Global Academy visit Dreamy School for training', '2nd exchange students of Bright Future Global Academy', 'Graduate intern teachers sent: Kim Chaeyoung, Jung Yujin'] },
    ],
  },
  philippines: {
    capital: 'Metro Manila',
    pop: '115.59 million',
    area: '300,000 ㎢ · about 1.3× the Korean Peninsula',
    religion: 'Catholic 79% · Christian 7% · Islam 6%, etc.',
    language: 'Filipino (Tagalog) · English',
    government: 'Presidential republic',
    currency: 'Philippine peso (PHP)',
    climate: 'Tropical monsoon · wet and dry seasons',
    timezone: '1 hour behind Korea',
    intro: 'Dreamy School Philippines was founded in Montalban, near Manila, to raise leaders grounded in Christian values. Practicing education built on the philosophy and principles of Dreamy School in Korea, it is extending the vision of Dreamy education into the Philippines. Since its opening the two schools have exchanged actively every year, sharing what they learn and growing together as one educational community. Near the school, in a landfill area, Dreamy Edu-Center offers a place of learning to children who have had little access to education.',
    themes: [
      { t: 'Curriculum — Dreamy education in a Philippine setting', d: 'The curriculum of Dreamy School Philippines reconstructs the philosophy and principles of Dreamy School for the educational environment and cultural context of the Philippines. Lessons applying the 3P principles, ‘Bijeum’ character education that shapes students’ character and life, and the Dreamy Honor Code — practicing the Five Nevers to form a community of trust — reflect the school’s core educational principles. On this foundation, an integrated K2–12 curriculum is run in line with the standards of the Philippine Department of Education and the needs of the local community.' },
      { t: 'Founding — building classrooms, opening a school', d: 'Dreamy School Philippines was established through the devotion and service of teachers and students of Dreamy School in Korea. While preparing to found the school, a school-founding seminar was held with local teachers to share the philosophy and vision of Dreamy education and to seek a direction fitting the local community. Classrooms and other facilities were built to meet the accreditation standards of the Philippine Department of Education. Through this preparation, a Junior High School opened in 2023 and a Senior High School in 2025, each running a full curriculum.' },
      { t: 'Exchange — Dreamy Festival, year after year', d: 'Since its founding the school has kept up an active educational exchange with Dreamy School in Korea. Each January students from Korea visit the Philippines to hold the Dreamy Festival, where students of both schools share the learning and growth of the past year. Teachers also learn and fellowship together through in-depth training and practical exchange. Sharing lesson cases built on the 3P principles has spread Dreamy School’s educational philosophy and methods locally. Graduates of Dreamy School in Korea are continually sent as interns, teaching subjects and serving in education on site.' },
      { t: 'Dreamy Edu-Center — a place of learning by the landfill', d: 'Near Dreamy School Philippines lies a vast landfill. Residents there make their living sorting and collecting waste, living without basic infrastructure such as electricity and water. Many children cannot attend school or receive adequate education. Dreamy Edu-Center was established in the landfill area by graduate intern teachers from Dreamy School in Korea to open the chance to learn. A curriculum for the children of the landfill area is developed and run together with students of Dreamy School Philippines. Those students now take the leading role in the work, realizing a sustainable mission in which local people themselves carry the education forward.' },
    ],
    timeline: [
      { y: '2022', items: ['Curriculum planning: Five Nevers, Bijeum, character education, Korean language, electives', 'Teacher training toward founding the school'] },
      { y: '2023', items: ['Dreamy School Philippines — Junior High School opens', '1st Dreamy Festival held jointly (annual thereafter)', 'Second-floor classrooms of the main building completed', 'Teachers sent from Dreamy School: the Chae Yohan and Jung Jiyoung family (Chae Yohan, 1st principal)', 'Graduate intern teachers sent: Kang Jahang, Lee Yujin, Lee Sumin, Jung Yewon', 'Joint courses opened and run with Dreamy School'] },
      { y: '2024', items: ['Graduate intern teachers sent: Lee Hyemin, Cho Wooshin, Jung Woojin', '12-year curriculum developed, including Senior High School', 'Children’s playground completed; third-floor classrooms and staff housing completed', 'Teacher training: teaching methods, Bijeum, Five Nevers, character education'] },
      { y: '2025', items: ['Dreamy School Philippines — Senior High School opens', 'Choi Yunki inaugurated as 2nd principal', 'Graduate intern teachers sent: Moon Hyeryung, Jung Sunyang', 'Participation in the 1st Dreamy International Festival in Korea', 'Dreamy Edu-Center in operation; gospel Bible conference held in the landfill area', 'Teacher training: student-led learning'] },
      { y: '2026', items: ['Dreamy Teacher Academy — joint teacher seminar of Philippine Christian schools (150 participants)', 'Graduate intern teachers sent: Kang Hanbit, Kim Yeji, An Juha, Yoon Yeyoung', 'Teacher training: curriculum redesign and Christian education', 'First 18 graduates of Dreamy Senior High School'] },
    ],
  },
  cambodia: {
    capital: 'Phnom Penh',
    pop: '18.05 million',
    area: '181,000 ㎢ · about 0.8× the Korean Peninsula',
    religion: 'Buddhist 95% · Christian 3% · other 2%',
    language: 'Khmer',
    government: 'Constitutional monarchy',
    currency: 'Riel (KHR) · US dollar widely used',
    climate: 'Tropical monsoon',
    timezone: '2 hours behind Korea',
    intro: 'Dreamville is a mixed-use community of about 1,800 households taking shape around a school in Siem Reap, Cambodia. Centered on educational institutions from kindergarten through university, it brings together a church, hospital, shops, cultural and sports facilities, playgrounds and parks so that education and daily life are joined. Dreamville aims to be more than a place to live: a healthy village where learning and care, faith and fellowship meet. At its center Dreamy School leads teacher training and curriculum development, partnering to build a school that raises the next generation through education fitted to local needs.',
    themes: [
      { t: 'Founding schools — a school at the center of the village', d: 'Dreamy School is partnering to build an educational system reaching from kindergarten to university at the heart of Dreamville. Schools are being founded on Christian values and educational philosophy so that Cambodia’s next generation may learn and grow in a safe, healthy environment. Pursuing academic excellence, an international and future-oriented curriculum is being shaped for Cambodia’s educational environment and cultural context. The aim is a school that is more than an institution — one that connects students, families and the community and stands at the center of the village, practicing the values of God’s kingdom.' },
      { t: 'Exchange — meeting children at Mustard Seed School and local kindergartens', d: 'Dreamy School students continue to visit local schools and kindergartens in Cambodia for education and service. With students of Mustard Seed Elementary School they share reading classes, Bible camps and Book Fest, and with its graduates they hold Korean language and culture camps, keeping the relationship alive. They also visit local kindergartens for art activities using wooden dolls, clay and colored paper — learning and serving together in educational mission.' },
      { t: 'Dreamy Teacher Academy — a place where teachers are formed', d: 'Cambodia lacks sufficient institutions to raise teachers’ expertise systematically and to certify their qualifications, so continuing education for teacher formation is needed. The Dreamy Teacher Academy answers that need, aiming to become an institution that helps Cambodian teachers grow into professionals with educational philosophy and teaching capacity. In the long term it seeks to provide systematic teacher education and training and to certify professional qualifications, continually raising teachers who will lead Christian education in Cambodia.' },
    ],
    timeline: [
      { y: '2018', items: ['Bible camp in Phnom Penh', 'Teaching equipment and school meals supported at a local elementary school'] },
      { y: '2019', items: ['Dreamy Foundation Phnom Penh branch opened', 'Phnom Penh Bible camp localized'] },
      { y: '2023', items: ['Partnership begins with NIBC (Not I But Christ)', 'Dreamville conceived'] },
      { y: '2024', items: ['Dreamville designed, construction begins', 'Educational mission partnership with Dreamy School'] },
      { y: '2026', items: ['Partnership begins with the Vice Minister of Education of Cambodia', 'Cambodian Ministry of Education delegation visits Korea, meets the Korean Minister of Education, discusses cooperation with Dreamy School', 'School-founding seminar', 'Dreamy Teacher Academy opens'] },
    ],
  },
  indonesia: {
    capital: 'Jakarta',
    pop: '287.2 million',
    area: '1,916,820 ㎢ · about 9× the Korean Peninsula',
    religion: 'Islam 87% · Christian 7% · Catholic 3% · Hindu 2% · Buddhist 1%',
    language: 'Indonesian',
    government: 'Presidential republic',
    currency: 'Rupiah (IDR)',
    climate: 'Tropical rainforest',
    timezone: '2 hours behind Korea (Jakarta)',
    intro: 'Cornerstone Global Academy (CGA) is a Christian school on the campus of Jakarta International University, running an integrated curriculum from kindergarten through high school. Founded in 2015, CGA offers an international curriculum grounded in a Christian worldview, raising Christian leaders for Indonesia’s future society. Working closely with Dreamy School, it continues an active educational exchange and grows as one educational community. Beyond this partnership, CGA also trains Christian teachers across Indonesia and supports local schools, contributing to the spread and growth of Christian education.',
    themes: [
      { t: 'Educational support — building spaces for learning together', d: 'Dreamy School supported Danvit Hall, completed in June 2025, with auditorium video and sound equipment, classroom furniture and teaching materials, and created the Dreamy Library as a space for learning and inquiry. It also supported the construction of a dormitory so that students from across Indonesia could live and study in a stable environment; the dormitory completed in August 2026 was named Dreamy House, marking the two schools’ lasting partnership. Alongside this, annual scholarships for CGA students, curriculum research funds, and exchange funds are provided so that both schools grow together.' },
      { t: 'Exchange — from a meeting of teachers to a partnership of students', d: 'The exchange between CGA and Dreamy School began with the teachers. In 2024 the entire CGA faculty visited Dreamy School in Korea, forming a partnership among the teachers of both schools and opening active discussion of educational cooperation. Student exchange began in earnest in May 2025 when Dreamy School students visited CGA. Today students of both schools share lessons and work together in the 3P Festival, teaching younger students, serving local schools and orphanages. Such exchange goes beyond cooperation between two schools: it shares educational experience and resources, advances education in Indonesia, and extends into serving and supporting local Christian schools.' },
      { t: 'Extending Christian education — widening the horizon together', d: 'Teachers of CGA and Dreamy School continue to visit each other’s schools, holding in-depth discussions on education and sharing their experience and aims, widening the horizon of Christian education together. Through this exchange the teachers learn from one another and grow as partners in educational mission for the kingdom of God. Students visit Christian schools across Indonesia together with CGA students, run camps for Indonesian children, and visit local schools to practice teaching and sharing — learning and serving side by side.' },
    ],
    timeline: [
      { y: '2024', items: ['Educational seminar for CGA teachers', 'CGA teachers visit Dreamy School in Korea for training and a vision trip'] },
      { y: '2025', items: ['Gospel Bible conference held at CGA', 'Teaching equipment supported', 'Dreamy Library established', 'Student exchange begins: high-school exchange, teaching younger students, local educational mission', '3P Festival held', 'Participation in the 1st Dreamy International Festival in Korea'] },
      { y: '2026', items: ['Dreamy School and CGA students serve local schools together', 'Dreamy House dormitory completed'] },
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
    intro: 'Dreamy School’s work in India aims to raise the next generation through Christian education and to help local teachers and schools grow on their own. Together with Indian teachers it studies the philosophy and 3P education of Dreamy School in Korea, seeking a direction for Christian education suited to India. It also practices the gospel through service — offering treatment and nutritional support, prayer and care to people affected by leprosy, and bringing love to neighbors long pushed aside.',
    themes: [
      { t: 'Dreamy School (Bangalore) — a small school in a farming village', d: 'Dreamy School in Bangalore stands in a small farming village near Bangalore, founded to serve the next generation in an area with little access to Christian education. Modest in size, it runs a curriculum fitted to the local educational environment, the circumstances of its students’ lives and the needs of the area. Rather than transplanting the philosophy of Dreamy School in Korea wholesale, it learns and adjusts together with local teachers, so that Christian education begun in a small school takes root in the community and changes the next generation.' },
      { t: 'Little Flower School (Dimapur, Nagaland) — Darkness to Light', d: 'Little Flower School, in Dimapur, Nagaland, takes “Darkness to Light” as its motto and pursues whole-person education supporting students’ intellectual, emotional and social growth. It has built a modern learning environment and strengthened computer education and physical activity, while forming a community in which parents and teachers support students’ growth together. Dreamy School partners with the school to improve its facilities and support teacher education, and seeks to widen curriculum and student exchange with Dreamy School in Korea.' },
      { t: 'Dreamy Academy International (Manipur) — God, Goals, Grow and Glow', d: 'Dreamy Academy International, founded in Manipur in 2024, takes “God, Goals, Grow and Glow” as its motto: keeping God at the center, setting clear goals, and helping students grow spiritually, socially and personally so that their lives may shine. Pursuing academic excellence, it practices education for the future through smart classrooms, a science laboratory and computer education, and runs dormitories for boys and girls, providing a safe and communal learning environment.' },
      { t: 'Serving people affected by leprosy — neighbors beyond prejudice', d: 'India accounts for a large share of the world’s new cases of leprosy, and those affected suffer not only from the disease but from social prejudice and separation from family. Medicine and nutritional food are provided, and treatment, prayer and occasions of care such as birthday parties build lasting relationships. Rather than one-off support, regular meetings and fellowship help them move out of isolation and loneliness and live as people who are respected. Through such care, neighbors long pushed aside open their hearts, receive the gospel and are baptized, changed as Christians.' },
    ],
    timeline: [
      { y: '2019', items: ['Dreamy School in Bangalore opens', 'A teacher of Dreamy School in Korea sent to serve at Dreamy School in Bangalore (Lee Sahoon)', 'Two teachers of Dreamy School in Bangalore sent to serve at Dreamy School in Korea'] },
      { y: '2020', items: ['Classrooms added at Dreamy School in Bangalore', 'Gospel Bible conference in Nagaland', 'School building of Little Flower School completed', 'Dormitory for orphaned students completed at Little Flower School', 'Teaching equipment supported at Little Flower School'] },
      { y: '2022', items: ['Futsal court and guest house built at Little Flower School'] },
      { y: '2024', items: ['School building of Dreamy Academy International in Manipur completed', 'Dreamy Academy International in Manipur opens'] },
      { y: '2025', items: ['Classrooms and restrooms added at Dreamy School in Bangalore', 'Teacher education and curriculum exchange with local schools in India'] },
    ],
  },
  pakistan: {
    capital: 'Islamabad',
    pop: '245 million',
    area: '796,000 ㎢ · about 3.5× the Korean Peninsula',
    religion: 'Islam 96.4% · Christian 1.6% · Hindu 1%, etc.',
    language: 'Urdu · English',
    government: 'Parliamentary federal republic',
    currency: 'Pakistani rupee (PKR)',
    climate: 'Arid · semi-arid',
    timezone: '4 hours behind Korea',
    intro: 'Dreamy School & College is a primary and secondary school established on the campus of Pakistan Global Institute (PGI), a Christian university in Pakistan. Grounded in Christian values, it pursues academic excellence and runs an English-medium, international and future-oriented curriculum shaped for Pakistan’s educational and cultural context. Through an educational community in which university and school grow together, it serves Pakistan’s next generation and opens a new path for Christian education.',
    themes: [
      { t: 'Pakistan Global Institute — a university born from martyrdom', d: 'Pakistan Global Institute (PGI) began as a university opening the door of higher education for minority and Christian communities in Pakistan. Its founding was decided after the 2011 martyrdom of Shahbaz Bhatti, Minister for Minority Affairs; after receiving approval from Pakistan’s Higher Education Commission in 2016, the campus was built, the facilities completed in 2022, and the university opened with official government accreditation in 2023. It offers professional and leadership education centered on business administration, computer engineering and data analytics. Chairman Han-Gil Park of Atomy serves as an endowed chair professor, lecturing online on “Leadership and Entrepreneurship.” Dreamy School partners continually with PGI through teacher education, curriculum development, scholarships and educational mission.' },
      { t: 'Founding the school — from university to primary and secondary education', d: 'Building on its partnership with PGI, Dreamy School extended its university-centered work into primary and secondary education by establishing Dreamy School & College. Grounded in a Christian worldview, it pursues academic excellence and runs an English-medium, international and future-oriented curriculum shaped for Pakistan’s educational environment and cultural context. This forms an educational community linking university and school, opening new possibilities for Christian education in a Muslim society.' },
      { t: 'Dreamy Teacher Academy — a teachers’ learning that grows each year', d: 'The Dreamy Teacher Academy helps teachers in Pakistan grow as educators with a Christian worldview and professional capacity. Teacher training that began with 35 participants in 2024 grew to 56 in 2025 and 82 in 2026. Through Christian education, future education, curriculum design, the Dreamy School curriculum and the writing of a teacher’s mission statement, it forms both the professional skill and the inner life of teachers who will lead Christian education in Pakistan.' },
    ],
    timeline: [
      { y: '2022', items: ['PGI campus construction completed', 'Flood relief in Pakistan in partnership with the Dreamy Foundation'] },
      { y: '2023', items: ['PGI opens as a government-accredited university', 'Learning equipment supported by the Dreamy Foundation'] },
      { y: '2024', items: ['Dreamy Teacher Academy teacher training begins (annual thereafter)', 'Mongsang scholarship students selected', 'Chairman Han-Gil Park lectures on “Leadership and Entrepreneurship”'] },
      { y: '2025', items: ['Women’s dormitory and staff housing completed at PGI', 'Chairman Han-Gil Park inaugurated as endowed chair professor of business administration'] },
      { y: '2026', items: ['Dreamy School & College established and in operation'] },
    ],
  },
};

export const COUNTRY_I18N: Record<string, Record<Locale, CountryI18n>> = Object.fromEntries(
  Object.entries(EN).map(([id, v]) => [id, { en: v }]),
);
