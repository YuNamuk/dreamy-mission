import 'server-only';
import { existsSync } from 'fs';
import path from 'path';
import { UPLOADED_PHOTOS, PHOTO_BASE } from './uploaded-photos';

const EXTS = ['jpg', 'jpeg', 'png', 'webp', 'avif'];

/** public/archive/<slot>.<ext> 또는 public/<name>.<ext> 존재 시 URL, 없으면 null. */
export function localPhoto(slot: string, dir = 'archive'): string | null {
  for (const ext of EXTS) {
    const rel = dir ? `${dir}/${slot}.${ext}` : `${slot}.${ext}`;
    if (existsSync(path.join(process.cwd(), 'public', rel))) return `/${rel}`;
  }
  return null;
}

/** 로컬 파일 우선, 없으면 Supabase Storage 업로드본, 둘 다 없으면 null. */
export function resolvePhoto(slot: string): string | null {
  const local = localPhoto(slot);
  if (local) return local;
  if (UPLOADED_PHOTOS.has(slot)) return `${PHOTO_BASE}/${slot}.jpg`;
  return null;
}
