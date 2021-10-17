window.addEventListener('DOMContentLoaded', () => {
  const state = {
    views: ['explorer', 'balances', 'hashrates'],
    activeView: 'explorer'
  }

  function activateView(activatedView) {
    document.querySelector(`#${state.activeView}`).classList.add('ion-hide');
    document.querySelector(`ion-item[name="${state.activeView}"]`).removeAttribute('color');
    document.querySelector(`#${activatedView}`).classList.remove('ion-hide');
    document.querySelector(`ion-item[name="${activatedView}"]`).setAttribute('color', 'dark');
    state.activeView = activatedView;
  }
  
  document.querySelector('#side-nav').addEventListener('click', e => {
    const activatedItem = e.target.closest('ion-item').getAttribute('name');
    if (activatedItem != state.activeView) {
      activateView(activatedItem);
    }
  });
});