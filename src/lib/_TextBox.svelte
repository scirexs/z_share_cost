<script context="module" lang="ts">
  /*** Export ***/
  export type Props = {
    prefix?: Snippet,
    suffix?: Snippet,
    value?: string,
    placeholder?: string,
    isClearable?: boolean,
    inputMode?: InputMode,
    autoComplete?: string,
    onKeyDown?: (key: string) => void,
    onInput?: (target: EventTarget & HTMLInputElement) => void,
    onChange?: (target: EventTarget & HTMLInputElement) => void,
    style?: StylePartsPartial,
  };
  export const enum InputMode {
    text,
    username,
    email,
    tel,
    url,
    digit,
    money,
  }

  /*** Styling ***/
  export function styleTextBox({
    size = EStyleSize.md,
    mergin = "",
    bgcolor = "",
    border = "",
    bdwidth = "border-b",
    bdcolor = "border-black",
    bdround = "",
    txtcolor = "",
    txtbold = "",
    txtitalic = "",
    others = "w-40",
  }): StylePartsPartial { return getPartsStyle({size, mergin, bgcolor, border, bdwidth, bdcolor, bdround, txtcolor, txtbold, txtitalic, others}); }
  const fixedStyle: string = "h-fit";
  const flexStyle: string = "inline-flex flex-row flex-nowrap justify-center items-center gap-1";
  const inputStyle: string = "focus:outline-none w-full bg-inherit";
  const svgStyle: string = "fill-black/70 hover:fill-black";

  /*** Others ***/
  type InputAttr = {
    type: string,
    inputmode: "text" | "email" | "tel" | "url" | "numeric" | "decimal" | "none" | "search" | null | undefined,
    name: string | undefined,
    autocomplete: string | undefined,
  };
  function getInputAttr(mode?: InputMode, ac?: string): InputAttr {
    if (mode === undefined) { mode = InputMode.text; }
    switch (mode) {
      case InputMode.text: return {type: "text", inputmode: undefined, name: undefined, autocomplete: ac};
      case InputMode.username: return {type: "text", inputmode: "email", name: "username", autocomplete: ac ? ac : "username"};
      case InputMode.email: return {type: "email", inputmode: "email", name: "email", autocomplete: ac ? ac : "email"};
      case InputMode.tel: return {type: "tel", inputmode: "tel", name: "tel", autocomplete: ac ? ac : "tel"};
      case InputMode.url: return {type: "url", inputmode: "url", name: undefined, autocomplete: ac};
      case InputMode.digit: return {type: "text", inputmode: "numeric", name: undefined, autocomplete: ac};
      case InputMode.money: return {type: "text", inputmode: "decimal", name: undefined, autocomplete: ac};
    }
  }

  /*** import ***/
  import type { Snippet } from "svelte";
  import { EStyleSize } from "$lib/constants"
  import { getPartsStyle, mergeStyle, getJoinStyle } from "$lib/gfunctions";
</script>

<!---------------------------------------->

<script lang="ts">
  let { prefix, suffix, value = $bindable(""), placeholder, isClearable, inputMode, autoComplete, onKeyDown, onInput, onChange, style }:Props = $props();

  /*** Initialize ***/
  const myStyle: StylePartsPartial = mergeStyle(styleTextBox({}), style) as StylePartsPartial;
  let displayButton = $state("invisible");
  const showPrefix: boolean = prefix !== undefined;
  const showSuffix: boolean = suffix !== undefined;
  const showButton: boolean = isClearable ? isClearable : false;
  const { type, inputmode, name, autocomplete } = getInputAttr(inputMode, autoComplete);
  let textBox: HTMLInputElement;
  let focus: boolean = false;
  let over: boolean = false;
  let disableEvent: boolean = false;

  /*** Others ***/
  function toggleButton(): void {
    if (!value) {
      displayButton = "invisible";
    } else {
      if (focus || over) {
        displayButton = "visible";
      } else {
        displayButton = "invisible";
      }
    }
  }

  /*** Handle events ***/
  function onfocusin(): void { focus = true; toggleButton(); }
  function onfocusout(): void { focus = false; toggleButton(); }
  function onmouseenter(): void { over = true; toggleButton(); }
  function onmouseleave(): void { over = false; toggleButton(); }
  function oncompositionstart(): void { disableEvent = true; }
  function oncompositionend(): void { disableEvent = false; }
  function oninput(evt: Event & { currentTarget: EventTarget & HTMLInputElement; }): void { toggleButton(); if (onInput && !disableEvent) {onInput(evt.currentTarget);}}
  const onkeydown = onKeyDown ? (evt: { key: string; }) => { if (!disableEvent) {onKeyDown(evt.key);} } : undefined;
  const onchange = onChange ? (evt: Event & { currentTarget: EventTarget & HTMLInputElement; }) => { if (!disableEvent) {onChange(evt.currentTarget);} } : undefined;
  function clearValue(): void {
    value = "";
    textBox.focus();
  }
</script>

<!---------------------------------------->

<fieldset class={getJoinStyle(myStyle, flexStyle, fixedStyle)} {onfocusin} {onfocusout} {onmouseenter} {onmouseleave}>
  {#if showPrefix}
    {@render prefix!()}
  {/if}
  <input class={inputStyle} bind:this={textBox} bind:value={value} {type} {placeholder} {inputmode} {name} {autocomplete} {oninput} {onkeydown} {onchange} {oncompositionstart} {oncompositionend} />
  {#if showButton}
    <button class={displayButton} type="button" onclick={clearValue}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="8" height="8" aria-hidden="true">
        <rect fill="transparent"></rect>
        <path class={svgStyle} d="M511.998 70.682 441.315 0 256.002 185.313 70.685 0 .002 70.692l185.314 185.314L.002 441.318 70.69 512l185.312-185.312L441.315 512l70.683-70.682-185.314-185.312z"/>
      </svg>
    </button>
  {/if}
  {#if showSuffix}
    {@render suffix!()}
  {/if}
</fieldset>

