<script context="module" lang="ts">
  export type Props = {
    title: string,
    value: string,
    clearable: boolean,
    placeholder: string,
    hint: string,
    inputType?: InputType,
    inputMode?: InputMode,
    keyFunc?: (str: string) => void,
    wholeStyle?: TextBoxStyle,
  };
  export type TextBoxStyle = {
    body: string,
    title: string,
    input: string,
    inputset: string,
    hint: string,
  };
  export const enum InputType {
    text = "text",
    email = "email",
    password = "password",
    tel = "tel",
    url = "url",
    search = "search",
    date = "date",
    time = "time",
    datetime = "datetime-local",
  }
  export const enum InputMode {
    standard = "text",
    digit = "numeric",
    money = "decimal",
    none = "none",
  }
  import { genUUID } from "$lib/gfunctions";

  class MyStyle {
    static defStyle: TextBoxStyle = {
      body: "my-2 content-center w-40 shrink-0",
      title: "text-sm",
      input: "border-0 focus:outline-none w-32",
      inputset: "flex-nowrap border-b border-black w-fit",
      hint: "text-sm leading-4 text-gray-400",
    }

    style: TextBoxStyle;
    showTitle: boolean;
    showClearButton: boolean;
    showHintArea: boolean;
    constructor(title: string, clearable: boolean, hint: string, wholeStyle?: TextBoxStyle) {
      this.style = wholeStyle ?? MyStyle.defStyle;
      this.showTitle = title !== "";
      this.showClearButton = clearable;
      this.showHintArea = hint !== "";
    }
  }
  class ButtonStatus {
    static on = "visible";
    static off = "invisible";

    #onFieldset: boolean = false;
    #onFocus: boolean = false;
    #visible = $state(ButtonStatus.off);
    toggleButton(value: string) {
      if (value === "") {
        this.#visible = ButtonStatus.off;
      } else {
        if (this.#onFieldset || this.#onFocus) {
          this.#visible = ButtonStatus.on;
        } else {
          this.#visible = ButtonStatus.off;
        }
      }
    }
    get visible() { return this.#visible; }
    set onFieldset(v: boolean) { this.#onFieldset = v; }
    set onFocus(v: boolean) { this.#onFocus = v; }
  }
  // TODO: textbox template (ex. std, email, pass, username, etc.)
  // TODO: input validation
  // TODO: auto transform
  // TODO: custom auto complete
  // TODO: prefix, suffix
</script>

<!---------------------------------------->

<script lang="ts">
  let {title, value = $bindable(), clearable, placeholder, hint, inputType, inputMode, keyFunc, wholeStyle}:Props = $props();

  /*** Initialize ***/
  const myStyle: MyStyle = new MyStyle(title, clearable, hint, wholeStyle);
  const myId: string | undefined = myStyle.showClearButton ? genUUID() : undefined;
  let bStat: ButtonStatus = new ButtonStatus();

  /*** Others ***/

  /*** Handle events ***/
  function onfocusin(): void { bStat.onFocus = true; bStat.toggleButton(value); }
  function onfocusout(): void { bStat.onFocus = false; bStat.toggleButton(value); }
  function onmouseenter(): void { bStat.onFieldset = true; bStat.toggleButton(value); }
  function onmouseleave(): void { bStat.onFieldset = false; bStat.toggleButton(value); }
  function oninput(): void { bStat.toggleButton(value); }
  function onkeyup(e: { key: string; }) {
    if (keyFunc !== undefined) {
      keyFunc(e.key);
    }
  }
  function clearInputValue(): void {
    value = "";
    document.getElementById(myId!)?.focus();
  }
</script>

<!---------------------------------------->

<div class={myStyle.style.body}>
  <fieldset class={myStyle.style.inputset} {onfocusin} {onfocusout} {onmouseenter} {onmouseleave}>
    {#if myStyle.showTitle}
      <legend class={myStyle.style.title}>{title}</legend>
    {/if}
    <input class={myStyle.style.input} bind:value={value} id={myId} type={inputType} inputmode={inputMode} {placeholder} {oninput} {onkeyup} />
    {#if myStyle.showClearButton}
      <button class={bStat.visible} type="button" onclick={clearInputValue}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 25" width="15" height="15"><path fill="none" d="M0 0h25v25H0z" pointer-events="none"/><path fill="#d1d5db" d="M12.417-.083c6.9 0 12.5 5.6 12.5 12.5s-5.6 12.5-12.5 12.5-12.5-5.6-12.5-12.5 5.6-12.5 12.5-12.5z" class="st0"/><path fill="#fff" d="M18.75 8.673 16.327 6.25l-3.834 3.82-3.82-3.82L6.25 8.673l3.82 3.834-3.82 3.82 2.423 2.423 3.82-3.82 3.834 3.82 2.423-2.423-3.82-3.82Z" class="st0"/></svg>
      </button>
    {/if}
  </fieldset>
  {#if myStyle.showHintArea}
    <div class={myStyle.style.hint}>{hint}</div>
  {/if}
</div>
