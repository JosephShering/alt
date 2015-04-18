/**
 * DispatcherRecorder(alt: AltInstance): DispatcherInstance
 *
 * > Record and replay your actions at any point in time.
 *
 * This util allows you to record a set of dispatches which you can later
 * replay at your convenience.
 *
 * Good for: Debugging, repeating, logging.
 *
 * Usage:
 *
 * ```js
 * var recorder = new DispatcherRecorder(alt);
 *
 * // start recording
 * recorder.record();
 *
 * // call a series of actions
 *
 * // stop recording
 * recorder.stop();
 *
 * // replay the events that took place
 * recorder.replay();
 * ```
 */

import Symbol from 'es-symbol'

export default class DispatcherRecorder {
  constructor(alt) {
    this.alt = alt
    this.events = []
    this.dispatchToken = null
  }

  /**
   * If recording started you get true, otherwise false since there's a recording
   * in progress.
   * record(): boolean
   */
  record() {
    if (this.dispatchToken) {
      return false
    }

    this.dispatchToken = this.alt.dispatcher.register(function (payload) {
      this.events.push(payload)
    }.bind(this))

    return true
  }

  /**
   * Stops the recording in progress.
   * stop(): undefined
   */
  stop() {
    this.alt.dispatcher.unregister(this.dispatchToken)
    this.dispatchToken = null
  }

  /**
   * Clear all events from memory.
   * clear(): undefined
   */
  clear() {
    this.events = []
  }

  /**
   * (As|S)ynchronously replay all events that were recorded.
   * replay(replayTime: ?number, done: ?function): undefined
   */
  replay(replayTime, done) {
    if (replayTime === void 0) {
      this.events.forEach((payload) => {
        this.alt.dispatch(payload.action, payload.data)
      })
    }

    const onNext = (payload, nextAction) => {
      return () => {
        setTimeout(() => {
          this.alt.dispatch(payload.action, payload.data)
          nextAction()
        }, replayTime)
      }
    }

    let next = done || function () { }
    let i = this.events.length - 1
    while (i >= 0) {
      var event = this.events[i]
      next = onNext(event, next)
      i -= 1
    }

    next()
  }

  /**
   * Serialize all the events so you can pass them around or load them into
   * a separate recorder.
   * serializeEvents(): string
   */
  serializeEvents() {
    const events = this.events.map((event) => {
      return {
        action: Symbol.keyFor(event.action),
        data: event.data
      }
    })
    return JSON.stringify(events)
  }

  /**
   * Load serialized events into the recorder and overwrite the current events
   * loadEvents(events: string): undefined
   */
  loadEvents(events) {
    const parsedEvents = JSON.parse(events)
    this.events = parsedEvents.map((event) => {
      return {
        action: Symbol.for(event.action),
        data: event.data
      }
    })
  }
}
