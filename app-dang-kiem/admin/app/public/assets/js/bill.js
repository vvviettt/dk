// (A) COMMON ITEMS NAME & PRICE
// items : {
//     "Apple" : 1.1, "Beet" : 2.2, "Cherry" : 3.3,
//     "Durian" : 2.3, "Eggplant" : 1.2, "Fig" : 2.1
//   };
// (B) INITIALIZE BILLING

(function () {
  let list = document.getElementById('addItems');
  for (let [k, v] of Object.entries(bill.items)) {
    let opt = document.createElement('option');
    opt.innerHTML = k;
    list.appendChild(opt);
  }

  // (B2) ALSO POPULATE PRICE IF KNOWN ITEM
  let item = document.getElementById('addItem'),
    price = document.getElementById('addPrice');
  item.onchange = () => {
    if (bill.items[item.value]) {
      price.value = bill.items[item.value];
    }
  };

  // (B3) INITIALIZE FORM + PRINT
  document.getElementById('bPrint').onclick = bill.print;
  document.getElementById('bottomB').onsubmit = bill.add;
});
window.addEventListener('load', bill.init);

// (C) ADD AN ITEM
() => {
  // (C1) GET HTML FIELDS
  let hItems = document.getElementById('items'),
    hQty = document.getElementById('addQty'),
    hItem = document.getElementById('addItem'),
    hPrice = document.getElementById('addPrice');

  // (C2) CREATE NEW ITEM ROW
  let row = document.createElement('div');
  row.className = 'row';

  let col = document.createElement('div');
  col.className = 'qty';
  col.innerHTML = hQty.value;
  row.appendChild(col);

  col = document.createElement('div');
  col.className = 'name';
  col.innerHTML = hItem.value;
  row.appendChild(col);

  col = document.createElement('div');
  col.className = 'price';
  col.innerHTML = (+hQty.value * parseFloat(hPrice.value)).toFixed(2);
  row.appendChild(col);

  col = document.createElement('button');
  col.innerHTML = "<span class='mi'>delete</span>";
  col.onclick = () => {
    bill.del(row);
  };
  row.appendChild(col);
  hItems.appendChild(row);

  // (B3) CLEAR FORM FIELDS + TOTAL
  hQty.value = 1;
  hItem.value = '';
  hPrice.value = '0.00';
  bill.total();
  return false;
};
// (D) DELETE ITEM ROW
(row) => {
  row.remove();
  bill.total();
},
  // (E) CALCULATE TOTAL
  () => {
    let all = document.querySelectorAll('#items .price'),
      amt = 0;
    if (all.length > 0) {
      for (let p of all) {
        amt += parseFloat(p.innerHTML);
      }
    }
    document.getElementById('totalB').innerHTML = amt.toFixed(2);
  };
print: () => {
  // (F1) GET ALL ITEMS
  let all = document.querySelectorAll('#items .row');

  // (F2) PRINT CURRENT LIST
  if (all.length > 0) {
    let pwin = window.open('bill-print.html');
    pwin.onload = () => {
      // GET PRINT WINDOW ITEMS LIST
      let pdoc = pwin.document,
        list = pdoc.getElementById('items');

      // CLONE ROW ITEMS ONLY (MINUS REMOVE BUTTON)
      for (let i of all) {
        let clone = i.cloneNode(true);
        clone.getElementsByTagName('button')[0].remove();
        list.appendChild(clone);
      }

      // ADD TOTAL ROW
      let total = pdoc.createElement('div');
      total.className = 'total';
      total.innerHTML = 'TOTAL: ' + document.getElementById('totalB').innerHTML;
      list.appendChild(total);

      // PRINT!
      pwin.print();
    };
  } else {
    alert('No items to bill!');
  }
};
