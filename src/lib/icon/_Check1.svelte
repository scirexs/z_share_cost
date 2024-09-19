<script module lang="ts">
  /*** Export ***/
  export type Props = {
    style?: string,  // bindable
    attributes?: HTMLAttributes<SVGSVGElement>,
  };

  /*** import ***/
  import type { HTMLAttributes } from "svelte/elements";
  import { stdCheck1 } from "$lib/style";
</script>

<!---------------------------------------->

<script lang="ts">
  let { style = $bindable(stdCheck1), attributes }: Props = $props();
</script>

<!---------------------------------------->

<svg class={style} viewBox="0 0 512 512" {...attributes}>
  <rect fill="transparent" />
  <path d="M440.469 73.413 218.357 295.525 71.531 148.709 0 220.229l146.826 146.826 71.531 71.532 71.521-71.532L512 144.945z"/>
</svg>
