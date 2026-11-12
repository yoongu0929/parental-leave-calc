import { MAX_WAGE } from '@/config/benefit';
import type { BenefitConfig, CalcInput } from './types';
import { YM_PATTERN, parseWage } from './format';

export interface FormValues {
  wageRaw: string;
  months: number;
  startYm: string;
}

export interface FormErrors {
  wage?: string;
  months?: string;
  startYm?: string;
}

export const MESSAGES = {
  wageEmpty: '월 통상임금을 입력해주세요.',
  wageRange: '올바른 금액을 입력해주세요.',
  monthsRange: '휴직 기간을 선택해주세요.',
  startYm: '시작 연월을 YYYY-MM 형식으로 입력해주세요.',
} as const;

/** 입력값 유효성 검사 (FN-02) */
export function validateForm(
  values: FormValues,
  config: BenefitConfig,
): { errors: FormErrors; input?: CalcInput } {
  const errors: FormErrors = {};

  const wage = parseWage(values.wageRaw);
  if (wage === null) {
    errors.wage = MESSAGES.wageEmpty;
  } else if (wage < 1 || wage > MAX_WAGE) {
    errors.wage = MESSAGES.wageRange;
  }

  if (
    !Number.isInteger(values.months) ||
    values.months < 1 ||
    values.months > config.maxMonths
  ) {
    errors.months = MESSAGES.monthsRange;
  }

  if (values.startYm !== '' && !YM_PATTERN.test(values.startYm)) {
    errors.startYm = MESSAGES.startYm;
  }

  if (Object.keys(errors).length > 0 || wage === null) {
    return { errors };
  }

  return {
    errors,
    input: {
      monthlyWage: wage,
      months: values.months,
      startYm: values.startYm === '' ? undefined : values.startYm,
    },
  };
}
