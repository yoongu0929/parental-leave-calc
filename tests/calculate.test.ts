import { describe, expect, it } from 'vitest';
import { BENEFIT_CONFIG } from '@/config/benefit';
import { calculate } from '@/lib/calculate';

const MAN = 10_000;
const run = (wageMan: number, months: number, startYm?: string) =>
  calculate({ monthlyWage: wageMan * MAN, months, startYm }, BENEFIT_CONFIG);

describe('calculate — 기능 정의서 TC-01 ~ TC-10', () => {
  it('TC-01 통상임금 300만 원, 12개월 = 2,310만 원', () => {
    expect(run(300, 12).total).toBe(2_310 * MAN);
  });

  it('TC-02 통상임금 200만 원, 12개월 = 2,160만 원', () => {
    const result = run(200, 12);
    expect(result.total).toBe(2_160 * MAN);
    expect(result.rows[6].amount).toBe(160 * MAN); // 7개월차 80% = 160만 원
  });

  it('TC-03 통상임금 60만 원, 3개월 = 하한 70만 원 × 3', () => {
    const result = run(60, 3);
    expect(result.total).toBe(210 * MAN);
    expect(result.rows.every((r) => r.applied === 'floor')).toBe(true);
  });

  it('TC-04 통상임금 400만 원, 1개월 = 상한 250만 원', () => {
    const result = run(400, 1);
    expect(result.total).toBe(250 * MAN);
    expect(result.rows[0].applied).toBe('cap');
  });

  it('TC-05 통상임금 60만 원, 8개월 = 560만 원 (전 구간 하한)', () => {
    expect(run(60, 8).total).toBe(560 * MAN);
  });

  it('TC-06 통상임금 250만 원, 3개월 = 750만 원, 적용 구분 해당 없음', () => {
    const result = run(250, 3);
    expect(result.total).toBe(750 * MAN);
    expect(result.rows.every((r) => r.applied === 'none')).toBe(true);
  });

  it('TC-07 통상임금 70만 원, 7개월 = 490만 원 (7개월차는 80%=56만 원이라 하한 적용)', () => {
    const result = run(70, 7);
    expect(result.total).toBe(490 * MAN);
    expect(result.rows[5].applied).toBe('none'); // 하한과 정확히 같으면 해당 없음
    expect(result.rows[6].rawAmount).toBe(56 * MAN);
    expect(result.rows[6].applied).toBe('floor');
  });

  it('TC-08 통상임금이 음수이거나 소수면 오류', () => {
    expect(() => calculate({ monthlyWage: -1, months: 6 }, BENEFIT_CONFIG)).toThrow(RangeError);
    expect(() => calculate({ monthlyWage: 1.5, months: 6 }, BENEFIT_CONFIG)).toThrow(RangeError);
  });

  it('TC-09 개월 수가 범위를 벗어나면 오류', () => {
    expect(() => calculate({ monthlyWage: 3_000_000, months: 0 }, BENEFIT_CONFIG)).toThrow(RangeError);
    expect(() => calculate({ monthlyWage: 3_000_000, months: 19 }, BENEFIT_CONFIG)).toThrow(RangeError);
  });

  it('13~18개월도 7개월째 이후와 같은 구간(80%, 상한 160만 원)으로 계산한다', () => {
    const result = run(300, 18);
    expect(result.rows[12].ratePercent).toBe(80);
    expect(result.rows[17].amount).toBe(160 * MAN);
    expect(result.total).toBe(3_270 * MAN); // 2,310만 + 160만 × 6
  });

  it('TC-10 시작 연월 2026-12, 3개월 → 연도가 넘어가며 표기', () => {
    const labels = run(300, 3, '2026-12').rows.map((r) => r.label);
    expect(labels).toEqual(['2026-12', '2027-01', '2027-02']);
  });
});

describe('calculate — 구간 경계와 평균', () => {
  it('3개월차는 1~3 구간, 4개월차는 4~6 구간 상한을 쓴다', () => {
    const rows = run(400, 4).rows;
    expect(rows[2].amount).toBe(250 * MAN);
    expect(rows[3].amount).toBe(200 * MAN);
  });

  it('월 평균은 총액 ÷ 개월 수 (원 단위 반올림)', () => {
    const result = run(300, 12);
    expect(result.average).toBe(Math.round((2_310 * MAN) / 12));
  });

  it('원 미만은 절사한다', () => {
    // 1,000,001 × 80% = 800,000.8 → 800,000
    const row = calculate({ monthlyWage: 1_000_001, months: 7 }, BENEFIT_CONFIG).rows[6];
    expect(row.rawAmount).toBe(800_000);
    expect(row.amount).toBe(800_000);
  });
});

describe('급여 기준 설정 무결성', () => {
  it('구간이 1개월차부터 maxMonths까지 빈틈과 겹침 없이 이어진다', () => {
    const { periods, maxMonths } = BENEFIT_CONFIG;
    expect(periods[0].from).toBe(1);
    for (let i = 1; i < periods.length; i += 1) {
      expect(periods[i].from).toBe(periods[i - 1].to + 1);
    }
    expect(periods[periods.length - 1].to).toBe(maxMonths);
  });

  it('모든 구간에서 하한은 상한을 넘지 않는다', () => {
    for (const p of BENEFIT_CONFIG.periods) {
      expect(p.floor).toBeLessThanOrEqual(p.cap);
    }
  });
});
