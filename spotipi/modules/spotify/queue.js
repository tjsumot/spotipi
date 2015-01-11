var util = require('util'),
    EventEmitter = require('events').EventEmitter;

function Queue() {
  EventEmitter.call(this);
  this.queue = [];
}

util.inherits(Queue, EventEmitter);

Queue.prototype.add = function(uri) {
  this.queue.push(uri);
  this.emit('enqueue', uri);
};

Queue.prototype.getNext = function() {
  var uri = this.queue.shift();
  this.emit('next', uri);
  return uri;
};

module.exports = Queue;
