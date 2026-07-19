// A small hand-written knowledge base standing in for a real vector-search index.
// Retrieval here is simple keyword overlap instead of embeddings — same
// retrieve-then-generate shape as a real RAG pipeline, just without the
// infrastructure. Swap `retrieve()` for a vector DB call later without
// touching the chat endpoint.

const SNIPPETS = [
  {
    id: 'timetable',
    keywords: ['timetable', 'routine', 'schedule', 'morning', 'today', 'brush', 'teeth', 'dressed', 'school'],
    text: 'The Timetable tab shows the routine blocks for each day. Tapping a block marks it complete and earns a star.',
  },
  {
    id: 'stars',
    keywords: ['star', 'stars', 'reward', 'rewards', 'redeem', 'earn', 'spend'],
    text: 'The Stars tab shows how many stars you have, ways to earn more by completing tasks, and rewards you can redeem stars for.',
  },
  {
    id: 'missions',
    keywords: ['mission', 'missions', 'video', 'videos', 'watch'],
    text: 'The Missions tab is a video library. A tutor or admin adds videos there for you to watch.',
  },
  {
    id: 'diary',
    keywords: ['diary', 'journal', 'write', 'wrote', 'day', 'feelings', 'feel'],
    text: 'The Diary tab is a private journal. You can write as many entries as you like about your day, any time.',
  },
  {
    id: 'nervous',
    keywords: ['nervous', 'scared', 'worried', 'anxious', 'upset', 'sad', 'angry', 'mad', 'overwhelmed'],
    text: "It's okay to feel nervous, upset, or unsure sometimes. Naming the feeling is a good first step, and writing about it in the Diary can help too.",
  },
  {
    id: 'caregiver',
    keywords: ['tutor', 'parent', 'caregiver', 'pin', 'help'],
    text: 'A tutor or caregiver manages the child\'s timetable, rewards, and videos. If something feels wrong or confusing, it is always okay to ask a grown-up for help.',
  },
];

export function retrieve(message, limit = 2) {
  const lower = message.toLowerCase();
  const scored = SNIPPETS.map((s) => ({
    snippet: s,
    score: s.keywords.reduce((n, k) => (lower.includes(k) ? n + 1 : n), 0),
  })).filter((s) => s.score > 0);

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => s.snippet.text);
}
