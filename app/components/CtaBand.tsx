import Link from 'next/link';

/** 참여 CTA 밴드 — ui/ 시안 7·8 공통: 하단 "함께 세워주세요" 스트립. */
export default function CtaBand({ ko, country }: { ko: boolean; country?: string }) {
  return (
    <section className="section--wide" style={{ padding: '48px 20px 56px' }}>
      <div className="mcta">
        <div>
          <b>{ko ? '당신의 참여로 한 아이의 세상이 달라집니다' : "Your part changes a child's world"}</b>
          <span>
            {ko
              ? `기도와 후원, 재능나눔으로 ${country ? `${country} ` : ''}교육선교에 함께 동참해 주세요.`
              : `Join the ${country ? `${country} ` : ''}education mission through prayer, support, and sharing your gifts.`}
          </span>
        </div>
        <div className="mcta__btns">
          <Link href="/support" className="mcta__primary">{ko ? '후원·참여 안내 →' : 'Support & Join →'}</Link>
          <Link href="/gallery" className="mcta__ghost">{ko ? '선교 이야기 보기' : 'Mission stories'}</Link>
        </div>
      </div>
    </section>
  );
}
