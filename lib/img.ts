/** Supabase Storage 이미지의 온더플라이 리사이즈(썸네일) URL. 변환 불가 URL은 원본 반환. (클라이언트/서버 공용) */
export function thumb(url: string | undefined | null, width = 520, quality = 70): string {
  if (!url) return '';
  if (!url.includes('/storage/v1/object/public/')) return url; // 로컬/외부는 그대로
  const base = url.split('?')[0].replace('/storage/v1/object/public/', '/storage/v1/render/image/public/');
  return `${base}?width=${width}&quality=${quality}`;
}

/** 원본 다운로드 URL(Content-Disposition attachment) */
export function downloadUrl(url: string): string {
  const clean = url.split('?')[0];
  return `${clean}?download`;
}
