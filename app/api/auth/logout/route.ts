import { NextRequest, NextResponse } from 'next/server';
import { TOKEN_COOKIE } from '@/lib/dreami';
import { originOf } from '@/lib/origin';

function clear(req: NextRequest) {
  const res = NextResponse.redirect(new URL('/', originOf(req)));
  res.cookies.delete(TOKEN_COOKIE);
  return res;
}

export async function POST(req: NextRequest) { return clear(req); }
export async function GET(req: NextRequest) { return clear(req); }
