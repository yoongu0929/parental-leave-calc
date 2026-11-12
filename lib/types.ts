export type Period = {
  from: number; // 시작 월차 (포함)
  to: number; // 종료 월차 (포함)
  ratePercent: number; // 지급률 (100, 80)
  cap: number; // 월 상한 (원)
  floor: number; // 월 하한 (원)
};

export interface BenefitConfig {
  asOf: string; // 기준일 'YYYY-MM-DD'
  maxMonths: number; // 최대 계산 개월 수
  periods: Period[];
}

export interface CalcInput {
  monthlyWage: number; // 월 통상임금 (원, 정수)
  months: number; // 휴직 개월 수
  startYm?: string; // 'YYYY-MM' (선택)
}

export type Applied = 'cap' | 'floor' | 'none';

export interface MonthRow {
  month: number; // 월차
  label?: string; // 달력 연월 (시작 연월 입력 시)
  ratePercent: number;
  rawAmount: number; // 상한·하한 적용 전 금액
  amount: number; // 최종 예상 지급액
  applied: Applied;
}

export interface CalcResult {
  rows: MonthRow[];
  total: number;
  average: number;
}
