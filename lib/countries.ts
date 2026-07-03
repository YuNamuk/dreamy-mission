/**
 * 교육선교 아카이브 — 6개국 시드 데이터 + 지도 기하(arc/노드 좌표) 헬퍼.
 *
 * 이 파일의 데이터는 "시드"다. 실제 표시 콘텐츠는 lib/content.ts 가
 * Supabase(app_3)의 편집본이 있으면 그것을, 없으면 이 시드를 쓴다.
 * (학생 로그인 편집 → Supabase 저장 → 공개 열람에 반영)
 */

export interface Theme {
  t: string;
  hint: string;
  d: string;
}
export interface TimelineRow {
  y: string;
  items: string[];
}
export interface Country {
  id: string;
  ko: string;
  en: string;
  local: string;
  years: string;
  /** 지도 viewBox(100×64) 좌표 */
  x: number;
  y: number;
  capital: string;
  pop: string;
  area: string;
  religion: string;
  language: string;
  government: string;
  currency: string;
  climate: string;
  timezone: string;
  intro: string;
  themes: Theme[];
  timeline: TimelineRow[];
}

/** 서울(드리미학교) 원점 — 추상 arc 시작점 */
export const SEOUL = { x: 76, y: 23 };
const VBH = 64;

/** 실제 지도(Leaflet)용 좌표 [위도, 경도] */
export const SEOUL_LATLNG: [number, number] = [37.5, 127.03];
export const LATLNG: Record<string, [number, number]> = {
  mongolia: [47.92, 106.92], // 울란바토르
  philippines: [14.6, 120.98], // 메트로 마닐라
  cambodia: [13.36, 103.85], // 씨엠립 (사역지)
  indonesia: [-6.21, 106.85], // 자카르타
  india: [28.61, 77.21], // 뉴델리
  pakistan: [33.69, 73.06], // 이슬라마바드
};

export const COUNTRIES: Country[] = [
  {
    id: 'mongolia', ko: '몽골', en: 'Mongolia', local: 'Монгол', years: '2021—', x: 60, y: 15,
    capital: '울란바토르 (Ulaanbaatar)', pop: '354만 명', area: '156.4만 ㎢ · 한반도의 7.1배',
    religion: '라마교 51.7% · 무교 40.6% · 이슬람교 3.2% · 기독교 1.3%',
    language: '몽골어',
    government: '이원집정부제 공화국',
    currency: '투그릭 (MNT)',
    climate: '대륙성 건조 기후 · 혹한의 겨울',
    timezone: '한국보다 1시간 느림',
    intro: '러시아와 중국 사이의 드넓은 내륙국. 드리미학교는 몽골의 크리스천 리더를 양성하고, 복음의 공공성 원리에 따라 공립학교 교육의 성장과 발전을 지원한다. 밝은미래학교와의 협력, 3P Festival, 인성교육 교재 출판, 지역 선교와 교사 연수로 교사와 학생의 성장을 돕는다.',
    themes: [
      { t: '3P EDU Festival', hint: '3P 페스티벌 사진', d: '울란바토르 한 구의 다섯 학교로 시작해 전 지역으로 확대된 프로젝트 중심 교육 축제. 학생·교사를 초청해 결과물을 나누고 상호 배움을 얻으며, 배움과 나눔·만남과 성장의 장을 제공하고 창조세계를 사랑하도록 돕는다.' },
      { t: 'Dreamy Teachers Academy', hint: '교사연수 사진', d: '공립학교 교육의 성장을 위한 교사연수. 방학마다 울란바토르에서 학습자 중심 교육 방법과 인성교육 교재 사용법을 나누고, 매 학기 몽골 교사·학생이 드리미학교를 찾아 연수한다.' },
      { t: '밝은미래학교 · 인성교육', hint: '밝은미래학교·인성교육 사진', d: '1997년 세워진 몽골 최초의 기독 초·중등학교와 2022년부터 협력한다. 드리미의 빚음 과정을 몽골 학생에 맞춰 인성교육 교재로 만들어 Dreamy Books로 출판·보급하며 전인적 성장을 돕는다.' },
      { t: '교육소외지역', hint: '지역 선교·복음캠프 사진', d: '한반도의 7배 넓은 몽골에는 교육·문화 혜택에서 소외되고 이동이 어려워 고립된 지역이 많다. 드리미 학생들이 매년 지역 학교를 찾아가 인성교육·프로젝트 교육으로 도전을 주고 복음캠프를 연다.' },
    ],
    timeline: [
      { y: '2021', items: ['밝은미래학교 사역 협력 기관 확정', '비오 캠프장·밝은미래학교 교육 협력 논의'] },
      { y: '2022', items: ['교사 가정 파견·졸업생 인턴 2명 파송', '온라인 한국어교육 · 3P 학교 모델링'] },
      { y: '2023', items: ['복음·한국어 캠프, 인턴 3명 파송', '빚음(자기관리) 과정 도입 · 울란바토르 교사 연수'] },
      { y: '2024', items: ['공립 교장단 방문연수 (21개교·40명) · 실무교사 연수 400여 명', '6개 학교 공동 3P 페스티벌 · 옵스 지역 선교'] },
      { y: '2025', items: ['교육부 교사연수청 협력 · 16개교 3P 페스티벌 (1,200명)', '두 학교와 교육과정 MOU · Dreamy Books 출판사 설립'] },
      { y: '2026', items: ['인턴 2명 파송 · 울란바토르 20개교 3P Edu Festival (1,200명)', '크리스천 리더십 교육 50여 명 · 지역 복음캠프'] },
    ],
  },
  {
    id: 'philippines', ko: '필리핀', en: 'Philippines', local: 'Pilipinas', years: '2022—', x: 83, y: 40,
    capital: '메트로 마닐라 (Metro Manila)', pop: '1억 1,559만 명', area: '30만 ㎢ · 한반도의 1.3배',
    religion: '천주교 79% · 기독교 7% · 이슬람교 6% 등',
    language: '필리핀어(타갈로그) · 영어',
    government: '대통령중심제 공화국',
    currency: '필리핀 페소 (PHP)',
    climate: '열대 몬순 · 우기와 건기',
    timezone: '한국보다 1시간 느림',
    intro: '급격한 도시화와 경제적 격차 속에 빈곤과 교육 불균형으로 소외된 계층이 배움의 기회를 잃은 땅. 마닐라 외곽 산이시드로에 드리미학교가 세워져 교육적 교류로 현지 리더들에게 도전을 준다. 바로 이곳에서 하나님의 꿈이 시작되었다.',
    themes: [
      { t: 'Dreamy School Philippines', hint: '필리핀 드리미학교 사진', d: '마닐라 빈민 이주촌 몬탈반에 개교한 필리핀 드리미학교는 열악한 교육 환경 속에 세워진 희망의 터전이다. 양질의 기독교 교육을 제공하며 필리핀의 미래를 이끌어갈 다음 세대를 양육하는 것을 비전으로 삼는다.' },
      { t: '노동', hint: '건축 노동 사진', d: '필리핀 교육선교는 수많은 손길과 땀방울이 모여 빚어졌다. 여러 기관의 후원과 함께 드리미학교 학생들이 건축에 직접 참여했고, 보수가 필요한 교육 공간을 단장하며 필리핀을 향한 사랑을 곳곳에 새겼다.' },
      { t: '쓰레기산', hint: '란필 마을 아이들 사진', d: '란필 지역은 마닐라에서 강제 이주된 빈민들이 모여 형성된 쓰레기산 마을로, 기초 인프라가 취약해 교육의 기회에서 소외된 곳이다. 파송된 교사들은 드리미학교 학생들과 함께 이 척박한 마을로 들어가 아이들에게 교육의 기회를 나눈다.' },
      { t: '인턴교사', hint: '인턴 선교사 수업 사진', d: '한국 드리미학교 교사 가정과 졸업생 인턴 선교사들이 현지로 파송되어 학교 운영과 교육을 전담하며, 살아있는 교육 선교의 모델을 만들어간다.' },
      { t: '우리의 꿈', hint: '필리핀 학생들 사진', d: '이제는 필리핀 드리미학교 학생들이 배움의 바통을 이어받아 각자의 삶으로 이야기를 써 내려간다. 그들이 꾸는 꿈은 하나님의 선교에 동참하여 소명을 살아내는 삶이다.' },
    ],
    timeline: [
      { y: '2022', items: ['교사 연수, 학교 건축', '교육과정 계획 (5불용, 빚음, 인성교육, 한국어교육, 선택활동)', '8월, 학생 교육선교'] },
      { y: '2023', items: ['교사 가정 파견 (1가정) · 졸업생 인턴 선교사 파송 (4명)', 'Dreamy School Philippines (Junior High School) 개교', '교육과정 교류 · 1월, 학생 교육선교'] },
      { y: '2024', items: ['졸업생 인턴 선교사 파송 (3명)', '고등학교 포함 12년제 교육과정 개발', '교사 연수: 교육 방법, 빚음, 5불용, 인성교육 · 1월, 학생 교육선교'] },
      { y: '2025', items: ['졸업생 인턴선교사 파송 (2명)', 'Dreamy School Philippines (Senior High School) 개교', '한국 드리미학교와 전면적 교류·방문 프로그램 · 1월, 학생 교육선교'] },
      { y: '2026', items: ['졸업생 인턴 선교사 파송 (3명) · 1학기 Dreamy Edu-Center 운영', '필리핀 기독교 학교 연합 교사세미나 (150명)', '교사연수: 교과 재구성 및 기독교 교육 · 1월, 학생 교육선교'] },
    ],
  },
  {
    id: 'cambodia', ko: '캄보디아', en: 'Cambodia', local: 'កម្ពុជា', years: '2023—', x: 63, y: 41,
    capital: '프놈펜 (Phnom Penh)', pop: '1,805만 명', area: '18.1만 ㎢ · 한반도의 0.8배',
    religion: '불교 95% · 기독교 3% · 기타 2%',
    language: '크메르어',
    government: '입헌군주제',
    currency: '리엘 (KHR) · 미국 달러 통용',
    climate: '열대 몬순',
    timezone: '한국보다 2시간 느림',
    intro: '힌두교와 대승불교의 찬란한 앙코르 시대를 거쳐 상좌부 불교로 정착했으나, 킬링필드의 종교 말살 비극을 딛고 일어나 현재는 불교를 국교로 재건한 땅. 씨엠립을 중심으로 교육과 의료가 어우러진 커뮤니티를 세워 건강한 가정과 다음 세대를 그리스도께로 인도한다.',
    themes: [
      { t: '겨자씨 초등학교', hint: '겨자씨 초등학교 사진', d: '2009년 씨엠립에 7명으로 시작해 지금은 1~6학년 6개 학급 90여 명이 재학한다. 독서수업·성경캠프·Book Fest, 졸업생과의 한국어·문화 캠프로 아이들이 자신의 미래를 상상하도록 돕는다.' },
      { t: '유치원 사역', hint: '유치원 미술활동 사진', d: 'NIBCM 캄보디아 지부 산하 다섯 유치원(샬롬·꼰뜨락·무지개·껌뽕톰 부속·드림빌 노동자 자녀). 클레이·색연필·스티커로 평소 접하기 어려운 예술 활동을 함께하며, 드리미학교 학생들이 가장 많이 웃는 만남의 시간을 갖는다.' },
      { t: 'NIBI', hint: 'NIBI 리더십 훈련 사진', d: '동남아 크리스천 공동체를 섬길 다음 세대 리더와 유치원 교사를 양성하는 기관(2008 설립, 씨엠립). 2년 기본 훈련 후 개인의 부르심에 따라 진로를 준비하며, 인도차이나 반도 청년 네트워크 형성을 기대한다.' },
      { t: '드림빌 프로젝트', hint: '드림빌 건설 현장 사진', d: 'NIBC가 이끄는 ‘교육’과 ‘의료’ 중심의 복합 커뮤니티 단지. 교회가 중심이 된 커뮤니티센터가 1,800세대를 건강하게 운영하는 모델을 제시하며, 단지 내 유·초·중·고 국제학교를 세운다(2024 착공~2028 순차 완공).' },
    ],
    timeline: [
      { y: '2023', items: ['NIBC 협력 시작 · 베트남 본사·시엠립 사역지 방문', '타운 프로젝트 개념 구상 및 협력 시작'] },
      { y: '2024', items: ['시엠립 타운 설계 및 착공', '교육선교 협력 · 5월, 학생 교육선교'] },
      { y: '2025', items: ['5월, 학생 교육선교'] },
      { y: '2026', items: ['학교 설립 준비 · Dreamy Teacher Academy 교사 연수 (9월)', '학교 설립 세미나 · 5월, 학생 교육선교'] },
      { y: '2027', items: ['타운 및 학교 오픈', '타운 분양 및 학교 순차적 개교'] },
    ],
  },
  {
    id: 'indonesia', ko: '인도네시아', en: 'Indonesia', local: 'Indonesia', years: '2024—', x: 66, y: 53,
    capital: '자카르타 (Jakarta)', pop: '2억 8,720만 명', area: '191.7만 ㎢ · 한반도의 약 9배',
    religion: '이슬람 87% · 기독교 7% · 천주교 3% · 힌두 2% · 불교 1%',
    language: '인도네시아어',
    government: '대통령중심제 공화국',
    currency: '루피아 (IDR)',
    climate: '열대 우림 기후',
    timezone: '한국보다 2시간 느림 (자카르타)',
    intro: '인구 2억 8천만의 다인종·다종교 국가. 자카르타의 JIU와 CGA는 기독교 세계관으로 다음 세대를 양성한다. 드리미학교는 교육 철학을 공유하며 교사·학생 교류로 교육 선교의 지평을 넓힌다.',
    themes: [
      { t: 'JIU & CGA', hint: 'JIU·CGA 캠퍼스 사진', d: '자카르타의 JIU(대학)와 CGA(1~12학년 기독교 학교)는 기독교 세계관으로 다음 세대를 양성한다. 애터미의 후원으로 완공된 Danvit Hall에 ‘Dreamy Library’를 조성해 초·중·고와 대학생이 함께 머무는 배움과 교류의 공간을 마련했다.' },
      { t: '만남, 관계', hint: 'CGA 교류·방문 사진', d: '드리미학교는 두 기관과 교육 철학을 공유하며 학생·교사 교류로 선교의 지평을 넓힌다. 2024년 첫 만남 이후 CGA 교사 26명이 방한하고, 드리미 학생들이 CGA를 찾아 방과후 프로그램과 Academic Festival을 함께한다.' },
      { t: '함께 섬기다', hint: '어린이 캠프·지역 섬김 사진', d: '드리미 학생들과 CGA 12학년 학생들이 함께 인도네시아 어린이들을 위한 캠프를 진행하며 지역을 섬긴다. 교실 너머의 이웃에게 배움과 사랑을 나눈다.' },
      { t: '같은 곳을 향하여', hint: 'DIF·비전 공유 사진', d: 'CGA 학생·교사가 한국의 DIF(Dreamy International Festival)에 참여해 필리핀·몽골 학생들과 프로젝트를 나눈다. 두 학교는 하나님 나라를 함께 세워가는 비전을 향해 나아간다.' },
    ],
    timeline: [
      { y: '2012', items: ['Jakarta International University (JIU) 설립 위원회 구성'] },
      { y: '2015', items: ['Cornerstone Global Academy (CGA) 기독교 초·중·고 설립'] },
      { y: '2017', items: ['K-Eduplex 캠퍼스 본관 건물 완공'] },
      { y: '2018', items: ['JIU 개교 및 입학식 · MCLC 유치원 설립'] },
      { y: '2022', items: ['JIU 종합대학 승격 (3개 단과대·6개 학과) · 1회 졸업식'] },
      { y: '2024', items: ['드리미–CGA 첫 만남 · 교사 26명 방한 (교사 연수·비전트립)', '드리미재단 CGA 사역에 40만 달러 기증'] },
      { y: '2025', items: ['5월, 학생 교육선교 · CGA 기숙사 건축 100만 달러 기증', '12월, CGA 학생·교사 DIF 참여'] },
      { y: '2026', items: ['5월, 학생 교육선교 · 어린이 캠프'] },
    ],
  },
  {
    id: 'india', ko: '인도', en: 'India', local: 'भारत', years: '2019—', x: 37, y: 35,
    capital: '뉴델리 (New Delhi)', pop: '약 14억 3천만 명', area: '328만 ㎢ · 한반도의 약 15배',
    religion: '힌두교 79.8% · 이슬람교 14.2% · 기독교 2.3% 등',
    language: '힌디어 · 영어 등 (공용어 22개)',
    government: '의원내각제 연방공화국',
    currency: '인도 루피 (INR)',
    climate: '열대 몬순 · 지역 차 큼',
    timezone: '한국보다 3시간 30분 느림',
    intro: '다신교와 다언어의 광활한 아대륙. 방갈로르와 나갈랜드, 마니푸르에 세워진 드리미 학교들이 고아와 소외된 아이들에게 배움의 집이 되어 준다.',
    themes: [
      { t: 'Dreamy School · Bangalore', hint: '방갈로르 드리미학교 사진', d: '2019년 개교. 드리미학교 교사가 파견 근무하고, 인도 현지 교사 두 명이 한국에서 함께 일하며 교육을 교류한다.' },
      { t: 'Little Flower School · Nagaland', hint: '나갈랜드 학교 사진', d: '2006년 설립된 나갈랜드의 학교. 학생 643명, 교사 18명. 고아를 위한 생활관과 풋살장, 기자재를 지원했다.' },
      { t: 'Dreamy International · Manipur', hint: '마니푸르 학교 사진', d: '2024년 개교. 학생 286명, 교사 17명이 함께하는 새로운 배움의 터전이다.' },
    ],
    timeline: [
      { y: '2006', items: ['Nagaland Little Flower Dreamy School 설립 (학생 643명·교사 18명)'] },
      { y: '2019', items: ['Dreamy School (Bangalore) 개교', '드리미학교 교사 파견 · 현지 교사 2인 한국 근무'] },
      { y: '2020', items: ['Little Flower School 고아용 생활관 건축 · 풋살장·기자재 지원'] },
      { y: '2024', items: ['Dreamy Academy International (Manipur) 개교 (학생 286명·교사 17명)'] },
    ],
  },
  {
    id: 'pakistan', ko: '파키스탄', en: 'Pakistan', local: 'پاکستان', years: '2016—', x: 29, y: 26,
    capital: '이슬라마바드 (Islamabad)', pop: '2억 4,500만 명', area: '79.6만 ㎢ · 한반도의 약 3.5배',
    religion: '이슬람교 96.4% (수니 다수) · 기독교 1.6% · 힌두교 1% 등',
    language: '우르두어 · 영어',
    government: '의원내각제 연방공화국',
    currency: '파키스탄 루피 (PKR)',
    climate: '건조 · 반건조 기후',
    timezone: '한국보다 4시간 느림',
    intro: '인구의 96%가 무슬림인 땅에서, 소수자와 기독교 공동체를 위한 대학 PGI가 세워졌다. 2011년 순교한 소수자민족부 장관 샤바즈 바티의 뜻을 이어, 사랑과 평화·정의·섬김의 공동체를 짓는다.',
    themes: [
      { t: 'Pakistan Global Institute', hint: 'PGI 캠퍼스 사진', d: '파키스탄 건국 이래 외국인이 처음으로 직접 설립한 고등교육기관. 소수자와 기독교 공동체를 위해, 순교한 샤바즈 바티 장관의 뜻을 이어 세워졌다. 2022년 캠퍼스 완공, 2023년 정부 인증 대학으로 개교했다.' },
      { t: 'Dreamy Teacher Academy', hint: '교사연수 사진', d: '기독교 교육과 미래교육, 교육과정 디자인을 나누는 교사연수. 2024년 35명, 2025년 56명, 2026년 82명으로 참여가 늘었다.' },
      { t: "Dreamy Women's Dormitory", hint: '여학생 기숙사 사진', d: '애터미 박한길 회장의 후원으로 2025년 3월 완공된 여학생 기숙사와 교직원 숙소. ‘인간을 사랑하는 기업’의 마음이 배움의 터전이 되었다.' },
      { t: 'Aman, the Dove', hint: 'PGI 마스코트 Aman 이미지', d: '사랑·평화·섬김을 상징하는 PGI의 마스코트. ‘몸은 여럿이나 그리스도 안에서 한 몸’(롬 12:5)이라는 고백을 담았다.' },
    ],
    timeline: [
      { y: '2016', items: ['파키스탄 고등교육위원회로부터 설립 허가 획득'] },
      { y: '2022', items: ['PGI 캠퍼스 건축 완공', '드리미재단과 협력하여 홍수 재난 지원'] },
      { y: '2023', items: ['파키스탄 정부 공식 인증 대학으로 개교'] },
      { y: '2024', items: ['몽상 장학생 선발 · 박한길 박사 특강 (리더십과 기업가 정신)', 'Dreamy Teacher Academy 35명'] },
      { y: '2025', items: ['드리미 여학생 기숙사·교직원 숙소 완공', '박한길 박사 경영학석부 석좌교수 취임 · 교사연수 56명'] },
      { y: '2026', items: ['Dreamy Higher Secondary School 설립 · 초등 영어 중심 국제교육', '교사연수 82명 · 무슬림 사회 기독교 교육'] },
    ],
  },
];

/** 각 테마의 이미지 슬롯 id (main / 보조 b / 보조 c) */
export function themeSlots(countryId: string, i: number) {
  const n = i + 1;
  return { main: `th-${countryId}-${n}`, b: `th-${countryId}-${n}-b`, c: `th-${countryId}-${n}-c` };
}

/** 지도 기하 — arc 경로 + 노드 위치(%) 계산 */
export function geo(c: Pick<Country, 'x' | 'y'>) {
  const S = SEOUL;
  const mx = (S.x + c.x) / 2;
  const my = (S.y + c.y) / 2;
  const dx = c.x - S.x;
  const dy = c.y - S.y;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  const k = 0.17 * len;
  const cx = (mx + nx * k).toFixed(1);
  const cy = (my + ny * k).toFixed(1);
  return {
    arcPath: `M ${S.x} ${S.y} Q ${cx} ${cy} ${c.x} ${c.y}`,
    nodeLeft: `${c.x}%`,
    nodeTop: `${((c.y / VBH) * 100).toFixed(2)}%`,
  };
}

export function findCountry(id: string) {
  return COUNTRIES.find((c) => c.id === id) ?? null;
}
export function countryIndex(id: string) {
  return COUNTRIES.findIndex((c) => c.id === id);
}
