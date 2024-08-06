<script context="module" lang="ts">
  export type Props = {
    panelPosition: PanelPosition,
    title: string,
    placeholder: string,
    hint: string,
    wholeStyle?: TagInputStyle,
  };
  export const enum PanelPosition {
    Top,
    Bottom,
    Left,
    Right,
  }
  export type TagInputStyle = {
    body: string,
    title: string,
    input: string,
    inputset: string,
    hint: string,
    panel: string,
    tag: TagStyle,
  }
  import type { ComponentProps } from "svelte";
  import type { Tag, TagStyle } from "$lib/zTagPanel.svelte";
  import { InputType, type InputMode, type TextBoxStyle } from "$lib/zTextBox.svelte";
  import TagPanel from "$lib/zTagPanel.svelte";
  import TextBox from "$lib/zTextBox.svelte";
  class MyStyle {
    // static defStyle: TagInputStyle = {
    //   body: "my-2",
    //   title: "text-sm",
    //   input: "border-0 focus:outline-none",
    //   inputset: "border-b border-black w-fit",
    //   hint: "text-sm leading-4 text-gray-400",
    //   panel: "",
    //   tag: {
    //     body: "",
    //     cross: "",
    //   }
    // }

    style: TagInputStyle | undefined;
    isLeftSide: boolean;
    isHorizontal: string | undefined;
    constructor(panelPosition: PanelPosition, wholeStyle?: TagInputStyle) {
      this.style = wholeStyle;
      this.isLeftSide = panelPosition === PanelPosition.Top || panelPosition === PanelPosition.Left;
      this.isHorizontal = panelPosition === PanelPosition.Top || panelPosition === PanelPosition.Bottom ? undefined : "flex";
    }
  }
  // TODO: bubbling tag values
</script>

<!---------------------------------------->

<script lang="ts">
  let { panelPosition, title, placeholder, hint, wholeStyle }: Props = $props();

  /*** Initialize ***/
  const myStyle: MyStyle = new MyStyle(panelPosition, wholeStyle);
  const delimiter: string[] = ["Enter"];
  let tags: Tag[] = $state([]);
  let value: string = $state("");
  let nextId: number = 0;
  // tags.map(x => x.tagText);

  /*** Others ***/
  function getTag(text: string): Tag {
    return {
      tagId: nextId,
      tagText: text,
      eachStyle: myStyle.style?.tag,
    }
  }
  function setTag(): void {
    tags.push(getTag(value));
    nextId += 1;
    value = "";
  }

  /*** Handle events ***/
  const keyFunc = (key: string) => {
    if (delimiter.includes(key)) {
      setTag();
    }
  };
</script>

<!---------------------------------------->

<div>
  <fieldset class={myStyle.isHorizontal}>
    {#if myStyle.isLeftSide}
      <TagPanel bind:tags={tags} isRemovable={true} />
    {/if}
    <TextBox bind:value={value} {title} {placeholder} {hint} clearable={true} {keyFunc} />
    {#if !myStyle.isLeftSide}
      <TagPanel bind:tags={tags} isRemovable={true} />
    {/if}
  </fieldset>
</div>
