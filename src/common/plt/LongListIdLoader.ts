import Controller from '../../lib/ext/Controller.js';
import type { LongListIdRecord } from '../datatypes/LongListIdRecord.js';

export abstract class LongListIdLoader extends Controller {
  abstract getIdRecord(): LongListIdRecord;
  abstract asyncLoadFrontItems(): void | Promise<void>;
  abstract asyncLoadBackItems(): void | Promise<void>;
}

