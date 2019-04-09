const noop = () => {};

class Queue {
  constructor() {
    this.queue = [];
    this.isActive = false;
  }

  add(item) {
    this.queue.push(item);
    this.next();
  }

  next() {
    if (!this.isActive && this.queue.length) {
      this.isActive = true;
      const next = this.queue.shift() || noop;
      next()
        .then(() => {
          this.isActive = false;
          this.next();
        });
    }
  }
}

module.exports = Queue;
