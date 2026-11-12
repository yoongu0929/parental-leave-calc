import type { Metadata } from 'next';
import Link from 'next/link';
import { BASE_MONTHS, BENEFIT_CONFIG, OFFICIAL_LINKS } from '@/config/benefit';
import { calculate } from '@/lib/calculate';
import { formatWon } from '@/lib/format';

export const metadata: Metadata = {
  title: '계산 기준 — 육아휴직 급여 계산기',
  description:
    '육아휴직 급여의 기간별 지급률, 월 상한액과 하한액, 받을 수 있는 조건, 계산 방식과 공식 출처를 정리했어요.',
};

const EXAMPLE_WAGE = 3_000_000;

function periodLabel(from: number, to: number, max: number) {
  if (to === max && from > 1 && to > from) return `${from}개월째부터`;
  return `${from}~${to}개월`;
}

export default function GuidePage() {
  const { periods, maxMonths, asOf } = BENEFIT_CONFIG;
  const example = calculate({ monthlyWage: EXAMPLE_WAGE, months: BASE_MONTHS }, BENEFIT_CONFIG);

  return (
    <>
      <h1>계산 기준</h1>
      <p className="asof">{asOf} 기준</p>

      <section className="prose" aria-labelledby="tiers">
        <h2 id="tiers">기간별 지급 기준</h2>
        <div className="table-wrap">
          <table className="result-table">
            <thead>
              <tr>
                <th scope="col">휴직 기간</th>
                <th scope="col">지급률</th>
                <th scope="col">월 상한</th>
                <th scope="col">월 하한</th>
              </tr>
            </thead>
            <tbody>
              {periods.map((p) => (
                <tr key={p.from}>
                  <th scope="row">{periodLabel(p.from, p.to, maxMonths)}</th>
                  <td>통상임금의 {p.ratePercent}%</td>
                  <td>{formatWon(p.cap)}</td>
                  <td>{formatWon(p.floor)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="prose" aria-labelledby="method">
        <h2 id="method">계산 방식</h2>
        <p>
          월별 지급액은 통상임금에 지급률을 곱해 구해요. 그 금액이 상한을 넘으면 상한액, 하한에
          못 미치면 하한액으로 계산해요. 원 미만은 버려요.
        </p>
        <p>
          예를 들어 통상임금이 {formatWon(EXAMPLE_WAGE)}이고 {BASE_MONTHS}개월 쓰면 총{' '}
          <strong>{formatWon(example.total)}</strong>이에요.
        </p>
        <p>휴직 중에는 매달 전액을 지급하는 것으로 계산해요. 예전에 있던 사후지급금은 폐지됐어요.</p>
      </section>

      <section className="prose" aria-labelledby="wage">
        <h2 id="wage">통상임금이란</h2>
        <p>
          정해진 근로에 대해 정기적으로 받는 기본급과 수당이에요. 급여 계산에는 휴직 시작일을
          기준으로 한 월 통상임금을 써요. 급여명세서에서 확인할 수 있고, 성과급이나 연장근로수당처럼
          달마다 달라지는 금액은 보통 포함되지 않아요.
        </p>
      </section>

      <section className="prose" aria-labelledby="eligibility">
        <h2 id="eligibility">급여를 받을 수 있는 조건</h2>
        <ul>
          <li>휴직을 시작하기 전 고용보험 피보험단위기간이 통산 180일 이상이어야 해요.</li>
          <li>육아휴직을 30일 이상 사용해야 해요.</li>
          <li>자녀가 휴직 시작일 기준 만 8세 이하이거나 초등학교 2학년 이하여야 해요.</li>
          <li>휴직 시작일 이후 1개월부터 휴직이 끝난 뒤 12개월 이내에 신청해야 해요.</li>
        </ul>
        <p>세부 요건은 개인 상황에 따라 달라질 수 있으니 고용24나 고용센터에서 확인해주세요.</p>
      </section>

      <section className="prose" aria-labelledby="period">
        <h2 id="period">휴직 기간</h2>
        <p>
          기본은 {BASE_MONTHS}개월이에요. 같은 자녀로 부모가 각각 3개월 이상 육아휴직을 사용했거나,
          한부모 또는 중증 장애아동의 부모라면 6개월을 더해 최대 {maxMonths}개월까지 쓸 수 있어요.
          13개월째부터도 7개월째 이후와 같은 기준으로 계산해요.
        </p>
      </section>

      <section className="prose" aria-labelledby="scope">
        <h2 id="scope">이 계산기에 반영되지 않는 경우</h2>
        <p>
          6+6 부모육아휴직 특례, 한부모 가정 특례, 육아기 근로시간 단축 급여는 계산에 넣지 않았어요.
          이런 경우에는 지급액이 더 높거나 달라질 수 있어요.
        </p>
      </section>

      <section className="prose" aria-labelledby="source">
        <h2 id="source">출처</h2>
        <ul>
          <li>고용보험법 시행령 제95조 (육아휴직 급여)</li>
          <li>남녀고용평등과 일·가정 양립 지원에 관한 법률 제19조 (육아휴직)</li>
          <li>
            <a href={OFFICIAL_LINKS.work24} target="_blank" rel="noopener noreferrer">
              고용24
            </a>
            에서 신청과 지급 기준을 확인할 수 있어요.
          </li>
        </ul>
        <p>
          <Link href="/">계산기로 돌아가기</Link>
        </p>
      </section>
    </>
  );
}
