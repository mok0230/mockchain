window.addEventListener('DOMContentLoaded', () => {
  const state = {
    views: ['miners', 'explorer'],
    activeView: 'miners'
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
        window.blockchain = JSON.parse(evt.data).data;
        refreshExplorerTable();
        updateAccountBalances();
      };
    } else {
      alert('WebSockets are not supported in this browser');
    }
  }

  function fetchHashrates() {
    return new Promise(function(resolve, reject){
      fetch('http://localhost:3000/hashrates').then((res) => {
      return res.json();
    }).then(data => {
      window.miners = data.hashrates;
      resolve(data.hashrates)
    })
    })
  }

  function refreshMinersTable() {
      new Tabulator("#miners-table", {
        data: window.miners, //assign data to table
        layout:"fitColumns", //fit columns to width of table (optional)
        columns:[ //Define Table Columns
          {title:"Miner", field:"address"},
          {title:"Hashes/sec", field:"hashrate"},
          {title:"Balance", field:"balance"},
        ]
     });
  }

  function zeroMinerBalances() {
    window.miners.forEach(miner => {
      miner.balance = 0;
    })
  }

  function updateAccountBalances() {
    zeroMinerBalances();
    window.blockchain.forEach(block => {
      const coinbaseTransaction = block.transactions[0];
      console.log('coinbaseTransaction', coinbaseTransaction);
      const minerIndex = window.miners.findIndex(miner => miner.address === coinbaseTransaction.recipient);
      console.log('minerIndex', minerIndex);
      const existingBalance = window.miners[minerIndex].balance;
      console.log('existingBalance', existingBalance);
      window.miners[minerIndex].balance = existingBalance ? existingBalance + coinbaseTransaction.amount : coinbaseTransaction.amount;
      console.log('window.miners[minerIndex]', window.miners[minerIndex])
    })
    refreshMinersTable();
  }

  function refreshExplorerTable() {
    //TODO: refresh (or even append!) data instead of creating a new a new table each time
    new Tabulator("#explorer-table", {
      data: window.blockchain, //assign data to table
      layout:"fitColumns", //fit columns to width of table (optional)
      columns:[ //Define Table Columns
        {title:"Block Height", field:"height"},
        {title:"Previous Hash", field:"previousHash"},
        {title:"Nonce", field:"nonce"},
        {title:"Miner", field:"transactions.0.recipient"},
        {title:"Amount", field:"transactions.0.amount"},
      ]
   });
  }

  function activateView(activatedView) {
    document.querySelector(`#${state.activeView}`).classList.add('ion-hide');
    document.querySelector(`ion-item[name="${state.activeView}"]`).removeAttribute('color');
    document.querySelector(`#${activatedView}`).classList.remove('ion-hide');
    document.querySelector(`ion-item[name="${activatedView}"]`).setAttribute('color', 'dark');
    state.activeView = activatedView;
  }

  openWebSocket();
  fetchHashrates().then((res) => refreshMinersTable());
  
  document.querySelector('#side-nav').addEventListener('click', e => {
    const activatedItem = e.target.closest('ion-item').getAttribute('name');
    if (activatedItem != state.activeView) {
      activateView(activatedItem);
    }
  });
});