import type { Applied, BenefitConfig, CalcInput, CalcResult, MonthRow } from './types';
import { addMonths } from './format';

/**
 * 육아휴직 급여 계산 (FN-03). 화면과 분리된 순수 함수.
 * - 금액은 정수(원)로만 계산하고, 지급률은 퍼센트 정수로 받아 부동소수점 오차를 피한다.
 * - 원 미만은 절사한다. (공식 기준 확인 후 확정 필요)
 */
export function calculate(input: CalcInput, config: BenefitConfig): CalcResult {
  const { monthlyWage, months, startYm } = input;

  if (!Number.isInteger(monthlyWage) || monthlyWage < 0) {
    throw new RangeError('monthlyWage must be a non-negative integer');
  }
  if (!Number.isInteger(months) || months < 1 || months > config.maxMonths) {
    throw new RangeError(`months must be an integer between 1 and ${config.maxMonths}`);
  }

  const rows: MonthRow[] = [];

  for (let m = 1; m <= months; m += 1) {
    const period = config.periods.find((p) => p.from <= m && m <= p.to);
    if (!period) {
      throw new Error(`No benefit period configured for month ${m}`);
    }

    const rawAmount = Math.floor((monthlyWage * period.ratePercent) / 100);

    let amount = rawAmount;
    let applied: Applied = 'none';
    if (rawAmount > period.cap) {
      amount = period.cap;
      applied = 'cap';
    } else if (rawAmount < period.floor) {
      amount = period.floor;
      applied = 'floor';
    }

    rows.push({
      month: m,
      label: startYm ? addMonths(startYm, m - 1) : undefined,
      ratePercent: period.ratePercent,
      rawAmount,
      amount,
      applied,
    });
  }

  const total = rows.reduce((sum, row) => sum + row.amount, 0);
  const average = Math.round(total / months);

  return { rows, total, average };
}
