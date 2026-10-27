"use client";

import { useState, type FormEvent } from "react";

/** PRD 5번 데이터 모양의 source 필드 */
type Source = {
  type: "url" | "text";
  url: string;
  text: string;
  images: string[];
};

type Mode = Source["type"];
type Status = "idle" | "loading" | "error" | "done";

function isValidUrl(value: string): boolean {
  try {
    const u = new URL(value.trim());
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * URL → 본문·이미지 추출.
 * TODO: 서버 API Route로 연결 (지원 블로그 플랫폼은 기업 확인 후 결정 — PRD 8번)
 */
async function extractFromUrl(url: string): Promise<Source> {
  void url;
  throw new Error("URL 본문 추출 기능은 아직 연결되지 않았어요. 지금은 '본문 붙여넣기'를 이용해 주세요.");
}

export default function ContentInputPage() {
  const [mode, setMode] = useState<Mode>("url");
  const [url, setUrl] = useState("");
  const [text, setText] = useState("");
  const [touched, setTouched] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [source, setSource] = useState<Source | null>(null);

  const value = mode === "url" ? url : text;
  const isEmpty = value.trim().length === 0;
  const fieldError =
    mode === "url" && !isEmpty && !isValidUrl(url) ? "http:// 또는 https:// 로 시작하는 주소를 입력해 주세요." : "";
  const canSubmit = !isEmpty && !fieldError && status !== "loading";

  function switchMode(next: Mode) {
    setMode(next);
    setTouched(false);
    setStatus("idle");
    setError("");
  }

  async function handleSubmit(e?: FormEvent) {
    e?.preventDefault();
    setTouched(true);
    if (!canSubmit) return;

    setStatus("loading");
    setError("");
    setSource(null);
    try {
      const result: Source =
        mode === "url"
          ? await extractFromUrl(url.trim())
          : { type: "text", url: "", text: text.trim(), images: [] };
      setSource(result);
      setStatus("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했어요.");
      setStatus("error");
    }
  }

  const loadingLabel = mode === "url" ? "본문·이미지 추출 중…" : "준비 중…";

  return (
    <main className="wrap">
      <ol className="steps" aria-label="진행 단계">
        <li aria-current="step">1. 콘텐츠 입력</li>
        <li>2. 대본 확인</li>
        <li>3. 장면 편집</li>
        <li>4. 영상 결과</li>
      </ol>

      <h1>블로그 콘텐츠 입력</h1>
      <p className="lead">블로그 URL이나 본문을 넣으면 30~60초 숏폼 대본과 장면을 만들어 드려요.</p>

      <form className="card" onSubmit={handleSubmit} noValidate>
        <div className="tabs" role="tablist" aria-label="입력 방식">
          <button type="button" role="tab" className="tab" aria-selected={mode === "url"} onClick={() => switchMode("url")}>
            블로그 URL
          </button>
          <button type="button" role="tab" className="tab" aria-selected={mode === "text"} onClick={() => switchMode("text")}>
            본문 붙여넣기
          </button>
        </div>

        {mode === "url" ? (
          <div>
            <label htmlFor="url">블로그 글 주소</label>
            <input
              id="url"
              type="url"
              inputMode="url"
              placeholder="https://"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onBlur={() => setTouched(true)}
              aria-invalid={touched && (!!fieldError || isEmpty)}
              disabled={status === "loading"}
            />
            {/* 안내/오류 문구가 항상 한 줄을 차지하게 해서 blur 시 버튼 위치가 밀리지 않게 함 */}
            {touched && isEmpty ? (
              <p className="field-error">주소를 입력해 주세요.</p>
            ) : fieldError ? (
              <p className="field-error">{fieldError}</p>
            ) : (
              <p className="hint">글에 첨부된 이미지도 함께 불러와 장면에 우선 활용해요.</p>
            )}
          </div>
        ) : (
          <div>
            <label htmlFor="text">블로그 본문</label>
            <textarea
              id="text"
              placeholder="블로그 본문을 붙여넣어 주세요."
              value={text}
              onChange={(e) => setText(e.target.value)}
              onBlur={() => setTouched(true)}
              aria-invalid={touched && isEmpty}
              disabled={status === "loading"}
            />
            {touched && isEmpty ? (
              <p className="field-error">본문을 입력해 주세요.</p>
            ) : (
              <p className="hint">본문만 입력하면 블로그 원본 이미지는 함께 불러오지 않아요.</p>
            )}
          </div>
        )}

        <button type="submit" className="submit" disabled={!canSubmit}>
          {status === "loading" ? (
            <>
              <span className="spinner" aria-hidden="true" />
              {loadingLabel}
            </>
          ) : (
            "대본 만들기"
          )}
        </button>

        {status === "error" && (
          <div className="alert" role="alert">
            <span>{error}</span>
            <button type="button" onClick={() => handleSubmit()}>
              다시 시도
            </button>
          </div>
        )}
      </form>

      {status === "done" && source && (
        <section className="handoff" aria-live="polite">
          <h2>다음 화면(대본 확인)으로 넘길 데이터</h2>
          <pre>{JSON.stringify({ source }, null, 2)}</pre>
        </section>
      )}
    </main>
  );
}
