const state = {};
const setState = stateChanges => {
  Object.assign(state, stateChanges);
}

module.exports = { state, setState };