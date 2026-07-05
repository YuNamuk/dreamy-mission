/** 번역 편집 시 한국어 원문을 입력칸 위에 참고로 표시 */
export default function RefText({ children }: { children?: string | null }) {
  if (!children || !children.trim()) return null;
  return (
    <div className="reftext"><span className="reftext__tag">원문</span><span className="reftext__body">{children}</span></div>
  );
}
