<script context="module" lang="ts">
  /*** Export ***/
  /*** Styling ***/
  /*** Others ***/
  type EachItem = { id: string, text: string, active: boolean };

  /*** import ***/
  import ChipInput from "$lib/obsolete/ChipInput.svelte";
  import SelectPanel from "$lib/obsolete/SelectPanel.svelte";
</script>

<!---------------------------------------->

<script lang="ts">
  /*** Initialize ***/
  let items: EachItem[] = $state([]);
  let selectItems: string[] = $state([]);

  /*** Others ***/
  /*** Handle events ***/
</script>

<!---------------------------------------->

<ChipInput bind:items />
<SelectPanel bind:items />
