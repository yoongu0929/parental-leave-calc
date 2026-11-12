/** 숫자 이외의 문자를 제거하고 앞자리 0을 없앤 숫자 문자열 */
export function toDigits(raw: string): string {
  return raw.replace(/\D/g, '').replace(/^0+/, '');
}

/** 통상임금 입력 포맷팅 (FN-01): 숫자만 남기고 천 단위 쉼표를 붙인다 */
export function formatNumberInput(raw: string): string {
  return toDigits(raw).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/** 쉼표가 포함된 입력 문자열을 정수로 변환. 비어 있으면 null */
export function parseWage(raw: string): number | null {
  const digits = toDigits(raw);
  return digits === '' ? null : Number(digits);
}

export function formatWon(value: number): string {
  return `${value.toLocaleString('ko-KR')}원`;
}

export const YM_PATTERN = /^\d{4}-(0[1-9]|1[0-2])$/;

/** 'YYYY-MM'에 개월 수를 더한 'YYYY-MM' (FN-07). 12월 다음은 다음 해 1월 */
export function addMonths(ym: string, offset: number): string {
  const [yearStr, monthStr] = ym.split('-');
  const index = Number(yearStr) * 12 + (Number(monthStr) - 1) + offset;
  const year = Math.floor(index / 12);
  const month = (index % 12) + 1;
  return `${year}-${String(month).padStart(2, '0')}`;
}
