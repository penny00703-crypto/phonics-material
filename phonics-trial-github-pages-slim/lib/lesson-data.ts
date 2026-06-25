export type ScreenType =
  | "cover"
  | "teacher"
  | "student"
  | "section"
  | "letter"
  | "spelling"
  | "word"
  | "chant"
  | "missing"
  | "wordGrid"
  | "keyPoints"
  | "review"
  | "finalReview"
  | "result";

export type InteractionType =
  | "start"
  | "tapReveal"
  | "profilePrompt"
  | "soundPractice"
  | "soundChoice"
  | "flashcard"
  | "chantRepeat"
  | "missingLetter"
  | "wordRead"
  | "compare"
  | "miniQuiz"
  | "assessment"
  | "report";

export type LessonScreen = {
  id: string;
  pptPage: number;
  title: string;
  originalSummary: string;
  screenType: ScreenType;
  interactionType: InteractionType;
  audioUsage: string;
  animationSuggestion: string;
  accent: "sky" | "mint" | "lemon" | "coral" | "lilac";
  heroImage?: string;
  supportingImages?: string[];
  phoneme?: string;
  letter?: string;
  lowercase?: string;
  ipa?: string;
  audio?: string[];
  words?: WordItem[];
  prompt?: string;
  chant?: string;
  options?: ChoiceOption[];
  quiz?: QuizQuestion[];
  revealItems?: string[];
};

export type WordItem = {
  word: string;
  letters?: string[];
  ipa?: string;
  image?: string;
  sentence?: string;
  audio?: string;
};

export type ChoiceOption = {
  label: string;
  correct?: boolean;
};

export type QuizQuestion = {
  prompt: string;
  options: ChoiceOption[];
  audio?: string;
};

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const asset = (name: string) => `${basePath}/assets/${name}`;
const humanVoice = (word: string) => asset(`voice-human/${word}.mp3`);
const generatedHero = asset("phonics-hero-generated.png");

export const lessonScreens: LessonScreen[] = [
  {
    id: "p1-cover",
    pptPage: 1,
    title: "Before We Start",
    originalSummary: "Opening reminder page from the PPT: microphone, camera, stable internet, notebook and pen.",
    screenType: "cover",
    interactionType: "start",
    audioUsage: "No source audio on this page; optional welcome tone is handled visually.",
    animationSuggestion: "Cover image fades in, title pops, start button pulses once.",
    accent: "sky",
    heroImage: asset("preclass-reminder-generated.png"),
    prompt: "Get ready for a smooth interactive trial lesson.",
    revealItems: ["Use your microphone", "Turn on your camera", "Find a quiet place with good internet", "Keep a notebook and pen nearby"]
  },
  {
    id: "p2-opener",
    pptPage: 2,
    title: "Your English Sound Trip",
    originalSummary: "Second opening image, used as lesson atmosphere.",
    screenType: "cover",
    interactionType: "tapReveal",
    audioUsage: "No source audio.",
    animationSuggestion: "Tap tickets to reveal the lesson mission.",
    accent: "mint",
    heroImage: generatedHero,
    revealItems: ["Listen carefully", "Say the sound", "Read the word", "Win small stars"]
  },
  {
    id: "p3-ticket",
    pptPage: 3,
    title: "Your Ticket to English Phonetics",
    originalSummary: "Title slide: Your Ticket to English Phonetics.",
    screenType: "cover",
    interactionType: "tapReveal",
    audioUsage: "No source audio.",
    animationSuggestion: "Ticket card slides upward; small icons float softly.",
    accent: "lemon",
    heroImage: generatedHero,
    revealItems: ["Sound 1: /æ/", "Sound 2: /e/", "Final review"]
  },
  {
    id: "p4-teacher",
    pptPage: 4,
    title: "Meet Your Teacher",
    originalSummary: "Teacher introduction: about me, experience, achievements, teaching style.",
    screenType: "teacher",
    interactionType: "tapReveal",
    audioUsage: "No source audio; teacher can speak live.",
    animationSuggestion: "Teacher facts reveal one by one with check marks.",
    accent: "coral",
    heroImage: generatedHero,
    revealItems: [
      "Experience: [X years of English teaching]",
      "Achievements: [List 1-2 teaching accomplishments]",
      "Teaching Style: friendly, interactive, and encouraging"
    ]
  },
  {
    id: "p5-student",
    pptPage: 5,
    title: "Tell Me About Yourself!",
    originalSummary: "Student self-introduction prompts: name, favorite subject, hobbies, English goals.",
    screenType: "student",
    interactionType: "profilePrompt",
    audioUsage: "No source audio; student speaks or types short answers.",
    animationSuggestion: "Each profile chip fills with a small success burst.",
    accent: "lilac",
    heroImage: generatedHero,
    revealItems: ["Your Name", "Favorite Subject", "Your Hobbies", "English Learning Goals"]
  },
  {
    id: "p6-a-section",
    pptPage: 6,
    title: "First Sound: the vowel /æ/",
    originalSummary: "Section divider: 1st the vowel /æ/.",
    screenType: "section",
    interactionType: "tapReveal",
    audioUsage: "No source audio on divider.",
    animationSuggestion: "Large /æ/ appears with a mouth-position hint.",
    accent: "sky",
    heroImage: generatedHero,
    phoneme: "/æ/",
    revealItems: ["Open your mouth wide", "Keep the sound short", "Try: a, a, apple"]
  },
  {
    id: "p7-letter-a",
    pptPage: 7,
    title: "Aa",
    originalSummary: "Letter Aa: capital A, lowercase a, letter name [eɪ].",
    screenType: "letter",
    interactionType: "soundPractice",
    audioUsage: "Uses media1.mp3 for the letter name/sound practice.",
    animationSuggestion: "Capital and lowercase letters bounce into place.",
    accent: "sky",
    heroImage: generatedHero,
    letter: "A",
    lowercase: "a",
    ipa: "[eɪ]",
    audio: [asset("media1.mp3")]
  },
  {
    id: "p8-a-spelling",
    pptPage: 8,
    title: "Phonics Spelling Aa",
    originalSummary: "Vocabulary examples: ant, ax; focus on the letter a in each word.",
    screenType: "spelling",
    interactionType: "soundChoice",
    audioUsage: "Uses recorded dictionary word audio for ant and ax.",
    animationSuggestion: "Highlighted letter a flips on tap inside each word.",
    accent: "mint",
    heroImage: generatedHero,
    audio: [humanVoice("ant"), humanVoice("ax")],
    words: [
      { word: "ant", letters: ["a", "n", "t"], audio: humanVoice("ant") },
      { word: "ax", letters: ["a", "x"], audio: humanVoice("ax") }
    ],
    options: [{ label: "a", correct: true }, { label: "e" }, { label: "i" }]
  },
  {
    id: "p9-pat-build",
    pptPage: 9,
    title: "Build: p a t",
    originalSummary: "Word card: p a t, A a, IPA [pæt], with image.",
    screenType: "word",
    interactionType: "flashcard",
    audioUsage: "Uses recorded dictionary word audio where available.",
    animationSuggestion: "Letters snap together into the word pat.",
    accent: "lemon",
    heroImage: generatedHero,
    words: [{ word: "pat", letters: ["p", "a", "t"], ipa: "[pæt]", audio: humanVoice("pat") }]
  },
  {
    id: "p10-pat-chant",
    pptPage: 10,
    title: "A is for pat",
    originalSummary: "Chant: A is for pat; a, a, pat.",
    screenType: "chant",
    interactionType: "chantRepeat",
    audioUsage: "No dedicated source audio; repeat button supports live teacher/student call-and-response.",
    animationSuggestion: "Chant text highlights by phrase.",
    accent: "lemon",
    heroImage: generatedHero,
    chant: "A is for pat; a, a, pat.",
    words: [{ word: "pat", ipa: "[pæt]", audio: humanVoice("pat") }]
  },
  {
    id: "p11-rat-build",
    pptPage: 11,
    title: "Build: r a t",
    originalSummary: "Word card: r a t, A a, IPA [ræt], with image.",
    screenType: "word",
    interactionType: "flashcard",
    audioUsage: "Uses recorded dictionary word audio where available.",
    animationSuggestion: "Letters snap together into the word rat.",
    accent: "coral",
    heroImage: generatedHero,
    words: [{ word: "rat", letters: ["r", "a", "t"], ipa: "[ræt]", audio: humanVoice("rat") }]
  },
  {
    id: "p12-rat-chant",
    pptPage: 12,
    title: "A is for rat",
    originalSummary: "Chant: A is for rat; a, a, rat.",
    screenType: "chant",
    interactionType: "chantRepeat",
    audioUsage: "No dedicated source audio; repeat button supports live teacher/student call-and-response.",
    animationSuggestion: "Rat image wiggles after student repeats.",
    accent: "coral",
    heroImage: generatedHero,
    chant: "A is for rat; a, a, rat.",
    words: [{ word: "rat", ipa: "[ræt]", audio: humanVoice("rat") }]
  },
  {
    id: "p13-mat-build",
    pptPage: 13,
    title: "Build: m a t",
    originalSummary: "Word card: m a t, A a, IPA [mæt], with image.",
    screenType: "word",
    interactionType: "flashcard",
    audioUsage: "Uses recorded dictionary word audio where available.",
    animationSuggestion: "Letters snap together into the word mat.",
    accent: "mint",
    heroImage: generatedHero,
    words: [{ word: "mat", letters: ["m", "a", "t"], ipa: "[mæt]", audio: humanVoice("mat") }]
  },
  {
    id: "p14-mat-chant",
    pptPage: 14,
    title: "A is for mat",
    originalSummary: "Chant: A is for mat; a, a, mat.",
    screenType: "chant",
    interactionType: "chantRepeat",
    audioUsage: "No dedicated source audio; repeat button supports live teacher/student call-and-response.",
    animationSuggestion: "Phrase chips glow in reading order.",
    accent: "mint",
    heroImage: generatedHero,
    chant: "A is for mat; a, a, mat.",
    words: [{ word: "mat", ipa: "[mæt]", audio: humanVoice("mat") }]
  },
  {
    id: "p15-jam-build",
    pptPage: 15,
    title: "Build: j a m",
    originalSummary: "Word card: j a m, A a, IPA [dʒæm], with image.",
    screenType: "word",
    interactionType: "flashcard",
    audioUsage: "Uses recorded dictionary word audio where available.",
    animationSuggestion: "Letters snap together into the word jam.",
    accent: "lilac",
    heroImage: generatedHero,
    words: [{ word: "jam", letters: ["j", "a", "m"], ipa: "[dʒæm]", audio: humanVoice("jam") }]
  },
  {
    id: "p16-jam-chant",
    pptPage: 16,
    title: "A is for jam",
    originalSummary: "Chant: A is for jam; a, a, jam.",
    screenType: "chant",
    interactionType: "chantRepeat",
    audioUsage: "No dedicated source audio; repeat button supports live teacher/student call-and-response.",
    animationSuggestion: "Jam picture grows slightly on the final word.",
    accent: "lilac",
    heroImage: generatedHero,
    chant: "A is for jam; a, a, jam.",
    words: [{ word: "jam", ipa: "[dʒæm]", audio: humanVoice("jam") }]
  },
  {
    id: "p17-a-quick-try",
    pptPage: 17,
    title: "Quick Try: Add a",
    originalSummary: "Practice items: ____lligator, ____nt, ____x, ____pple; answer is a.",
    screenType: "missing",
    interactionType: "missingLetter",
    audioUsage: "No source audio; success feedback sound is visual/text only.",
    animationSuggestion: "Correct answers turn into completed words with a star.",
    accent: "sky",
    heroImage: generatedHero,
    words: [
      { word: "alligator", audio: humanVoice("alligator") },
      { word: "ant", audio: humanVoice("ant") },
      { word: "ax", audio: humanVoice("ax") },
      { word: "apple", audio: humanVoice("apple") }
    ],
    options: [{ label: "a", correct: true }, { label: "e" }, { label: "o" }]
  },
  {
    id: "p18-e-section",
    pptPage: 18,
    title: "Second Sound: the vowel /e/",
    originalSummary: "Section divider: 2nd the vowel /e/.",
    screenType: "section",
    interactionType: "tapReveal",
    audioUsage: "No source audio on divider.",
    animationSuggestion: "Large /e/ appears after the /æ/ sound slides aside.",
    accent: "coral",
    heroImage: generatedHero,
    phoneme: "/e/",
    revealItems: ["Small smile mouth", "Short sound", "Try: e, e, egg"]
  },
  {
    id: "p19-letter-e",
    pptPage: 19,
    title: "Ee",
    originalSummary: "Letter Ee: capital E, lowercase e, letter name [i:].",
    screenType: "letter",
    interactionType: "soundPractice",
    audioUsage: "Uses media4.mp3 for Ee letter name/sound practice.",
    animationSuggestion: "Capital and lowercase letters bounce into place.",
    accent: "coral",
    heroImage: generatedHero,
    letter: "E",
    lowercase: "e",
    ipa: "[i:]",
    audio: [asset("media4.mp3")]
  },
  {
    id: "p20-e-spelling",
    pptPage: 20,
    title: "Phonics Spelling Ee",
    originalSummary: "Vocabulary example: bed; b e / be be / be spelling practice.",
    screenType: "spelling",
    interactionType: "soundChoice",
    audioUsage: "Uses recorded dictionary word audio for bed.",
    animationSuggestion: "Letter e lights up inside bed; b + e chunks combine.",
    accent: "mint",
    heroImage: generatedHero,
    audio: [humanVoice("bed")],
    words: [{ word: "bed", letters: ["b", "e", "d"], audio: humanVoice("bed") }],
    options: [{ label: "e", correct: true }, { label: "a" }, { label: "u" }]
  },
  {
    id: "p21-pet-build",
    pptPage: 21,
    title: "Build: p e t",
    originalSummary: "Word card: p e t, E e, IPA [pet], with image.",
    screenType: "word",
    interactionType: "flashcard",
    audioUsage: "Uses recorded dictionary word audio where available.",
    animationSuggestion: "Letters snap together into the word pet.",
    accent: "lemon",
    heroImage: generatedHero,
    words: [{ word: "pet", letters: ["p", "e", "t"], ipa: "[pet]", audio: humanVoice("pet") }]
  },
  {
    id: "p22-get-build",
    pptPage: 22,
    title: "Build: g e t",
    originalSummary: "Word card: g e t, E e, IPA [get], with image.",
    screenType: "word",
    interactionType: "flashcard",
    audioUsage: "Uses recorded dictionary word audio where available.",
    animationSuggestion: "Letters snap together into the word get.",
    accent: "sky",
    heroImage: generatedHero,
    words: [{ word: "get", letters: ["g", "e", "t"], ipa: "[get]", audio: humanVoice("get") }]
  },
  {
    id: "p23-net-build",
    pptPage: 23,
    title: "Build: n e t",
    originalSummary: "Word card: n e t, E e, IPA [net], with image.",
    screenType: "word",
    interactionType: "flashcard",
    audioUsage: "Uses recorded dictionary word audio where available.",
    animationSuggestion: "Letters snap together into the word net.",
    accent: "mint",
    heroImage: generatedHero,
    words: [{ word: "net", letters: ["n", "e", "t"], ipa: "[net]", audio: humanVoice("net") }]
  },
  {
    id: "p24-jet-build",
    pptPage: 24,
    title: "Build: j e t",
    originalSummary: "Word card: j e t, E e, IPA [dʒet], with image.",
    screenType: "word",
    interactionType: "flashcard",
    audioUsage: "Uses recorded dictionary word audio where available.",
    animationSuggestion: "Jet image takes off after the word is built.",
    accent: "lilac",
    heroImage: generatedHero,
    words: [{ word: "jet", letters: ["j", "e", "t"], ipa: "[dʒet]", audio: humanVoice("jet") }]
  },
  {
    id: "p25-e-quick-try",
    pptPage: 25,
    title: "Quick Try: Read Ee Words",
    originalSummary: "Practice word list: pet, pen, net, get, set, leg, jet, red, bed.",
    screenType: "wordGrid",
    interactionType: "wordRead",
    audioUsage: "Uses recorded dictionary word audio where available.",
    animationSuggestion: "Tapped words flip from grey to color with encouragement.",
    accent: "coral",
    heroImage: generatedHero,
    words: ["pet", "pen", "net", "get", "set", "leg", "jet", "red", "bed"].map((word) => ({ word, audio: humanVoice(word) }))
  },
  {
    id: "p26-key-points",
    pptPage: 26,
    title: "Key Points",
    originalSummary: "Key points summary slide with visual support.",
    screenType: "keyPoints",
    interactionType: "compare",
    audioUsage: "No source audio; students compare two short vowel sounds orally.",
    animationSuggestion: "Two sound cards slide side-by-side for comparison.",
    accent: "lemon",
    heroImage: generatedHero,
    revealItems: ["Letter a can say /æ/ in pat", "Letter e can say /e/ in pet", "Short vowels are quick sounds"]
  },
  {
    id: "p27-pronunciation-review",
    pptPage: 27,
    title: "Pronunciation Review",
    originalSummary: "Summary: letter a [æ], letter e [e], pat/rat/mat/jam and pet/get/net/jet.",
    screenType: "review",
    interactionType: "miniQuiz",
    audioUsage: "No source audio; students can use record/compare on review words.",
    animationSuggestion: "Correct answers unlock a small badge.",
    accent: "sky",
    heroImage: generatedHero,
    quiz: [
      { prompt: "Which sound is in pat?", options: [{ label: "/æ/", correct: true }, { label: "/e/" }] },
      { prompt: "Which word uses /e/?", options: [{ label: "pet", correct: true }, { label: "pat" }] },
      { prompt: "Choose the /æ/ word.", options: [{ label: "jam", correct: true }, { label: "jet" }] }
    ]
  },
  {
    id: "p28-final-review",
    pptPage: 28,
    title: "Teacher Diagnosis",
    originalSummary: "Ending teacher diagnosis slide from the PPT: student level, strengths, areas to improve, and learning suggestions.",
    screenType: "finalReview",
    interactionType: "assessment",
    audioUsage: "Audio review combines available Aa/Ee files plus oral word reading.",
    animationSuggestion: "Teacher feedback categories appear as a friendly mission board.",
    accent: "mint",
    heroImage: asset("image50.png"),
    quiz: [
      { prompt: "Vocabulary: Which word matches /pæt/?", options: [{ label: "pat", correct: true }, { label: "pet" }] },
      { prompt: "Phonics: Fill the missing letter: b _ d", options: [{ label: "e", correct: true }, { label: "a" }] },
      { prompt: "Listening: tap the short a sound.", audio: humanVoice("ant"), options: [{ label: "a", correct: true }, { label: "e" }] },
      { prompt: "Pronunciation: say jam, then choose its vowel.", options: [{ label: "/æ/", correct: true }, { label: "/e/" }] },
      { prompt: "Mini assessment: Which pair has the same vowel sound?", options: [{ label: "pet / bed", correct: true }, { label: "pat / pet" }] }
    ]
  },
  {
    id: "p29-result",
    pptPage: 29,
    title: "CEFR Ability Benchmark",
    originalSummary: "CEFR levels and key abilities table from the PPT, used to connect the trial lesson result to a learning path.",
    screenType: "result",
    interactionType: "report",
    audioUsage: "No source audio; report encourages next lesson readiness.",
    animationSuggestion: "Completion badge scales in with confetti-like dots.",
    accent: "lilac",
    heroImage: asset("image51.png"),
    prompt: "You are ready for the next lesson!"
  }
];

export const majorCheckpoints = [17, 27, 28, 29];

export function getInteractionPlanMarkdown() {
  return lessonScreens
    .map(
      (screen) =>
        `### PPT Page ${screen.pptPage}: ${screen.title}
- Original content summary: ${screen.originalSummary}
- New screen type: ${screen.screenType}
- Interaction type: ${screen.interactionType}
- Audio usage: ${screen.audioUsage}
- Animation suggestion: ${screen.animationSuggestion}`
    )
    .join("\n\n");
}
