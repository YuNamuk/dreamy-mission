/**
 * 교육선교 아카이브 — 6개국 시드 데이터 + 지도 기하(arc/노드 좌표) 헬퍼.
 *
 * 이 파일의 데이터는 "시드"다. 실제 표시 콘텐츠는 lib/content.ts 가
 * Supabase(app_3)의 편집본이 있으면 그것을, 없으면 이 시드를 쓴다.
 * 문구 기준: 전시 국가별 문구 수정본(2026.7) — 한다체 / 개신교·천주교 병기 / 교육선교 붙여쓰기.
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
  /** 사역지 주소(표시·지오코딩용) — 병합 시 채워짐 */
  address?: string;
  /** 지도 표기 좌표 [위도, 경도] — 병합 시 채워짐 */
  site?: [number, number];
}

/** 드리미학교(천안) 원점 — 추상 arc 시작점 */
export const SEOUL = { x: 76, y: 23 };
const VBH = 64;

/** 실제 지도(Leaflet)용 좌표 [위도, 경도] — 사역지 주소 지오코딩 기반 (관리자에서 수정 가능) */
export const SEOUL_LATLNG: [number, number] = [36.805, 127.3193]; // 드리미학교(천안 병천면 봉항로 89)
export const LATLNG: Record<string, [number, number]> = {
  mongolia: [48.06, 106.66], // 울란바타르 송기노하이르한구
  philippines: [14.7614, 121.153], // 리잘 로드리게스(San Isidro)
  cambodia: [13.3599, 103.8615], // 씨엠립 Treak
  indonesia: [-6.352, 107.1819], // 브카시 델타마스(Cikarang)
  india: [28.61, 77.21], // 뉴델리 (주소 미지정)
  pakistan: [33.4831, 73.1261], // 라왈핀디 Rawat
};

/** 각 나라 사역지 기본 주소(시드) — 관리자에서 수정 시 편집본이 우선 */
export const SEED_ADDRESS: Record<string, string> = {
  mongolia: 'Songinokhairkhan District, 19th Khoroo, Ulaanbaatar, Mongolia',
  philippines: 'Lot 23 Block 2 PSD 56216 Sitio Tanag, Brgy. San Isidro, Rodriguez, Rizal, Philippines',
  cambodia: '140 Group 5 Treak, Krong Siem Reap, Cambodia',
  indonesia: 'K-Eduplex, Jl. Ganesha 2, Lot B1, Deltamas, Central Cikarang, Bekasi Regency, West Java 17530, Indonesia',
  india: '',
  pakistan: 'Moza Bagga Sheikhan, Near Police Training School, Rawat, Rawalpindi, Pakistan',
};

export const COUNTRIES: Country[] = [
  {
    id: 'mongolia', ko: '몽골', en: 'Mongolia', local: 'Монгол', years: '2021—', x: 60, y: 15,
    capital: '울란바타르 (Ulaanbaatar)', pop: '354만 명', area: '156만 4,000㎢ · 한반도의 약 7.1배',
    religion: '라마교(티베트 불교) 51.7% · 무교 40.6% · 이슬람교 3.2% · 기독교 1.3%',
    language: '몽골어',
    government: '이원집정부제 공화국',
    currency: '투그릭 (MNT)',
    climate: '대륙성 건조 기후 · 혹한의 겨울',
    timezone: '한국보다 1시간 느림',
    intro: '몽골은 한반도의 약 7.1배에 이르는 156만 4,000㎢의 광활한 땅에 354만 명이 살아가는 나라로, 인구의 절반이 수도 울란바타르(Ulaanbaatar)에 모여 사는 동안 지역은 교육과 복음의 손길에서 멀어져 왔다. 라마교(티베트 불교, 51.7%)와 무교(40.6%)가 다수이며 기독교인은 1.3%에 불과하다. 드리미학교는 크리스천 리더를 양성하고 복음의 공공성 원리에 따라 공립학교 교육의 성장을 섬기고 있다. 교사가 세워지고 배움이 초원 끝 마을까지 닿아, 몽골의 다음 세대가 하나님 앞에 온전한 한 사람으로 서는 날을 향해 이 길을 걸어간다.',
    themes: [
      { t: '3P EDU Festival — 울란바타르 전역으로 번지는 배움의 축제', hint: '3P 페스티벌 사진', d: '울란바타르 한 구의 5개 학교로 시작된 3P EDU Festival은 이제 울란바타르 전역의 학생과 교사를 초청하는 교육 축제로 자랐다. 프로젝트 중심 교육의 결과물을 나누고 서로에게 배우며, 학생들이 창조세계를 돌보고 사랑하도록 돕는 배움과 만남, 성장의 장이 되고 있다.' },
      { t: 'Dreamy Teachers Academy — 교사를 세워 교육을 세우다', hint: '교사연수 사진', d: 'Dreamy Teachers Academy는 몽골 공립학교 교육의 성장을 위해 교사 연수를 꾸준히 이어오고 있다. 방학에는 울란바타르에서 학습자 중심 교육 방법과 인성교육 교재 활용 연수를 열고, 매 학기 몽골의 교사와 학생들이 한국 드리미학교를 방문하여 연수를 진행한다.' },
      { t: '밝은미래학교·빚음 인성교육 — 전인적 성장으로 빚어가다', hint: '밝은미래학교·빚음 인성교육 사진', d: '밝은미래학교는 한국 선교사가 설립한 기독교 학교로, 선교와 크리스천 리더 양성을 사명으로 삼아 왔다. 드리미학교는 2022년부터 졸업생 인턴 교사 파송, 프로젝트 중심 교육, 빚음 인성교육으로 동역하며, 시간관리·가치·감정·자아존중감 교육 내용을 교재로 출판(Dreamy Books)하여 몽골 학생들의 전인적 성장을 돕고 있다.' },
      { t: '지역 선교 — 초원 끝 마을까지 찾아가는 사랑', hint: '지역 선교·복음캠프 사진', d: '한반도의 약 7.1배에 이르는 몽골의 지역은 교육적·문화적 혜택이 닿기 어렵고, 이동이 쉽지 않아 고립된 곳이 많다. 드리미학교 학생들은 해마다 지역의 학교를 찾아가 인성교육과 프로젝트 중심 교육으로 도전을 주고, 복음캠프를 열어 학생들이 하나님께로 돌아오도록 돕고 있다.' },
    ],
    timeline: [
      { y: '1997', items: ['한국 선교사가 기독교 초중등학교인 밝은미래학교 설립, 선교와 크리스천 리더 양성 사역 시작'] },
      { y: '2021', items: ['밝은미래학교 사역 협력기관 확정, 교육 협력 및 지원 논의'] },
      { y: '2022', items: ['교사 가정 파송(1가정), 졸업생 인턴 교사 파송(2명)', '온라인 한국어교육, 3P 교육 학교 모델링'] },
      { y: '2023', items: ['졸업생 인턴 교사 파송(3명)', '중고등학생 교육 캠프(복음 캠프, 한국어 캠프), 빚음 과정 도입', '울란바타르 학교 교사 연수'] },
      { y: '2024', items: ['졸업생 인턴 교사 파송(2명)', '밝은미래학교 전교생 빚음·복음 캠프', '공립학교 교장단 방문 연수(21개교 40명), 실무교사 연수(6개교 400여 명), 공동 3P 페스티벌, 3P 전문 코치 과정(40명)', '지역 선교(옵스 아이막 테스얄랑솜: 복음캠프, 한국어 캠프)'] },
      { y: '2025', items: ['졸업생 인턴 교사 파송(2명)', '인성교육 교재 제작 및 학급별 교육, 크리스천 리더십 교육(40여 명)', '교육부 산하 교사연수청 협력, 바양골구·성긴하이르한구 교육 연수(교사 300명, 학생 250명, 학부모 250명), 16개교 3P 페스티벌(1,200명)', '2개교 교육과정 MOU 체결', 'Dreamy Books 출판사 설립(인성교육 교재 2권, 초등 그림책 6권 출판)', '지역 선교(바양차간 지역 학교 교육 협력)'] },
      { y: '2026', items: ['졸업생 인턴 교사 파송(2명)', '인성교육 교재 보급, 크리스천 리더십 교육(50여 명), 공동 3P Festival', '울란바타르 교사 연수(300여 명), 20개교 3P Edu Festival(1,200명), 교사·학생 방문 연수', '지역 선교(인성교육, 문제해결 프로젝트, 복음 캠프)'] },
    ],
  },
  {
    id: 'philippines', ko: '필리핀', en: 'Philippines', local: 'Pilipinas', years: '2022—', x: 83, y: 40,
    capital: '메트로 마닐라 (Metro Manila)', pop: '1억 1,559만 명', area: '30만㎢ · 한반도의 약 1.3배',
    religion: '천주교 79% · 개신교 7% · 이슬람교 6% 등',
    language: '필리핀어(타갈로그) · 영어',
    government: '대통령중심제 공화국',
    currency: '필리핀 페소 (PHP)',
    climate: '열대 몬순 · 우기와 건기',
    timezone: '한국보다 1시간 느림',
    intro: '필리핀은 수도 마닐라(Metro Manila)를 중심으로 1억 1,559만 명이 30만㎢(한반도의 약 1.3배)의 섬들에 살아가는 나라로, 천주교(79%)와 개신교(7%)가 다수인 기독교 문화권이다. 그러나 급격한 도시화와 경제적 격차 속에서 빈곤과 교육 불균형이 깊어지고, 마닐라 외곽의 빈민 이주촌 아이들은 배움의 기회에서 밀려나 있다. 드리미학교는 이곳에 학교를 세우고 교사를 파송하여 배움의 기회를 회복하는 교육선교에 동참하고 있다. 이제 배움의 바통을 이어받은 필리핀의 아이들이 각자의 삶으로 하나님의 선교를 살아내는 날을 향해, 드리미학교는 이 동역의 길을 계속 걸어간다.',
    themes: [
      { t: 'Dreamy School Philippines — 빈민 이주촌에 세워진 희망의 터전', hint: '필리핀 드리미학교 사진', d: '마닐라 빈민 이주촌 몬탈반(Montalban)에 개교한 필리핀 드리미학교는 열악한 교육 환경 속에 세워진 희망의 터전이다. 양질의 기독교 교육으로 필리핀의 미래를 이끌어갈 다음 세대를 양육하는 것을 비전으로 삼는다.' },
      { t: '학교 건축 사역 — 수많은 손길과 땀방울로 빚어진 학교', hint: '건축 노동 사진', d: '필리핀 드리미학교는 수많은 손길과 땀방울이 모여 빚어졌다. 여러 기관의 후원과 함께 드리미학교 학생들이 건축에 직접 참여했고, 보수가 필요한 교육 공간을 단장하며 필리핀을 향한 사랑을 곳곳에 새겼다.' },
      { t: '란필 에듀센터(Landfill Edu-Center) — 쓰레기산 마을로 들어간 사랑', hint: '란필 마을 아이들 사진', d: '란필(Landfill) 지역은 마닐라에서 강제 이주된 빈민들이 모여 형성된 쓰레기산 마을로, 기초 인프라가 취약해 교육의 기회에서 소외된 곳이다. 파송된 교사들은 필리핀 드리미학교 학생들과 함께 이 척박한 마을로 들어가 아이들에게 교육의 기회를 나눈다.' },
      { t: '교사 파송 — 삶으로 복음을 가르치는 사람들', hint: '인턴 교사 수업 사진', d: '한국 드리미학교 교사 가정과 졸업생 인턴 교사들이 현지로 파송되어 학교 운영과 교육을 전담하며 살아있는 교육선교의 모델을 만들어가고 있다. 이들의 헌신은 성공이 아닌 섬김의 길을 걷는 삶 그 자체로 복음을 증언한다.' },
      { t: '3P Festival — 배움의 바통을 이어받은 아이들', hint: '필리핀 학생들 사진', d: '드리미학교의 교육 철학인 3P(Play, Performance, Practice)를 바탕으로 열리는 3P 페스티벌은 양국 학생들이 후원 관계를 넘어 동등한 파트너로 만나는 교육 축제다. 이제는 필리핀 드리미학교 학생들이 배움의 바통을 이어받아 각자의 삶으로 그 이야기를 써 내려가고 있으며, 이곳에서 그들이 꾸는 꿈은 하나님의 선교에 동참하여 소명을 살아내는 삶이다.' },
    ],
    timeline: [
      { y: '이전', items: ['마닐라 외곽 빈민가에서 헌신해 온 선교사들이 초등 과정인 산 이시드로 그레이스 스쿨(San Isidro Grace School)을 운영하며 지역 교육의 토대 마련 (연도 미상)'] },
      { y: '2022', items: ['교사 연수, 학교 건축 참여', '교육과정 계획(5불용, 빚음, 인성교육, 한국어교육, 선택활동)', '8월 학생 교육선교'] },
      { y: '2023', items: ['교사 가정 파송(1가정), 졸업생 인턴 교사 파송(4명)', 'Dreamy School Philippines(Junior High School) 개교', '1월 학생 교육선교'] },
      { y: '2024', items: ['졸업생 인턴 교사 파송(3명)', '고등학교 포함 12년제 교육과정 개발', '교사 연수(교육 방법, 빚음, 5불용, 인성교육)', '1월 학생 교육선교'] },
      { y: '2025', items: ['졸업생 인턴 교사 파송(2명)', 'Dreamy School Philippines(Senior High School) 개교', '한국 드리미학교와 전면적 교류 및 방문 프로그램', '교사 연수(학생 주도성 교육)', '1월 학생 교육선교'] },
      { y: '2026', items: ['졸업생 인턴 교사 파송(3명)', '1학기 Dreamy Edu-Center 운영', '필리핀 기독교 학교 연합 교사세미나 개최(150명 참여)', '교사 연수(교과 재구성 및 기독교 교육)', '1월 학생 교육선교'] },
    ],
  },
  {
    id: 'cambodia', ko: '캄보디아', en: 'Cambodia', local: 'កម្ពុជា', years: '2023—', x: 63, y: 41,
    capital: '프놈펜 (Phnom Penh)', pop: '1,784.8만 명', area: '18만 1,000㎢ · 한반도의 약 0.8배',
    religion: '불교 95% · 기타 5%',
    language: '크메르어',
    government: '입헌군주제',
    currency: '리엘 (KHR) · 미국 달러 통용',
    climate: '열대 몬순',
    timezone: '한국보다 2시간 느림',
    intro: '캄보디아는 수도 프놈펜(Phnom Penh)을 중심으로 1,784.8만 명이 18만 1,000㎢(한반도의 약 0.8배)의 땅에 살아가며, 불교(95%)가 국교인 나라다. 찬란한 앙코르 문명의 땅이지만 킬링필드의 비극으로 한 세대의 지성과 신앙이 무너지는 아픔을 지나왔다. 드리미학교는 씨엠립(Siem Reap)에서 교육으로 다음 세대를 세우는 현지 사역자들과 동역하고 있다. 무너졌던 세대의 자리에서 새로운 세대가 배움과 신앙으로 일어서는 날을 소망하며, 드림빌에 세워질 학교와 함께 그 길을 걸어간다.',
    themes: [
      { t: '겨자씨초등학교 — 일곱 명으로 시작된 겨자씨의 자람', hint: '겨자씨초등학교 사진', d: '2009년 씨엠립에 세워진 겨자씨초등학교는 학생 7명으로 시작하여 현재 6개 학급 90여 명이 재학하는 학교로 자랐다. 드리미학교는 재학생들과 독서수업, 성경캠프, Book Fest를, 졸업생들과 한국어·한국문화 캠프를 함께하며 지속적인 관계를 이어가고 있다.' },
      { t: '유치원 사역 — 가장 많이 웃는 만남의 시간', hint: '유치원 미술활동 사진', d: 'NIBCM 캄보디아 지부 산하의 여러 유치원에서 드리미학교 학생들은 목각인형, 클레이, 색종이 등 다양한 재료로 아이들이 평소 접하기 어려운 예술 활동을 함께한다. 드리미 학생들이 가장 기대하고 가장 많이 웃는 시간 중 하나다.' },
      { t: 'NIBI — 동남아시아를 섬길 다음 세대 리더십', hint: 'NIBI 리더십 훈련 사진', d: 'NIBI(New International Bethany Institute)는 동남아시아 크리스천 공동체를 섬길 다음 세대 리더와 유치원 교사를 양성하기 위해 2008년 씨엠립에 설립된 기관이다. 다양한 국적의 학생 30여 명이 훈련받고 있으며, 인도차이나 반도의 크리스천 청년 네트워크 형성을 지향한다. 드림빌에서의 교육을 위해 드리미학교와 협력하고 있다.' },
      { t: '드림빌 프로젝트 — 교육과 의료로 세우는 건강한 마을', hint: '드림빌 건설 현장 사진', d: '드림빌(DreamVil)은 씨엠립 현지인들에게 건강한 삶을 선물하기 위해 교육과 의료를 중심으로 계획된 1,800세대 규모의 복합 커뮤니티 단지다. 단지 안에 유치·초·중·고 과정의 국제학교를 세워 캄보디아의 아이들과 가정을 주님께로 인도하는 장이 되기를 기대하며, 드리미학교가 학교 설립에 동역하고 있다.' },
    ],
    timeline: [
      { y: '2004', items: ['NIBC(Not I But Christ), 한동대학교 동남아시아지역 연구팀으로 시작'] },
      { y: '2008', items: ['NIBI(New International Bethany Institute) 설립, 다음 세대 리더십 양성 시작'] },
      { y: '2009', items: ['NIBC 주거 개발 회사 설립(이후 3개국 10개 도시 약 3만 세대 공급)', '겨자씨초등학교 설립(학생 7명으로 개교)'] },
      { y: '2023', items: ['드리미학교, NIBC 협력 시작', '사역지 방문', '타운(드림빌) 프로젝트 개념 구상 및 협력 시작'] },
      { y: '2024', items: ['드림빌 타운 설계 및 착공', '교육선교 협력', '5월 학생 교육선교'] },
      { y: '2025', items: ['5월 학생 교육선교'] },
      { y: '2026', items: ['학교 설립 준비', 'Dreamy Teachers Academy 교사 연수(9월 예정)', '학교 설립 세미나', '5월 학생 교육선교'] },
      { y: '2027', items: ['드림빌 타운 및 학교 개교 예정'] },
    ],
  },
  {
    id: 'indonesia', ko: '인도네시아', en: 'Indonesia', local: 'Indonesia', years: '2024—', x: 66, y: 53,
    capital: '자카르타 (Jakarta)', pop: '2억 8,720만 명', area: '191만 6,820㎢ · 한반도의 약 9배',
    religion: '이슬람교 87% · 개신교 7% · 천주교 3% · 힌두교 2% · 불교 1%',
    language: '인도네시아어',
    government: '대통령중심제 공화국',
    currency: '루피아 (IDR)',
    climate: '열대 우림 기후',
    timezone: '한국보다 2시간 느림 (자카르타)',
    intro: '인도네시아는 수도 자카르타(Jakarta)를 중심으로 2억 8,720만 명이 191만 6,820㎢(한반도의 약 9배)의 광대한 섬들에 살아가는 세계 4위의 인구 대국이며, 이슬람교(87%)가 다수인 가운데 개신교(7%)와 천주교(3%)가 소수로 자리한다. 이 땅에서 기독교 교육은 소수의 길이지만, 드리미학교는 자카르타의 기독교 교육기관들과 교육 철학을 나누며 학생과 교사가 서로에게 배우는 동역의 길을 걷고 있다. 서로에게 배우는 이 동역이 국경과 언어를 넘어, 다음 세대를 향한 하나님 나라의 비전으로 계속 확장되기를 소망한다.',
    themes: [
      { t: 'JIU·CGA — 기독교 세계관으로 다음 세대를 세우는 캠퍼스', hint: 'JIU·CGA 캠퍼스 사진', d: '자카르타의 JIU(Jakarta International University)와 CGA(Cornerstone Global Academy)는 기독교 세계관을 바탕으로 다음 세대를 양성하는 교육기관이다. 다양한 국가와 문화적 배경의 학생들이 함께 배우며 신앙과 인성, 학문을 균형 있게 성장시키고 있다.' },
      { t: 'Dreamy Library — 배움과 교류가 머무는 공간', hint: 'Dreamy Library 사진', d: 'Danvit Hall 안에 조성된 Dreamy Library는 초·중·고 학생과 대학생이 함께 이용하는 배움과 교류의 공간이다. 도서관 안쪽의 Mini Library는 초등학생들이 방과 후 숙제를 하고 독서를 즐기며 편안하게 머무는 따뜻한 배움의 자리가 되고 있다.' },
      { t: '교사 교류 — 서로에게 배우는 동역자들', hint: 'CGA 교사 교류 사진', d: '2023년부터 CGA 교사들은 여러 차례 한국 드리미학교를 방문하며 교육 철학과 교육과정, 학교 운영 전반을 나누어 왔다. 수업 참관과 교사 연수, 교육 세미나를 통해 양국 교사들은 하나님 나라를 위한 교육선교의 동역자로 함께 세워지고 있다.' },
      { t: '학생 교류(Academic Festival·DIF) — 국경을 넘어 같은 곳을 향하여', hint: 'Academic Festival·DIF 사진', d: '2025년부터 드리미학교와 CGA 학생들의 본격적인 교류가 시작되었다. 드리미학교 학생들은 CGA를 방문해 방과후 프로그램과 Academic Festival을 함께 열었고, CGA 학생들은 한국에서 열린 DIF(Dreamy International Festival)에 참가해 프로젝트와 비전을 나누었다. 2026년에는 양국 학생들이 함께 인도네시아 어린이들을 위한 캠프를 섬기며, 하나님 나라를 함께 세워가는 꿈을 확장해 가고 있다.' },
    ],
    timeline: [
      { y: '2012', items: ['Jakarta International University(JIU) 설립위원회 구성'] },
      { y: '2015–2018', items: ['Cornerstone Global Academy(CGA) 설립(2015)', 'K-Eduplex 캠퍼스 본관 완공(2017)', 'JIU 개교 및 MCLC 유치원 설립(2018)'] },
      { y: '2022', items: ['JIU 종합대학 승격(3개 단과대학, 6개 학과), 1회 졸업식'] },
      { y: '2024', items: ['6월, 드리미학교에서 CGA 관계자들과 첫 만남, 협력 가능성 논의', '7월, 드리미학교 대표단 CGA 방문, 교육 세미나 및 비전 공유', '12월, CGA 교사 26명 한국 방문(교사 연수·비전트립)'] },
      { y: '2025', items: ['3월, CGA 복음 사경회', '5월, 학생 교육선교(학생 10명, 교사 2명 CGA 방문)', '6월, Danvit Hall 완공 및 Dreamy Library 조성', '12월, CGA 학생 15명·교사 8명 DIF 참석'] },
      { y: '2026', items: ['5월, 학생 교육선교(CGA 12학년 학생들과 인도네시아 어린이 캠프 진행)'] },
    ],
  },
  {
    id: 'india', ko: '인도', en: 'India', local: 'भारत', years: '2019—', x: 37, y: 35,
    capital: '뉴델리 (New Delhi)', pop: '14억 5,600만 명', area: '328만 7,782㎢ · 한반도의 약 15배',
    religion: '힌두교 79.8% · 이슬람교 14.2% · 기독교 2.3% 등',
    language: '힌디어 · 영어 등 (공용어 22개)',
    government: '의원내각제 연방공화국',
    currency: '인도 루피 (INR)',
    climate: '열대 몬순 · 지역 차 큼',
    timezone: '한국보다 3시간 30분 느림',
    intro: '인도는 수도 뉴델리(New Delhi)를 중심으로 14억 5,600만 명이 328만 7,782㎢(한반도의 약 15배)의 대륙 같은 땅에 살아가는 세계 1위의 인구 대국이며, 힌두교(79.8%)와 이슬람교(14.2%)가 다수인 가운데 기독교는 소수로 자리한다. 지역마다 언어와 문화, 교육 환경의 격차가 큰 이 땅에서 드리미학교는 방갈로르(Bangalore)와 나갈랜드(Nagaland)·마니푸르(Manipur)의 학교들과 동역하고 있다. 교육이 닿는 자리마다 아이들의 삶과 미래가 달라지는 이 여정이, 인도의 더 많은 자리에서 이어지기를 소망한다.',
    themes: [
      { t: 'Little Flower Dreamy School(Nagaland) — 언덕 마을에 세워진 배움의 터', hint: '나갈랜드 학교 사진', d: '2006년 나갈랜드에 세워진 Little Flower Dreamy School은 현재 학생 643명, 교사 18명이 함께하는 학교로 자랐다. 고아 학생들을 위한 생활관과 풋살장이 세워져 아이들의 배움과 삶을 함께 품고 있다.' },
      { t: 'Dreamy School Bangalore — 교사가 오가며 세워지는 학교', hint: '방갈로르 드리미학교 사진', d: '2019년 방갈로르에 개교한 Dreamy School은 드리미학교 교사 파송과 현지 교사의 한국 파견 근무를 통해 양방향으로 교육을 나누며 세워졌다.' },
      { t: 'Dreamy Academy International(Manipur) — 새로 시작된 배움의 공동체', hint: '마니푸르 학교 사진', d: '2024년 마니푸르에 개교한 Dreamy Academy International은 학생 286명, 교사 17명과 함께 첫걸음을 내딛었다.' },
    ],
    timeline: [
      { y: '2006', items: ['나갈랜드에 Little Flower Dreamy School 설립(현재 학생 643명, 교사 18명)'] },
      { y: '2019', items: ['Dreamy School(Bangalore) 개교', '드리미학교 교사 파송 근무', '인도 현지 교사 2인 한국 파견 근무'] },
      { y: '2020', items: ['Little Flower School 고아 학생 생활관 건축, 풋살장 조성, 기자재 지원'] },
      { y: '2024', items: ['Dreamy Academy International(Manipur) 개교(학생 286명, 교사 17명)'] },
    ],
  },
  {
    id: 'pakistan', ko: '파키스탄', en: 'Pakistan', local: 'پاکستان', years: '2016—', x: 29, y: 26,
    capital: '이슬라마바드 (Islamabad)', pop: '약 2억 5,500만 명', area: '79만 6,000㎢ · 한반도의 약 3.5배',
    religion: '이슬람교 96.4% · 기독교 1.6% · 힌두교 1% 등',
    language: '우르두어 · 영어',
    government: '의원내각제 연방공화국',
    currency: '파키스탄 루피 (PKR)',
    climate: '건조 · 반건조 기후',
    timezone: '한국보다 4시간 느림',
    intro: '파키스탄은 수도 이슬라마바드(Islamabad)를 중심으로 약 2억 5,500만 명이 79만 6,000㎢(한반도의 약 3.5배)의 땅에 살아가는 세계 5위의 인구 대국이며, 이슬람교(96.4%)가 국교인 이 땅에서 기독교인은 소수자로 살아간다. PGI는 소수자와 기독교 공동체를 위한 고등교육의 문을 여는 대학으로 세워졌고, 드리미학교는 교사 연수와 교육과정 협력으로 이 여정에 동참하고 있다. 닫혀 있던 배움의 문이 더 이른 자리에서, 더 많은 이들에게 열리기를 소망하며 함께 걸어간다.',
    themes: [
      { t: 'Pakistan Global Institute — 순교의 자리에서 시작된 대학', hint: 'PGI 캠퍼스 사진', d: 'PGI는 2011년 파키스탄 소수자민족부 장관 샤바즈 바티의 순교를 계기로, 소수자와 기독교 공동체를 위한 대학 설립이 결정되며 시작되었다. 2023년 파키스탄 건국 이후 최초로 외국인이 직접 설립한 정부 공인 고등교육기관으로 개교하여, 경영학·컴퓨터학·데이터분석학 등으로 다음 세대를 교육하고 있다.' },
      { t: 'Dreamy Teachers Academy — 해마다 자라나는 교사들의 배움', hint: '교사연수 사진', d: '2024년 35명으로 시작된 Dreamy Teachers Academy 교사 연수는 2025년 56명, 2026년 82명으로 해마다 자라고 있다. 기독교 교육, 미래교육, 교육과정 디자인, 교사 사명선언문 작성 등 교사의 내면과 전문성을 함께 세우는 연수로 이어지고 있다.' },
      { t: '몽상 장학 사역 — 다음 세대를 위한 리더십 교육', hint: '장학·리더십 교육 사진', d: '몽상 장학생 선발과 리더십·기업가 정신 강의를 통해 PGI 학생들이 학업과 소명을 이어가도록 돕고 있다. 배움의 기회가 닫혀 있던 젊은이들에게 고등교육의 길이 열리고 있다.' },
      { t: 'Dreamy Higher Secondary School — 새로 열리는 초·중등 교육의 길', hint: '초·중등 교육 사진', d: '2026년 Dreamy Higher Secondary School 설립이 추진되며, 초등과정 영어 중심 국제교육으로 교육선교의 지평이 대학에서 초·중등으로 확장되고 있다.' },
    ],
    timeline: [
      { y: '2011', items: ['소수자민족부 장관 샤바즈 바티 순교를 계기로 소수자와 기독교 공동체를 위한 대학(PGI) 설립 결정'] },
      { y: '2016', items: ['파키스탄 고등교육위원회로부터 설립 허가 획득'] },
      { y: '2022', items: ['PGI 캠퍼스 건축 완공', '드리미재단과 협력하여 파키스탄 대홍수 재난 구호 지원'] },
      { y: '2023', items: ['PGI, 정부 공식 인증 대학으로 개교(파키스탄 건국 이후 최초의 외국인 직접 설립 고등교육기관)', '드리미재단 학습 기자재 지원'] },
      { y: '2024', items: ['Dreamy Teachers Academy 교사 연수(35명)', '몽상 장학생 선발', '리더십과 기업가 정신 온라인 강의', '데이터분석학과 설립'] },
      { y: '2025', items: ['Dreamy Teachers Academy 교사 연수(56명)', '여학생 기숙사 및 교직원 숙소 완공'] },
      { y: '2026', items: ['Dreamy Teachers Academy 교사 연수(82명: 기독교 교육, 미래교육, 교육과정 디자인, 드리미학교 교육과정, 교사 사명선언문 작성)', 'Dreamy Higher Secondary School 설립 추진(초등과정 영어 중심 국제교육)', '9월 AI 학과 설립 예정'] },
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
