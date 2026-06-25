"use client";

import { ArrowLeft, ArrowRight, Award, Camera, Check, Lightbulb, Mic, NotebookPen, Play, RotateCcw, Target, Volume2, Wifi, X } from "lucide-react";
import { CSSProperties, useEffect, useMemo, useRef, useState } from "react";
import { LessonScreen, QuizQuestion, lessonScreens } from "@/lib/lesson-data";

type Feedback = "idle" | "correct" | "try";

const accent = {
  sky: "#26B7FF",
  mint: "#22C7A5",
  lemon: "#FDE700",
  coral: "#FF6B6B",
  lilac: "#7C6EF8"
};

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const asset = (name: string) => `${basePath}/assets/${name}`;

const standaloneWordImages: Record<string, string> = {
  alligator: asset("word-items/alligator.png"),
  ant: asset("word-items/ant.png"),
  apple: asset("word-items/apple.png"),
  ax: asset("word-items/ax.png"),
  bed: asset("word-items/bed.png"),
  get: asset("word-items/get.png"),
  jam: asset("word-items/jam.png"),
  jet: asset("word-items/jet.png"),
  leg: asset("word-items/leg.png"),
  mat: asset("word-items/mat.png"),
  net: asset("word-items/net.png"),
  pat: asset("word-items/pat.png"),
  pen: asset("word-items/pen.png"),
  pet: asset("word-items/pet.png"),
  rat: asset("word-items/rat.png"),
  red: asset("word-items/red.png"),
  set: asset("word-items/set.png")
};

const wordImageTuning: Record<string, { scale?: number; x?: number; y?: number }> = {
  alligator: { scale: 0.82 },
  ant: { scale: 0.84 },
  apple: { scale: 0.76 },
  ax: { scale: 0.76 },
  bed: { scale: 0.82 },
  get: { scale: 0.86 },
  jet: { scale: 0.78 },
  leg: { scale: 0.86 },
  net: { scale: 0.82 },
  pen: { scale: 0.82 },
  pet: { scale: 0.82 },
  red: { scale: 0.88 },
  set: { scale: 0.88 }
};

const textFromAudioSrc = (src: string) => {
  const file = decodeURIComponent(src.split("/").pop() ?? "").replace(/\.(mp3|wav|aiff)$/i, "");
  return file.replace(/^voice-/, "").replace(/^chant-/, "").replace(/-/g, " ");
};

export default function LessonPage() {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [revealed, setRevealed] = useState<Record<string, number>>({});
  const [feedback, setFeedback] = useState<Feedback>("idle");
  const [successBurst, setSuccessBurst] = useState(0);
  const [audioStatus, setAudioStatus] = useState<"idle" | "playing">("idle");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioRunRef = useRef(0);

  const screen = lessonScreens[index];
  const progress = ((index + 1) / lessonScreens.length) * 100;

  useEffect(() => {
    const raw = new URLSearchParams(window.location.search).get("screen");
    const next = raw ? Number(raw) - 1 : Number.NaN;
    if (Number.isInteger(next) && next >= 0 && next < lessonScreens.length) setIndex(next);
  }, []);

  useEffect(() => {
    return () => {
      if (audioRef.current) audioRef.current.pause();
      window.speechSynthesis?.cancel();
    };
  }, []);
  const score = useMemo(() => {
    const total = Object.keys(answers).length;
    const correct = Object.values(answers).filter(Boolean).length;
    return { total, correct, percent: total ? Math.round((correct / total) * 100) : 0 };
  }, [answers]);

  const go = (next: number) => {
    setIndex(Math.max(0, Math.min(lessonScreens.length - 1, next)));
    setFeedback("idle");
    setAudioStatus("idle");
    if (audioRef.current) audioRef.current.pause();
    window.speechSynthesis?.cancel();
  };

  const answer = (key: string, correct: boolean, value?: string) => {
    setAnswers((old) => ({ ...old, [key]: correct }));
    if (value) setSelected((old) => ({ ...old, [key]: value }));
    setFeedback(correct ? "correct" : "try");
    if (correct) setSuccessBurst((old) => old + 1);
  };

  const revealNext = () => {
    const max = screen.revealItems?.length ?? 0;
    setRevealed((old) => ({ ...old, [screen.id]: Math.min(max, (old[screen.id] ?? 0) + 1) }));
  };

  const speakText = (text: string) => {
    if (!window.speechSynthesis) return Promise.resolve();
    return new Promise<void>((resolve) => {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const voices = window.speechSynthesis.getVoices();
      utterance.voice =
        voices.find((voice) => /^en[-_]/i.test(voice.lang) && /female|samantha|karen|victoria|ava|serena/i.test(voice.name)) ??
        voices.find((voice) => /^en[-_]/i.test(voice.lang)) ??
        null;
      utterance.lang = utterance.voice?.lang || "en-US";
      utterance.rate = 0.82;
      utterance.pitch = 1.04;
      utterance.onend = () => {
        setAudioStatus("idle");
        resolve();
      };
      utterance.onerror = () => {
        setAudioStatus("idle");
        resolve();
      };
      setAudioStatus("playing");
      window.speechSynthesis.speak(utterance);
    });
  };

  const playAudio = async (src?: string) => {
    const runId = audioRunRef.current + 1;
    audioRunRef.current = runId;
    const startedAt = Date.now();
    const finishPlayback = () => {
      const delay = Math.max(0, 650 - (Date.now() - startedAt));
      window.setTimeout(() => {
        if (audioRunRef.current === runId) setAudioStatus("idle");
      }, delay);
    };
    if (!src) return;
    setAudioStatus("playing");
    if (src.startsWith("tts:")) {
      await speakText(src.replace("tts:", ""));
      return;
    }
    try {
      const audio = audioRef.current;
      if (!audio) {
        await speakText(textFromAudioSrc(src));
        return;
      }
      audio.pause();
      audio.src = src;
      audio.onended = finishPlayback;
      audio.onerror = () => {
        finishPlayback();
        speakText(textFromAudioSrc(src));
      };
      audio.load();
      await audio.play().catch(() => {
        finishPlayback();
        speakText(textFromAudioSrc(src));
      });
      return;
    } catch {
      finishPlayback();
      await speakText(textFromAudioSrc(src));
    }
  };

  return (
    <main className="courseware-shell">
      <div className="course-frame">
        <TopBar index={index} progress={progress} />
        <section key={screen.id} className="stage">
          <SlideContent
            screen={screen}
            index={index}
            revealedCount={revealed[screen.id] ?? 0}
            revealNext={revealNext}
            playAudio={playAudio}
            answer={answer}
            selected={selected}
            score={score}
            audioStatus={audioStatus}
          />
          <Feedback feedback={feedback} burst={successBurst} />
        </section>
        <BottomBar index={index} go={go} />
        <audio ref={audioRef} preload="auto" className="lesson-audio" />
      </div>
    </main>
  );
}

function TopBar({ index, progress }: { index: number; progress: number }) {
  return (
    <header className="topbar">
      <div className="brand-lockup">
        <div className="brand-mark">P</div>
        <div>
          <div className="brand-name">PHONICS</div>
          <div className="brand-sub">Trial Lesson</div>
        </div>
      </div>
      <div className="progress-lockup">
        <div className="progress-text">
          {index + 1} / {lessonScreens.length}
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </header>
  );
}

function BottomBar({ index, go }: { index: number; go: (index: number) => void }) {
  return (
    <footer className="bottombar">
      <button className="round-btn" disabled={index === 0} onClick={() => go(index - 1)} aria-label="Previous">
        <ArrowLeft />
      </button>
      <button className="reset-btn" onClick={() => go(0)}>
        <RotateCcw />
        Reset
      </button>
      <button className="next-btn" onClick={() => go(index + 1)}>
        {index === lessonScreens.length - 1 ? "Again" : "Next"}
        <ArrowRight />
      </button>
    </footer>
  );
}

function SlideContent(props: {
  screen: LessonScreen;
  index: number;
  revealedCount: number;
  revealNext: () => void;
  playAudio: (src?: string) => void;
  answer: (key: string, correct: boolean, value?: string) => void;
  selected: Record<string, string>;
  score: { total: number; correct: number; percent: number };
  audioStatus: "idle" | "playing";
}) {
  const { screen } = props;
  if (screen.pptPage === 1) return <AnchorSlide {...props} />;
  if (screen.pptPage === 28) return <DiagnosisSlide {...props} />;
  if (screen.pptPage === 29) return <BenchmarkSlide {...props} />;
  if (screen.pptPage === 2 || screen.pptPage === 5) return <IntroGuideSlide {...props} />;
  if (screen.pptPage === 6 || screen.pptPage === 18) return <MouthSoundSlide {...props} />;
  if (screen.screenType === "letter") return <LetterSlide {...props} />;
  if (screen.screenType === "spelling") return <SpellingSlide {...props} />;
  if (screen.screenType === "word") return <WordSlide {...props} />;
  if (screen.screenType === "chant") return <ChantSlide {...props} />;
  if (screen.screenType === "missing") return <MissingSlide {...props} />;
  if (screen.screenType === "wordGrid") return <WordGridSlide {...props} />;
  if (screen.screenType === "review" || screen.screenType === "finalReview") return <QuizSlide {...props} />;
  if (screen.screenType === "result") return <ResultSlide {...props} />;
  return <RevealSlide {...props} />;
}

function SlideTitle({ screen, label }: { screen: LessonScreen; label?: string }) {
  return (
    <div className="slide-title">
      <div className="kicker" style={{ color: accent[screen.accent] }}>
        {label ?? `Step ${screen.pptPage}`}
      </div>
      <h1>{screen.title}</h1>
    </div>
  );
}

function AnchorSlide({ screen, score }: Parameters<typeof SlideContent>[0]) {
  const isResult = screen.pptPage === 29;
  return (
    <div className="anchor-slide">
      <div className="anchor-visual-frame">
        <img src={screen.heroImage} alt="" className="anchor-image" />
      </div>
      <div className="anchor-copy">
        <SlideTitle screen={screen} label={screen.pptPage === 1 ? "Ready" : screen.pptPage === 28 ? "Teacher Diagnosis" : "CEFR Benchmark"} />
        {isResult ? (
          <div className="report-strip">
            <div>
              <strong>{score.total ? `${score.percent}%` : "Ready"}</strong>
              <span>Practice Score</span>
            </div>
            <div>
              <strong>100%</strong>
              <span>Completion</span>
            </div>
          </div>
        ) : (
          <>
            <p>{screen.prompt ?? screen.originalSummary}</p>
            {screen.pptPage === 1 && <PreparationIcons />}
          </>
        )}
      </div>
    </div>
  );
}

function PreparationIcons() {
  const items = [
    { label: "Mic", icon: Mic },
    { label: "Camera", icon: Camera },
    { label: "Wi-Fi", icon: Wifi },
    { label: "Notes", icon: NotebookPen }
  ];
  return (
    <div className="prep-icons">
      {items.map(({ label, icon: Icon }) => (
        <div key={label}>
          <Icon />
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}

function IntroGuideSlide({ screen, revealedCount, revealNext }: Parameters<typeof SlideContent>[0]) {
  const isStudent = screen.pptPage === 5;
  const items = (screen.revealItems ?? []).slice(0, Math.max(1, revealedCount));
  return (
    <div className="guide-slide">
      <div className="guide-visual">
        <img src="/assets/phonics-hero-generated.png" alt="" />
      </div>
      <div className="guide-copy">
        <SlideTitle screen={screen} label={isStudent ? "Your Turn" : "Warm Up"} />
        <p className="lead">{isStudent ? "Answer with short phrases. The teacher will guide you." : "We will listen, say, and read one step at a time."}</p>
        <div className="guide-chips">
          {items.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
        {revealedCount < (screen.revealItems?.length ?? 0) && (
          <button className="primary-action" onClick={revealNext}>
            Reveal
            <ArrowRight />
          </button>
        )}
      </div>
    </div>
  );
}

function MouthSoundSlide({ screen, revealedCount, revealNext }: Parameters<typeof SlideContent>[0]) {
  const isA = screen.phoneme === "/æ/";
  const visible = (screen.revealItems ?? []).slice(0, Math.max(1, revealedCount));
  return (
    <div className="mouth-slide">
      <SlideTitle screen={screen} label="New Sound" />
      <div className="mouth-layout">
        <div className="mouth-card">
          <div className={isA ? "mouth-photo real-a" : "mouth-photo real-e"} aria-label={isA ? "Open wide mouth for /æ/" : "Small smile mouth for /e/"} />
          <strong>{screen.phoneme}</strong>
        </div>
        <div className="reveal-list compact">
          {visible.map((item) => (
            <div key={item} className="reveal-item">
              <Check />
              {item}
            </div>
          ))}
        </div>
      </div>
      {revealedCount < (screen.revealItems?.length ?? 0) && (
        <button className="primary-action" onClick={revealNext}>
          Reveal
          <ArrowRight />
        </button>
      )}
    </div>
  );
}

function RevealSlide({ screen, revealedCount, revealNext }: Parameters<typeof SlideContent>[0]) {
  const items = screen.revealItems ?? [];
  const visible = items.slice(0, revealedCount);
  return (
    <div className="simple-slide">
      <SlideTitle screen={screen} label={screen.screenType === "section" ? "New Sound" : "Warm Up"} />
      {screen.phoneme && <div className="sound-badge" style={{ background: accent[screen.accent] }}>{screen.phoneme}</div>}
      {screen.prompt && <p className="lead">{screen.prompt}</p>}
      <div className="reveal-list">
        {visible.map((item) => (
          <div key={item} className="reveal-item">
            <Check />
            {item}
          </div>
        ))}
      </div>
      {revealedCount < items.length && (
        <button className="primary-action" onClick={revealNext}>
          Reveal
          <ArrowRight />
        </button>
      )}
    </div>
  );
}

function LetterSlide({ screen, playAudio, audioStatus }: Parameters<typeof SlideContent>[0]) {
  return (
    <div className="focus-slide letter-slide">
      <div className="kicker" style={{ color: accent[screen.accent] }}>Listen</div>
      <div className="letter-focus">
        <span>{screen.letter}</span>
        <span style={{ color: accent[screen.accent] }}>{screen.lowercase}</span>
      </div>
      <div className="letter-ipa">{screen.ipa}</div>
      <button className="primary-action" onClick={() => playAudio(screen.audio?.[0])}>
        <Play />
        {audioStatus === "playing" ? "Playing..." : "Play Sound"}
      </button>
    </div>
  );
}

function SpellingSlide({ screen, playAudio, answer, selected, audioStatus }: Parameters<typeof SlideContent>[0]) {
  return (
    <div className="focus-slide">
      <SlideTitle screen={screen} label="Listen and Choose" />
      <div className="word-row">
        {screen.words?.map((item) => (
          <button key={item.word} className="word-pill large" onClick={() => playAudio(item.audio)}>
            <WordArt word={item.word} size="small" />
            {highlightWord(item.word, item.word.includes("a") ? "a" : "e")}
            <Volume2 />
          </button>
        ))}
      </div>
      <p className="lead">Which vowel sound do you hear?</p>
      <Choices prefix={screen.id} options={screen.options ?? []} answer={answer} selected={selected[screen.id]} />
    </div>
  );
}

function WordSlide({ screen, playAudio, answer, selected, audioStatus }: Parameters<typeof SlideContent>[0]) {
  const item = screen.words?.[0];
  if (!item) return null;
  const vowel = item.word.includes("a") ? "a" : "e";
  const chosen = selected[screen.id];
  return (
    <div className="focus-slide word-slide">
      <div className="tile-word">
        {(item.letters ?? item.word.split("")).map((letter, index) => (
          <button
            key={`${letter}-${index}`}
            onClick={() => answer(screen.id, letter === vowel, letter)}
            className={[
              "letter-tile",
              letter === vowel ? "vowel" : "",
              chosen === letter ? "selected" : "",
              chosen === letter && letter === vowel ? "correct" : "",
              chosen === letter && letter !== vowel ? "wrong" : ""
            ].join(" ")}
          >
            {letter}
          </button>
        ))}
      </div>
      <div className="word-content">
        <div className="word-hero">
          <WordArt word={item.word} size="large" />
        </div>
        <div className="word-actions">
          <div className="word-pronunciation">
            <strong>{item.word}</strong>
            <span>{item.ipa}</span>
          </div>
          <button className="primary-action" disabled={!item.audio} onClick={() => playAudio(item.audio)}>
            <Play />
            {!item.audio ? "Teacher Voice Soon" : audioStatus === "playing" ? "Playing..." : "Hear Word"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ChantSlide({ screen, playAudio, audioStatus }: Parameters<typeof SlideContent>[0]) {
  const audio = screen.audio?.[0];
  return (
    <div className="focus-slide">
      <SlideTitle screen={screen} label="Read" />
      <div className="chant-line">{screen.chant}</div>
      {audio && (
        <button className="primary-action" onClick={() => playAudio(audio)}>
          <Play />
          {audioStatus === "playing" ? "Playing..." : "Say It"}
        </button>
      )}
    </div>
  );
}

function MissingSlide({ screen, answer, selected }: Parameters<typeof SlideContent>[0]) {
  const correct = screen.options?.find((option) => option.correct)?.label;
  const words = screen.words ?? [];
  const activeItem = words.find((item) => selected[`${screen.id}-${item.word}`] !== correct) ?? words[words.length - 1];
  const activeKey = activeItem ? `${screen.id}-${activeItem.word}` : screen.id;
  const chosen = selected[activeKey];
  return (
    <div className="focus-slide missing-slide">
      <div className="slide-title">
        <div className="kicker" style={{ color: accent[screen.accent] }}>Quick Try</div>
        <h1>Add a</h1>
      </div>
      <div className="missing-grid">
        {words.map((item) => {
          const itemKey = `${screen.id}-${item.word}`;
          const itemChoice = selected[itemKey];
          const isDone = itemChoice === correct;
          const isActive = item.word === activeItem?.word;
          return (
          <div key={item.word} className={["missing-card", isActive ? "active" : "", isDone ? "done" : ""].join(" ")}>
            <WordArt word={item.word} size="practice" />
            <div className="missing-word">
              <span className={isDone ? "filled-letter" : ""}>{isDone ? itemChoice : "__"}</span>
              <span>{item.word.slice(1)}</span>
            </div>
          </div>
          );
        })}
      </div>
      <Choices prefix={activeKey} options={screen.options ?? []} answer={answer} selected={chosen} />
    </div>
  );
}

function WordGridSlide({ screen, playAudio, answer, selected }: Parameters<typeof SlideContent>[0]) {
  return (
    <div className="focus-slide read-slide">
      <div className="slide-title">
        <div className="kicker" style={{ color: accent[screen.accent] }}>Read Aloud</div>
        <h1>Read Ee Words</h1>
      </div>
      <div className="read-grid">
        {screen.words?.map((item, index) => (
          <button
            key={item.word}
            className={selected[`${screen.id}-${index}`] === item.word ? "selected-word" : ""}
            onClick={() => {
              if (item.audio) playAudio(item.audio);
              answer(`${screen.id}-${index}`, true, item.word);
            }}
          >
            <WordArt word={item.word} size="tile" />
            <span>{item.word}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function QuizSlide({ screen, playAudio, answer, selected }: Parameters<typeof SlideContent>[0]) {
  const question = screen.quiz?.[0];
  if (!question) return <RevealSlide {...({ screen, revealedCount: 0, revealNext: () => {}, playAudio, answer, selected, score: { total: 0, correct: 0, percent: 0 }, index: 0, audioStatus: "idle" } as Parameters<typeof SlideContent>[0])} />;
  return (
    <div className="focus-slide">
      <SlideTitle screen={screen} label="Checkpoint" />
      <QuizQuestionCard screen={screen} question={question} index={0} playAudio={playAudio} answer={answer} selected={selected[`${screen.id}-0`]} />
    </div>
  );
}

function ResultSlide({ screen, score }: Parameters<typeof SlideContent>[0]) {
  return (
    <div className="focus-slide">
      <SlideTitle screen={screen} label="Report" />
      <div className="report-strip wide">
        <div>
          <strong>100%</strong>
          <span>Completion</span>
        </div>
        <div>
          <strong>{score.total ? `${score.percent}%` : "Ready"}</strong>
          <span>Practice Score</span>
        </div>
      </div>
      <p className="lead">{screen.prompt}</p>
    </div>
  );
}

function DiagnosisSlide({ score }: Parameters<typeof SlideContent>[0]) {
  const cards = [
    { icon: Target, label: "Level", value: "A1 Starter", note: "Ready for guided phonics reading", tone: "sky" },
    { icon: Award, label: "Strong point", value: "Short vowels", note: "/a/ and /e/ are becoming clearer", tone: "mint" },
    { icon: Lightbulb, label: "Next step", value: "CVC words", note: "Read and blend: pat, pet, bed, jam", tone: "lemon" }
  ] as const;
  return (
    <div className="diagnosis-slide">
      <div className="diagnosis-header">
        <span>Teacher Diagnosis</span>
        <h1>A1 Starter</h1>
        <p>Clear next step for the student after today&apos;s phonics trial.</p>
      </div>
      <div className="diagnosis-board">
        {cards.map(({ icon: Icon, label, value, note, tone }) => (
          <div key={label} className={`diagnosis-card ${tone}`}>
            <div className="diagnosis-icon">
              <Icon />
            </div>
            <div>
              <span>{label}</span>
              <strong>{value}</strong>
              <p>{note}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="report-strip compact">
        <div>
          <strong>{score.total ? `${score.percent}%` : "Ready"}</strong>
          <span>Practice Score</span>
        </div>
        <div>
          <strong>Next</strong>
          <span>Personal learning plan</span>
        </div>
      </div>
    </div>
  );
}

function BenchmarkSlide({ score }: Parameters<typeof SlideContent>[0]) {
  const levels = [
    {
      level: "C2",
      ability: "Understands virtually everything with ease. Summarizes, analyzes and evaluates information. Expresses ideas precisely and appropriately in any context."
    },
    {
      level: "C1",
      ability: "Understands complex texts and expresses ideas fluently. Uses language flexibly and effectively in academic, work and social contexts."
    },
    {
      level: "B2",
      ability: "Understands main ideas of complex texts. Communicates with fluency and interacts naturally. Explains viewpoints and discusses issues."
    },
    {
      level: "B1",
      ability: "Understands main points of familiar topics. Deals with most situations while traveling. Describes experiences, events and plans."
    },
    {
      level: "A2",
      ability: "Understands common expressions and simple information. Communicates in routine tasks. Describes background and immediate needs."
    },
    {
      level: "A1",
      ability: "Understands and uses basic phrases. Introduces oneself, asks and answers simple questions. Interacts slowly and simply."
    }
  ];
  return (
    <div className="benchmark-slide">
      <div className="cefr-ladder" aria-label="CEFR levels">
        {levels.map(({ level, ability }) => (
          <div key={level} className={level === "A1" ? "active" : ""}>
            <strong>{level}</strong>
            <span>{ability}</span>
          </div>
        ))}
      </div>
      <div className="benchmark-copy">
        <SlideTitle
          screen={{
            id: "benchmark-title",
            pptPage: 29,
            title: "CEFR Ability Benchmark",
            originalSummary: "",
            screenType: "result",
            interactionType: "report",
            audioUsage: "",
            animationSuggestion: "",
            accent: "lilac"
          }}
          label="CEFR Benchmark"
        />
        <div className="report-strip">
          <div>
            <strong>{score.total ? `${score.percent}%` : "75%"}</strong>
            <span>Practice Score</span>
          </div>
          <div>
            <strong>100%</strong>
            <span>Completion</span>
          </div>
        </div>
        <p className="lead">You are ready for the next lesson!</p>
      </div>
    </div>
  );
}

function QuizQuestionCard({
  screen,
  question,
  index,
  playAudio,
  answer,
  selected
}: {
  screen: LessonScreen;
  question: QuizQuestion;
  index: number;
  playAudio: (src?: string) => void;
  answer: (key: string, correct: boolean, value?: string) => void;
  selected?: string;
}) {
  return (
    <div className="quiz-card">
      <p>{question.prompt}</p>
      {question.audio && (
        <button className="listen-btn" onClick={() => playAudio(question.audio)}>
          <Volume2 />
        </button>
      )}
      <Choices prefix={`${screen.id}-${index}`} options={question.options} answer={answer} selected={selected} />
    </div>
  );
}

function Choices({
  prefix,
  options,
  answer,
  selected
}: {
  prefix: string;
  options: { label: string; correct?: boolean }[];
  answer: (key: string, correct: boolean, value?: string) => void;
  selected?: string;
}) {
  return (
    <div className="choice-row">
      {options.map((option) => {
        const isSelected = selected === option.label;
        return (
        <button
          key={option.label}
          className={[isSelected ? "selected" : "", isSelected && option.correct ? "correct" : "", isSelected && !option.correct ? "wrong" : ""].join(" ")}
          onClick={() => answer(prefix, Boolean(option.correct), option.label)}
        >
          {option.label}
        </button>
        );
      })}
    </div>
  );
}

function WordArt({ word, size = "small" }: { word: string; size?: "mini" | "small" | "practice" | "tile" | "large" }) {
  const src = standaloneWordImages[word];
  if (!src) return null;
  const tune = wordImageTuning[word] ?? {};
  const sizeScale = size === "tile" ? 1.32 : 1;
  return (
    <span
      className={`word-art ${size}`}
      aria-hidden="true"
      style={{
        "--word-scale": (tune.scale ?? 1) * sizeScale,
        "--word-x": `${tune.x ?? 0}%`,
        "--word-y": `${tune.y ?? 0}%`
      } as CSSProperties}
    >
      <img src={src} alt="" />
    </span>
  );
}

function Feedback({ feedback, burst }: { feedback: Feedback; burst: number }) {
  if (feedback === "idle") return null;
  const ok = feedback === "correct";
  return (
    <>
      {ok && <Fireworks key={burst} />}
      <div className={ok ? "feedback ok" : "feedback try"}>
        {ok ? <Check /> : <X />}
        {ok ? "Great job" : "Try again"}
      </div>
    </>
  );
}

function Fireworks() {
  const centers = [
    { x: "28%", y: "28%" },
    { x: "72%", y: "30%" },
    { x: "50%", y: "48%" },
    { x: "32%", y: "68%" },
    { x: "70%", y: "70%" }
  ];
  return (
    <div className="fireworks" aria-hidden="true">
      {centers.map((center, burstIndex) => (
        <span
          key={`ring-${burstIndex}`}
          className="firework-ring"
          style={{ "--cx": center.x, "--cy": center.y, "--delay": `${burstIndex * 90}ms` } as CSSProperties}
        />
      ))}
      {Array.from({ length: 90 }).map((_, index) => {
        const center = centers[index % centers.length];
        const local = Math.floor(index / centers.length);
        const angle = (local / 18) * Math.PI * 2;
        const distance = 70 + (local % 4) * 18;
        return (
          <span
            key={index}
            className="firework-spark"
            style={{
              "--i": index,
              "--cx": center.x,
              "--cy": center.y,
              "--x": `${Math.cos(angle) * distance}px`,
              "--y": `${Math.sin(angle) * distance}px`,
              "--delay": `${(index % centers.length) * 90}ms`
            } as CSSProperties}
          />
        );
      })}
    </div>
  );
}

function highlightWord(word: string, vowel: string) {
  return (
    <span>
      {word.split("").map((letter, index) => (
        <span key={`${letter}-${index}`} className={letter === vowel ? "hl" : ""}>
          {letter}
        </span>
      ))}
    </span>
  );
}
