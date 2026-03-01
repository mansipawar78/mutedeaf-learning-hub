export interface Exercise {
  word: string;
  emoji?: string;
  example: string;
  imageUrl?: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  exercises: Exercise[];
}

export const lessons: Lesson[] = [
  {
    id: 'alphabet',
    title: 'Alphabet',
    description: 'Learn to recognize and pronounce letters A to Z',
    icon: 'BookOpen',
    color: 'from-teal-500 to-cyan-500',
    exercises: [
      { word: 'A', emoji: '🅰️', example: 'A is for Apple' },
      { word: 'B', emoji: '🅱️', example: 'B is for Ball' },
      { word: 'C', emoji: '🌊', example: 'C is for Cat' },
      { word: 'D', emoji: '🐶', example: 'D is for Dog' },
      { word: 'E', emoji: '🐘', example: 'E is for Elephant' },
    ],
  },
  {
    id: 'phrases',
    title: 'Common Phrases',
    description: 'Practice everyday phrases and greetings',
    icon: 'MessageSquare',
    color: 'from-amber-500 to-orange-500',
    exercises: [
      { word: 'Hello', emoji: '👋', example: 'Hello, how are you?' },
      { word: 'Thank you', emoji: '🙏', example: 'Thank you very much!' },
      { word: 'Please', emoji: '🤲', example: 'Please help me.' },
      { word: 'Sorry', emoji: '😔', example: 'I am sorry for that.' },
      { word: 'Goodbye', emoji: '👋', example: 'Goodbye, see you later!' },
    ],
  },
  {
    id: 'numbers',
    title: 'Numbers',
    description: 'Count and recognize numbers 1 through 10',
    icon: 'Hash',
    color: 'from-green-500 to-emerald-500',
    exercises: [
      { word: 'One', emoji: '1️⃣', example: 'I have one apple.' },
      { word: 'Two', emoji: '2️⃣', example: 'There are two cats.' },
      { word: 'Three', emoji: '3️⃣', example: 'She has three books.' },
      { word: 'Four', emoji: '4️⃣', example: 'We need four chairs.' },
      { word: 'Five', emoji: '5️⃣', example: 'He ate five cookies.' },
    ],
  },
  {
    id: 'vocabulary',
    title: 'Vocabulary',
    description: 'Expand your vocabulary with common words',
    icon: 'Layers',
    color: 'from-blue-500 to-indigo-500',
    exercises: [
      { word: 'Water', emoji: '💧', example: 'I drink water every day.' },
      { word: 'Food', emoji: '🍎', example: 'The food is delicious.' },
      { word: 'Home', emoji: '🏠', example: 'I am going home now.' },
      { word: 'Friend', emoji: '🤝', example: 'She is my best friend.' },
      { word: 'Happy', emoji: '😊', example: 'I feel happy today.' },
    ],
  },
  {
    id: 'isl-alphabet',
    title: 'Sign Language (ISL)',
    description: 'Learn Indian Sign Language alphabet letters A through J with real-time camera detection',
    icon: 'HandMetal',
    color: 'from-teal-500 to-cyan-500',
    exercises: [
      {
        word: 'A',
        emoji: '🤟',
        example: 'Closed fist with thumb resting on the side — all fingers curled inward.',
        imageUrl: '/assets/generated/isl-sign-a.dim_256x256.png',
      },
      {
        word: 'B',
        emoji: '🤟',
        example: 'Hold all four fingers straight up together, thumb tucked flat across the palm.',
        imageUrl: '/assets/generated/isl-sign-b.dim_256x256.png',
      },
      {
        word: 'C',
        emoji: '🤟',
        example: 'Curve all fingers and thumb into a C shape, as if holding a small ball.',
        imageUrl: '/assets/generated/isl-sign-c.dim_256x256.png',
      },
      {
        word: 'D',
        emoji: '🤟',
        example: 'Extend your index finger upward while curling the other fingers; touch thumb to middle finger.',
        imageUrl: '/assets/generated/isl-sign-d.dim_256x256.png',
      },
      {
        word: 'E',
        emoji: '🤟',
        example: 'Bend all four fingers at the knuckles with fingertips touching the palm; thumb tucked under.',
        imageUrl: '/assets/generated/isl-sign-e.dim_256x256.png',
      },
      {
        word: 'F',
        emoji: '🤟',
        example: 'Touch your index fingertip to your thumb tip forming a circle; extend the other three fingers up.',
        imageUrl: '/assets/generated/isl-sign-a.dim_256x256.png',
      },
      {
        word: 'G',
        emoji: '🤟',
        example: 'Extend your index finger and thumb horizontally, pointing to the side like a sideways L.',
        imageUrl: '/assets/generated/isl-sign-a.dim_256x256.png',
      },
      {
        word: 'H',
        emoji: '🤟',
        example: 'Extend your index and middle fingers together pointing sideways; keep other fingers and thumb closed.',
        imageUrl: '/assets/generated/isl-sign-a.dim_256x256.png',
      },
      {
        word: 'I',
        emoji: '🤟',
        example: 'Raise only your pinky finger straight up; close all other fingers and thumb into a fist.',
        imageUrl: '/assets/generated/isl-sign-a.dim_256x256.png',
      },
      {
        word: 'J',
        emoji: '🤟',
        example: 'Raise your pinky finger and draw a J shape in the air — move down then curve upward.',
        imageUrl: '/assets/generated/isl-sign-a.dim_256x256.png',
      },
    ],
  },
];
