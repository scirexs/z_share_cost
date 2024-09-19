<script context="module" lang="ts">
  /*** Export ***/
  export type Props = {
    children: Snippet,
    onClose?: IdentHandler,
    style?: StylePartsPartial,
  };

  /*** Styling ***/
  export function styleChip({
    size = EStyleSize.md,
    mergin = "",
    bgcolor = "bg-zinc-500",
    border = "",
    bdwidth = "",
    bdcolor = "",
    bdround = "rounded-full",
    txtcolor = "text-zinc-200",
    txtbold = "",
    txtitalic = "",
    others = "",
  }): StylePartsPartial { return getPartsStyle({size, mergin, bgcolor, border, bdwidth, bdcolor, bdround, txtcolor, txtbold, txtitalic, others}); }
  function getSizeStyle(size: EStyleSize): [string, string] {
    switch (size) {
      case EStyleSize.xs: return ["text-xs px-2 pb-0.5 min-h-5 gap-1", "w-2 h-2 fill-white/70 hover:fill-white"];
      case EStyleSize.sm: return ["text-xs px-2.5 pb-0.5 min-h-6 gap-1", "w-2 h-2 fill-white/70 hover:fill-white"];
      case EStyleSize.md: return ["text-sm px-2.5 pb-0.5 min-h-7 gap-1", "w-2 h-2 fill-white/70 hover:fill-white"];
      case EStyleSize.lg: return ["text-base px-3 pb-0.5 min-h-8 gap-1.5", "w-2.5 h-2.5 fill-white/70 hover:fill-white"];
      case EStyleSize.xl: return ["text-lg px-3.5 pb-0.5 min-h-9 gap-1.5", "w-3 h-3 fill-white/70 hover:fill-white"];
    }
  }  // [sizeStyle, svgStyle]
  const fixedStyle: string = "w-fit";
  const flexStyle: string = "inline-flex flex-row flex-nowrap justfy-center items-center";
  const buttonStyle: string = "pt-0.5";

  /*** Others ***/
  /*** import ***/
  import type { Snippet } from "svelte";
  import { EStyleSize } from "$lib/obsolete/constants"
  import { getPartsStyle, mergeStyle, getJoinStyle, removeSizeStyle } from "$lib/obsolete/gfunctions";
</script>

<!---------------------------------------->

<script lang="ts">
  const { children, onClose, style }: Props = $props();

  /*** Initialize ***/
  const myStyle: StylePartsPartial = mergeStyle(styleChip({}), style) as StylePartsPartial;
  const [sizeStyle, svgStyle]: [string, string] = getSizeStyle(myStyle.size);
  removeSizeStyle(myStyle);
  const showButton: boolean = onClose !== undefined;

  /*** Others ***/
  /*** Handle events ***/
  const onclick = () => showButton ? onClose?.handler(onClose?.id) : undefined;
</script>

<!---------------------------------------->

<span class={getJoinStyle(myStyle, sizeStyle, flexStyle, fixedStyle)}>
  {@render children()}
  {#if showButton}
    <button class={buttonStyle} type="button" {onclick}>
      <svg class={svgStyle} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" aria-hidden="true">
        <rect fill="transparent"></rect>
        <path d="M511.998 70.682 441.315 0 256.002 185.313 70.685 0 .002 70.692l185.314 185.314L.002 441.318 70.69 512l185.312-185.312L441.315 512l70.683-70.682-185.314-185.312z"/>
      </svg>
    </button>
  {/if}
</span>

