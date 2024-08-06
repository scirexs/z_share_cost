<script context="module" lang="ts">
  // 枠組
    // 枠線
    // バックグラウンド
    // ラベル
  // 内部
    // 上部タグ描画領域
    // 左タグ描画領域
    // テキスト入力領域
      // プレースホルダー
      // 確定操作
    // 右タグ描画領域
    // 下部タグ描画領域
  // タグ
    // 枠線
    // バックグラウンド
    // 値
    // 削除ボタン
    import type { ComponentProps } from "svelte";
    import { EStyleFlexDirection, EStyleFlexAlignCrossAxis, EStyleSize } from "$lib/constants";
    import { incrementer, prevent, sleep } from "$lib/gfunctions";
    import ZZZ from "$lib/zzz.svelte";
    import Chip, { styleChip } from "$lib/_Chip.svelte";
    import Flex, { styleFlex } from "$lib/_Flex.svelte";
    import TextBox from "$lib/_TextBox.svelte";
    import Button from "$lib/_Button.svelte"
    import Select, { getSelectItem, styleSelect } from "$lib/_Select.svelte"
    import Toggle, { styleToggle } from "$lib/_Toggle.svelte";
    import InputForm from "$lib/InputForm.svelte";
    import Accordion, {styleAccordion} from "$lib/_Accordion.svelte";
    import { slide } from 'svelte/transition';
    import { quintOut } from 'svelte/easing';
    import Tabs, { styleTabs } from "$lib/_Tabs.svelte";
    import Descriptor from "$lib/_Descriptor.svelte";
</script>
<script lang="ts">
  const labels = ["tab1", "tab2", "tab3"];
  const items = [getSelectItem("label1", 1), getSelectItem("label2", 2), getSelectItem("label3", 3)];
</script>


<!-- <Tabs {labels} style={styleTabs({size: EStyleSize.md})}>
  {#snippet tabPanel1()}
    <p>foo</p>
  {/snippet}
  {#snippet tabPanel2()}
    <ul>
      <li>bar</li>
      <li>bar</li>
      <li>bar</li>
    </ul>
  {/snippet}
  {#snippet tabPanel3()}
    <h3>baz</h3>
    <hr>
    <button type="button">baz</button>
  {/snippet}
</Tabs> -->
<!-- <Accordion label="Single test">
  Lorem ipsum dolor sit amet lorem et lorem ipsum lorem dolor ea nibh sed. Magna ea et kasd ut elitr vero exerci diam et ipsum dolore consetetur stet gubergren. Dolor aliquyam vel autem sed takimata vulputate stet suscipit et invidunt molestie et elitr dolor. Ut ea iriure sadipscing dolore. Erat stet ipsum nonummy sea no lorem accusam.
</Accordion> -->
<!-- <InputForm /> -->
<!-- <Toggle style={styleToggle({size: EStyleSize.md})}>あ</Toggle> -->
<Select placeholder="Select here 選んでね" {items} style={styleSelect({size: EStyleSize.md, bdround: "rounded-md", bdwidth: "border"})} />

<!-- <Button onClick={()=>{}}>Medium</Button> -->
<!-- <InputForm /> -->
<!-- <Flex style={{layout: {direction: EStyleFlexDirection.row}}}>
  <TextBox bind:value={val} placeholder="input here" isClearable={true} onKeyDown={setChip} />
  {#each chips as chip}
    <Chip {...chip} />
  {/each}
</Flex> -->
<!-- <TagInput panelPosition={PanelPosition.Right} title="Name" placeholder="&quot;Enter&quot; to tag" hint="" /> -->
<!-- <ZZZ /> -->
<!-- <Chip onClose={(id)=>{}}>Test</Chip> -->
