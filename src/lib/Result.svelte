<script context="module" lang="ts">
  /*** Export ***/
  export type Props = {
    txns: Txns[],
    forAccordion: StylePartsPartial,
  };
  /*** Styling ***/
  /*** Others ***/
  type Name = {
    id: string,
    text: string,
    active: boolean,
  };
  type Txns = {
    txnId: number,
    id: string,
    text: string,
    amount: number,
    note: string,
    for: Name[],
  };
  type Account = {
    from: string,
    to: string,
    amt: number,
  };
  type Summary = {
    name: string,
    total: number,
    amt: number,
  }

  /*** import ***/
  import Accordion from "$lib/_Accordion_c.svelte";
</script>

<!---------------------------------------->

<script lang="ts">
  let { txns = $bindable(), forAccordion }: Props = $props();

  /*** Styling ***/
  /*** Initialize ***/
  let items: Account[] = $derived(getEachItems(txns));
  let summary: Summary[] = $derived(summaryByName(items));
  let total: number = $derived(summary.reduce((acc, x) => acc+x.total, 0));
  let results: Account[] = $derived(getTransferAmount(summary));

  /*** Sync ***/
  /*** Others ***/
  function getEachItems(txns: Txns[]): Account[] {
    const items = [];
    for (const txn of txns) {
      const eachAmt = txn.amount / txn.for.length;
      for (const borrower of txn.for) {
        items.push({
          from: borrower.text,
          to: txn.text,
          amt: eachAmt,
        });
      }
    }

    return items.filter(x => x.to !== x.from);
  }

  function summaryByName(items: Account[]): Summary[] {
    const summary: Record<string, number> = {};
    items.forEach(x => {
      summary[x.from] = 0;
      summary[x.to] = 0;
    });
    items.forEach(x => {
      summary[x.from] += (x.amt * -1);
      summary[x.to] += x.amt;
    });
    const total = Object.fromEntries(
      Object.entries(Object.groupBy(items, x=>x.to))
        .map(([name,vals])=>[name, vals!.reduce((acc,x)=>acc+x.amt, 0)])
    );

    return Object.entries(summary)
      .map(([name, amt]) => {return {name: name,total: total[name] ? total[name] : 0,amt: amt};})
      .filter(x => x.amt !== 0);
  }

  function getTransferAmount(summary: Summary[]): Account[] {
    const credit = summary.filter(x => x.amt > 0)
      .map(x => {return {...x};})
      .toSorted((x,y) => y.amt - x.amt); // descending
    const debit = summary.filter(x => x.amt < 0)
      .map(x => {return {...x, amt: x.amt * -1};})
      .toSorted((x,y) => x.amt - y.amt); // ascending

    return balanceCreditDebit(credit, debit);
  }
  function balanceCreditDebit(credit: Summary[], debit: Summary[]): Account[] {
    const ret: Account[] = [];
    if (credit.reduce((acc, x)=>acc+x.amt, 0) !== debit.reduce((acc, x)=>acc+x.amt, 0)) {
      return ret;
    }

    let cre: Summary | undefined = credit.shift();
    let deb: Summary | undefined = debit.shift();
    while (credit.length !== 0 || debit.length !== 0) {
      if (cre === undefined) { cre = credit.shift()!; }
      if (deb === undefined) { deb = debit.shift()!; }

      const item = {from: deb.name, to: cre.name, amt: deb.amt};
      if (cre.amt > deb.amt) {
        cre.amt -= deb.amt;
        deb = undefined;
      } else if (cre.amt < deb.amt) {
        item.amt = cre.amt;
        deb.amt -= cre.amt;
        cre = undefined;
      } else {
        deb = undefined;
        cre = undefined;
      }
      ret.push(item);
    }
    return ret;
  }

  /*** Handle events ***/
</script>

<!---------------------------------------->

<div class="flex flex-col justify-center items-center mb-5 w-full">
  <div class="text-forest text-2xl">Total Share Amount</div>
  <div class="text-forest text-5xl font-bold">{total.toLocaleString("ja-JP", { style: "currency", currency: "JPY" })}</div>
  <!-- <div class="text-sage text-lg font-bold mt-1">{num.toLocaleString("ja-JP", { style: "currency", currency: "JPY" })} / person</div> -->
</div>
<span class="text-forest text-lg">To share the costs ...</span>
{#each results as result}
  <div class="flex justify-between items-center pl-2">
    <span class="text-forest text-2xl">{result.from} &gt; {result.to}</span>
    <span class="text-teal text-3xl font-bold">{result.amt.toLocaleString("ja-JP", { style: "currency", currency: "JPY" })}</span>
  </div>
{/each}
<Accordion label="Summary" isOpen={true} style={forAccordion} contentSize="px-4 pt-2 pb-3 h-fit">
  <div class="flex flex-col gap-2 divide-y divide-sage text-lg text-forest">
    <div class="grid grid-cols-3 grid-rows-1 items-center text-base px-2">
      <span></span>
      <span class="justify-self-end">Paid for others</span>
      <span class="justify-self-end">To balance</span>
    </div>
    {#each summary as item (item.name)}
      <div class="grid grid-cols-3 grid-rows-1 items-center px-2">
        <span class="justify-self-start">{item.name}</span>
        <span class="justify-self-end">{item.total.toLocaleString("ja-JP", { style: "currency", currency: "JPY" })}</span>
        {#if item.amt >= 0}
          <span class="justify-self-end text-teal">{item.amt.toLocaleString("ja-JP", { style: "decimal", signDisplay: "always" })}</span>
        {:else}
          <span class="justify-self-end text-sage">{item.amt.toLocaleString("ja-JP", { style: "decimal", signDisplay: "always" })}</span>
        {/if}
      </div>
    {/each}
  </div>
</Accordion>

{#snippet item(txn: Txns)}
  <div class="flex w-full">
    <div class="grow flex flex-col">
      <div class="flex justify-between items-center">
        <span class="leading-5">{txn.text}</span>
        <span class="text-sm leading-4 text-sage">{txn.note}</span>
      </div>
      <div class="flex flex-none justify-center items-center">
        <span class="basis-10 shrink-0 text-right leading-5">For</span>
        <span class="grow inline-flex justify-between items-center">
          <span class="text-sm px-2">{txn.for.map(x => x.text).join(", ")}</span>
          <span class="text-lg leading-5">{txn.amount.toLocaleString("ja-JP", { style: "currency", currency: "JPY" })}</span>
        </span>
      </div>
    </div>
  </div>
{/snippet}
<Accordion label="Details" style={forAccordion} contentSize={"px-4 pt-2 pb-3 h-fit"}>
  <div class="flex flex-col gap-2 divide-y divide-sage">
    {#each txns as txn (txn.txnId)}
      {@render item(txn)}
    {/each}
  </div>
</Accordion>
