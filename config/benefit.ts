import type { BenefitConfig } from '@/lib/types';

/**
 * 급여 기준 설정 (FN-09)
 * 제도가 바뀌면 이 파일과 asOf(기준일)만 수정합니다.
 * 근거: 고용보험법 시행령 제95조 (시행 2026-09-18 확인), 남녀고용평등법 제19조
 * 공식 대조일: 2026-11-11
 */
export const BENEFIT_CONFIG: BenefitConfig = {
  asOf: '2026-11-10',
  maxMonths: 18,
  periods: [
    { from: 1, to: 3, ratePercent: 100, cap: 2_500_000, floor: 700_000 },
    { from: 4, to: 6, ratePercent: 100, cap: 2_000_000, floor: 700_000 },
    { from: 7, to: 18, ratePercent: 80, cap: 1_600_000, floor: 700_000 },
  ],
};

export const MAX_WAGE = 99_999_999;

/** 기본 육아휴직 기간(개월). 이를 넘는 13~18개월은 추가 요건(부모 각 3개월 이상 사용, 한부모 등)이 필요 */
export const BASE_MONTHS = 12;

export const OFFICIAL_LINKS = {
  work24: 'https://www.work24.go.kr',
  law: 'https://www.law.go.kr',
} as const;
