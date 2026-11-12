'use client';

import { useEffect, useRef, useState } from 'react';
import ResultSummary from './ResultSummary';
import ResultTable from './ResultTable';
import WageForm from './WageForm';
import { BASE_MONTHS, BENEFIT_CONFIG } from '@/config/benefit';
import { calculate } from '@/lib/calculate';
import { formatNumberInput } from '@/lib/format';
import type { CalcResult } from '@/lib/types';
import { validateForm, type FormErrors } from '@/lib/validate';

const DEFAULT_MONTHS = 6;

export default function Calculator() {
  const [wageRaw, setWageRaw] = useState('');
  const [months, setMonths] = useState(DEFAULT_MONTHS);
  const [startYm, setStartYm] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [result, setResult] = useState<{ data: CalcResult; months: number } | null>(null);
  const [stale, setStale] = useState(false);
  const [calcCount, setCalcCount] = useState(0);
  const resultRef = useRef<HTMLElement>(null);

  // 계산이 끝나면 결과 영역으로 이동 (FN-04). 동작 줄이기 설정을 존중한다.
  useEffect(() => {
    if (calcCount === 0 || !resultRef.current) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    resultRef.current.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  }, [calcCount]);

  const markStale = () => {
    if (result) setStale(true);
  };

  const handleSubmit = () => {
    const { errors: nextErrors, input } = validateForm({ wageRaw, months, startYm }, BENEFIT_CONFIG);
    setErrors(nextErrors);

    if (!input) {
      setResult(null);
      setStale(false);
      return;
    }

    try {
      setResult({ data: calculate(input, BENEFIT_CONFIG), months: input.months });
      setStale(false);
      setCalcCount((count) => count + 1);
    } catch {
      setResult(null);
      setErrors({ wage: '계산 중 문제가 생겼어요. 잠시 후 다시 시도해주세요.' });
    }
  };

  const handleReset = () => {
    setWageRaw('');
    setMonths(DEFAULT_MONTHS);
    setStartYm('');
    setErrors({});
    setResult(null);
    setStale(false);
  };

  return (
    <>
      <WageForm
        wageRaw={wageRaw}
        months={months}
        startYm={startYm}
        errors={errors}
        maxMonths={BENEFIT_CONFIG.maxMonths}
        baseMonths={BASE_MONTHS}
        onWageChange={(value) => {
          setWageRaw(formatNumberInput(value));
          markStale();
        }}
        onMonthsChange={(value) => {
          setMonths(value);
          markStale();
        }}
        onStartYmChange={(value) => {
          setStartYm(value);
          markStale();
        }}
        onSubmit={handleSubmit}
        onReset={handleReset}
      />

      {result && (
        <section
          ref={resultRef}
          className={stale ? 'result is-stale' : 'result'}
          aria-labelledby="result-title"
          aria-live="polite"
        >
          <h2 id="result-title" className="sr-only">
            계산 결과
          </h2>
          {stale && (
            <p className="stale-note">입력이 변경되었어요. 다시 계산해주세요.</p>
          )}
          <ResultSummary result={result.data} months={result.months} />
          <ResultTable rows={result.data.rows} />
        </section>
      )}
    </>
  );
}
