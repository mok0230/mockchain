window.addEventListener('DOMContentLoaded', () => {
  const state = {
    views: ['explorer', 'balances', 'hashrates'],
    activeView: 'explorer'
  }

  function openWebSocket() {
    if ("WebSocket" in window) {
      const websocket = new WebSocket('ws://localhost:8080');
			
      websocket.onopen = function(evt) {
        console.log('event', evt)
      };

      websocket.onmessage = function (evt) { 
        console.log('message received');
        console.log('evt', evt);
        console.log('evt.data', evt.data);
      };
    } else {
      alert('WebSockets are not supported in this browser');
    }
  }

  function activateView(activatedView) {
    document.querySelector(`#${state.activeView}`).classList.add('ion-hide');
    document.querySelector(`ion-item[name="${state.activeView}"]`).removeAttribute('color');
    document.querySelector(`#${activatedView}`).classList.remove('ion-hide');
    document.querySelector(`ion-item[name="${activatedView}"]`).setAttribute('color', 'dark');
    state.activeView = activatedView;
  }

  openWebSocket();
  
  document.querySelector('#side-nav').addEventListener('click', e => {
    const activatedItem = e.target.closest('ion-item').getAttribute('name');
    if (activatedItem != state.activeView) {
      activateView(activatedItem);
    }
  });
});