# 드리미 앱 스타터

드리미학교 포털이 만들어준 **내 앱의 출발점**이에요.
**드리미로 로그인**과 **내 Supabase 백엔드**가 이미 연결돼 있어서, 바로 기능을 붙이면 됩니다.

## 무엇이 이미 돼 있나

- ✅ **드리미로 로그인** (OAuth2) — `app/api/auth/login` · `app/auth/callback` · `lib/dreami.ts`
- ✅ **내 Supabase 클라이언트** — `lib/supabase.ts` (내 전용 schema 로 자동 격리)
- ✅ **키 자동 주입** — 배포(Vercel)에는 키가 이미 들어가 있어요. 코드에서 `process.env` 로만 읽고 **하드코딩 금지**.

## 가장 빠른 시작 (vibe 코딩)

1. 포털 **개발자 콘솔 → 내 앱 → 백엔드 카드**에서 **“Vibe 코딩 프롬프트 복사”** 를 누르세요.
2. 그 프롬프트를 Claude / Cursor / 기타 AI 코딩 도구에 붙여넣고, 만들고 싶은 걸 말하세요.
3. 이 저장소에 코드를 **`git push`** 하면 **자동으로 빌드·배포**됩니다. (Vercel)

> 키는 이미 배포 환경에 주입돼 있어 따로 만질 필요가 없어요.

## 직접 만들기

```bash
npm install
npm run dev        # http://localhost:3000
```

로컬에서 시험하려면 `.env.example` 을 `.env.local` 로 복사하고, 포털 백엔드 카드의 값(URL·anon key·schema·client id/secret)을 채우세요.

### 로그인한 사용자 읽기 (서버 컴포넌트)

```ts
import { getUser } from '@/lib/session';
const user = await getUser(); // { sub, email, name, role, cohort, picture } 또는 null
// user.sub 를 사용자 고유 키로 쓰세요(이메일은 바뀔 수 있음).
```

### 내 데이터베이스 쓰기

```ts
import { supabase } from '@/lib/supabase';
const { data } = await supabase!.from('내테이블').select('*');
await supabase!.from('내테이블').insert({ ... });
```

- 테이블은 포털 **백엔드 카드 → 테이블**에서 만들면 돼요 (예: `notes`, 컬럼 `body` 텍스트). `id`·`created_at` 은 자동.
- 공유 백엔드면 `NEXT_PUBLIC_SUPABASE_SCHEMA` 로 **내 전용 공간**만 접근합니다 — 다른 사람 데이터는 못 봐요(안전).

## 주의

- `DREAMI_CLIENT_SECRET` / service key 는 **서버에서만** 쓰고 절대 프론트(`NEXT_PUBLIC_`)로 노출하지 마세요.
- 로그인은 포털에 **등록된 주소**(내 앱 주소)로 접속할 때만 동작해요 — 콜백 주소가 그 주소 기준으로 등록돼 있어요.
- 학교에 등록된 구성원만 로그인됩니다.

## 구조

```
app/
  page.tsx              홈 — 로그인 상태 + Supabase 데모
  layout.tsx            루트 레이아웃
  actions.ts            서버 액션(notes 추가 데모)
  api/auth/login/       로그인 시작(authorize 로 이동)
  auth/callback/        코드 → 토큰 교환 → 세션 쿠키
  api/auth/logout/      로그아웃
lib/
  supabase.ts           내 Supabase 클라이언트(schema 격리)
  dreami.ts             드리미 OAuth(authorize/token/userinfo)
  session.ts            getUser() — 현재 로그인 사용자
  origin.ts             redirect_uri 계산 헬퍼
```
