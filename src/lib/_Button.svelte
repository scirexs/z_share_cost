<script context="module" lang="ts">
  /*** Export ***/
  export type Props = {
    children: Snippet,
    onClick: () => void,
    style?: StylePartsPartial,
  }

  /*** Styling ***/
  export function styleButton({
    size = EStyleSize.md,
    mergin = "",
    bgcolor = "bg-zinc-500",
    border = "",
    bdwidth = "",
    bdcolor = "",
    bdround = "rounded-md",
    txtcolor = "text-white",
    txtbold = "font-semibold",
    txtitalic = "",
    others = "hover:brightness-110",
  }): StylePartsPartial { return getPartsStyle({size, mergin, bgcolor, border, bdwidth, bdcolor, bdround, txtcolor, txtbold, txtitalic, others}); }
  function getSizeStyle(size: EStyleSize): string {
    switch (size) {
      case EStyleSize.xs: return "px-2 pb-0.5 min-w-6 h-6";
      case EStyleSize.sm: return "px-3 pb-0.5 min-w-8 h-8";
      case EStyleSize.md: return "px-4 pb-0.5 min-w-10 h-10";
      case EStyleSize.lg: return "px-6 pb-0.5 min-w-12 h-12";
      case EStyleSize.xl: return "px-8 pb-0.5 min-w-14 h-14";
    }
  }
  const fixedStyle: string = "select-none truncate transition duration-300";
  const flexStyle: string = "inline-flex flex-row flex-nowrap justify-center items-center gap-2";

  /*** Others ***/
  /*** import ***/
  import type { Snippet } from "svelte";
  import { EStyleSize } from "$lib/constants"
  import { getPartsStyle, mergeStyle, getJoinStyle } from "$lib/gfunctions";
</script>

<!---------------------------------------->

<script lang="ts">
  const { children, onClick, style }: Props = $props();

  /*** Initialize ***/
  const myStyle: StylePartsPartial = mergeStyle(styleButton({}), style) as StylePartsPartial;
  const sizeStyle: string = getSizeStyle(myStyle.size);

  /*** Others ***/
  /*** Handle events ***/
</script>

<!---------------------------------------->

<button class={getJoinStyle(myStyle, sizeStyle, flexStyle, fixedStyle)} type="button" onclick={onClick}>
  {@render children()}
</button>

