import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, '..', 'data');
if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
const DB_PATH = path.join(DATA_DIR, 'db.json');

function defaultData() {
  return {
    users: [],
    videos: [],
    routines: [],
    tasks: [],
    rewards: [],
    diaryEntries: [],
  };
}

function load() {
  if (!existsSync(DB_PATH)) {
    save(defaultData());
  }
  const raw = readFileSync(DB_PATH, 'utf-8');
  const parsed = JSON.parse(raw);
  return { ...defaultData(), ...parsed };
}

function save(data) {
  writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

let data = load();

export const db = {
  get users() {
    return data.users;
  },
  get videos() {
    return data.videos;
  },
  get routines() {
    return data.routines;
  },
  get tasks() {
    return data.tasks;
  },
  get rewards() {
    return data.rewards;
  },
  get diaryEntries() {
    return data.diaryEntries;
  },
  persist() {
    save(data);
  },
  reset() {
    data = defaultData();
    save(data);
  },
};
