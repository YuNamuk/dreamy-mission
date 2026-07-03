'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import type { DreamiUser } from '@/lib/dreami';

export interface NavCountry {
  id: string;
  ko: string;
  en: string;
}

const MENU = [
  { key: 'home', label: 'HOME', href: '/' },
  { key: 'about', label: 'ABOUT', href: '/#about' },
  { key: 'stories', label: 'STORIES', href: '/#stories' },
  { key: 'map', label: 'MAP', href: '/#map' },
  { key: 'archive', label: 'ARCHIVE', href: '/#stories' },
];

export default function Nav({
  user,
  countries = [],
  active,
}: {
  user: DreamiUser | null;
  countries?: NavCountry[];
  active?: string;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [missionsOpen, setMissionsOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const missionsRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (missionsRef.current && !missionsRef.current.contains(e.target as Node)) setMissionsOpen(false);
      if (userRef.current && !userRef.current.contains(e.target as Node)) setUserOpen(false);
    }
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, []);

  const initial = (user?.name || user?.email || '·').trim().charAt(0).toUpperCase();

  return (
    <nav className="nav2">
      <Link href="/" className="nav2__brand" aria-label="홈">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/mark.png" alt="" />
        <span className="nav2__wordmark">
          <b>Dreamy School</b>
          <i>Missions</i>
        </span>
      </Link>

      {/* 데스크톱 메뉴 */}
      <div className="nav2__menu">
        <Link href="/" className={`nav2__item${active === 'home' ? ' is-active' : ''}`}>HOME</Link>
        <Link href="/#about" className={`nav2__item${active === 'about' ? ' is-active' : ''}`}>ABOUT</Link>

        <div className="nav2__dd" ref={missionsRef}>
          <button
            className={`nav2__item nav2__ddbtn${active === 'missions' ? ' is-active' : ''}`}
            onClick={() => setMissionsOpen((v) => !v)}
            aria-expanded={missionsOpen}
          >
            MISSIONS
            <svg width="11" height="11" viewBox="0 0 12 12" style={{ marginLeft: 5 }}><path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          {missionsOpen && (
            <div className="nav2__ddpanel" onClick={() => setMissionsOpen(false)}>
              {countries.map((c) => (
                <Link key={c.id} href={`/${c.id}`} className="nav2__ddlink">
                  <b>{c.ko}</b>
                  <span>{c.en}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        <Link href="/#stories" className={`nav2__item${active === 'stories' ? ' is-active' : ''}`}>STORIES</Link>
        <Link href="/#map" className={`nav2__item${active === 'map' ? ' is-active' : ''}`}>MAP</Link>
        <Link href="/#stories" className={`nav2__item${active === 'archive' ? ' is-active' : ''}`}>ARCHIVE</Link>
      </div>

      {/* 우측: 언어 + 계정 */}
      <div className="nav2__end">
        <span className="nav2__kr" title="한국어">KR</span>
        {user ? (
          <div className="nav2__dd" ref={userRef}>
            <button className="nav2__avatar" onClick={() => setUserOpen((v) => !v)} title={user.name ?? user.email} aria-label="계정">
              {initial}
            </button>
            {userOpen && (
              <div className="nav2__ddpanel nav2__ddpanel--right">
                <div className="nav2__userinfo">
                  <b>{user.name ?? user.email}</b>
                  <span>{user.email}{user.role ? ` · ${user.role}` : ''}</span>
                </div>
                <Link href="/admin" className="nav2__ddlink">관리자</Link>
                <a href="/api/auth/logout" className="nav2__ddlink">로그아웃</a>
              </div>
            )}
          </div>
        ) : (
          <a href="/api/auth/login" className="nav2__avatar nav2__avatar--guest" title="드리미학교 학생·교사 로그인" aria-label="학생 로그인">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="12" cy="8" r="3.4" /><path d="M5 20c0-3.3 3.1-5.5 7-5.5s7 2.2 7 5.5" strokeLinecap="round" /></svg>
          </a>
        )}
        <button className="nav2__burger" onClick={() => setMobileOpen((v) => !v)} aria-label="메뉴">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
        </button>
      </div>

      {/* 모바일 메뉴 */}
      {mobileOpen && (
        <div className="nav2__mobile" onClick={() => setMobileOpen(false)}>
          {MENU.map((m) => (
            <Link key={m.key} href={m.href} className="nav2__mlink">{m.label}</Link>
          ))}
          <div className="nav2__mgroup">
            <span>MISSIONS</span>
            <div className="nav2__mcountries">
              {countries.map((c) => (
                <Link key={c.id} href={`/${c.id}`} className="nav2__mchip">{c.ko}</Link>
              ))}
            </div>
          </div>
          {!user && <a href="/api/auth/login" className="nav2__mlink">학생 로그인</a>}
          {user && <a href="/api/auth/logout" className="nav2__mlink">로그아웃</a>}
        </div>
      )}
    </nav>
  );
}
