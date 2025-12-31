export class OgpData {
  constructor() {
    this._id = null;
    this._type = "";
    this._title = "";
    this._description = "";
    this._imageUrl = "";
    this._url = "";
    this._creationTime = null;
    this._userId = null;
    this._files = [];
  }

  getId() { return this._id; }
  getTitle() { return this._title; }
  getType() { return this._type; }
  getImageUrl() { return this._imageUrl; }
  getUrl() { return this._url; }
  getDescription() { return this._description; }
  getCreationTime() { return this._creationTime; }
  getUserId() { return this._userId; }
  getFiles() { return this._files; }

  setId(id) { this._id = id; }
  setTitle(title) { this._title = title; }
  setType(t) { this._type = t; }
  setImageUrl(url) { this._imageUrl = url; }
  setUrl(url) { this._url = url; }
  setDescription(d) { this._description = d; }
  setCreationTime(t) { this._creationTime = t; }
  setUserId(id) { this._userId = id; }
  setFiles(files) { this._files = files; }
};


