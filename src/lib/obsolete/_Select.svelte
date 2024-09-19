<script context="module" lang="ts">
  /*** Export ***/
  export type Props = {
    items: SelectItem[],
    value?: Primitive,
    placeholder?: string,
    style?: StylePartsPartial,
  }
  export function getSelectItem(label: string, value?: Primitive): SelectItem {
    const ret: SelectItem = { label: label };
    if (value !== undefined) { ret.value = value; }
    return ret;
  }

  /*** Styling ***/
  export function styleSelect({
    size = EStyleSize.md,
    mergin = "my-1",
    bgcolor = "",
    border = "",
    bdwidth = "border-b",
    bdcolor = "border-black",
    bdround = "",
    txtcolor = "text-black",
    txtbold = "",
    txtitalic = "",
    others = "",
  }): StylePartsPartial { return getPartsStyle({size, mergin, bgcolor, border, bdwidth, bdcolor, bdround, txtcolor, txtbold, txtitalic, others}); }
  function getSizeStyle(size: EStyleSize): [string, string] {
    switch (size) {
      case EStyleSize.xs: return ["h-6 pr-5", "top-2.5 right-1.5"];
      case EStyleSize.sm: return ["h-7 pr-6", "top-3 right-2"];
      case EStyleSize.md: return ["h-8 pr-6", "top-3.5 right-2"];
      case EStyleSize.lg: return ["h-9 pr-6", "top-4 right-2"];
      case EStyleSize.xl: return ["h-9 pr-6", "top-4 right-2"];
    }
  }
  const placeholderStyle: string = "text-zinc-400";
  const wrapStyle: string = "relative";
  const fixedStyle: string = "pb-1 pt-0.5 bg-inherit appearance-none cursor-pointer focus:outline-none"
  const svgStyle: string = "w-3 h-3 pointer-events-none absolute";

  /*** Others ***/
  type SelectItem = { label: string, value?: Primitive };

  /*** import ***/
  import { EStyleSize } from "$lib/obsolete/constants"
  import { getPartsStyle, mergeStyle, getJoinStyle, addStyle, once } from "$lib/obsolete/gfunctions";
</script>

<!---------------------------------------->

<script lang="ts">
  let { items = $bindable(), value = $bindable(), placeholder, style }:Props = $props();

  /*** Initialize ***/
  const stdStyle = mergeStyle(styleSelect({}), style) as StylePartsPartial;
  const initStyle = addStyle({...stdStyle}, "txtcolor", placeholderStyle);
  let myStyle: StylePartsPartial = $state.frozen(initStyle);
  const [sizeStyle, svgSizeStyle]: [string, string] = getSizeStyle(myStyle.size);
  const showPlaceholder: boolean = placeholder !== undefined;

  /*** Others ***/
  /*** Handle events ***/
  function onchange(evt: Event): void { myStyle = stdStyle; }

</script>

<!---------------------------------------->

<fieldset class={wrapStyle}>
  <select class={getJoinStyle(myStyle, sizeStyle, fixedStyle)} bind:value={value} onchange={once(onchange)}>
    {#if showPlaceholder}
      <option hidden value={undefined}>{placeholder}</option>
    {/if}
    {#each items as item}
      <option class={stdStyle.txtcolor} value={item.value} selected={item.value === value ? true : undefined}>{item.label}</option>
    {/each}
  </select>
  <svg class={getJoinStyle({}, svgStyle, svgSizeStyle)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" focusable="false" aria-hidden="true">
    <path fill="#4b4b4b" d="m440.189 92.085-184.17 184.17L71.83 92.085 0 163.915l256.019 256 255.981-256z"/>
  </svg>
</fieldset>
