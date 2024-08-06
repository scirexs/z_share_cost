<script context="module" lang="ts">
  /*** Export ***/
  export type Props = {
    children: Snippet,
    prefix?: Snippet,
    suffix?: Snippet,
    hint?: string,
    label?: string,
    style?: StylePartsPartial,
  };

  /*** Styling ***/
  export function styleDescriptor({
    size = EStyleSize.sm,
    mergin = "",
    bgcolor = "",
    border = "",
    bdwidth = "",
    bdcolor = "",
    bdround = "",
    txtcolor = "",
    txtbold = "",
    txtitalic = "",
    others = "",
  }): StylePartsPartial { return getPartsStyle({size, mergin, bgcolor, border, bdwidth, bdcolor, bdround, txtcolor, txtbold, txtitalic, others}); }
  const fixedStyle: string = "h-fit";
  const flexStyle: string = "inline-flex flex-row flex-nowrap justify-center items-center gap-1";
  const labelStyle: string = "-mb-0.5 text-forest text-base";
  const childStyle: string = "-mb-1";
  const hintStyle: string = "text-xs text-forest";

  /*** Others ***/
  /*** import ***/
  import type { Snippet } from "svelte";
  import { EStyleSize } from "$lib/constants"
  import { getPartsStyle, mergeStyle, getJoinStyle } from "$lib/gfunctions";
</script>

<!---------------------------------------->

<script lang="ts">
  let { children, prefix, suffix, hint = $bindable(""), label = "", style }: Props = $props();

  /*** Styling ***/
  const myStyle: StylePartsPartial = mergeStyle(styleDescriptor({}), style) as StylePartsPartial;

  /*** Initialize ***/
  const showLabel: boolean = label !== "";
  const showPrefix: boolean = prefix !== undefined;
  const showSuffix: boolean = suffix !== undefined;
  let showHint: boolean = hint !== "";

  /*** Sync ***/
  /*** Others ***/
  /*** Handle events ***/
</script>

<!---------------------------------------->

<fieldset class={getJoinStyle(myStyle)}>
  {#if showLabel}
    <legend class={labelStyle}>{label}</legend>
  {/if}
  <div class={childStyle}>
    {#if showPrefix}
      {@render prefix!()}
    {/if}
    {@render children()}
    {#if showSuffix}
      {@render suffix!()}
    {/if}
  </div>
  {#if showHint}
    <output class={hintStyle}>{hint}</output>
  {/if}
</fieldset>
