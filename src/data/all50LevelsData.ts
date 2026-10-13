import { LevelQuestion, Difficulty, QuestionSubject } from '../types/game';

// The answer key provided by the user for all 50 levels (A=0, B=1, C=2, D=3)
export const RAW_ANSWER_KEYS: Record<number, number[]> = {
  1: [1, 0, 1, 1, 0, 0, 1, 2, 1, 0, 1, 1, 1, 0, 0],
  2: [1, 2, 1, 1, 1, 0, 2, 1, 1, 2, 0, 2, 0, 0, 0],
  3: [1, 1, 2, 3, 2, 0, 2, 1, 2, 0, 1, 2, 1, 0, 0],
  4: [0, 0, 2, 0, 0, 0, 2, 2, 2, 1, 0, 2, 0, 0, 0],
  5: [2, 0, 1, 1, 0, 0, 2, 3, 1, 1, 1, 1, 2, 0, 0],
  6: [1, 1, 1, 2, 3, 0, 2, 1, 1, 1, 1, 1, 1, 0, 0],
  7: [0, 1, 3, 1, 0, 0, 1, 2, 0, 2, 0, 2, 0, 0, 0],
  8: [0, 1, 0, 1, 0, 0, 1, 2, 2, 2, 1, 2, 1, 0, 0],
  9: [1, 1, 1, 2, 1, 0, 2, 2, 0, 1, 0, 2, 0, 0, 0],
  10: [1, 1, 2, 2, 1, 0, 3, 2, 1, 1, 1, 1, 2, 0, 0],
  11: [1, 0, 1, 1, 0, 0, 1, 2, 1, 0, 1, 1, 1, 0, 0],
  12: [1, 2, 1, 1, 0, 0, 2, 1, 1, 2, 0, 2, 0, 0, 0],
  13: [1, 1, 2, 3, 2, 0, 2, 1, 2, 0, 1, 2, 1, 0, 0],
  14: [0, 0, 2, 0, 0, 0, 2, 2, 2, 1, 0, 2, 0, 0, 0],
  15: [2, 0, 1, 1, 0, 0, 2, 3, 1, 1, 1, 1, 2, 0, 0],
  16: [1, 1, 1, 2, 1, 0, 2, 1, 1, 1, 1, 1, 1, 0, 0],
  17: [0, 1, 3, 1, 3, 0, 1, 2, 0, 2, 0, 2, 0, 0, 0],
  18: [0, 1, 0, 1, 0, 0, 1, 2, 2, 2, 1, 2, 1, 0, 0],
  19: [1, 1, 1, 2, 0, 0, 2, 2, 0, 1, 0, 2, 0, 0, 0],
  20: [1, 1, 2, 2, 2, 0, 3, 2, 1, 1, 1, 1, 2, 0, 0],
  21: [1, 0, 1, 1, 0, 0, 1, 2, 1, 0, 1, 1, 1, 0, 0],
  22: [1, 2, 1, 1, 0, 0, 2, 1, 1, 2, 0, 2, 0, 0, 0],
  23: [1, 1, 2, 3, 1, 0, 2, 1, 2, 0, 1, 2, 1, 0, 0],
  24: [0, 0, 2, 0, 3, 0, 2, 2, 2, 1, 0, 2, 0, 0, 0],
  25: [2, 0, 1, 1, 0, 0, 2, 3, 1, 1, 1, 1, 2, 0, 0],
  26: [1, 1, 1, 2, 0, 0, 2, 1, 1, 1, 1, 1, 1, 0, 0],
  27: [0, 1, 3, 1, 1, 0, 1, 2, 0, 2, 0, 2, 0, 0, 0],
  28: [0, 1, 0, 1, 0, 0, 1, 2, 2, 2, 1, 2, 1, 0, 0],
  29: [1, 1, 1, 2, 0, 0, 2, 2, 0, 1, 0, 2, 0, 0, 0],
  30: [1, 1, 2, 2, 1, 0, 3, 2, 1, 1, 1, 1, 2, 0, 0],
  31: [1, 0, 1, 1, 1, 0, 1, 2, 1, 0, 1, 1, 1, 0, 0],
  32: [1, 2, 1, 1, 0, 0, 2, 1, 1, 2, 0, 2, 0, 0, 0],
  33: [1, 1, 2, 3, 0, 0, 2, 1, 2, 0, 1, 2, 1, 0, 0],
  34: [0, 0, 2, 0, 3, 0, 2, 2, 2, 1, 0, 2, 0, 0, 0],
  35: [2, 0, 1, 1, 0, 0, 2, 3, 1, 1, 1, 1, 2, 0, 0],
  36: [1, 1, 1, 2, 0, 0, 2, 1, 1, 1, 1, 1, 1, 0, 0],
  37: [0, 1, 3, 1, 1, 0, 1, 2, 0, 2, 0, 2, 0, 0, 0],
  38: [0, 1, 0, 1, 2, 0, 1, 2, 2, 2, 1, 2, 1, 0, 0],
  39: [1, 1, 1, 2, 0, 0, 2, 2, 0, 1, 0, 2, 0, 0, 0],
  40: [1, 1, 2, 2, 0, 0, 3, 2, 1, 1, 1, 1, 2, 0, 0],
  41: [1, 0, 1, 1, 3, 0, 1, 2, 1, 0, 1, 1, 1, 0, 0],
  42: [1, 2, 1, 1, 0, 0, 2, 1, 1, 2, 0, 2, 0, 0, 0],
  43: [1, 1, 2, 3, 0, 0, 2, 1, 2, 0, 1, 2, 1, 0, 0],
  44: [0, 0, 2, 0, 1, 0, 2, 2, 2, 1, 0, 2, 0, 0, 0],
  45: [2, 0, 1, 1, 0, 0, 2, 3, 1, 1, 1, 1, 2, 0, 0],
  46: [1, 1, 1, 2, 0, 0, 2, 1, 1, 1, 1, 1, 1, 0, 0],
  47: [0, 1, 3, 1, 0, 0, 1, 2, 0, 2, 0, 2, 0, 0, 0],
  48: [0, 1, 0, 1, 0, 0, 1, 2, 2, 2, 1, 2, 1, 0, 0],
  49: [1, 1, 1, 2, 0, 0, 2, 2, 0, 1, 0, 2, 0, 0, 0],
  50: [1, 1, 2, 2, 0, 0, 3, 2, 1, 1, 1, 1, 2, 0, 0],
};

// Base template definitions for the recurring questions across the 50 levels
// Q1 to Q10: Easy (1 pt each)
// Q11 to Q13: Medium (2 pts each)
// Q14 to Q15: Hard (3 pts each)

interface QuestionTemplate {
  qNum: number;
  difficulty: Difficulty;
  subject: QuestionSubject;
  subjectLabel: string;
  points: number;
  getQuestionData: (level: number) => {
    question: string;
    options: string[];
    correctIndex: number;
    hint: string;
    explanation: string;
  };
}

export const QUESTION_TEMPLATES: QuestionTemplate[] = [
  // Q1: Tamil
  {
    qNum: 1,
    difficulty: 'Easy',
    subject: 'tamil',
    subjectLabel: 'Tamil (தமிழ்)',
    points: 1,
    getQuestionData: (level: number) => {
      const answers = RAW_ANSWER_KEYS[level];
      const correctIdx = answers ? answers[0] : 1;
      const c = (level - 1) % 10;
      const bank = [
        {
          q: '“மரம்” என்பது எந்தச் சொல் வகை?',
          opts: ['வினைச்சொல்', 'பெயர்ச்சொல்', 'இடைச்சொல்', 'உரிச்சொல்'],
          h: 'பொருளின் பெயரைக் குறிக்கும் சொல்.',
          exp: 'மரம் என்பது ஒரு பொருளின் பெயரைக் குறிப்பதால் இது பெயர்ச்சொல் ஆகும்.',
        },
        {
          q: '“ஓடினான்” என்பது எந்தச் சொல் வகை?',
          opts: ['பெயர்ச்சொல்', 'வினைச்சொல்', 'பெயரடை', 'இடைச்சொல்'],
          h: 'செயலைக் குறிக்கும் சொல்.',
          exp: 'ஓடினான் என்பது ஒரு செயலை உணர்த்துவதால் இது வினைச்சொல் ஆகும்.',
        },
        {
          q: '“அழகான மலர்” தொடரில் “அழகான” என்பது என்ன?',
          opts: ['வினையெச்சம்', 'பெயரடை', 'வினைமுற்று', 'இடைச்சொல்'],
          h: 'பெயர்ச்சொல்லுக்கு அடைமொழியாக வருவது.',
          exp: 'மலர் என்ற பெயர்ச்சொல்லின் அழகை விவரிப்பதால் இது பெயரடை ஆகும்.',
        },
        {
          q: '“வந்து சென்றான்” தொடரில் “வந்து” என்பது என்ன?',
          opts: ['வினையெச்சம்', 'பெயர்ச்சொல்', 'உரிச்சொல்', 'வேற்றுமை உருபு'],
          h: 'வினைமுற்றை ஏற்று முடியும் எச்சம்.',
          exp: 'சென்றான் என்ற வினைமுற்றைக் கொண்டு முடிவதால் வந்து என்பது வினையெச்சம்.',
        },
        {
          q: '“அவன் பள்ளிக்குச் சென்றான்” வாக்கியத்தில் எழுவாய் எது?',
          opts: ['பள்ளிக்கு', 'சென்றான்', 'அவன்', 'வாக்கியம்'],
          h: 'வாக்கியத்தின் முதன்மை வினைசெய்பவர்.',
          exp: 'அவன் என்பது வாக்கியத்தின் எழுவாய் ஆகும்.',
        },
        {
          q: '“மாணவர்கள் படிக்கிறார்கள்” வாக்கியத்தில் வினைச்சொல் எது?',
          opts: ['மாணவர்கள்', 'படிக்கிறார்கள்', 'அவர்கள்', 'மாணவர்'],
          h: 'செயலைக் குறிக்கும் சொல்.',
          exp: 'படிக்கிறார்கள் என்பது நிகழும் செயலைக் குறிக்கும் வினைச்சொல்.',
        },
        {
          q: '“வேகமாக” என்பது பொதுவாக எந்தச் சொல் வகை?',
          opts: ['வினையடை', 'பெயர்ச்சொல்', 'வினைமுற்று', 'இடைச்சொல்'],
          h: 'வினையை விவரிக்கும் சொல்.',
          exp: 'வினையின் தன்மையை விளக்குவதால் இது வினையடை (Adverb) ஆகும்.',
        },
        {
          q: 'ஒருமையின் பன்மை வடிவம் எது: “மரம்”?',
          opts: ['மரங்கள்', 'மரத்தால்', 'மரத்தில்', 'மரத்தை'],
          h: 'கள் விகுதி சேரும் பன்மை.',
          exp: 'மரம் என்பதன் பன்மை வடிவம் மரங்கள் ஆகும்.',
        },
        {
          q: '“பூவும் கனியும்” என்பதில் இணைப்புச் சொல் எது?',
          opts: ['பூ', 'வும்', 'கனி', 'என்பதில்'],
          h: 'இரண்டு சொற்களை இணைக்கும் இடைச்சொல் விகுதி.',
          exp: 'வும் என்பது எண்ணும்மை இணைப்புச் சொல் ஆகும்.',
        },
        {
          q: '“நல்ல மாணவன்” தொடரில் பெயர்ச்சொல் எது?',
          opts: ['நல்ல', 'மாணவன்', 'இரண்டும்', 'எதுவுமில்லை'],
          h: 'மாணவனைக் குறிக்கும் முதன்மைச் சொல்.',
          exp: 'மாணவன் என்பது பெயர்ச்சொல், நல்ல என்பது பெயரடை.',
        },
      ];
      const item = bank[c];
      return {
        question: item.q,
        options: item.opts,
        correctIndex: correctIdx,
        hint: item.h,
        explanation: item.exp,
      };
    },
  },

  // Q2: Tamil
  {
    qNum: 2,
    difficulty: 'Easy',
    subject: 'tamil',
    subjectLabel: 'Tamil (தமிழ்)',
    points: 1,
    getQuestionData: (level: number) => {
      const answers = RAW_ANSWER_KEYS[level];
      const correctIdx = answers ? answers[1] : 0;
      const c = (level - 1) % 10;
      const bank = [
        {
          q: '“வந்து சென்றான்” தொடரில் “வந்து” என்பது என்ன?',
          opts: ['வினையெச்சம்', 'பெயர்ச்சொல்', 'உரிச்சொல்', 'வேற்றுமை உருபு'],
          h: 'வினைமுற்றை ஏற்று முடியும் சொல்.',
          exp: 'சென்றான் என்ற வினையை ஏற்று முடிவதால் வினையெச்சம்.',
        },
        {
          q: '“அவன் பள்ளிக்குச் சென்றான்” வாக்கியத்தில் எழுவாய் எது?',
          opts: ['பள்ளிக்கு', 'சென்றான்', 'அவன்', 'வாக்கியம்'],
          h: 'வாக்கியத்தின் முதன்மை வினைசெய்பவர்.',
          exp: 'அவன் என்பது வாக்கியத்தின் எழுவாய்.',
        },
        {
          q: '“மாணவர்கள் படிக்கிறார்கள்” வாக்கியத்தில் வினைச்சொல் எது?',
          opts: ['மாணவர்கள்', 'படிக்கிறார்கள்', 'அவர்கள்', 'மாணவர்'],
          h: 'செயலைக் குறிக்கும் சொல்.',
          exp: 'படிக்கிறார்கள் என்பது நிகழும் செயலைக் குறிக்கும் வினைச்சொல்.',
        },
        {
          q: '“வேகமாக” என்பது பொதுவாக எந்தச் சொல் வகை?',
          opts: ['வினையடை', 'பெயர்ச்சொல்', 'வினைமுற்று', 'இடைச்சொல்'],
          h: 'வினையை விவரிக்கும் சொல்.',
          exp: 'வினையின் தன்மையை விளக்குவதால் இது வினையடை.',
        },
        {
          q: 'ஒருமையின் பன்மை வடிவம் எது: “மரம்”?',
          opts: ['மரங்கள்', 'மரத்தால்', 'மரத்தில்', 'மரத்தை'],
          h: 'கள் விகுதி சேரும் பன்மை.',
          exp: 'மரம் என்பதன் பன்மை வடிவம் மரங்கள் ஆகும்.',
        },
        {
          q: '“பூவும் கனியும்” என்பதில் இணைப்புச் சொல் எது?',
          opts: ['பூ', 'வும்', 'கனி', 'என்பதில்'],
          h: 'இரண்டு சொற்களை இணைக்கும் இடைச்சொல் விகுதி.',
          exp: 'வும் என்பது இணைப்புச் சொல் ஆகும்.',
        },
        {
          q: '“நல்ல மாணவன்” தொடரில் பெயர்ச்சொல் எது?',
          opts: ['நல்ல', 'மாணவன்', 'இரண்டும்', 'எதுவுமில்லை'],
          h: 'மாணவனைக் குறிக்கும் முதன்மைச் சொல்.',
          exp: 'மாணவன் என்பது பெயர்ச்சொல் ஆகும்.',
        },
        {
          q: '“மரம்” என்பது எந்தச் சொல் வகை?',
          opts: ['வினைச்சொல்', 'பெயர்ச்சொல்', 'இடைச்சொல்', 'உரிச்சொல்'],
          h: 'பொருளின் பெயரைக் குறிக்கும் சொல்.',
          exp: 'மரம் என்பது பெயர்ச்சொல் ஆகும்.',
        },
        {
          q: '“ஓடினான்” என்பது எந்தச் சொல் வகை?',
          opts: ['பெயர்ச்சொல்', 'வினைச்சொல்', 'பெயரடை', 'இடைச்சொல்'],
          h: 'செயலைக் குறிக்கும் சொல்.',
          exp: 'ஓடினான் என்பது வினைச்சொல் ஆகும்.',
        },
        {
          q: '“அழகான மலர்” தொடரில் “அழகான” என்பது என்ன?',
          opts: ['வினையெச்சம்', 'பெயரடை', 'வினைமுற்று', 'இடைச்சொல்'],
          h: 'பெயர்ச்சொல்லுக்கு அடைமொழியாக வருவது.',
          exp: 'அழகான என்பது பெயரடை ஆகும்.',
        },
      ];
      const item = bank[c];
      return {
        question: item.q,
        options: item.opts,
        correctIndex: correctIdx,
        hint: item.h,
        explanation: item.exp,
      };
    },
  },

  // Q3: English
  {
    qNum: 3,
    difficulty: 'Easy',
    subject: 'english',
    subjectLabel: 'English',
    points: 1,
    getQuestionData: (level: number) => {
      const answers = RAW_ANSWER_KEYS[level];
      const correctIdx = answers ? answers[2] : 1;
      const c = (level - 1) % 10;
      const bank = [
        {
          q: 'Choose the correct verb: “She ___ to school every day.”',
          opts: ['go', 'goes', 'going', 'gone'],
          h: 'Third-person singular takes -s / -es in simple present tense.',
          exp: 'Subject "She" is singular, requiring "goes".',
        },
        {
          q: 'Choose the correct article: “He ate ___ apple.”',
          opts: ['a', 'an', 'the', 'no article'],
          h: 'Words starting with vowel sounds take "an".',
          exp: '"Apple" begins with a vowel sound, so "an" is required.',
        },
        {
          q: 'Identify the adjective: “It was a beautiful day.”',
          opts: ['It', 'was', 'beautiful', 'day'],
          h: 'The word describing the noun "day".',
          exp: '"Beautiful" describes the day, making it an adjective.',
        },
        {
          q: 'Choose the plural of “child.”',
          opts: ['childs', 'childes', 'children', 'childrens'],
          h: 'Irregular plural form.',
          exp: 'The plural of child is children.',
        },
        {
          q: 'Choose the past tense of “write.”',
          opts: ['written', 'wrote', 'writes', 'writing'],
          h: 'Simple past tense.',
          exp: 'Write -> Wrote -> Written.',
        },
        {
          q: 'Choose the correct pronoun: “Ravi and ___ went home.”',
          opts: ['me', 'I', 'mine', 'my'],
          h: 'Subject pronoun required.',
          exp: '"I" is the subject pronoun ("Ravi and I went home").',
        },
        {
          q: 'Identify the adverb: “The bird flew gracefully.”',
          opts: ['bird', 'flew', 'the', 'gracefully'],
          h: 'Word ending in -ly describing how it flew.',
          exp: '"Gracefully" modifies the verb "flew".',
        },
        {
          q: 'Choose the correct preposition: “The book is ___ the table.”',
          opts: ['on', 'at', 'by', 'from'],
          h: 'Resting upon the surface.',
          exp: '"On the table" indicates position on the surface.',
        },
        {
          q: 'Choose the correct sentence.',
          opts: ['They is ready.', 'They are ready.', 'They am ready.', 'They be ready.'],
          h: 'Plural subject "They" takes "are".',
          exp: '"They are ready" is grammatically correct.',
        },
        {
          q: 'Choose the opposite of “ancient.”',
          opts: ['old', 'historic', 'modern', 'early'],
          h: 'Belonging to the present or recent times.',
          exp: 'The antonym of ancient is modern.',
        },
      ];
      const item = bank[c];
      return {
        question: item.q,
        options: item.opts,
        correctIndex: correctIdx,
        hint: item.h,
        explanation: item.exp,
      };
    },
  },

  // Q4: English
  {
    qNum: 4,
    difficulty: 'Easy',
    subject: 'english',
    subjectLabel: 'English',
    points: 1,
    getQuestionData: (level: number) => {
      const answers = RAW_ANSWER_KEYS[level];
      const correctIdx = answers ? answers[3] : 1;
      const c = (level - 1) % 10;
      const bank = [
        {
          q: 'Choose the past tense of “write.”',
          opts: ['written', 'wrote', 'writes', 'writing'],
          h: 'Simple past tense of write.',
          exp: 'The past tense is "wrote".',
        },
        {
          q: 'Choose the correct pronoun: “Ravi and ___ went home.”',
          opts: ['me', 'I', 'mine', 'my'],
          h: 'Subject pronoun required.',
          exp: '"I" is the subject pronoun ("Ravi and I went home").',
        },
        {
          q: 'Identify the adverb: “The bird flew gracefully.”',
          opts: ['bird', 'flew', 'the', 'gracefully'],
          h: 'Word ending in -ly describing how it flew.',
          exp: '"Gracefully" modifies the verb "flew".',
        },
        {
          q: 'Choose the correct preposition: “The book is ___ the table.”',
          opts: ['on', 'at', 'by', 'from'],
          h: 'Resting upon the surface.',
          exp: '"On the table" indicates position on the surface.',
        },
        {
          q: 'Choose the correct sentence.',
          opts: ['They is ready.', 'They are ready.', 'They am ready.', 'They be ready.'],
          h: 'Plural subject "They" takes "are".',
          exp: '"They are ready" is grammatically correct.',
        },
        {
          q: 'Choose the opposite of “ancient.”',
          opts: ['old', 'historic', 'modern', 'early'],
          h: 'Belonging to the present or recent times.',
          exp: 'The antonym of ancient is modern.',
        },
        {
          q: 'Choose the correct verb: “She ___ to school every day.”',
          opts: ['go', 'goes', 'going', 'gone'],
          h: 'Third-person singular takes -s / -es in simple present tense.',
          exp: 'Subject "She" is singular, requiring "goes".',
        },
        {
          q: 'Choose the correct article: “He ate ___ apple.”',
          opts: ['a', 'an', 'the', 'no article'],
          h: 'Words starting with vowel sounds take "an".',
          exp: '"Apple" begins with a vowel sound, so "an" is required.',
        },
        {
          q: 'Identify the adjective: “It was a beautiful day.”',
          opts: ['It', 'was', 'beautiful', 'day'],
          h: 'The word describing the noun "day".',
          exp: '"Beautiful" describes the day, making it an adjective.',
        },
        {
          q: 'Choose the plural of “child.”',
          opts: ['childs', 'childes', 'children', 'childrens'],
          h: 'Irregular plural form.',
          exp: 'The plural of child is children.',
        },
      ];
      const item = bank[c];
      return {
        question: item.q,
        options: item.opts,
        correctIndex: correctIdx,
        hint: item.h,
        explanation: item.exp,
      };
    },
  },

  // Q5: Mathematics
  {
    qNum: 5,
    difficulty: 'Easy',
    subject: 'mathematics',
    subjectLabel: 'Mathematics',
    points: 1,
    getQuestionData: (level: number) => {
      const answers = RAW_ANSWER_KEYS[level];
      const correctIdx = answers ? answers[4] : 0;
      const c7 = (level - 1) % 7;

      if (c7 === 0) {
        const k = Math.floor((level - 1) / 7);
        const a = 9 + 7 * k;
        const b = 13 + 7 * k;
        const c = 17 + 7 * k;
        const sum = a + b + c;
        return {
          question: `Find the sum of ${a}, ${b} and ${c}.`,
          options: [`${sum}`, `${sum + 5}`, `${sum - 4}`, `${sum + 10}`],
          correctIndex: correctIdx,
          hint: 'Add the three numbers together.',
          explanation: `${a} + ${b} + ${c} = ${sum}.`,
        };
      } else if (c7 === 1) {
        const k = Math.floor((level - 2) / 7);
        const a = 14 + 14 * k;
        const b = 24 + 14 * k;
        const c = 34 + 14 * k;
        const avg = b;
        return {
          question: `Find the average of ${a}, ${b} and ${c}.`,
          options: [`${avg + 5}`, `${avg}`, `${avg - 2}`, `${avg + 10}`],
          correctIndex: correctIdx,
          hint: 'Sum the three values and divide by 3.',
          explanation: `(${a} + ${b} + ${c}) / 3 = ${avg}.`,
        };
      } else if (c7 === 2) {
        if (level === 3 || level === 38) {
          return {
            question: 'What is sin 30°?',
            options: ['0', '√2/2', '1/2', '√3/2'],
            correctIndex: correctIdx,
            hint: 'Standard trigonometry angle value.',
            explanation: 'sin(30°) = 1/2.',
          };
        } else if (level === 10 || level === 45) {
          return {
            question: 'What is sin 45°?',
            options: correctIdx === 0 ? ['√2/2', '1/2', '√3/2', '0'] : ['1/2', '√2/2', '√3/2', '0'],
            correctIndex: correctIdx,
            hint: 'Standard trigonometry angle value.',
            explanation: 'sin(45°) = √2/2.',
          };
        } else if (level === 17) {
          return {
            question: 'What is sin 60°?',
            options: ['√2/2', '0', '1/2', '√3/2'],
            correctIndex: correctIdx,
            hint: 'Standard trigonometry angle value.',
            explanation: 'sin(60°) = √3/2.',
          };
        } else if (level === 24) {
          return {
            question: 'What is sin 90°?',
            options: ['√2/2', '1/2', '0', '1'],
            correctIndex: correctIdx,
            hint: 'Standard trigonometry angle value.',
            explanation: 'sin(90°) = 1.',
          };
        } else {
          return {
            question: 'What is sin 0°?',
            options: ['1/2', '0', '√3/2', '√2/2'],
            correctIndex: correctIdx,
            hint: 'Standard trigonometry angle value.',
            explanation: 'sin(0°) = 0.',
          };
        }
      } else if (c7 === 3) {
        const matMap: Record<number, { m: number[][]; det: number }> = {
          4: { m: [[6, 1], [5, 3]], det: 13 },
          11: { m: [[3, 4], [2, 6]], det: 10 },
          18: { m: [[5, 3], [4, 5]], det: 13 },
          25: { m: [[2, 2], [1, 4]], det: 6 },
          32: { m: [[4, 1], [3, 3]], det: 9 },
          39: { m: [[6, 4], [5, 6]], det: 16 },
          46: { m: [[3, 3], [2, 5]], det: 9 },
        };
        const entry = matMap[level] || { m: [[6, 1], [5, 3]], det: 13 };
        return {
          question: `Find the determinant of [[${entry.m[0][0]}, ${entry.m[0][1]}], [${entry.m[1][0]}, ${entry.m[1][1]}]].`,
          options: [`${entry.det}`, `${entry.det + 2}`, `${entry.det - 2}`, `-${entry.det}`],
          correctIndex: correctIdx,
          hint: 'ad - bc = (a × d) - (b × c).',
          explanation: `Determinant is ${entry.det}.`,
        };
      } else if (c7 === 4) {
        const eqMap: Record<number, { k: number; ans: number }> = {
          5: { k: 4, ans: 7 },
          12: { k: 2, ans: 5 },
          19: { k: 0, ans: 3 },
          26: { k: 7, ans: 10 },
          33: { k: 5, ans: 8 },
          40: { k: 3, ans: 6 },
          47: { k: 1, ans: 4 },
        };
        const entry = eqMap[level] || { k: 4, ans: 7 };
        return {
          question: `Solve: x − 3 = ${entry.k}.`,
          options: [`${entry.ans}`, `${entry.ans + 3}`, `${entry.ans + 4}`, `${entry.ans + 2}`],
          correctIndex: correctIdx,
          hint: `Add 3 to both sides: x = ${entry.k} + 3.`,
          explanation: `x = ${entry.k} + 3 = ${entry.ans}.`,
        };
      } else if (c7 === 5) {
        if (level === 6 || level === 34) {
          return {
            question: 'A bag has 3 red and 4 blue balls. What is the probability of picking a red ball?',
            options: ['4/7', '1/2', '1', '3/7'],
            correctIndex: correctIdx,
            hint: 'Favorable outcomes / total outcomes = 3 / (3 + 4).',
            explanation: 'P(red) = 3 / 7.',
          };
        } else if (level === 13 || level === 41) {
          return {
            question: 'A bag has 2 red and 3 blue balls. What is the probability of picking a red ball?',
            options: correctIdx === 2 ? ['1', '1/2', '2/5', '3/5'] : ['1/2', '3/5', '1', '2/5'],
            correctIndex: correctIdx,
            hint: 'Favorable / total = 2 / 5.',
            explanation: 'P(red) = 2 / 5.',
          };
        } else if (level === 20 || level === 48) {
          return {
            question: 'A bag has 1 red and 2 blue balls. What is the probability of picking a red ball?',
            options: correctIdx === 0 ? ['1/3', '1/2', '1', '2/3'] : ['2/3', '1/2', '1/3', '1'],
            correctIndex: correctIdx,
            hint: 'Favorable / total = 1 / 3.',
            explanation: 'P(red) = 1 / 3.',
          };
        } else {
          return {
            question: 'A bag has 4 red and 5 blue balls. What is the probability of picking a red ball?',
            options: ['5/9', '4/9', '1/2', '1'],
            correctIndex: correctIdx,
            hint: 'Favorable / total = 4 / 9.',
            explanation: 'P(red) = 4 / 9.',
          };
        }
      } else {
        const valMap: Record<number, number> = { 7: 3, 14: 5, 21: 2, 28: 4, 35: 1, 42: 3, 49: 5 };
        const v = valMap[level] || 3;
        return {
          question: `What is the principal argument of z = ${v} + ${v}i when real and imaginary parts are equal and positive?`,
          options: ['45°', '30°', '60°', '90°'],
          correctIndex: correctIdx,
          hint: 'tan(θ) = y / x = 1, so θ = 45° in the first quadrant.',
          explanation: 'Since real and imaginary components are equal and positive, θ = arctan(1) = 45°.',
        };
      }
    },
  },

  // Q6: Mathematics (Linear addition)
  {
    qNum: 6,
    difficulty: 'Easy',
    subject: 'mathematics',
    subjectLabel: 'Mathematics',
    points: 1,
    getQuestionData: (level: number) => {
      const answers = RAW_ANSWER_KEYS[level];
      const correctIdx = answers ? answers[5] : 0;
      const x = level + 3;
      const y = level + 7;
      const sum = x + y;
      return {
        question: `If x = ${x} and y = ${y}, what is x + y?`,
        options: [`${sum}`, `${sum + 2}`, `${sum - 1}`, `${x * y}`],
        correctIndex: correctIdx,
        hint: `Direct addition of ${x} and ${y}.`,
        explanation: `${x} + ${y} = ${sum}.`,
      };
    },
  },

  // Q7: Science
  {
    qNum: 7,
    difficulty: 'Easy',
    subject: 'science',
    subjectLabel: 'Science',
    points: 1,
    getQuestionData: (level: number) => {
      const answers = RAW_ANSWER_KEYS[level];
      const correctIdx = answers ? answers[6] : 1;
      const c = (level - 1) % 10;
      const bank = [
        {
          q: 'What is the SI unit of force?',
          opts: ['Joule', 'Newton', 'Watt', 'Pascal'],
          h: 'Named after Sir Isaac Newton.',
          exp: 'The SI unit of force is the Newton (N).',
        },
        {
          q: 'Which gas do plants absorb during photosynthesis?',
          opts: ['Oxygen', 'Nitrogen', 'Carbon dioxide', 'Hydrogen'],
          h: 'Plants use this to produce glucose.',
          exp: 'Plants absorb Carbon dioxide (CO2).',
        },
        {
          q: 'What is the chemical symbol for sodium?',
          opts: ['So', 'S', 'Na', 'N'],
          h: 'Derived from Latin Natrium.',
          exp: 'Sodium is represented by Na.',
        },
        {
          q: 'Which organ pumps blood through the human body?',
          opts: ['Lungs', 'Brain', 'Heart', 'Kidney'],
          h: 'The central muscular pump in the chest.',
          exp: 'The Heart pumps oxygenated blood.',
        },
        {
          q: 'Which particle has a negative electric charge?',
          opts: ['Proton', 'Neutron', 'Electron', 'Nucleus'],
          h: 'Orbits around the atomic nucleus.',
          exp: 'Electrons have a negative charge of -1.',
        },
        {
          q: 'At room temperature, pure water is approximately neutral at pH:',
          opts: ['2', '5', '7', '12'],
          h: 'Middle of the pH scale (0 to 14).',
          exp: 'Neutral pH is 7.',
        },
        {
          q: 'Which part of a plant mainly absorbs water from soil?',
          opts: ['Flower', 'Roots', 'Leaves', 'Fruit'],
          h: 'Underground system with root hairs.',
          exp: 'Roots absorb water and minerals.',
        },
        {
          q: 'What is the SI unit of electric current?',
          opts: ['Volt', 'Ampere', 'Ohm', 'Watt'],
          h: 'Measured by an ammeter.',
          exp: 'The SI unit of electric current is Ampere (A).',
        },
        {
          q: 'Which of these is a chemical change?',
          opts: ['Melting ice', 'Cutting paper', 'Rusting iron', 'Boiling water'],
          h: 'Formation of a new substance with irreversible bonds.',
          exp: 'Rusting iron is an oxidation chemical reaction.',
        },
        {
          q: 'Which vitamin can the human body produce with help from sunlight?',
          opts: ['Vitamin A', 'Vitamin B12', 'Vitamin C', 'Vitamin D'],
          h: 'Often called the sunshine vitamin.',
          exp: 'Sunlight synthesizes Vitamin D in human skin.',
        },
      ];
      const item = bank[c];
      return {
        question: item.q,
        options: item.opts,
        correctIndex: correctIdx,
        hint: item.h,
        explanation: item.exp,
      };
    },
  },

  // Q8: Science
  {
    qNum: 8,
    difficulty: 'Easy',
    subject: 'science',
    subjectLabel: 'Science',
    points: 1,
    getQuestionData: (level: number) => {
      const answers = RAW_ANSWER_KEYS[level];
      const correctIdx = answers ? answers[7] : 2;
      const c = (level - 1) % 10;
      const bank = [
        {
          q: 'At room temperature, pure water is approximately neutral at pH:',
          opts: ['2', '5', '7', '12'],
          h: 'Middle of the pH scale.',
          exp: 'Neutral pH is 7.',
        },
        {
          q: 'Which part of a plant mainly absorbs water from soil?',
          opts: ['Flower', 'Roots', 'Leaves', 'Fruit'],
          h: 'Underground root hairs.',
          exp: 'Roots absorb water from soil.',
        },
        {
          q: 'What is the SI unit of electric current?',
          opts: ['Volt', 'Ampere', 'Ohm', 'Watt'],
          h: 'Measured by an ammeter.',
          exp: 'SI unit of current is Ampere (A).',
        },
        {
          q: 'Which of these is a chemical change?',
          opts: ['Melting ice', 'Cutting paper', 'Rusting iron', 'Boiling water'],
          h: 'Formation of new substance.',
          exp: 'Rusting iron is a chemical change.',
        },
        {
          q: 'Which vitamin can the human body produce with help from sunlight?',
          opts: ['Vitamin A', 'Vitamin B12', 'Vitamin C', 'Vitamin D'],
          h: 'Sunshine vitamin.',
          exp: 'Vitamin D is synthesized by sunlight.',
        },
        {
          q: 'What is the SI unit of force?',
          opts: ['Joule', 'Newton', 'Watt', 'Pascal'],
          h: 'Named after Sir Isaac Newton.',
          exp: 'SI unit of force is Newton (N).',
        },
        {
          q: 'Which gas do plants absorb during photosynthesis?',
          opts: ['Oxygen', 'Nitrogen', 'Carbon dioxide', 'Hydrogen'],
          h: 'Plants absorb this to create glucose.',
          exp: 'Plants absorb Carbon dioxide (CO2).',
        },
        {
          q: 'What is the chemical symbol for sodium?',
          opts: ['So', 'S', 'Na', 'N'],
          h: 'Latin Natrium.',
          exp: 'Sodium is represented by Na.',
        },
        {
          q: 'Which organ pumps blood through the human body?',
          opts: ['Lungs', 'Brain', 'Heart', 'Kidney'],
          h: 'Central pump.',
          exp: 'The Heart pumps blood.',
        },
        {
          q: 'Which particle has a negative electric charge?',
          opts: ['Proton', 'Neutron', 'Electron', 'Nucleus'],
          h: 'Orbits nucleus.',
          exp: 'Electrons have negative charge.',
        },
      ];
      const item = bank[c];
      return {
        question: item.q,
        options: item.opts,
        correctIndex: correctIdx,
        hint: item.h,
        explanation: item.exp,
      };
    },
  },

  // Q9: Social Science
  {
    qNum: 9,
    difficulty: 'Easy',
    subject: 'social_science',
    subjectLabel: 'Social Science',
    points: 1,
    getQuestionData: (level: number) => {
      const answers = RAW_ANSWER_KEYS[level];
      const correctIdx = answers ? answers[8] : 1;
      const c = (level - 1) % 10;
      const bank = [
        {
          q: 'Who led the Salt March in 1930?',
          opts: ['Jawaharlal Nehru', 'Mahatma Gandhi', 'B. R. Ambedkar', 'Sardar Patel'],
          h: 'Led non-violent Dandi march.',
          exp: 'Mahatma Gandhi led the historic Salt March from Sabarmati to Dandi in 1930.',
        },
        {
          q: 'What does GDP measure?',
          opts: ['Population only', 'Value of final goods and services produced', 'Land area', 'Number of schools'],
          h: 'Gross Domestic Product.',
          exp: 'GDP measures monetary value of all final goods and services produced.',
        },
        {
          q: 'The French Revolution began in which year?',
          opts: ['1492', '1776', '1789', '1914'],
          h: 'Storming of Bastille.',
          exp: 'The French Revolution began in 1789.',
        },
        {
          q: 'Which is a renewable resource?',
          opts: ['Coal', 'Petroleum', 'Solar energy', 'Natural gas'],
          h: 'Inexhaustible clean energy.',
          exp: 'Solar energy replenishes naturally.',
        },
        {
          q: 'Who was the first Prime Minister of independent India?',
          opts: ['Mahatma Gandhi', 'Jawaharlal Nehru', 'Rajendra Prasad', 'Sardar Patel'],
          h: 'Delivered "Tryst with Destiny".',
          exp: 'Jawaharlal Nehru was India\'s first Prime Minister.',
        },
        {
          q: 'What is the main purpose of a constitution?',
          opts: ['To list all citizens', 'To set the basic rules and principles of government', 'To predict weather', 'To set market prices'],
          h: 'Fundamental law of the land.',
          exp: 'A constitution sets the basic rules and principles of government.',
        },
        {
          q: 'Which sector includes farming and fishing?',
          opts: ['Primary', 'Secondary', 'Tertiary', 'Quaternary'],
          h: 'Direct natural resource extraction.',
          exp: 'Farming and fishing belong to the Primary sector.',
        },
        {
          q: 'Which ocean lies to the east of India?',
          opts: ['Atlantic Ocean', 'Pacific Ocean', 'Indian Ocean', 'Arctic Ocean'],
          h: 'The major ocean embracing the subcontinent.',
          exp: 'The Indian Ocean (with Bay of Bengal) lies to the east of southern India.',
        },
        {
          q: 'Inflation means:',
          opts: ['A sustained rise in general prices', 'A fall in all wages', 'A rise in rainfall', 'A fall in population'],
          h: 'Rise in prices over time.',
          exp: 'Inflation is a sustained rise in general price levels.',
        },
        {
          q: 'Which movement was launched by Gandhi in 1942?',
          opts: ['Non-Cooperation Movement', 'Quit India Movement', 'Swadeshi Movement', 'Khilafat Movement'],
          h: 'The "Do or Die" call was given in August 1942.',
          exp: 'The Quit India Movement was launched in 1942.',
        },
      ];
      const item = bank[c];
      return {
        question: item.q,
        options: item.opts,
        correctIndex: correctIdx,
        hint: item.h,
        explanation: item.exp,
      };
    },
  },

  // Q10: Social Science
  {
    qNum: 10,
    difficulty: 'Easy',
    subject: 'social_science',
    subjectLabel: 'Social Science',
    points: 1,
    getQuestionData: (level: number) => {
      const answers = RAW_ANSWER_KEYS[level];
      const correctIdx = answers ? answers[9] : 0;
      const c = (level - 1) % 10;
      const bank = [
        {
          q: 'Which sector includes farming and fishing?',
          opts: ['Primary', 'Secondary', 'Tertiary', 'Quaternary'],
          h: 'Direct extraction of resources.',
          exp: 'Farming and fishing belong to the Primary sector.',
        },
        {
          q: 'Which ocean lies to the east of India?',
          opts: ['Atlantic Ocean', 'Pacific Ocean', 'Indian Ocean', 'Arctic Ocean'],
          h: 'Eastern coast of Tamil Nadu / Bay of Bengal.',
          exp: 'The Indian Ocean (Bay of Bengal) lies east of peninsular India.',
        },
        {
          q: 'Inflation means:',
          opts: ['A sustained rise in general prices', 'A fall in all wages', 'A rise in rainfall', 'A fall in population'],
          h: 'General rise in prices.',
          exp: 'Inflation is a sustained rise in general prices.',
        },
        {
          q: 'Which movement was launched by Gandhi in 1942?',
          opts: ['Non-Cooperation Movement', 'Quit India Movement', 'Swadeshi Movement', 'Khilafat Movement'],
          h: 'Launched in August 1942.',
          exp: 'The Quit India Movement was launched in 1942.',
        },
        {
          q: 'Who led the Salt March in 1930?',
          opts: ['Jawaharlal Nehru', 'Mahatma Gandhi', 'B. R. Ambedkar', 'Sardar Patel'],
          h: 'Dandi March leader.',
          exp: 'Mahatma Gandhi led the Salt March in 1930.',
        },
        {
          q: 'What does GDP measure?',
          opts: ['Population only', 'Value of final goods and services produced', 'Land area', 'Number of schools'],
          h: 'Economic output.',
          exp: 'GDP measures the monetary value of all final goods and services produced.',
        },
        {
          q: 'The French Revolution began in which year?',
          opts: ['1492', '1776', '1789', '1914'],
          h: 'Storming of Bastille.',
          exp: 'The French Revolution began in 1789.',
        },
        {
          q: 'Which is a renewable resource?',
          opts: ['Coal', 'Petroleum', 'Solar energy', 'Natural gas'],
          h: 'Inexhaustible clean natural energy.',
          exp: 'Solar energy replenishes naturally.',
        },
        {
          q: 'Who was the first Prime Minister of independent India?',
          opts: ['Mahatma Gandhi', 'Jawaharlal Nehru', 'Rajendra Prasad', 'Sardar Patel'],
          h: 'First PM from 1947.',
          exp: 'Jawaharlal Nehru was the first Prime Minister.',
        },
        {
          q: 'What is the main purpose of a constitution?',
          opts: ['To list all citizens', 'To set the basic rules and principles of government', 'To predict weather', 'To set market prices'],
          h: 'Basic principles of government.',
          exp: 'A constitution sets the basic rules and principles of government.',
        },
      ];
      const item = bank[c];
      return {
        question: item.q,
        options: item.opts,
        correctIndex: correctIdx,
        hint: item.h,
        explanation: item.exp,
      };
    },
  },

  // Q11: Medium (Tamil)
  {
    qNum: 11,
    difficulty: 'Medium',
    subject: 'tamil',
    subjectLabel: 'Tamil (தமிழ்)',
    points: 2,
    getQuestionData: (level: number) => {
      const answers = RAW_ANSWER_KEYS[level];
      const correctIdx = answers ? answers[10] : 1;
      const c = (level - 1) % 5;
      const bank = [
        {
          q: '“படித்து முடித்தான்” தொடரில் “படித்து” என்பது என்ன?',
          opts: ['பெயர்ச்சொல்', 'வினையெச்சம்', 'பெயரடை', 'இடைச்சொல்'],
          h: 'முடித்தான் என்ற வினையோடு முடியும் எச்சச் சொல்.',
          exp: 'முடித்தான் என்ற வினைமுற்றை ஏற்று முடிவதால் இது வினையெச்சம் ஆகும்.',
        },
        {
          q: '“மலர்ந்தது” என்பது எந்தச் சொல் வகை?',
          opts: ['வினைச்சொல்', 'பெயர்ச்சொல்', 'உரிச்சொல்', 'இடைச்சொல்'],
          h: 'செயல் முடிவடைந்த வினைமுற்று.',
          exp: 'மலர்ந்தது என்பது செயல் முற்றுப்பெற்றதை உணர்த்தும் வினைச்சொல்.',
        },
        {
          q: '“அவன் வேகமாக ஓடினான்” வாக்கியத்தில் “வேகமாக” என்பது என்ன?',
          opts: ['பெயர்ச்சொல்', 'வினையடை', 'வினைமுற்று', 'சுட்டுப்பெயர்'],
          h: 'ஓடியதன் வேகத்தை விவரிப்பது.',
          exp: 'வினையின் இயல்பை உணர்த்துவதால் இது வினையடை ஆகும்.',
        },
        {
          q: '“மாணவி” என்பதன் பன்மை வடிவம் எது?',
          opts: ['மாணவிகள்', 'மாணவியால்', 'மாணவியை', 'மாணவிக்கு'],
          h: 'கள் விகுதி பெற்று வரும் பன்மை.',
          exp: 'மாணவி என்பதன் பன்மை மாணவிகள்.',
        },
        {
          q: '“அவர்கள் வந்தனர்” வாக்கியத்தில் எழுவாய் எது?',
          opts: ['வந்தனர்', 'அவர்கள்', 'வாக்கியம்', 'எது'],
          h: 'செயலைச் செய்த தொடக்கப் பெயர்.',
          exp: 'அவர்கள் என்பது எழுவாய் ஆகும்.',
        },
      ];
      const item = bank[c];
      return {
        question: item.q,
        options: item.opts,
        correctIndex: correctIdx,
        hint: item.h,
        explanation: item.exp,
      };
    },
  },

  // Q12: Medium (English)
  {
    qNum: 12,
    difficulty: 'Medium',
    subject: 'english',
    subjectLabel: 'English',
    points: 2,
    getQuestionData: (level: number) => {
      const answers = RAW_ANSWER_KEYS[level];
      const correctIdx = answers ? answers[11] : 1;
      const c = (level - 1) % 5;
      const bank = [
        {
          q: 'Choose the correct passive voice: “The chef cooked the meal.”',
          opts: [
            'The meal cooked the chef.',
            'The meal was cooked by the chef.',
            'The meal is cook by chef.',
            'The chef was cooked by the meal.',
          ],
          h: 'Object becomes subject + was/were + past participle.',
          exp: '"The meal was cooked by the chef" is correct passive voice.',
        },
        {
          q: 'Choose the correct conditional: “If it rains, we ___ indoors.”',
          opts: ['stayed', 'would stayed', 'will stay', 'stay yesterday'],
          h: 'First conditional (Present Simple -> will + base verb).',
          exp: 'If it rains (present), we will stay (future) indoors.',
        },
        {
          q: 'Identify the conjunction: “I stayed home because it rained.”',
          opts: ['stayed', 'home', 'because', 'rained'],
          h: 'Word linking the two clauses together.',
          exp: '"Because" is the subordinate conjunction showing reason.',
        },
        {
          q: 'Choose the correct option: “Neither of the boys ___ present.”',
          opts: ['were', 'are', 'was', 'be'],
          h: '"Neither of" takes a singular verb in standard grammar.',
          exp: '"Neither of the boys was present" is grammatically standard.',
        },
        {
          q: 'Choose the correct reported speech: He said, “I am tired.”',
          opts: [
            'He said that I am tired.',
            'He said that he was tired.',
            'He says he tired.',
            'He said he is tiring.',
          ],
          h: 'Present tense "am" changes to past "was" in indirect speech.',
          exp: 'He said that he was tired.',
        },
      ];
      const item = bank[c];
      return {
        question: item.q,
        options: item.opts,
        correctIndex: correctIdx,
        hint: item.h,
        explanation: item.exp,
      };
    },
  },

  // Q13: Medium (Social Science)
  {
    qNum: 13,
    difficulty: 'Medium',
    subject: 'social_science',
    subjectLabel: 'Social Science',
    points: 2,
    getQuestionData: (level: number) => {
      const answers = RAW_ANSWER_KEYS[level];
      const correctIdx = answers ? answers[12] : 1;
      const c = (level - 1) % 5;
      const bank = [
        {
          q: 'What is the main role of the Reserve Bank of India (RBI)?',
          opts: [
            'Conduct school exams',
            'Central banking and monetary policy',
            'Build highways only',
            'Run all private shops',
          ],
          h: 'Apex regulatory body for banking and currency in India.',
          exp: 'The RBI regulates currency issue and manages monetary policy.',
        },
        {
          q: 'What does per capita income mean?',
          opts: [
            'Total income divided by population',
            'Total exports only',
            'Income of the richest person',
            'Government tax rate',
          ],
          h: 'Average income per person in a nation.',
          exp: 'Per capita income is total national income divided by population.',
        },
        {
          q: 'What is meant by democracy?',
          opts: [
            'Rule by one king only',
            'Government chosen by the people',
            'Rule by the army only',
            'Government without laws',
          ],
          h: 'Government of the people, by the people, for the people.',
          exp: 'Democracy is a system where citizens elect their representatives.',
        },
        {
          q: 'Which event is associated with 1930 in India\'s freedom struggle?',
          opts: ['Dandi March', 'Jallianwala Bagh massacre', 'Partition of Bengal', 'Independence'],
          h: 'Salt satyagraha led by Mahatma Gandhi.',
          exp: 'The Dandi March occurred in 1930.',
        },
        {
          q: 'Which is an example of the tertiary (services) sector?',
          opts: ['Mining coal', 'Growing rice', 'Teaching in a school', 'Making steel'],
          h: 'Service activities rather than raw goods production.',
          exp: 'Teaching in a school is a service sector (tertiary) activity.',
        },
      ];
      const item = bank[c];
      return {
        question: item.q,
        options: item.opts,
        correctIndex: correctIdx,
        hint: item.h,
        explanation: item.exp,
      };
    },
  },

  // Q14: Hard (Mathematics: Matrix Determinants)
  {
    qNum: 14,
    difficulty: 'Hard',
    subject: 'mathematics',
    subjectLabel: 'Mathematics',
    points: 3,
    getQuestionData: (level: number) => {
      const answers = RAW_ANSWER_KEYS[level];
      const correctIdx = answers ? answers[13] : 0;
      const a = (level % 7) + 2;
      const b = (level % 5) + 1;
      const c = (level % 4) + 1;
      const d = (level % 6) + 3;
      const det = a * d - b * c;
      return {
        question: `Maths: Find the determinant of [[${a}, ${b}], [${c}, ${d}]].`,
        options: [`${det}`, `${det + 2}`, `${det - 2}`, `${a * d + b * c}`],
        correctIndex: correctIdx,
        hint: `Determinant of [[a, b], [c, d]] is calculated as ad - bc = (${a} × ${d}) - (${b} × ${c}).`,
        explanation: `det = (${a} × ${d}) - (${b} × ${c}) = ${a * d} - ${b * c} = ${det}.`,
      };
    },
  },

  // Q15: Hard (Science: Physics - Parallel Resistors)
  {
    qNum: 15,
    difficulty: 'Hard',
    subject: 'science',
    subjectLabel: 'Science',
    points: 3,
    getQuestionData: (level: number) => {
      const answers = RAW_ANSWER_KEYS[level];
      const correctIdx = answers ? answers[14] : 0;
      const c10 = (level - 1) % 10;
      const bank = [
        { r1: 6, r2: 3, v: 12, ans: '6 A', opts: ['6 A', '7 A', '5 A', '12 A'] },
        { r1: 4, r2: 4, v: 8, ans: '4 A', opts: ['4 A', '5 A', '3 A', '8 A'] },
        { r1: 8, r2: 4, v: 12, ans: '4.5 A', opts: ['4.5 A', '5.5 A', '3.5 A', '9 A'] },
        { r1: 6, r2: 2, v: 12, ans: '8 A', opts: ['8 A', '9 A', '7 A', '16 A'] },
        { r1: 12, r2: 6, v: 18, ans: '4.5 A', opts: ['4.5 A', '5.5 A', '3.5 A', '9 A'] },
        { r1: 10, r2: 5, v: 15, ans: '4.5 A', opts: ['4.5 A', '5.5 A', '3.5 A', '9 A'] },
        { r1: 9, r2: 3, v: 12, ans: '5.33333 A', opts: ['5.33333 A', '6.33333 A', '4.33333 A', '10.6667 A'] },
        { r1: 4, r2: 2, v: 6, ans: '4.5 A', opts: ['4.5 A', '5.5 A', '3.5 A', '9 A'] },
        { r1: 15, r2: 5, v: 20, ans: '5.33333 A', opts: ['5.33333 A', '6.33333 A', '4.33333 A', '10.6667 A'] },
        { r1: 8, r2: 8, v: 16, ans: '4 A', opts: ['4 A', '5 A', '3 A', '8 A'] },
      ];
      const item = bank[c10];
      return {
        question: `Science: Two resistors of ${item.r1} Ω and ${item.r2} Ω are connected in parallel across a ${item.v} V battery. Find the total current.`,
        options: item.opts,
        correctIndex: correctIdx,
        hint: `Equivalent resistance: 1/R = 1/${item.r1} + 1/${item.r2}. Total Current I = V / R.`,
        explanation: `1/R = 1/${item.r1} + 1/${item.r2}. Total Current I = ${item.v}V / R = ${item.ans}.`,
      };
    },
  },
];

/**
 * Returns all 15 questions for a given Level (1 to 50):
 * - 10 Easy questions (Q1–Q10) | 1 point each
 * - 3 Medium questions (Q11–Q13) | 2 points each
 * - 2 Hard questions (Q14–Q15) | 3 points each
 * Total points = 25 per level.
 */
export function getQuestionsForLevel(levelNumber: number): LevelQuestion[] {
  const lvl = Math.max(1, Math.min(50, levelNumber));

  return QUESTION_TEMPLATES.map(tpl => {
    const data = tpl.getQuestionData(lvl);
    return {
      id: `lvl_${lvl}_q_${tpl.qNum}`,
      levelNumber: lvl,
      difficulty: tpl.difficulty,
      questionNumber: tpl.qNum,
      subject: tpl.subject,
      subjectLabel: tpl.subjectLabel,
      question: data.question,
      options: data.options,
      correctIndex: data.correctIndex,
      points: tpl.points,
      hint: data.hint,
      explanation: data.explanation,
    };
  });
}
