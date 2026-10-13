import { QuestionItem, GradeLevel, Difficulty, QuestionSubject } from '../types/game';

export const QUESTION_BANK: QuestionItem[] = [
  // ==========================================
  // TAMIL QUESTIONS (இலக்கணம், இலக்கியம், புரிதல், சொற்பொருள்)
  // ==========================================
  {
    id: 'tam_01',
    subject: 'tamil',
    subjectLabel: 'Tamil',
    category: 'Grammar',
    grade: 'Grade 6',
    difficulty: 'Easy',
    scenario: 'தளத்தின் அவசர ஒலிபெருக்கியில் ஒரு வாக்கியம் ஒலிக்கிறது: "புயல் வேகமாக ______."',
    question: 'சரியான வினைமுற்றைத் தேர்ந்தெடுத்து வாக்கியத்தை நிறைவு செய்க:',
    tamilScript: 'புயல் வேகமாக ______ (நகர்கிறது / பறந்தது)',
    options: ['நகர்கிறது (Approaching)', 'பறந்தது (Flew away)', 'உறங்குகிறது (Sleeping)', 'நீந்துகிறது (Swimming)'],
    correctIndex: 0,
    hint: 'நிகழ்கால வினையைக் குறிக்கும் சொல்.',
    explanation: '"புயல் வேகமாக நகர்கிறது" என்பதே நிகழ்காலத்திற்குப் பொருத்தமான தொடராகும்.',
    rewardXp: 30,
    rewardCoins: 10,
  },
  {
    id: 'tam_02',
    subject: 'tamil',
    subjectLabel: 'Tamil',
    category: 'Literature',
    grade: 'Grade 7',
    difficulty: 'Easy',
    scenario: 'புயலின் போது குழுவிற்குத் தன்னம்பிக்கை ஊட்ட தளபதி ஒரு திருக்குறளை நினைவுபடுத்துகிறார்.',
    question: '"இடுக்கண் வருங்கால் ______; அதனை அடுத்தூர்வது அஃதொப்பது இல்." - விடுபட்ட சொல் எது?',
    tamilScript: 'இடுக்கண் வருங்கால் ______',
    options: ['நகுக (Smile)', 'அழுக (Cry)', 'ஓடுக (Flee)', 'அஞ்சுக (Fear)'],
    correctIndex: 0,
    hint: 'துன்பம் வரும்போது சிரித்து எதிர்கொள்ள வேண்டும் என்பது வள்ளுவர் வாக்கு.',
    explanation: '"இடுக்கண் வருங்கால் நகுக" - துன்பம் வரும்போது மனம் தளராமல் புன்னகையுடன் எதிர்கொள்ள வேண்டும்.',
    rewardXp: 35,
    rewardCoins: 10,
  },
  {
    id: 'tam_03',
    subject: 'tamil',
    subjectLabel: 'Tamil',
    category: 'Meaning',
    grade: 'Grade 8',
    difficulty: 'Medium',
    scenario: 'வானிலை அறிக்கையில் "சூறாவளி எச்சரிக்கை" என்ற சொல் வந்துள்ளது.',
    question: '"சூறாவளி" என்பதன் நேரடிப் பொருள் என்ன?',
    tamilScript: 'சூறாவளி என்பதன் பொருள் யாது?',
    options: ['சுழன்று வீசும் பலத்த காற்று (Violent Whirlwind)', 'மெல்லிய பனிச்சாரல்', 'மழை இல்லாத வானிலை', 'மிதமான தென்றல்'],
    correctIndex: 0,
    hint: 'சுழன்று பெரும் வேகத்துடன் வீசும் காற்று.',
    explanation: 'சூறாவளி என்பது சுழன்று பெரும் வேகத்துடன் வீசும் ஆபத்தான புயல் காற்றாகும்.',
    rewardXp: 45,
    rewardCoins: 10,
  },
  {
    id: 'tam_04',
    subject: 'tamil',
    subjectLabel: 'Tamil',
    category: 'Grammar',
    grade: 'Grade 9',
    difficulty: 'Easy',
    scenario: 'ஆய்வகப் பலகையில் "செங்கதிர்" என்ற சொல் பொறிக்கப்பட்டுள்ளது.',
    question: '"செங்கதிர்" என்பது எவ்வகைத் தொகைநிலைத் தொடர்?',
    tamilScript: 'செங்கதிர் = செம்மை + கதிர்',
    options: ['பண்புத்தொகை', 'வினைத்தொகை', 'உவமைத்தொகை', 'உம்மைத்தொகை'],
    correctIndex: 0,
    hint: 'செம்மை என்ற நிறப் பண்பும் "மை" விகுதியும் மறைந்து வந்துள்ளது.',
    explanation: 'செம்மையாகிய கதிர் எனப் பண்பு உருபும் மை விகுதியும் மறைந்து வருவதால் இது பண்புத்தொகை.',
    rewardXp: 40,
    rewardCoins: 10,
  },
  {
    id: 'tam_05',
    subject: 'tamil',
    subjectLabel: 'Tamil',
    category: 'Comprehension',
    grade: 'Grade 10',
    difficulty: 'Medium',
    scenario: 'ஆய்வுத் தளத்தில் உள்ள நீர் சேமிப்புத் தொட்டியில் திருவள்ளுவரின் அறிவியல் சிந்தனை காணப்படுகிறது.',
    question: '"நீரின்றி அமையாது உலகெனின் யார்யார்க்கும் வான்இன்று அமையாது ______" - இக்குறளின் இறுதிச்சொல் யாது?',
    tamilScript: 'நீரின்றி அமையாது உலகெனின்...',
    options: ['ஒழுக்கு', 'அழகு', 'செல்வம்', 'உயிர்'],
    correctIndex: 0,
    hint: 'மழை இல்லையேல் உலகத்து ஒழுக்கமும் நிலைபெறாது என்பது பொருள்.',
    explanation: '"நீரின்றி அமையாது உலகெனின் யார்யார்க்கும் வான்இன்று அமையாது ஒழுக்கு" (குறள் 20).',
    rewardXp: 50,
    rewardCoins: 10,
  },

  // ==========================================
  // ENGLISH QUESTIONS (Grammar, Vocabulary, Comprehension, Communication)
  // ==========================================
  {
    id: 'eng_01',
    subject: 'english',
    subjectLabel: 'English',
    category: 'Grammar',
    grade: 'Grade 6',
    difficulty: 'Easy',
    scenario: 'The research base station log reads: "The hero ______ the airlock door before the gale arrived."',
    question: 'Choose the correct past tense verb form:',
    options: ['secured', 'secures', 'securing', 'will secure'],
    correctIndex: 0,
    hint: 'The action was completed in the past before the storm arrived.',
    explanation: '"Secured" is the simple past tense required to agree with "arrived".',
    rewardXp: 30,
    rewardCoins: 10,
  },
  {
    id: 'eng_02',
    subject: 'english',
    subjectLabel: 'English',
    category: 'Vocabulary',
    grade: 'Grade 7',
    difficulty: 'Easy',
    scenario: 'Emergency warning: "The structural beams are facing hazardous vibration levels."',
    question: 'What is the closest synonym for the word "hazardous"?',
    options: ['Dangerous', 'Peaceful', 'Comfortable', 'Ordinary'],
    correctIndex: 0,
    hint: 'Something that exposes equipment to severe risk of harm or destruction.',
    explanation: '"Hazardous" means risky, perilous, or dangerous.',
    rewardXp: 35,
    rewardCoins: 10,
  },
  {
    id: 'eng_03',
    subject: 'english',
    subjectLabel: 'English',
    category: 'Grammar',
    grade: 'Grade 8',
    difficulty: 'Medium',
    scenario: 'Base Comms relay diagnostic: "Neither the backup generator nor the solar panels ______ working after the lightning hit."',
    question: 'Select the grammatically correct auxiliary verb:',
    options: ['were', 'was', 'is', 'has been'],
    correctIndex: 0,
    hint: 'When subjects are connected by "Neither... nor", verb agrees with the closer plural subject ("solar panels").',
    explanation: '"Solar panels" is plural and closer to the verb, so "were" is grammatically correct.',
    rewardXp: 45,
    rewardCoins: 10,
  },
  {
    id: 'eng_04',
    subject: 'english',
    subjectLabel: 'English',
    category: 'Vocabulary',
    grade: 'Grade 9',
    difficulty: 'Easy',
    scenario: 'Life-support briefing: "We must immediately replenish the depleted emergency water tanks."',
    question: 'What is the direct antonym (opposite) of the word "depleted"?',
    options: ['Replenished', 'Exhausted', 'Diminished', 'Drained'],
    correctIndex: 0,
    hint: '"Depleted" means emptied out. What word means filled back up?',
    explanation: '"Replenished" means refilled, which is the direct opposite of "depleted".',
    rewardXp: 40,
    rewardCoins: 10,
  },
  {
    id: 'eng_05',
    subject: 'english',
    subjectLabel: 'English',
    category: 'Communication',
    grade: 'Grade 10',
    difficulty: 'Medium',
    scenario: 'As base commander, you must broadcast an urgent emergency dispatch under low radio bandwidth.',
    question: 'Which transmission is the most concise and professional?',
    options: [
      '"Storm Level 4 imminent. Base sealed. Power 45%, O2 nominal. Requesting telemetry window."',
      '"Hey team, really crazy windy weather is coming and we hope everything goes fine!"',
      '"A big storm is blowing everything around, please send help whenever you can."',
      '"We might have some power issues today because of bad clouds outside."'
    ],
    correctIndex: 0,
    hint: 'Professional emergency communications prioritize quantifiable numbers and direct status.',
    explanation: 'Option A gives vital data (Level 4, status, power, O2, clear request) without unnecessary filler.',
    rewardXp: 50,
    rewardCoins: 10,
  },

  // ==========================================
  // MATHEMATICS (Sum of digits, Avg, %, Ratio, Speed/Time, Algebra, Geometry)
  // ==========================================
  {
    id: 'math_01',
    subject: 'mathematics',
    subjectLabel: 'Mathematics',
    category: 'Sum of Digits',
    grade: 'Grade 6',
    difficulty: 'Easy',
    scenario: 'The security keypad displays an emergency access code: 387. The terminal requires the sum of its digits.',
    question: 'What is the sum of the digits in 387?',
    options: ['18', '17', '19', '16'],
    correctIndex: 0,
    hint: 'Add each single digit: 3 + 8 + 7.',
    explanation: '3 + 8 = 11, and 11 + 7 = 18.',
    rewardXp: 35,
    rewardCoins: 10,
  },
  {
    id: 'math_02',
    subject: 'mathematics',
    subjectLabel: 'Mathematics',
    category: 'Average',
    grade: 'Grade 7',
    difficulty: 'Easy',
    scenario: 'Four exterior anemometers record wind gusts: 50 km/h, 60 km/h, 70 km/h, and 60 km/h.',
    question: 'What is the average wind speed across the four sensors?',
    options: ['60 km/h', '55 km/h', '65 km/h', '58 km/h'],
    correctIndex: 0,
    hint: 'Sum all values (50 + 60 + 70 + 60) and divide by 4.',
    explanation: 'Sum = 240 km/h. 240 ÷ 4 = 60 km/h.',
    rewardXp: 35,
    rewardCoins: 10,
  },
  {
    id: 'math_03',
    subject: 'mathematics',
    subjectLabel: 'Mathematics',
    category: 'Speed, Distance, Time',
    grade: 'Grade 8',
    difficulty: 'Hard',
    scenario: 'The emergency Rover travels at 24 km/h back to the research hangar located 36 km away.',
    question: 'How long will it take the rover to reach the hangar?',
    options: ['1 hour 30 minutes (1.5 h)', '1 hour 15 minutes', '2 hours', '1 hour 45 minutes'],
    correctIndex: 0,
    hint: 'Time = Distance ÷ Speed = 36 ÷ 24.',
    explanation: '36 ÷ 24 = 1.5 hours, which equals 1 hour and 30 minutes.',
    rewardXp: 60,
    rewardCoins: 10,
  },
  {
    id: 'math_04',
    subject: 'mathematics',
    subjectLabel: 'Mathematics',
    category: 'Simple Algebra',
    grade: 'Grade 9',
    difficulty: 'Hard',
    scenario: 'Pressure balancing equation for the airlock: 4x + 12 = 60, where x represents valve calibration units.',
    question: 'Solve for x:',
    options: ['12', '14', '10', '16'],
    correctIndex: 0,
    hint: 'Subtract 12 from 60: 4x = 48. Then divide by 4.',
    explanation: '4x = 60 - 12 = 48 => x = 48 ÷ 4 = 12.',
    rewardXp: 60,
    rewardCoins: 10,
  },
  {
    id: 'math_05',
    subject: 'mathematics',
    subjectLabel: 'Mathematics',
    category: 'Ratio',
    grade: 'Grade 10',
    difficulty: 'Easy',
    scenario: 'The hydroponics station mixes nutrient salt and purified water in a ratio of 3:7. If 15 grams of nutrient salt are used, how much water is needed?',
    question: 'How many grams of water are needed?',
    options: ['35 grams', '30 grams', '42 grams', '28 grams'],
    correctIndex: 0,
    hint: 'If 3 parts = 15 grams, then 1 part = 5 grams. Multiply 7 by 5.',
    explanation: '15 ÷ 3 = 5 g per part. 7 × 5 = 35 grams of water.',
    rewardXp: 40,
    rewardCoins: 10,
  },

  // ==========================================
  // SCIENCE (Physics, Chemistry, Biology)
  // ==========================================
  {
    id: 'sci_01',
    subject: 'science',
    subjectLabel: 'Science',
    category: 'Physics',
    grade: 'Grade 6',
    difficulty: 'Easy',
    scenario: 'High winds cause mechanical rotation in the base wind turbine, generating electricity.',
    question: 'What energy transformation takes place in a wind turbine generator?',
    options: [
      'Kinetic energy into Electrical energy',
      'Chemical energy into Sound energy',
      'Nuclear energy into Heat energy',
      'Light energy into Chemical energy'
    ],
    correctIndex: 0,
    hint: 'Wind motion (kinetic) is turned into power on the grid.',
    explanation: 'The turbine blades capture the kinetic motion of the moving wind and convert it into electrical energy.',
    rewardXp: 35,
    rewardCoins: 10,
  },
  {
    id: 'sci_02',
    subject: 'science',
    subjectLabel: 'Science',
    category: 'Chemistry',
    grade: 'Grade 7',
    difficulty: 'Easy',
    scenario: 'Oxygen scrubbers in the life-support bay remove exhaled Carbon Dioxide (CO2) from the air.',
    question: 'What is the chemical symbol for the element Oxygen?',
    options: ['O', 'Ox', 'Og', 'Om'],
    correctIndex: 0,
    hint: 'It is a single-letter symbol on the periodic table.',
    explanation: 'Oxygen is represented by the chemical symbol O (atomic number 8).',
    rewardXp: 35,
    rewardCoins: 10,
  },
  {
    id: 'sci_03',
    subject: 'science',
    subjectLabel: 'Science',
    category: 'Biology',
    grade: 'Grade 8',
    difficulty: 'Hard',
    scenario: 'The hydroponics bio-dome uses artificial sunlight so green plants can generate fresh oxygen for the base crew.',
    question: 'What biological process allows green plants to produce oxygen and glucose using light?',
    options: ['Photosynthesis', 'Fermentation', 'Transpiration', 'Decomposition'],
    correctIndex: 0,
    hint: 'Photo means light; synthesis means combining.',
    explanation: 'Plants use photosynthesis to convert water, carbon dioxide, and light into glucose and oxygen.',
    rewardXp: 60,
    rewardCoins: 10,
  },
  {
    id: 'sci_04',
    subject: 'science',
    subjectLabel: 'Science',
    category: 'Physics',
    grade: 'Grade 9',
    difficulty: 'Hard',
    scenario: 'During high-velocity storm gales, atmospheric pressure outside drops rapidly compared to inside.',
    question: 'According to Bernoulli\'s principle, what happens to fluid pressure when fluid speed increases?',
    options: [
      'Pressure decreases as speed increases',
      'Pressure increases as speed increases',
      'Pressure remains exactly constant',
      'Pressure drops to absolute zero'
    ],
    correctIndex: 0,
    hint: 'Fast-moving fluids create regions of lower static pressure.',
    explanation: 'Bernoulli\'s principle states that an increase in the speed of a fluid occurs simultaneously with a decrease in static pressure.',
    rewardXp: 65,
    rewardCoins: 10,
  },
  {
    id: 'sci_05',
    subject: 'science',
    subjectLabel: 'Science',
    category: 'Chemistry',
    grade: 'Grade 10',
    difficulty: 'Easy',
    scenario: 'Water electrolysis unit splits pure water (H2O) into hydrogen and breathable oxygen.',
    question: 'In water electrolysis, which gas is collected at the positive anode?',
    options: ['Oxygen (O2)', 'Hydrogen (H2)', 'Nitrogen (N2)', 'Argon (Ar)'],
    correctIndex: 0,
    hint: 'Negatively charged oxide ions oxidize into oxygen gas at the positive electrode.',
    explanation: 'Oxygen is produced at the anode (positive electrode), while hydrogen is produced at the cathode.',
    rewardXp: 40,
    rewardCoins: 10,
  },

  // ==========================================
  // SOCIAL SCIENCE (History, Economics)
  // ==========================================
  {
    id: 'soc_01',
    subject: 'social_science',
    subjectLabel: 'Social Science',
    category: 'History',
    grade: 'Grade 6',
    difficulty: 'Easy',
    scenario: 'Research archive log: Early human civilizations also faced catastrophic seasonal monsoons and floods.',
    question: 'Which ancient river valley civilization built advanced brick drainage and water reservoirs at Mohenjo-Daro and Harappa?',
    options: ['Indus Valley Civilization', 'Mesopotamian Civilization', 'Egyptian Civilization', 'Roman Civilization'],
    correctIndex: 0,
    hint: 'Located along the Indus River basin with famous planned grid cities.',
    explanation: 'The Indus Valley Civilization developed some of the earliest planned urban drainage and water storage systems.',
    rewardXp: 35,
    rewardCoins: 10,
  },
  {
    id: 'soc_02',
    subject: 'social_science',
    subjectLabel: 'Social Science',
    category: 'Economics',
    grade: 'Grade 7',
    difficulty: 'Easy',
    scenario: 'Base supply manager notes: "We have limited power cells, but unlimited emergency demands from all stations."',
    question: 'In economics, what fundamental concept describes the condition where human wants exceed available resources?',
    options: ['Scarcity', 'Inflation', 'Monopoly', 'Surplus'],
    correctIndex: 0,
    hint: 'Resources are limited; needs are unlimited.',
    explanation: 'Scarcity is the fundamental economic problem of having seemingly unlimited human wants in a world of limited resources.',
    rewardXp: 35,
    rewardCoins: 10,
  },
  {
    id: 'soc_03',
    subject: 'social_science',
    subjectLabel: 'Social Science',
    category: 'History',
    grade: 'Grade 8',
    difficulty: 'Medium',
    scenario: 'A commemorative station plaque honors early meteorological warning pioneers.',
    question: 'Who invented the Mercury Barometer in 1643 to measure atmospheric air pressure?',
    options: ['Evangelista Torricelli', 'Galileo Galilei', 'Isaac Newton', 'Blaise Pascal'],
    correctIndex: 0,
    hint: 'An Italian physicist and mathematician who studied vacuums.',
    explanation: 'Evangelista Torricelli invented the mercury barometer in 1643, revolutionizing weather forecasting.',
    rewardXp: 45,
    rewardCoins: 10,
  },
  {
    id: 'soc_04',
    subject: 'social_science',
    subjectLabel: 'Social Science',
    category: 'Economics',
    grade: 'Grade 9',
    difficulty: 'Medium',
    scenario: 'Base logistics trade analysis: Choosing between investing in solar battery upgrades versus buying extra rover tracks.',
    question: 'What is the economic term for the value of the next best alternative given up when making a choice?',
    options: ['Opportunity Cost', 'Sunk Cost', 'Marginal Revenue', 'Fixed Cost'],
    correctIndex: 0,
    hint: 'The cost of the missed opportunity.',
    explanation: 'Opportunity cost represents the potential benefits an individual or organization misses out on when choosing one alternative over another.',
    rewardXp: 50,
    rewardCoins: 10,
  },
  {
    id: 'soc_05',
    subject: 'social_science',
    subjectLabel: 'Social Science',
    category: 'History',
    grade: 'Grade 10',
    difficulty: 'Easy',
    scenario: 'International research base charter: "Established under collaborative interplanetary treaties, mirroring the 1967 international space pact."',
    question: 'What is the name of the 1967 multilateral treaty that forms the basis of international space law?',
    options: ['Outer Space Treaty', 'Geneva Convention', 'Kyoto Protocol', 'Antarctic Treaty'],
    correctIndex: 0,
    hint: 'Governs the peaceful exploration and use of outer space, including the Moon and celestial bodies.',
    explanation: 'The Outer Space Treaty (1967) bars weapons of mass destruction in space and limits celestial bodies to peaceful exploration.',
    rewardXp: 40,
    rewardCoins: 10,
  },
];

/**
 * EXACT QUESTION COUNT ENFORCEMENT FUNCTION:
 * Easy: Exactly 10 questions (Tamil: 2, English: 2, Mathematics: 2, Science: 2, Social Science: 2)
 * Medium: Exactly 3 questions (Tamil: 1, English: 1, Social Science: 1)
 * Hard: Exactly 2 questions (Mathematics: 1, Science: 1)
 *
 * Excludes already answered questions when possible, ensuring no repeated questions per attempt!
 */
export function generateQuestionSet(
  difficulty: Difficulty,
  answeredQuestionIds: string[] = []
): { questions: QuestionItem[]; isBankExhausted: boolean } {
  let isBankExhausted = false;

  // Filter helper: prefer unseen questions
  const getQuestionsForCategory = (
    subj: QuestionSubject,
    count: number
  ): QuestionItem[] => {
    // First try matching subject with target difficulty
    let pool = QUESTION_BANK.filter(q => q.subject === subj);

    // Prefer unseen
    const unseen = pool.filter(q => !answeredQuestionIds.includes(q.id));

    let selected: QuestionItem[] = [];
    if (unseen.length >= count) {
      selected = [...unseen].sort(() => 0.5 - Math.random()).slice(0, count);
    } else {
      // If unseen is fewer, take all unseen and fill remaining from pool
      isBankExhausted = true;
      selected = [...unseen];
      const seen = pool.filter(q => answeredQuestionIds.includes(q.id));
      const remainingNeeded = count - selected.length;
      selected = selected.concat(seen.sort(() => 0.5 - Math.random()).slice(0, remainingNeeded));
    }

    // Safety fallback: ensure exactly 'count' questions
    while (selected.length < count && pool.length > 0) {
      selected.push(pool[selected.length % pool.length]);
    }

    return selected.slice(0, count);
  };

  const finalQuestions: QuestionItem[] = [];

  if (difficulty === 'Easy') {
    // Exactly 10 questions: 2 Tamil, 2 English, 2 Math, 2 Science, 2 Social Science
    finalQuestions.push(...getQuestionsForCategory('tamil', 2));
    finalQuestions.push(...getQuestionsForCategory('english', 2));
    finalQuestions.push(...getQuestionsForCategory('mathematics', 2));
    finalQuestions.push(...getQuestionsForCategory('science', 2));
    finalQuestions.push(...getQuestionsForCategory('social_science', 2));
  } else if (difficulty === 'Medium') {
    // Exactly 3 questions: 1 Tamil, 1 English, 1 Social Science
    finalQuestions.push(...getQuestionsForCategory('tamil', 1));
    finalQuestions.push(...getQuestionsForCategory('english', 1));
    finalQuestions.push(...getQuestionsForCategory('social_science', 1));
  } else {
    // Hard: Exactly 2 questions: 1 Mathematics, 1 Science
    finalQuestions.push(...getQuestionsForCategory('mathematics', 1));
    finalQuestions.push(...getQuestionsForCategory('science', 1));
  }

  // Shuffle order of question delivery
  const shuffled = finalQuestions.sort(() => 0.5 - Math.random());

  return {
    questions: shuffled,
    isBankExhausted,
  };
}
