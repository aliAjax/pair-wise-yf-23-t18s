import { createElement } from "react";
import TestRenderer, { act } from "react-test-renderer";
import { PowerDistributionPage } from "../src/pages/PowerDistributionPage";
import { usePowerDistributionStore } from "../src/stores/PowerDistributionStore";

(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;

async function main() {
  await usePowerDistributionStore.getState().load();
  let tree: TestRenderer.ReactTestRenderer | null = null;
  await act(async () => {
    tree = TestRenderer.create(createElement(PowerDistributionPage));
  });
  const text = JSON.stringify(tree!.toJSON());
  const needles = ["配电方案", "每相负载", "灯具挂接", "供电回路柜", "演出快照", "PAR-01", "STB-01", "C6", "首演夜配电快照", "恢复最近可用方案", "发布演出快照", "12.7%", "未挂接", "检修中"];
  let failures = 0;
  for (const needle of needles) {
    const ok = text.includes(needle);
    console.log(`${ok ? "PASS" : "FAIL"} 渲染包含「${needle}」`);
    if (!ok) failures += 1;
  }
  console.log(failures === 0 ? "ALL PASS" : `${failures} FAILURES`);
  process.exit(failures === 0 ? 0 : 1);
}

main();
