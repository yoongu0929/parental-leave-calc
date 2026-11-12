import Calculator from '@/components/Calculator';
import { BENEFIT_CONFIG } from '@/config/benefit';

export default function HomePage() {
  return (
    <>
      <h1>육아휴직 급여 계산기</h1>
      <p className="lead">
        월 통상임금과 휴직 기간을 입력하면 달마다 받을 예상 급여를 보여드려요.
      </p>
      <p className="asof">급여 기준 {BENEFIT_CONFIG.asOf}</p>
      <Calculator />
    </>
  );
}
