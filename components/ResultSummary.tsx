import { BENEFIT_CONFIG, OFFICIAL_LINKS } from '@/config/benefit';
import { formatWon } from '@/lib/format';
import type { CalcResult } from '@/lib/types';

interface ResultSummaryProps {
  result: CalcResult;
  months: number;
}

export default function ResultSummary({ result, months }: ResultSummaryProps) {
  const hasCap = result.rows.some((row) => row.applied === 'cap');
  const hasFloor = result.rows.some((row) => row.applied === 'floor');
  const floor = BENEFIT_CONFIG.periods[0].floor;

  return (
    <div className="summary">
      <p className="summary-label">{months}개월 동안 받을 예상 급여</p>
      <p className="summary-total">{formatWon(result.total)}</p>
      <p className="summary-average">한 달 평균 {formatWon(result.average)}</p>

      {(hasCap || hasFloor) && (
        <ul className="summary-notes">
          {hasCap && <li>일부 월에는 상한액이 적용됐어요.</li>}
          {hasFloor && <li>일부 월에는 최저 지급액({formatWon(floor)})이 적용됐어요.</li>}
        </ul>
      )}

      <p className="summary-disclaimer">
        예상 금액이에요. 실제 지급액은 고용센터 심사 결과에 따라 달라질 수 있어요.{' '}
        <a href={OFFICIAL_LINKS.work24} target="_blank" rel="noopener noreferrer">
          고용24에서 확인하기
        </a>
      </p>
    </div>
  );
}
