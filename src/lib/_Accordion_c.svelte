<script context="module" lang="ts">
  /*** Export ***/
  export type Props = {
    children: Snippet,
    label: string | Snippet,
    icon?: Snippet,  // to change icon, put svgs into {#if isOpen}
    isOpen?: boolean,   // if link some, specify array[i] of the some
    group?: boolean[],  // if link some, specify array of the some
    contentSize: string,
    style?: StylePartsPartial,  // others will be only applied to summary
  };

  /*** Styling ***/
  export function styleAccordion({
    size = EStyleSize.md,
    mergin = "",
    bgcolor = "bg-zinc-200",
    border = "",
    bdwidth = "border",
    bdcolor = "border-black",
    bdround = "rounded-md",
    txtcolor = "",
    txtbold = "",
    txtitalic = "",
    others = "group-open:bg-inherit group-open:underline duration-75",
  }): StylePartsPartial { return getPartsStyle({size, mergin, bgcolor, border, bdwidth, bdcolor, bdround, txtcolor, txtbold, txtitalic, others}); }
  function getWholeStyle(style: StylePartsPartial): StylePartsPartial {
    return filter(style, ["mergin","border","bdwidth","bdcolor","bdround"]);
  }
  function getLabelStyle(style: StylePartsPartial): StylePartsPartial {
    return filter(style, ["size","bgcolor","txtcolor","txtbold","txtitalic","others"]);
  }
  function getSizeStyle(size: EStyleSize): [string, string, string] {
    switch (size) {
      case EStyleSize.xs: return ["px-2 min-h-6", "px-2 pb-1.5", "w-2.5 h-2.5"];
      case EStyleSize.sm: return ["px-3 min-h-8", "px-3 pb-2", "w-3 h-3"];
      case EStyleSize.md: return ["px-4 min-h-10", "px-4 pt-2 pb-3 overflow-y-auto h-[calc(100lvh-600px)]", "w-3 h-3"];
      case EStyleSize.lg: return ["px-4 min-h-11", "px-4 pb-3", "w-3.5 h-3.5"];
      case EStyleSize.xl: return ["px-4 min-h-12", "px-4 pb-3", "w-3.5 h-3.5"];
    }
  }  // [sizeStyle, contentSizeStyle, svgSizeStyle]
  const fixedStyle: string = "overflow-hidden group";
  const summaryStyle: string = "select-none cursor-pointer block [&::-webkit-details-marker]:hidden";
  const flexStyle: string = "flex flex-row flex-nowrap justify-center items-center";
  const labelStyle: string = "pb-0.5";
  const svgStyle: string = "pointer-events-none group-open:rotate-180 duration-300";

  /*** Others ***/
  const duration = 400;  // duration of open,close transition

  /*** import ***/
  import type { Snippet } from "svelte";
  import { slide } from 'svelte/transition';
  import { EStyleSize } from "$lib/constants"
  import { getPartsStyle, mergeStyle, getJoinStyle, prevent, filter, sleep } from "$lib/gfunctions";
</script>

<!---------------------------------------->

<script lang="ts">
  let { children, label, icon, isOpen = $bindable(false), group = $bindable([]), style, contentSize }: Props = $props();

  /*** Styling ***/
  const myStyle: StylePartsPartial = mergeStyle(styleAccordion({}), style) as StylePartsPartial;
  const [sizeStyle, contentSizeStyle, svgSizeStyle]: [string, string, string] = getSizeStyle(myStyle.size);
  const showDefaultIcon: boolean = icon === undefined;

  /*** Initialize ***/
  let open: boolean = $state(isOpen);
  let guard: boolean = false;
  const isStrLabel = typeof label === "string";

  /*** Sync ***/
  $effect.pre(() => {
    isOpen;  // trigger of the $effect
    toggleDetails();
  });

  /*** Others ***/
  function toggleDetails(): void {
    if (guard) { return; }
    guard = true;
    if (isOpen) {
      open = true;
    } else {
      sleep(duration).then(() => open = false);
    }
    sleep(duration).then(() => guard = false);
  }

  /*** Handle events ***/
  function updateIsOpen(): void {
    let tmp = !isOpen;
    group.forEach((_,i) => group[i] = false);
    isOpen = tmp;
  }
</script>

<!---------------------------------------->

<details class={getJoinStyle(getWholeStyle(myStyle), fixedStyle)} open={open}>
  <summary class={getJoinStyle(getLabelStyle(myStyle), sizeStyle, flexStyle, summaryStyle)} onclick={prevent(updateIsOpen)}>
    {#if isStrLabel}
      <span class={labelStyle}>
        {label}
      </span>
    {:else}
      {@render label()}
    {/if}
  </summary>
  {#if isOpen}
    <div class={contentSize} transition:slide={{ duration: duration }}>
      {@render children()}
    </div>
  {/if}
</details>
