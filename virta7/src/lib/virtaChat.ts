interface Rule {
  keywords: string[];
  replies: string[];
}

const RULES: Rule[] = [
  {
    keywords: ['hi', 'hello', 'hey'],
    replies: ["Hi there! I'm glad you're here.", 'Hello! How are you feeling right now?'],
  },
  {
    keywords: ['sad', 'upset', 'angry', 'mad', 'worried', 'nervous', 'scared'],
    replies: [
      "I'm sorry you're feeling that way. It's okay to feel like this.",
      'Thank you for telling me. Would it help to write about it in your Diary?',
    ],
  },
  {
    keywords: ['happy', 'good', 'great', 'excited'],
    replies: ['That makes me happy too!', "That's wonderful to hear!"],
  },
  {
    keywords: ['mission', 'missions'],
    replies: [
      'You can find your missions on the Missions tab. Completing them earns you stars!',
    ],
  },
  {
    keywords: ['star', 'stars', 'reward', 'rewards'],
    replies: ['You can see your stars and rewards on the Stars tab.'],
  },
  {
    keywords: ['timetable', 'routine', 'schedule'],
    replies: ["Your timetable for today is on the Timetable tab. You've got this!"],
  },
  {
    keywords: ['diary', 'journal'],
    replies: ['You can write about your day in the Diary tab, any time you like.'],
  },
  {
    keywords: ['bye', 'goodbye', 'see you'],
    replies: ['Bye for now! I will be right here when you want to talk again.'],
  },
  {
    keywords: ['thank', 'thanks'],
    replies: ["You're welcome!"],
  },
];

const FALLBACK_REPLIES = [
  "Thanks for sharing that with me. Tell me more if you'd like.",
  "I'm listening. What else is on your mind?",
  "That's good to know. Is there anything I can help with?",
];

function pick(list: string[]): string {
  return list[Math.floor(Math.random() * list.length)];
}

export function getVirtaReply(userText: string): string {
  const lower = userText.toLowerCase();
  for (const rule of RULES) {
    if (rule.keywords.some((k) => lower.includes(k))) {
      return pick(rule.replies);
    }
  }
  return pick(FALLBACK_REPLIES);
}
