import { usePowerDistributionStore } from "../src/stores/PowerDistributionStore";
import { computePhaseLoads, phaseImbalance } from "../src/utils/powerMath";

const store = usePowerDistributionStore;
const assert = (cond: boolean, msg: string) => {
  if (!cond) throw new Error(`FAIL: ${msg}`);
  console.log(`ok: ${msg}`);
};

await store.getState().load();
let s = store.getState();
assert(s.circuits.length === 9 && s.hookups.length === 9, "种子数据加载 9 回路 / 9 挂接");
assert(s.issues.length === 0, "初始方案校验通过");
const seedImbalance = phaseImbalance(computePhaseLoads(s.circuits, s.hookups));
assert(seedImbalance <= 0.2, `初始负载差 ${(seedImbalance * 100).toFixed(1)}% 不超过两成`);

// 1. 挂到检修回路 C-203(id=6) → 拦截，保留上一版可用方案
const beforeUsable = JSON.stringify(s.lastUsableHookups);
assert(store.getState().reassignCircuit(1, 6) === false, "挂接检修回路被拦截");
s = store.getState();
assert(s.lastError !== null && s.lastError.includes("检修"), "拦截原因包含检修提示");
assert(JSON.stringify(s.lastUsableHookups) === beforeUsable, "上一版可用方案原样保留");
assert(s.hookups.find((h) => h.fixture_id === 1)?.circuit_id === 6, "被拦截的变更仅停留在草稿");
store.getState().restoreLastUsable();
s = store.getState();
assert(s.hookups.find((h) => h.fixture_id === 1)?.circuit_id === 1, "恢复最近可用方案后回到 C-101");
assert(s.lastError === null && s.issues.length === 0, "恢复后错误清除");

// 2. 功率调到 8000W → C-301 额定 32A(7040W) 超载 → 拦截
assert(store.getState().reassignCircuit(9, 7) === true, "STROBE-01 先挂回 C-301");
assert(store.getState().updateWattage(9, 8000) === false, "8000W 超载被拦截");
s = store.getState();
assert(s.lastError !== null && s.lastError.includes("超载"), "拦截原因包含超载提示");
store.getState().restoreLastUsable();
assert(store.getState().hookups.find((h) => h.fixture_id === 9)?.wattage === 3000, "恢复后功率回到 3000W");

// 3. 制造三相不平衡：PAR-03 从 L3 挪到 L1 → 负载差超限 → 禁止发布
assert(store.getState().reassignCircuit(6, 3) === true, "PAR-03 挪到 C-103(L1) 本身不超载");
s = store.getState();
const imbalanced = phaseImbalance(computePhaseLoads(s.circuits, s.hookups));
assert(imbalanced > 0.2, `挪动后负载差 ${(imbalanced * 100).toFixed(1)}% 超过两成`);
assert(store.getState().publishSnapshot("不平衡测试") === false, "负载差超限禁止发布快照");
assert(store.getState().snapshots.length === 1, "快照数量未增加");

// 4. 挪回 L3 恢复平衡 → 发布成功 → 快照冻结
// （不平衡不属于挂接拦截项，该方案本身就是最近可用方案，需手动调回平衡）
assert(store.getState().reassignCircuit(6, 8) === true, "PAR-03 挪回 C-302(L3)");
assert(store.getState().publishSnapshot("换场后 V2") === true, "恢复平衡后发布成功");
s = store.getState();
assert(s.snapshots.length === 2, "快照数量 +1");
const frozen = JSON.stringify(s.snapshots[1]);
store.getState().updateWattage(9, 1200);
store.getState().reassignCircuit(4, 9);
s = store.getState();
assert(JSON.stringify(s.snapshots[1]) === frozen, "发布后继续调整灯具，快照内容不变");
assert(s.snapshots[1].hookups.find((h) => h.fixture_id === 9)?.wattage === 3000, "快照内功率保持发布时取值");
assert(s.hookups.find((h) => h.fixture_id === 9)?.wattage === 1200, "当前方案已按新调整生效");

console.log("ALL PASS");
