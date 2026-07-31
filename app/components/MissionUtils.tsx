'use client';

/** 전역 헤더 우측 유틸 — 언어 전환·계정(로그인/관리자)·모바일 섹션 메뉴. (구 nav2에서 이식) */
import { useEffect, useRef, useState } from 'react';
import type { DreamiUser } from '@/lib/dreami';
import { LOCALES, LOCALE_SHORT, LOCALE_LABEL, LANG_COOKIE } from '@/lib/locales';

export interface UtilCountry { id: string; ko: string; en: string }

const SECTIONS = [
  { ko: '교육선교 홈', en: 'Home', href: '/mission' },
  { ko: '소개', en: 'About', href: '/mission/about' },
  { ko: '선교지', en: 'Missions', href: '/mission/missions' },
  { ko: '스토리', en: 'Stories', href: '/mission/stories' },
  { ko: '갤러리', en: 'Gallery', href: '/mission/gallery' },
  { ko: '함께하기', en: 'Support', href: '/mission/support' },
];

export default function MissionUtils({ user, locale = 'ko', countries = [] }: { user: DreamiUser | null; locale?: string; countries?: UtilCountry[] }) {
  const [userOpen, setUserOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const userRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (userRef.current && !userRef.current.contains(e.target as Node)) setUserOpen(false);
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
    }
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, []);

  const tt = (ko: string, en: string) => (locale === 'ko' ? ko : en);
  function setLang(l: string) {
    document.cookie = `${LANG_COOKIE}=${l}; path=/; max-age=31536000; samesite=lax`;
    window.location.reload();
  }
  const initial = (user?.name || user?.email || '·').trim().charAt(0).toUpperCase();

  return (
    <div className="ghd__utils">
      <div className="nav2__dd" ref={langRef}>
        <button className="nav2__lang" onClick={() => setLangOpen((v) => !v)} aria-expanded={langOpen} aria-label="Language">
          {LOCALE_SHORT[locale] ?? locale.toUpperCase()}
          <svg width="10" height="10" viewBox="0 0 12 12" style={{ marginLeft: 4 }}><path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        {langOpen && (
          <div className="nav2__ddpanel nav2__ddpanel--right">
            {LOCALES.map((l) => (
              <button key={l} className={`nav2__ddlink nav2__langopt${l === locale ? ' is-active' : ''}`} onClick={() => setLang(l)}>
                <b>{LOCALE_LABEL[l] ?? l}</b><span>{LOCALE_SHORT[l] ?? l.toUpperCase()}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {user ? (
        <div className="nav2__dd" ref={userRef}>
          <button className="nav2__avatar" onClick={() => setUserOpen((v) => !v)} title={user.name ?? user.email} aria-label="계정">{initial}</button>
          {userOpen && (
            <div className="nav2__ddpanel nav2__ddpanel--right">
              <div className="nav2__userinfo">
                <b>{user.name ?? user.email}</b>
                <span>{user.email}{user.role ? ` · ${user.role}` : ''}</span>
              </div>
              <a href="/mission/admin" className="nav2__ddlink">{tt('관리자', 'Admin')}</a>
              <a href="/mission/api/auth/logout" className="nav2__ddlink">{tt('로그아웃', 'Sign out')}</a>
            </div>
          )}
        </div>
      ) : (
        <a href="/mission/api/auth/login" className="nav2__avatar nav2__avatar--guest" title="드리미학교 학생·교사 로그인" aria-label="학생 로그인">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="12" cy="8" r="3.4" /><path d="M5 20c0-3.3 3.1-5.5 7-5.5s7 2.2 7 5.5" strokeLinecap="round" /></svg>
        </a>
      )}

      <button className="ghd__burger" onClick={() => setMobileOpen((v) => !v)} aria-label="교육선교 메뉴">
        <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
      </button>

      {mobileOpen && (
        <div className="ghd__mobile" onClick={() => setMobileOpen(false)}>
          <div className="ghd__msec">{tt('교육선교', 'MISSIONS')}</div>
          {SECTIONS.map((s) => <a key={s.href} href={s.href} className="nav2__mlink">{tt(s.ko, s.en)}</a>)}
          {countries.length > 0 && (
            <div className="nav2__mcountries">
              {countries.map((c) => <a key={c.id} href={`/mission/${c.id}`} className="nav2__mchip">{locale === 'ko' ? c.ko : c.en}</a>)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
