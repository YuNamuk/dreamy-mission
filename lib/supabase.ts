/**
 * 내 Supabase 백엔드 클라이언트.
 * 포털이 NEXT_PUBLIC_SUPABASE_* 를 Vercel env 에 자동 주입한다.
 * 공유 백엔드면 NEXT_PUBLIC_SUPABASE_SCHEMA(app_<id>) 로 내 전용 공간만 쓴다.
 *
 * 사용 예:
 *   import { supabase } from '@/lib/supabase'
 *   const { data } = await supabase.from('notes').select('*')
 */
import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const schema = process.env.NEXT_PUBLIC_SUPABASE_SCHEMA?.trim();

/** env 가 주입됐는지 — 아직이면 페이지가 안내를 띄운다. */
export const supabaseReady = Boolean(url && anonKey);

// 공유 백엔드면 내 전용 schema 로, 아니면 기본(public). 타입은 추론에 맡긴다.
export const supabase = supabaseReady
  ? createClient(url!, anonKey!, schema ? { db: { schema } } : {})
  : null;
