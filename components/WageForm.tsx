'use client';

import type { FormEvent } from 'react';
import type { FormErrors } from '@/lib/validate';

interface WageFormProps {
  wageRaw: string;
  months: number;
  startYm: string;
  errors: FormErrors;
  maxMonths: number;
  baseMonths: number;
  onWageChange: (value: string) => void;
  onMonthsChange: (value: number) => void;
  onStartYmChange: (value: string) => void;
  onSubmit: () => void;
  onReset: () => void;
}

export default function WageForm({
  wageRaw,
  months,
  startYm,
  errors,
  maxMonths,
  baseMonths,
  onWageChange,
  onMonthsChange,
  onStartYmChange,
  onSubmit,
  onReset,
}: WageFormProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };

  const monthOptions = Array.from({ length: maxMonths }, (_, i) => i + 1);

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <div className="field">
        <label htmlFor="wage">월 통상임금</label>
        <div className="input-suffix">
          <input
            id="wage"
            name="wage"
            type="text"
            inputMode="numeric"
            autoComplete="off"
            placeholder="3,000,000"
            value={wageRaw}
            onChange={(e) => onWageChange(e.target.value)}
            aria-invalid={errors.wage ? true : undefined}
            aria-describedby={errors.wage ? 'wage-hint wage-error' : 'wage-hint'}
          />
          <span aria-hidden="true">원</span>
        </div>
        <p id="wage-hint" className="hint">
          휴직 시작일 기준 금액이에요. 급여명세서의 기본급과 매월 정기적으로 받는 수당이 포함되고,
          성과급, 연장근로수당처럼 달라지는 금액은 보통 제외돼요.
        </p>
        {errors.wage && (
          <p id="wage-error" className="error" role="alert">
            {errors.wage}
          </p>
        )}
      </div>

      <div className="field">
        <label htmlFor="months">휴직 기간</label>
        <select
          id="months"
          name="months"
          value={months}
          onChange={(e) => onMonthsChange(Number(e.target.value))}
          aria-invalid={errors.months ? true : undefined}
          aria-describedby={errors.months ? 'months-hint months-error' : 'months-hint'}
        >
          {monthOptions.map((m) => (
            <option key={m} value={m}>
              {m}개월{m > baseMonths ? ' (조건 충족 시)' : ''}
            </option>
          ))}
        </select>
        <p id="months-hint" className="hint">
          {baseMonths + 1}~{maxMonths}개월은 부모가 같은 자녀로 각각 3개월 이상 휴직을 사용했거나,
          한부모·중증 장애아동의 부모인 경우에만 쓸 수 있어요.
        </p>
        {errors.months && (
          <p id="months-error" className="error" role="alert">
            {errors.months}
          </p>
        )}
      </div>

      <div className="field">
        <label htmlFor="start-ym">
          휴직 시작 연월 <span className="optional">(선택)</span>
        </label>
        <input
          id="start-ym"
          name="start-ym"
          type="month"
          value={startYm}
          onChange={(e) => onStartYmChange(e.target.value)}
          aria-invalid={errors.startYm ? true : undefined}
          aria-describedby={errors.startYm ? 'start-error start-hint' : 'start-hint'}
        />
        <p id="start-hint" className="hint">
          입력하면 월별 표에 달력 연월이 함께 나와요. 계산 금액에는 영향이 없어요.
        </p>
        {errors.startYm && (
          <p id="start-error" className="error" role="alert">
            {errors.startYm}
          </p>
        )}
      </div>

      <div className="actions">
        <button type="submit" className="btn btn-primary">
          계산하기
        </button>
        <button type="button" className="btn btn-quiet" onClick={onReset}>
          초기화
        </button>
      </div>
    </form>
  );
}
