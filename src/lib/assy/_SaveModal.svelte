<script module lang="ts">
  /*** Export ***/
  export type Props = {
    open: boolean,  // bindable
    data: string,  // bindable
    template: string,
  };

  /*** Others ***/
  const replaceString = "$replace$";
  const duration = 1000;
  const ICON_FORM = {
    INIT: 0,
    OK: 1,
    NG: -1,
  } as const;

  /*** import ***/
  import { untrack } from "svelte";
  import { sleep, copyToClipboard, encodeDeflateString } from "$lib/util";
  import Modal from "$lib/comp/_Modal.svelte";
  import TextField from "$lib/comp/_TextField.svelte";
  import Copy from "$lib/icon/_Copy1.svelte";
  import Check from "$lib/icon/_Check1.svelte";
  import Cross from "$lib/icon/_Cross1.svelte";
</script>

<!---------------------------------------->

<!-- svelte-ignore non_reactive_update -->
<script lang="ts">
  let { open = $bindable(), data = $bindable(), template }: Props = $props();

  /*** Initialize ***/
  const attributes = {readonly: true};
  const events = {onclick: selectAll};
  let element: HTMLInputElement | HTMLTextAreaElement | undefined = $state();
  let encoding: Promise<string> = $state(new Promise(()=>""));
  let icon = $state(0);

  /*** Sync with outside ***/
  $effect.pre(() => { open;
    untrack(()=>{ getEncodeString(); });
  });

  /*** Styling ***/
  const styleCopy = "h-5 w-5 fill-neutral-500";
  const styleCheck = "h-5 w-5 fill-active";
  const styleCross = "h-5 w-5 fill-invalid";
  const styleTextField: DefineStyle = {
    whole: { margin: "m-2" },
    middle: {
      margin: "",
      padding: "p-1",
      gap: "gap-1",
      border_radius: "rounded-md",
      border_width: "border",
      border_color: "border-neutral-500",
      background_color: "bg-white",
    },
    main: {
      width: "w-44",
      flex_grow: "grow-0",
      color: "text-black",
    },
    top: {
      margin: "mb-2",
      display: "flex",
      justify_content: "justify-center",
    },
    label: {
      font_size: "text-xl",
      font_weight: "bold",
    },
  }

  /*** Status ***/

  /*** Validation ***/

  /*** Others ***/
  async function getEncodeString() {
    if (!open) { return; }
    encoding = encodeDeflateString(data);
  }

  /*** Handle events ***/
  function selectAll(ev: Event) {
    element?.select();
  }
  function onclickF(text: string):(ev: Event) => void {
    return (ev: Event) => {
      copyToClipboard(text)
        .then(() =>  { icon = ICON_FORM.OK; })
        .catch(() => { icon = ICON_FORM.NG; })
        .finally(() => { sleep(duration).then(() => icon = ICON_FORM.INIT); });
    };
  }
</script>

<!---------------------------------------->

<Modal bind:open>
  {#await encoding}
    <div class="m-2 flex justify-center items-center">
      Now loading...
    </div>
  {:then result}
    {@const text = template.replace(replaceString, result)}
    <TextField label="Save status" value={text} style={styleTextField} {events} {attributes} bind:element>
      {#snippet right()}
        <button class="p-1 border-neutral-500 bg-white" type="button" onclick={onclickF(text)}>
          {#if icon === ICON_FORM.INIT}
            <Copy style={styleCopy} />
          {:else if icon === ICON_FORM.OK}
            <Check style={styleCheck} />
          {:else}
            <Cross style={styleCross} />
          {/if}
        </button>
      {/snippet}
    </TextField>
  {/await}
</Modal>
