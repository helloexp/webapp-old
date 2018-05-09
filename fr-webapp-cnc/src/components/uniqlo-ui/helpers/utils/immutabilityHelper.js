import update from 'react-addons-update';

function mergeSingle(objA, objB) {
  if (!objA) return objB;
  if (!objB) return objA;

  return update(objA, { $merge: objB });
}

export default {

  merge() {
    const args = Array.prototype.slice.call(arguments, 0);  // eslint-disable-line prefer-rest-params
    let base = args[0];

    for (let pos = 1; pos < args.length; pos++) {
      if (args[pos]) {
        base = mergeSingle(base, args[pos]);
      }
    }

    return base;
  },

  mergeItem(obj, key, newValueObject) {
    const command = {};

    command[key] = { $merge: newValueObject };

    return update(obj, command);
  },

  push(array, obj) {
    const newObj = Array.isArray(obj) ? obj : [obj];

    return update(array, { $push: newObj });
  },

  shift(array) {
    return update(array, { $splice: [[0, 1]] });
  },

};
