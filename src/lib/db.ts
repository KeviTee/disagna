import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { LowSync } from 'lowdb';
import { JSONFileSync } from 'lowdb/node';
import type { User, Project, Section } from './types';

interface Data {
  users: User[];
  projects: Project[];
  sections: Section[];
}

const dataDir = join(process.cwd(), 'data');
if (!existsSync(dataDir)) mkdirSync(dataDir, { recursive: true });
const file = join(dataDir, 'db.json');
const adapter = new JSONFileSync<Data>(file);
const defaultData: Data = { users: [], projects: [], sections: [] };
const db = new LowSync(adapter, defaultData);
db.read();
if (!db.data) db.data = defaultData;

export default db;
