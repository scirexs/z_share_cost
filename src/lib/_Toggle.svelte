<script context="module" lang="ts">
  /*** Export ***/
  export type Props = {
    children: Snippet,
    isActive?: boolean,
    onClick?: IdentHandler,
    styleTo?: StylePartsPartial,
    style?: StylePartsPartial,
  }

  /*** Styling ***/
  export function styleToggle({
    size = EStyleSize.md,
    mergin = "",
    bgcolor = "bg-zinc-500",
    border = "",
    bdwidth = "",
    bdcolor = "",
    bdround = "rounded-md",
    txtcolor = "text-white",
    txtbold = "",
    txtitalic = "",
    others = "hover:brightness-110",
  }): StylePartsPartial { return getPartsStyle({size, mergin, bgcolor, border, bdwidth, bdcolor, bdround, txtcolor, txtbold, txtitalic, others}); }
  function getSizeStyle(size: EStyleSize): string {
    switch (size) {
      case EStyleSize.xs: return "p-1 min-w-6 min-h-6";
      case EStyleSize.sm: return "p-1.5 min-w-8 min-h-8";
      case EStyleSize.md: return "p-2 min-w-10 min-h-10";
      case EStyleSize.lg: return "p-2 min-w-12 min-h-12";
      case EStyleSize.xl: return "p-2 min-w-14 min-h-14";
    }
  }
  const fixedStyle: string = "select-none truncate transition duration-300";
  const flexStyle: string = "inline-flex flex-row flex-nowrap justify-center items-center gap-2";
  const styleToDefault: StylePartsPartial = { bgcolor: "bg-zinc-600", others: "" };

  /*** Others ***/
  /*** import ***/
  import type { Snippet } from "svelte";
  import { EStyleSize } from "$lib/constants"
  import { getPartsStyle, mergeStyle, getJoinStyle, addStyle } from "$lib/gfunctions";
</script>

<!---------------------------------------->

<script lang="ts">
  let { children, isActive = $bindable(false), onClick, styleTo, style }: Props = $props();

  /*** Initialize ***/
  isActive = isActive === undefined ? false : isActive;
  const inactiveStyle: StylePartsPartial = mergeStyle(styleToggle({}), style) as StylePartsPartial;
  const activeStyle: StylePartsPartial = mergeStyle(styleToggle(styleToDefault), styleTo) as StylePartsPartial;
  addStyle(activeStyle, "size", inactiveStyle.size);  // fixed size with inactive style
  const sizeStyle: string = getSizeStyle(inactiveStyle.size);
  let myStyle: StylePartsPartial = $derived(isActive ? activeStyle : inactiveStyle);

  /*** Others ***/
  /*** Handle events ***/
  function onclick() {
    isActive = !isActive;
    if (onClick) { onClick.handler(onClick.id); }
  }
</script>

<!---------------------------------------->

<button class={getJoinStyle(myStyle, sizeStyle, flexStyle, fixedStyle)} type="button" {onclick}>
  {@render children()}
</button>