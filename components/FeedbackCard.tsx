import { FEEDBACK_URL } from '@/config/site';

/** 결과 화면 아래 의견 수집 카드. FEEDBACK_URL이 비어 있으면 아무것도 그리지 않는다. */
export default function FeedbackCard() {
  if (!FEEDBACK_URL) return null;

  return (
    <aside className="feedback" aria-labelledby="feedback-title">
      <h3 id="feedback-title" className="feedback-title">
        계산 결과가 도움이 됐나요?
      </h3>
      <p className="feedback-body">
        틀린 부분이나 헷갈린 점을 알려주세요. 30초면 돼요. 실제 지급액과 달랐다면 특히 큰 도움이
        돼요.
      </p>
      <a className="btn btn-outline" href={FEEDBACK_URL} target="_blank" rel="noopener noreferrer">
        의견 남기기
      </a>
    </aside>
  );
}
