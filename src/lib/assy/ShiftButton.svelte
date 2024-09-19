<script module lang="ts">
  type Props = {
    text: string,
    next: boolean,
    enable?: boolean,
    onclick: (ev: Event) => void,
  };

  import { STATE } from "$lib/const";
  import Button from "$lib/comp/_Button.svelte";
  import Arrow1 from "$lib/icon/_Arrow1.svelte";
</script>

<!---------------------------------------->

<script lang="ts">
  let { text, next, enable = true, onclick }: Props = $props();

  /*** Initialize ***/

  /*** Styling ***/

  /*** Others ***/

  /*** Handle events ***/
</script>

<!---------------------------------------->

{#if next}
  <Button status={enable ? STATE.DEFAULT : STATE.DISABLE} {onclick}>
    <!-- svelte-ignore block_empty -->
    {#snippet left()} {/snippet}
    {text}
    {#snippet right()}
      <Arrow1 style="fill-canvas" />
    {/snippet}
  </Button>
{:else}
  <Button status={STATE.CUSTOM1} {onclick}>
    {#snippet left()}
      <Arrow1 style="fill-inactive rotate-180" />
    {/snippet}
    {text}
  </Button>
{/if}
