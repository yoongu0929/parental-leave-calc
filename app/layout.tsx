import type { Metadata } from 'next';
import Link from 'next/link';
import type { ReactNode } from 'react';
import './globals.css';
import { BENEFIT_CONFIG, OFFICIAL_LINKS } from '@/config/benefit';

export const metadata: Metadata = {
  title: '육아휴직 급여 계산기 — 월별 예상 지급액',
  description:
    '월 통상임금과 휴직 기간만 입력하면 육아휴직 급여의 월별 예상 지급액과 총액을 계산해 보여드려요. 입력한 내용은 저장되지 않아요.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <header className="site-header">
          <div className="shell header-inner">
            <Link href="/" className="brand">
              육아휴직 급여 계산기
            </Link>
            <Link href="/guide" className="nav-link">
              계산 기준
            </Link>
          </div>
        </header>

        <main className="shell">{children}</main>

        <footer className="site-footer">
          <div className="shell">
            <p>
              이 계산기는 참고용 예상치를 제공해요. 실제 급여 지급 여부와 금액은 고용센터의 심사
              결과에 따라 달라요.
            </p>
            <p>
              급여 기준 {BENEFIT_CONFIG.asOf} ·{' '}
              <a href={OFFICIAL_LINKS.work24} target="_blank" rel="noopener noreferrer">
                고용24
              </a>
            </p>
            <p>입력한 내용은 서버로 전송되거나 저장되지 않아요.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
