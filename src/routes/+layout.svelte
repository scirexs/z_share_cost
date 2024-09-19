<script module>
  import "../app.css";
  import LogoMark from "$lib/icon/LogoMark.svelte";
  import LogoString from "$lib/icon/LogoString.svelte";
</script>

<header class="h-8 pl-3 bg-charline flex items-center gap-3">
  <LogoMark />
  <LogoString />
</header>

<main>
  <slot />
</main>
