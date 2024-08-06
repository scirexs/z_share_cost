<script context="module" lang="ts">
  /*** Export ***/
  // export type Props = {
  //   title: string,
  //   contents: Snippet<{subtitle: string, items: {label: string, src: string}[]}[]>,
  //   pages: {title: string, contents: Snippet}[],
  // };
	export const ListItem = createRawSnippet((texta: () => number) => {
		return {
			render: () => `
				<li>${texta()}</li>
			`,
			setup: (li) => {
				$effect(() => {
					li.textContent = `${texta()}`;
				});
			}
		};
	});
  /*** Styling ***/
  /*** Others ***/
  /*** import ***/
  // import type {Snippet} from "svelte";
	import { createRawSnippet } from 'svelte';
</script>

<!---------------------------------------->

<script lang="ts">
  // const { title, contents }: Props = $props();
  let foo = test;

  /*** Styling ***/
  /*** Initialize ***/
  /*** Sync ***/
  /*** Others ***/
  /*** Handle events ***/
</script>

<!---------------------------------------->

{@render foo()}

{#snippet test()}
  <p>this is test</p>
{/snippet}