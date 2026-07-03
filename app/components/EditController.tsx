'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { saveCountryEdit } from '../edit-actions';

/**
 * 편집 모드 컨트롤러(로그인 학생 전용).
 * 페이지에 렌더된 [data-field] 요소들을 contentEditable 로 만들고,
 * 저장 시 값을 모아 서버액션으로 보낸다.
 *   data-field="intro" | "theme.<i>.t" | "theme.<i>.d"
 */
export default function EditController({ countryId, themeCount }: { countryId: string; themeCount: number }) {
  const [editing, setEditing] = useState(false);
  const [pending, startTransition] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);
  const router = useRouter();

  function setEditingState(on: boolean) {
    setEditing(on);
    setMsg(null);
    const root = document.getElementById('country-root');
    if (root) root.setAttribute('data-editing', String(on));
    document.querySelectorAll<HTMLElement>('[data-field]').forEach((el) => {
      el.contentEditable = on ? 'true' : 'false';
    });
  }

  function collect() {
    const get = (sel: string) => document.querySelector<HTMLElement>(`[data-field="${sel}"]`)?.innerText.trim() ?? '';
    const themes: { t?: string; d?: string }[] = [];
    for (let i = 0; i < themeCount; i++) {
      themes.push({ t: get(`theme.${i}.t`), d: get(`theme.${i}.d`) });
    }
    return { intro: get('intro'), themes };
  }

  function onSave() {
    const patch = collect();
    startTransition(async () => {
      const res = await saveCountryEdit(countryId, patch);
      if (res.ok) {
        setEditingState(false);
        setMsg('저장했어요.');
        router.refresh();
        setTimeout(() => setMsg(null), 2500);
      } else {
        setMsg(res.error ?? '저장에 실패했어요.');
      }
    });
  }

  function onCancel() {
    setEditingState(false);
    // 원본 복원을 위해 새로고침(편집 취소).
    router.refresh();
  }

  return (
    <div className="editbar" role="toolbar" aria-label="편집 도구">
      {!editing ? (
        <>
          <span>학생 편집 모드</span>
          <button className="editbar__btn" onClick={() => setEditingState(true)}>
            편집
          </button>
        </>
      ) : (
        <>
          <b>편집 중</b>
          <span style={{ color: '#cbd8e3' }}>글자를 눌러 수정</span>
          <button className="editbar__btn" onClick={onSave} disabled={pending}>
            {pending ? '저장 중…' : '저장'}
          </button>
          <button className="editbar__btn editbar__btn--ghost" onClick={onCancel} disabled={pending}>
            취소
          </button>
        </>
      )}
      {msg && <span style={{ color: '#fff', maxWidth: 260 }}>{msg}</span>}
    </div>
  );
}
