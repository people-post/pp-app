(function(dat) {
class Story extends dat.ServerDataObject {
  constructor(data) {
    super(data);
    this._events = [];
    for (let d of data.events) {
      this._events.push(new dat.StoryEvent(d));
    }
  }

  getEvents() { return this._events; }
};

dat.Story = Story;
}(window.dat = window.dat || {}));
