import { describe, expect, it } from 'vitest';
import { BENEFIT_CONFIG } from '@/config/benefit';
import { addMonths, formatNumberInput, formatWon, parseWage } from '@/lib/format';
import { MESSAGES, validateForm } from '@/lib/validate';

describe('format', () => {
  it('천 단위 쉼표를 붙이고 숫자 이외 문자는 제거한다', () => {
    expect(formatNumberInput('3000000')).toBe('3,000,000');
    expect(formatNumberInput('3,00a0,000원')).toBe('3,000,000');
    expect(formatNumberInput('')).toBe('');
  });

  it('앞자리 0을 제거한다', () => {
    expect(formatNumberInput('0003000')).toBe('3,000');
    expect(parseWage('0')).toBeNull();
  });

  it('parseWage는 쉼표 입력을 정수로 바꾼다', () => {
    expect(parseWage('3,000,000')).toBe(3_000_000);
    expect(parseWage('')).toBeNull();
  });

  it('formatWon은 원 단위 쉼표 표기', () => {
    expect(formatWon(23_100_000)).toBe('23,100,000원');
  });

  it('addMonths는 연도를 넘긴다', () => {
    expect(addMonths('2026-12', 1)).toBe('2027-01');
    expect(addMonths('2026-01', 11)).toBe('2026-12');
    expect(addMonths('2026-11', 14)).toBe('2028-01');
  });
});

describe('validateForm', () => {
  const base = { wageRaw: '3,000,000', months: 6, startYm: '' };

  it('정상 입력이면 오류 없이 CalcInput을 돌려준다', () => {
    const { errors, input } = validateForm(base, BENEFIT_CONFIG);
    expect(errors).toEqual({});
    expect(input).toEqual({ monthlyWage: 3_000_000, months: 6, startYm: undefined });
  });

  it('통상임금이 비어 있으면 오류', () => {
    const { errors, input } = validateForm({ ...base, wageRaw: '' }, BENEFIT_CONFIG);
    expect(errors.wage).toBe(MESSAGES.wageEmpty);
    expect(input).toBeUndefined();
  });

  it('통상임금이 99,999,999를 넘으면 범위 오류', () => {
    const { errors } = validateForm({ ...base, wageRaw: '100,000,000' }, BENEFIT_CONFIG);
    expect(errors.wage).toBe(MESSAGES.wageRange);
  });

  it('휴직 개월 수가 범위를 벗어나면 오류', () => {
    expect(validateForm({ ...base, months: 0 }, BENEFIT_CONFIG).errors.months).toBe(MESSAGES.monthsRange);
    expect(validateForm({ ...base, months: 19 }, BENEFIT_CONFIG).errors.months).toBe(MESSAGES.monthsRange);
    expect(validateForm({ ...base, months: 18 }, BENEFIT_CONFIG).errors).toEqual({});
  });

  it('시작 연월 형식이 틀리면 오류, 비어 있으면 통과', () => {
    expect(validateForm({ ...base, startYm: '2026-13' }, BENEFIT_CONFIG).errors.startYm).toBe(MESSAGES.startYm);
    expect(validateForm({ ...base, startYm: '2026-12' }, BENEFIT_CONFIG).errors).toEqual({});
  });
});
