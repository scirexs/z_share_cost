<script context="module" lang="ts">
  /*** Export ***/
  export interface Props {
    active?: number,
    labels?: string[],
    disable?: boolean,
    layout?: StyleLayoutPartial,
    style?: StylePartsPartial,
    activeStyle?: StylePartsPartial,
    frameStyle?: StylePartsPartial,
    [key: string]: unknown | Snippet,
  };

  /*** Styling ***/
  export function layoutTabs({
    direction = EStyleFlexDirection.row,
    flexibility = EStyleFlexibility.none,
    wrap = EStyleFlexWrap.nowrap,
    mainpos = EStyleFlexAlignMainAxis.start,
    crosspos = EStyleFlexAlignCrossAxis.center,
    gap = "gap-0",
    others = "",
  }): StyleLayoutPartial { return getLayoutStyle({direction, flexibility, wrap, mainpos, crosspos, gap, others}); }
  export function styleTabs({
    size = EStyleSize.md,
    mergin = "m-1",
    bgcolor = "",
    border = "",
    bdwidth = "border-b-2",
    bdcolor = "",
    bdround = "",
    txtcolor = "",
    txtbold = "",
    txtitalic = "",
    others = "hover:text-zinc-600",
  }): StylePartsPartial { return getPartsStyle({size, mergin, bgcolor, border, bdwidth, bdcolor, bdround, txtcolor, txtbold, txtitalic, others}); }
  export function styleActive({
    mergin = "",
    bgcolor = "",
    border = "",
    bdwidth = "border-b-2",
    bdcolor = "border-blue-600",
    bdround = "",
    txtcolor = "text-blue-600",
    txtbold = "",
    txtitalic = "",
    others = "",
  }): StylePartsPartial { return getPartsStyle({mergin, bgcolor, border, bdwidth, bdcolor, bdround, txtcolor, txtbold, txtitalic, others}); }
  export function styleFrame({
    mergin = "-mt-0.5",
    bgcolor = "",
    border = "",
    bdwidth = "border-t-2",
    bdcolor = "",
    bdround = "",
    txtcolor = "",
    txtbold = "",
    txtitalic = "",
    others = "p-2",
  }): StylePartsPartial { return getPartsStyle({mergin, bgcolor, border, bdwidth, bdcolor, bdround, txtcolor, txtbold, txtitalic, others}); }
  function getWholeStyle(style: StylePartsPartial): StylePartsPartial {
    return filter(style, ["mergin"]);
  }
  function getLabelStyle(style: StylePartsPartial): StylePartsPartial {
    return filter(style, ["bgcolor","border","bdwidth","bdcolor","bdround","txtcolor","txtbold","txtitalic","others"]);
  }
  function getActiveStyle(style: StylePartsPartial): StylePartsPartial {
    return filter(style, ["bgcolor","border","bdwidth","bdcolor","bdround","txtcolor","txtbold","txtitalic","others"]);
  }
  function getFrameStyle(style: StylePartsPartial): StylePartsPartial {
    return filter(style, ["mergin","bgcolor","border","bdwidth","bdcolor","bdround","txtcolor","txtbold","txtitalic","others"]);
  }
  function getSizeStyle(size: EStyleSize): string {
    switch (size) {
      case EStyleSize.xs: return "text-sm px-2 min-h-6";
      case EStyleSize.sm: return "text-sm px-3 min-h-8";
      case EStyleSize.md: return "text-base px-4 min-h-10";
      case EStyleSize.lg: return "text-lg px-5 min-h-12";
      case EStyleSize.xl: return "text-xl px-6 min-h-14";
    }
  }  // [sizeStyle, svgStyle]
  const fixedStyle: string = "truncate transition duration-200";
  const flexStyle: string = "flex";
  const frameFixedStyle: string = "";

  /*** Others ***/
  type RestSnippets = Record<string, Snippet>;
  type RestArgs = Record<string, unknown>;
  const labelName = "tabLabel";
  const panelName = "tabPanel";

  /*** import ***/
  import type { Snippet } from "svelte";
  import { EStyleSize, EStyleFlexDirection, EStyleFlexibility, EStyleFlexWrap, EStyleFlexAlignMainAxis, EStyleFlexAlignCrossAxis } from "$lib/constants"
  import { getPartsStyle, getLayoutStyle, mergeStyle, getJoinStyle, isSnippet, filter } from "$lib/gfunctions";
</script>

<!---------------------------------------->

<script lang="ts">
  let { active = $bindable(0), labels = [], disable = false, layout, style, activeStyle, frameStyle, ...rest }: Props = $props();

  /*** Styling ***/
  const myLayout: StyleLayoutPartial = mergeStyle(layoutTabs({}), layout) as StyleLayoutPartial;
  const myStyle: StylePartsPartial = mergeStyle(styleTabs({}), style) as StylePartsPartial;
  const actStyle: StylePartsPartial = mergeStyle(styleActive({}), activeStyle) as StylePartsPartial;
  const frmStyle: StylePartsPartial = mergeStyle(styleFrame({}), frameStyle) as StylePartsPartial;
  const sizeStyle: string = getSizeStyle(myStyle.size);

  /*** Initialize ***/
  const snippets: RestSnippets = getSnippets(rest);
  const isStrLabel = labels.length > 0;
  if (!isStrLabel) { labels = getSnippetKeysFromName(labelName); }
  const panels: string[] = getSnippetKeysFromName(panelName);

  /*** Sync ***/
  /*** Others ***/
  function getSnippets(rest: RestArgs): RestSnippets {
    let ret: RestSnippets = {};
    for (const key of Object.keys(rest)) {
      if (isSnippet(rest[key], key)) {
        ret[key] = rest[key] as Snippet;
      }
    }
    return ret;
  }
  function getSnippetKeysFromName(name: string): string[] {
    return Object.keys(snippets).filter(x => x.startsWith(name));
  }

  /*** Handle events ***/
  function switchTab(index: number): void {
    active = index;
  }
</script>

<!---------------------------------------->

<div class={getJoinStyle(getWholeStyle(myStyle))}>
  <ul class={getJoinStyle(myLayout, flexStyle)}>
    {#each labels as label, i}
      {#if i === active}
        <li>
          <button class={getJoinStyle(getActiveStyle(actStyle), sizeStyle, fixedStyle)} onclick={disable ? ()=>{} : () => switchTab(i)} type="button">
            {#if isStrLabel}
              {label}
            {:else}
              {@render snippets[label]()}
            {/if}
          </button>
        </li>
      {:else}
        <li>
          <button class={getJoinStyle(getLabelStyle(myStyle), sizeStyle, fixedStyle)} onclick={disable ? ()=>{} : () => switchTab(i)} type="button">
            {#if isStrLabel}
              {label}
            {:else}
              {@render snippets[label]()}
            {/if}
          </button>
        </li>
      {/if}
    {/each}
  </ul>
  <div class={getJoinStyle(getFrameStyle(frmStyle), frameFixedStyle)}>
    {@render snippets[panels[active]]()}
  </div>
</div>
