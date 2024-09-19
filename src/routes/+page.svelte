<script module lang="ts">
  /*** Export ***/
  type Data = {
    phase: number,
    names: string[],
    txns: Transaction[],
  }

  /*** import ***/
  import type { Transaction } from "$lib/assy/Details.svelte";
  import { page } from "$app/stores";
  import { decodeDeflateString } from "$lib/util";
  import Tabs from "$lib/comp/_Tabs.svelte";
  import Entry from "./Entry.svelte";
  import Cost from "./Cost.svelte";
  import Share from "./Share.svelte";
  import { fixTransactions } from "./_proc";
</script>

<!---------------------------------------->

<script lang="ts">
  /*** Initialize ***/
  const labels = ["Entry", "Cost", "Share"];
  const saveTemplate = $page.url.origin + $page.url.pathname + "?d=$replace$"
  let phase = $state(0);
  let names: string[] = $state([]);
  let txns: Transaction[] = $state([]);

  async function loadData() {
    const param = $page.url.searchParams.get("d");
    if (!param) { return; }
    try {
      const data: Data = JSON.parse(await decodeDeflateString(param));
      if (!validateData(data)) { return; }
      const {phase: _phase, names: _names, txns: _txns} = data;
      phase = _phase;
      names = _names;
      txns = fixTransactions(names, _txns);
    } catch (e) {
      console.error("Failed to load data:", e)
      return;
    }
  }
  function validateData(data: object): boolean {
    if (!Object.hasOwn(data, "phase")) { return false; }
    if (!Object.hasOwn(data, "names")) { return false; }
    if (!Object.hasOwn(data, "txns")) { return false; }
    if (typeof (data as Data).phase !== "number") { return false; }
    if (!Array.isArray((data as Data).names)) { return false; }
    if (!Array.isArray((data as Data).txns)) { return false; }
    if (!(data as Data).names.every(x => typeof x === "string" && [...x].length>0 && [...x].length<=8)) { return false; }
    if (!(data as Data).txns.every(x => {
      return typeof x.id === "string"
      && typeof x.lender === "string"
      && typeof x.amount === "number"
      && x.amount > 0
      && x.amount <= 1000000
      && [...x.note].length <= 15
      && Array.isArray(x.borrowers)
      && x.borrowers.every(x => typeof x === "string")
      && typeof x.everyone === "boolean";
    })) { return false; }
    return true;
  }

  // import { STATE, THEME } from "$lib/const";
  // import { themeColor } from "$lib/style";
  // let status: State = $state(STATE.DEFAULT);
  // function onclick() {
  //   if (themeColor.theme === THEME.LIGHT) {
  //     themeColor.toDark();
  //   } else {
  //     themeColor.toLight();
  //   }
  // }
  // let stat: State = $state(STATE.DEFAULT);
</script>

<!---------------------------------------->
<!-- <button type="button" onclick={()=>open=true} >open</button>
<button type="button" onclick={()=>foo+="a"} >add</button>
<SaveModal bind:open bind:data={foo} template="prefix__$replace$__suffix" /> -->


{#await loadData() then}
  <Tabs bind:active={phase} {labels} lock={true}>
    {#snippet panel1Entry()}
      <Entry bind:phase bind:names bind:txns />
    {/snippet}
    {#snippet panel2Cost()}
      <Cost bind:phase bind:names bind:txns url={saveTemplate} />
    {/snippet}
    {#snippet panel3Share()}
      <Share bind:phase bind:names bind:txns url={saveTemplate} />
    {/snippet}
  </Tabs>
{/await}
