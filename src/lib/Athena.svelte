<script context="module" lang="ts">
  /*** Export ***/
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
  }

  /*** import ***/
  import type { Snippet } from "svelte";
  import { incrementer } from "$lib/gfunctions";
  import { EStyleSize, EStyleFlexibility, EStyleFlexAlignMainAxis } from "$lib/constants";
  import { mergeStyle } from "$lib/gfunctions";
  import Tabs, { layoutTabs, styleTabs, styleActive, styleFrame } from "$lib/_Tabs.svelte";
  import Descriptor, { styleDescriptor } from "$lib/_Descriptor.svelte";
  import Button, { styleButton } from "$lib/_Button.svelte";
  import TextBox, { styleTextBox } from "$lib/_TextBox.svelte";
  import ChipInput from "$lib/ChipInput.svelte";
  import { styleChip } from "$lib/_Chip.svelte";
  import CostInput from "$lib/CostInput.svelte";
  import { styleToggle } from "$lib/_Toggle.svelte";
  import { styleSelect } from "$lib/_Select.svelte";
  import { styleAccordion } from "$lib/_Accordion_c.svelte";
  import Details from "$lib/Details.svelte";
  import Result from "$lib/Result.svelte";
</script>

<!---------------------------------------->

<script lang="ts">

  /*** Standard Styling ***/
  const stdDescriptor = styleDescriptor({mergin: "mt-1 mb-5", txtcolor: "text-forest", others: "w-full"});
  const stdButton = styleButton({size: EStyleSize.md, bgcolor: "bg-teal", txtcolor: "text-serenity"});
  const stdTextBox = styleTextBox({size: EStyleSize.md, bdwidth: "border-b", bdcolor: "border-forest", others: "w-full"});
  const stdSelect = styleSelect({size: EStyleSize.md, bdwidth: "border-b", bdcolor: "border-forest", others: "w-full"});
  const stdChip = styleChip({bgcolor: "bg-teal", txtcolor: "text-serenity"});
  const stdToggle = styleToggle({size: EStyleSize.md, bgcolor: "bg-sage", bdround: "rounded-full", txtcolor: "text-serenity", others: "px-4"});
  const stdAccordion = styleAccordion({size: EStyleSize.md, mergin: "mt-8", bgcolor: "bg-forest", bdcolor: "border-forest", txtcolor: "text-serenity", others: "duration-75"});

  /*** Styling By Purpose ***/
  const onTabs = layoutTabs({mainpos: EStyleFlexAlignMainAxis.stretch, flexibility: EStyleFlexibility.auto, others: "*:grow *:text-center"});
  const forTabsNonActive = styleTabs({size: EStyleSize.xl, mergin: "mx-5", bdcolor: "border-sage", txtcolor: "text-sage", others: "cursor-default"});
  const forTabsActive = styleActive({bdcolor: "border-forest", txtcolor: "text-forest", txtbold: "font-bold", others: "w-full cursor-default"});
  const forTabsFrame = styleFrame({bdcolor: "border-sage", others: "px-5 py-2 h-[calc(100dvh-160px)] max-h-[calc(100dvh-160px)] overflow-y-auto overscroll-y-contain"}); // koko
  const forButtonNext = mergeStyle(stdButton, {bdwidth: "border-2", bdcolor: "border-teal", others: "relative grow basis-2/3"});
  const forButtonBack = styleButton({size: EStyleSize.md, bgcolor: "bg-serenity", bdwidth: "border-2", bdcolor: "border-sage", txtcolor: "text-sage", others: "relative grow basis-1/3"});
  const forButtonAll = mergeStyle(stdToggle, {bgcolor: "bg-serenity", bdwidth: "border-2", bdcolor: "border-teal",  txtcolor: "text-teal"});
  const forToggleActive = mergeStyle(stdToggle, {bgcolor: "bg-teal"});
  const forButtonOk = mergeStyle(stdButton, {others: "w-full hover:brightness-110"});

  /*** Other Styling ***/
  const styleBackButtonArrow = "absolute inset-y-1/4 left-3 size-5";  // should handle in button pre/suffix
  const styleNextButtonArrow = "absolute inset-y-1/4 right-3 size-5";  // should handle in button pre/suffix

  /*** Initialize ***/
  let phase: number = $state(0);
  let names: Name[] = $state([]);
  let txns: Txns[] = $state([]);
  let genTxnId = $state(incrementer(0));
  const phaseLabel: string[] = ["Entry", "Cost", "Share"];

  /*** Sync ***/
  /*** Others ***/
  /*** Handle events ***/
  function shiftPhase(to: number):()=>void {
    const toPhase = to;
    return () => { phase = toPhase; };
  }
  function initApp(): void {
    phase = 0;
    names = [];
    txns = [];
    genTxnId = incrementer(0);
  }
</script>

<!---------------------------------------->

<Tabs bind:active={phase} labels={phaseLabel} disable={true} layout={onTabs} style={forTabsNonActive} activeStyle={forTabsActive} frameStyle={forTabsFrame}>
  {#snippet tabPanel1()}
    <ChipInput bind:items={names} styleDescriptor={stdDescriptor} styleTextBox={stdTextBox} styleChip={stdChip} />
  {/snippet}
  {#snippet tabPanel2()}
    <CostInput bind:items={names} bind:txns {genTxnId} forDescriptor={stdDescriptor} forSelect={stdSelect} forTextBox={stdTextBox} forButton={forButtonOk} {forButtonAll} forToggle={stdToggle} {forToggleActive} />
    <Details bind:txns forAccordion={stdAccordion} />
  {/snippet}
  {#snippet tabPanel3()}
    <Result bind:txns forAccordion={stdAccordion} />
  {/snippet}
</Tabs>

<div class="fixed bottom-0 w-full h-16 px-5 py-3 flex gap-2 items-center">
  {#snippet Back(phase: number)}
    <Button style={forButtonBack} onClick={shiftPhase(phase)}>
      <svg xmlns="http://www.w3.org/2000/svg" class={styleBackButtonArrow} viewBox="0 0 512 512">
        <path fill="#7FA091" d="M419.916 71.821 348.084 0l-256 256.005 256 255.995 71.832-71.822-184.174-184.173z"/>
      </svg>
      Back
    </Button>
  {/snippet}
  {#snippet Next(label: string, phase: number)}
    <Button style={forButtonNext} onClick={shiftPhase(phase)}>
      {label}
      <svg xmlns="http://www.w3.org/2000/svg" class={styleNextButtonArrow} viewBox="0 0 512 512">
        <path fill="#E2E8EF" d="M163.916 0 92.084 71.822l184.174 184.174L92.084 440.178 163.916 512l256-256.004z"/>
      </svg>
    </Button>
  {/snippet}

  {#if phase === 0}
    {@render Next("Enter costs", 1)}
  {:else if phase === 1}
    {@render Back(0)}
    {@render Next("Share the costs", 2)}
  {:else}
    {@render Back(1)}
    <Button style={forButtonNext} onClick={initApp}>New Start</Button>
  {/if}
</div>