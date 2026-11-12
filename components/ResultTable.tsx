import { BENEFIT_CONFIG } from '@/config/benefit';
import { formatWon } from '@/lib/format';
import type { Applied, MonthRow } from '@/lib/types';

const APPLIED_LABEL: Record<Applied, string> = {
  cap: '상한 적용',
  floor: '하한 적용',
  none: '-',
};

export default function ResultTable({ rows }: { rows: MonthRow[] }) {
  const maxCap = Math.max(...BENEFIT_CONFIG.periods.map((p) => p.cap));

  return (
    <div className="table-wrap">
      <table className="result-table">
        <caption>월별 예상 지급액</caption>
        <thead>
          <tr>
            <th scope="col">월차</th>
            <th scope="col">지급률</th>
            <th scope="col">계산 금액</th>
            <th scope="col">적용</th>
            <th scope="col">예상 지급액</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.month}>
              <th scope="row">
                {row.month}개월차
                {row.label && <span className="month-label">{row.label}</span>}
              </th>
              <td>{row.ratePercent}%</td>
              <td>{formatWon(row.rawAmount)}</td>
              <td className={row.applied === 'none' ? undefined : 'applied'}>
                {APPLIED_LABEL[row.applied]}
              </td>
              <td className="amount-cell">
                <span className="amount">{formatWon(row.amount)}</span>
                <span className="bar" aria-hidden="true">
                  <span style={{ width: `${Math.min(100, (row.amount / maxCap) * 100)}%` }} />
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
