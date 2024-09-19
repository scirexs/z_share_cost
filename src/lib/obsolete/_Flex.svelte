<script context="module" lang="ts">
  /*** Export ***/
  export type Props = {
    children: Snippet,
    style?: StyleLayoutPartial,
  };

  /*** Styling ***/
  export function styleFlex({
    direction = EStyleFlexDirection.row,
    flexibility = EStyleFlexibility.none,
    wrap = EStyleFlexWrap.wrap,
    mainpos = EStyleFlexAlignMainAxis.start,
    crosspos = EStyleFlexAlignCrossAxis.center,
    gap = "gap-1",
    others = "",
  }): StyleLayoutPartial { return getLayoutStyle({direction, flexibility, wrap, mainpos, crosspos, gap, others}); }
  const fixedStyle: string = "h-fit w-fit";
  const flexStyle: string = "flex";

  /*** Others ***/
  /*** import ***/
  import type { Snippet } from "svelte";
  import { EStyleFlexDirection, EStyleFlexibility, EStyleFlexWrap, EStyleFlexAlignMainAxis, EStyleFlexAlignCrossAxis } from "$lib/obsolete/constants"
  import { getLayoutStyle, mergeStyle, getJoinStyle } from "$lib/obsolete/gfunctions";
</script>

<!---------------------------------------->

<script lang="ts">
  const { children, style }:Props = $props();

  /*** Initialize ***/
  const myStyle: StyleLayoutPartial = mergeStyle(styleFlex({}), style) as StyleLayoutPartial;

  /*** Others ***/
  /*** Handle events ***/
</script>

<!---------------------------------------->

<div class={getJoinStyle(myStyle, flexStyle, fixedStyle)}>
  {@render children()}
</div>
