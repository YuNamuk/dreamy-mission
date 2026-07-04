'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LOCALES, LOCALE_LABEL, BASE_LOCALE } from '@/lib/locales';

/** 편집기 상단 언어 탭. 기본(ko)은 원문, 그 외는 번역 오버레이를 편집. */
export default function AdminLangTabs({ current }: { current: string }) {
  const path = usePathname();
  return (
    <div className="adminlangtabs">
      {LOCALES.map((l) => (
        <Link key={l} href={l === BASE_LOCALE ? path : `${path}?lang=${l}`} className={`adminlangtab${l === current ? ' is-active' : ''}`}>
          {LOCALE_LABEL[l] ?? l}
          {l !== BASE_LOCALE && <span className="adminlangtab__tag">번역</span>}
        </Link>
      ))}
    </div>
  );
}
