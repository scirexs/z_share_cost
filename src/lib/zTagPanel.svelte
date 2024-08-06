<script context="module" lang="ts">
  export type Props = {
    tags: Tag[],
    isRemovable: boolean,
    wholeStyle?: string,
  };
  export type Tag = {
    tagId: number,
    tagText: string,
    eachStyle?: TagStyle,
  };
  export type TagStyle = {
    body: string,
    cross: string,
  };

  class MyStyle {
    static defStyle = {
      list: "flex flex-row flex-wrap items-center gap-1 mx-1 content-center",
      body: "bg-gray-300 border-none rounded-full px-3 py-1 h-fit w-fit text-sm items-center font-bold",
      cross: "bg-transparent border-none hover:text-red-600",
    }
    static setDefaultForEach(ary: Tag[]) {
      ary.forEach((x) => x.eachStyle = x.eachStyle ?? MyStyle.defStyle);
    }

    style: string;
    isRemovable: boolean;
    constructor(isRemovable: boolean, wholeStyle?: string) {
      this.style = wholeStyle ?? MyStyle.defStyle.list;
      this.isRemovable = isRemovable;
    }
  }
  // TODO: Add body click event
  // TODO: Add img icon
</script>

<!---------------------------------------->

<script lang="ts">
  let { tags = $bindable(), isRemovable, wholeStyle }: Props = $props();

  /*** Initialize ***/
  const myStyle: MyStyle = new MyStyle(isRemovable, wholeStyle);
  MyStyle.setDefaultForEach(tags);

  /*** Others ***/

  /*** Handle events ***/
  function removeTag(id: number): void {
    const idx = tags.findIndex((x) => {
      return x.tagId === id;
    });
    tags = tags.toSpliced(idx, 1);
  }
</script>

<!---------------------------------------->

{#snippet Tag(x)}
  <li class={x.eachStyle ? x.eachStyle.body : MyStyle.defStyle.body}>
    {x.tagText}
    {#if myStyle.isRemovable}
      <button class={x.eachStyle ? x.eachStyle.cross : MyStyle.defStyle.cross} type="button" onclick={() => removeTag(x.tagId)}>×</button>
    {/if}
  </li>
{/snippet}

<ul class={myStyle.style}>
  {#each tags as tag}
    {@render Tag(tag)}
  {/each}
</ul>
