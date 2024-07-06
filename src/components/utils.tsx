import { createStore, SetStoreFunction, Store } from "solid-js/store";

export function createLocalStore<T extends object>(
  name: string,
  init: T
): [Store<T>, SetStoreFunction<T>] {
  const [state, setState] = createStore<T>(init);
  return [state, setState];
}

export function removeIndex<T>(array: readonly T[], index: number): T[] {
  return [...array.slice(0, index), ...array.slice(index + 1)];
}

// From: https://qiita.com/tronicboy/items/a77ca847245a96c61fe5
export class Queue<T> {
  #queue: Map<number, T>;
  #front: number;
  #back: number;

  constructor() {
    this.#front = 1;
    this.#back = 0;
    this.#queue = new Map();
  }

  get size(): number {
    return this.#queue.size;
  }

  enqueue(value: T): number {
    this.#back++;
    this.#queue.set(this.#back, value);
    return this.#back;
  }

  remove(key: number): void {
    const hasItem = this.#queue.get(key);
    if (!hasItem) throw TypeError("Item not in queue.");
    this.#queue.delete(key);
  }

  dequeue(): T {
    let poppedItem: T | null = null;
    while (!poppedItem) {
      if (this.#front > this.#back) throw Error("End of Queue.");
      const hasItem = this.#queue.get(this.#front);
      if (hasItem) {
        poppedItem = hasItem;
        break;
      }
      this.#front++;
    }
    this.#queue.delete(this.#front);
    this.#front++;
    return poppedItem;
  }

  peek(): T | undefined {
    let peekedItem: T | undefined = undefined;
    while (!peekedItem) {
      if (this.#front > this.#back) break;
      const hasItem = this.#queue.get(this.#front);
      if (hasItem) {
        peekedItem = hasItem;
        break;
      }
      this.#front++;
    }
    return peekedItem;
  }
}
