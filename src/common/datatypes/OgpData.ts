export class OgpData {
  private _id: string | null;
  private _type: string;
  private _title: string;
  private _description: string;
  private _imageUrl: string;
  private _url: string;
  private _creationTime: Date | null;
  private _userId: string | null;
  private _files: unknown[];

  constructor() {
    this._id = null;
    this._type = '';
    this._title = '';
    this._description = '';
    this._imageUrl = '';
    this._url = '';
    this._creationTime = null;
    this._userId = null;
    this._files = [];
  }

  getId(): string | null {
    return this._id;
  }

  getTitle(): string {
    return this._title;
  }

  getType(): string {
    return this._type;
  }

  getImageUrl(): string {
    return this._imageUrl;
  }

  getUrl(): string {
    return this._url;
  }

  getDescription(): string {
    return this._description;
  }

  getCreationTime(): Date | null {
    return this._creationTime;
  }

  getUserId(): string | null {
    return this._userId;
  }

  getFiles(): unknown[] {
    return this._files;
  }

  setId(id: string | null): void {
    this._id = id;
  }

  setTitle(title: string): void {
    this._title = title;
  }

  setType(t: string): void {
    this._type = t;
  }

  setImageUrl(url: string): void {
    this._imageUrl = url;
  }

  setUrl(url: string): void {
    this._url = url;
  }

  setDescription(d: string): void {
    this._description = d;
  }

  setCreationTime(t: Date | null): void {
    this._creationTime = t;
  }

  setUserId(id: string | null): void {
    this._userId = id;
  }

  setFiles(files: unknown[]): void {
    this._files = files;
  }
}

