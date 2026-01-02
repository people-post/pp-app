export class Notice {
  static readonly T_TYPE = {
    LIKE: 'LIKE',
    REPOST: 'REPOST',
  } as const;

  isFrom(_type: string): boolean {
    return false;
  }

  getFromId(): string | null {
    return null;
  }

  getFromIdType(): string | null {
    return null;
  }

  getNUnread(): number {
    return 0;
  }
}

