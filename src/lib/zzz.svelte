<script module lang="ts">
  /*** Export ***/

  /*** Others ***/

  /*** import ***/
  import TextField from "./comp/_TextField.svelte";
	import { emptyTest } from "./util";
</script>

<!---------------------------------------->

<script lang="ts">
  let test = $state.raw(emptyTest);
  function validation(value: string, auto?: boolean): [boolean, string?] {
    const num = Number.parseInt(value.trim());
    if (Number.isNaN(num)) { return [false, "Amount must be number"]; }
    if (num <= 0)          { return [false, "Amount must be greater than 0"]; }
    if (num > 1000000)     { return [false, "Amount must be less than a million"]; }
    return [true];
  }
</script>

<TextField label="Test" bind:test {validation} />
