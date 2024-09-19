import type { Transaction } from "$lib/assy/Details.svelte";
import { getRandomInt } from "$lib/util";
export type Total = {  // total amount with everyone
  amount: string,
  each: string,
};
export type Balance = {
  lender: string,
  borrower: string,
  amount: number,
};
export type Summary = {  // simple sum amount
  name: string,
  payment: string,
  receipt: string,
  diff: string,
  positive: boolean,
};
export type Transfer = {  // transfer amount to share
  lender: string,
  borrower: string,
  amount: string,
};
type TotalBalance = {
  name: string,
  amount: number,
};

// ------------------------------
export function fixTransactions(names: string[], txns: Transaction[]): Transaction[] {
  if (names.length <= 0 || txns.length <= 0) { return txns; }
  let ret = txns.filter(txn => names.includes(txn.lender));  // not working
  ret.forEach(txn => { if (txn.everyone) { txn.borrowers = [ ...names ]; } });
  for (const txn of ret.filter(txn => !txn.everyone)) {
    txn.borrowers = txn.borrowers.filter(name => names.includes(name));
  }
  ret = ret.filter(txn => txn.borrowers.length > 0);
  return ret;
}

// ------------------------------
export function getTotal(names: string[], txns: Transaction[]): Total {
  const sum = txns.filter(x => x.everyone).reduce((acc, x) => acc+x.amount, 0);
  return {
    amount: sum.toLocaleString("ja-JP", { style: "currency", currency: "JPY" }),
    each: Math.ceil(sum / names.length).toLocaleString("ja-JP", { style: "currency", currency: "JPY" }),
  };
}

// ------------------------------
export function getAllBalances(txns: Transaction[]): Balance[] {
  const ret: Balance[] = [];
  for (const txn of txns) {
    const perPerson = getIntegerQuotients(txn.amount, txn.borrowers.length);
    if (txn.borrowers.includes(txn.lender)) { ret.push({lender: txn.lender, borrower: txn.lender, amount: perPerson(false)}) }
    for (const borrower of txn.borrowers) {
      if (borrower === txn.lender) { continue; }
      ret.push({lender: txn.lender, borrower, amount: perPerson(true)});
    }
  }
  return ret;
}
function getIntegerQuotients(beDivided: number, divide: number): (random: boolean)=>number {
  const quotient: number[] = Array(divide).fill(Math.trunc(beDivided / divide));
  for (let idx = 0 ; idx < beDivided % divide; idx++) {
    quotient[idx] += 1;
  }
  return (random: boolean) => {
    if (random) {
      return quotient.splice(getRandomInt(quotient.length), 1)[0] ?? 0;
    } else {
      return quotient.shift() ?? 0;
    }
  }
}

// ------------------------------
export function getSummaries(names: string[], balances: Balance[]): Summary[] {
  const payment: Record<string, number> = getPayment(balances);
  const receipt: Record<string, number> = getReceipt(balances);
  const temp = names.map(name => ({name, payment: payment[name] ?? 0, receipt: receipt[name] ?? 0}));
  return temp.map(x => ({
    name: x.name,
    payment: x.payment.toLocaleString("ja-JP", { style: "decimal" }),
    receipt: x.receipt.toLocaleString("ja-JP", { style: "decimal" }),
    diff: (x.receipt - x.payment).toLocaleString("ja-JP", { style: "decimal", signDisplay: "always" }),
    positive: (x.receipt - x.payment) >= 0,
  }));
}
function getPayment(balances: Balance[]): Record<string, number> {
  return balances.reduce((acc: Record<string, number>, {lender, amount}) => {
    acc[lender] = (acc[lender] ?? 0) + amount;
    return acc;
  }, {});
}
function getReceipt(balances: Balance[]):Record<string, number> {
  return balances.reduce((acc: Record<string, number>, {borrower, amount}) => {
    acc[borrower] = (acc[borrower] ?? 0) + amount;
    return acc;
  }, {});
}

// ------------------------------
export function getTransfers(balances: Balance[]): Transfer[] {
  const sourceBalances = balances.filter(x => x.lender !== x.borrower);
  const totalBalances = getTotalBalances(sourceBalances);
  const finalBalances = clearingBalances(totalBalances);
  return getBalanceDisplay(finalBalances);
}

function getTotalBalances(balances: Balance[]): TotalBalance[] {
  const ret: TotalBalance[] = [];
  for (const name of getUniqueNames(balances)) { ret.push({name, amount: 0}); }
  for (const balance of balances) {
    ret.find(x => x.name === balance.lender)!.amount +=  balance.amount;
    ret.find(x => x.name === balance.borrower)!.amount -=  balance.amount;
  }
  return ret;
}
function getUniqueNames(balances: Balance[]): IterableIterator<string> {
  const unique: Set<string> = new Set();
  for (const balance of balances) {
    unique.add(balance.lender);
    unique.add(balance.borrower);
  }
  return unique.values();
}
function clearingBalances(totalBalances: TotalBalance[]): Balance[] {
  const [lenders, borrowers] = splitLenderBorrower(totalBalances);
  return matchBalances(lenders, borrowers);
}
function splitLenderBorrower(totalBalance: TotalBalance[]): [TotalBalance[], TotalBalance[]] {
  const lenders: TotalBalance[] = [];
  const borrowers: TotalBalance[] = [];
  for (const {name, amount} of totalBalance) {
    if (amount > 0) { lenders.push({ name, amount }); }
    if (amount < 0) { borrowers.push({ name, amount: Math.abs(amount) }); }
  }
  return [
    lenders.sort((x,y) => y.amount - x.amount),  // descending
    borrowers.sort((x,y) => x.amount - y.amount),  // ascending
  ];
}
function matchBalances(lenders: TotalBalance[], borrowers: TotalBalance[]): Balance[] {
  if (getTotalAmount(lenders) !== getTotalAmount(borrowers)) { return []; }

  const ret: Balance[] = [];
  let lender: TotalBalance | undefined;
  let borrower: TotalBalance | undefined;

  while (lenders.length !== 0 || borrowers.length !== 0) {
    lender = lender ?? lenders.shift();
    borrower = borrower ?? borrowers.shift();
    if (lender === undefined || borrower === undefined) { break; }

    const balance: Balance = {lender: lender.name, borrower: borrower.name, amount: borrower.amount};

    if (lender.amount > borrower.amount) {
      lender.amount -= borrower.amount;
      borrower = undefined;
    } else if (lender.amount < borrower.amount) {
      balance.amount = lender.amount;
      borrower.amount -= lender.amount;
      lender = undefined;
    } else {
      borrower = undefined;
      lender = undefined;
    }
    ret.push(balance);
  }
  return ret;
}
function getTotalAmount(totalBalances: TotalBalance[]): number {
  return totalBalances.reduce((acc, x)=>acc+x.amount, 0);
}
function getBalanceDisplay(balances: Balance[]): Transfer[] {
  return balances.map(x => ({ ...x,
    amount: x.amount.toLocaleString("ja-JP", { style: "currency", currency: "JPY" }),
  }));
}