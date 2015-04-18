import assign from 'object-assign'
const noop = function () { }

// babelHelpers
/*eslint-disable */
/* istanbul ignore next */
const _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

/* istanbul ignore next */
const _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };
/*eslint-enable */

export default class AltTestingUtils {
  static createStoreSpy(alt) {
    return {
      _storeName: 'ALT_TEST_STORE',
      alt: alt,
      bindAction: noop,
      bindActions: noop,
      bindListeners: noop,
      dispatcher: alt.dispatcher,
      emitChange: noop,
      exportPublicMethods: noop,
      getInstance: noop,
      on: noop,
      setState: noop,
      waitFor: noop
    }
  }

  static makeStoreTestable(alt, UnwrappedStore) {
    const StorePrototype = AltTestingUtils.createStoreSpy(alt)
    function DerivedStore() {
      _get(Object.getPrototypeOf(DerivedStore.prototype), 'constructor', this).call(this)
    }
    _inherits(DerivedStore, UnwrappedStore)
    assign(DerivedStore.prototype, StorePrototype)
    return new DerivedStore()
  }

  static mockGetState(state = {}) {
    return {
      getState: () => {
        return state
      }
    }
  }
}
