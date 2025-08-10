import { join } from 'path';
import { LowSync } from 'lowdb';
import { JSONFileSync } from 'lowdb/node';
import type { User, Project, Section } from './types';

interface Data {
  users: User[];
  projects: Project[];
  sections: Section[];
}

const file = join(process.cwd(), 'data/db.json');
const adapter = new JSONFileSync<Data>(file);
const defaultData: Data = { users: [], projects: [], sections: [] };
const db = new LowSync(adapter, defaultData);
db.read();
if (!db.data) db.data = defaultData;

export default db;
