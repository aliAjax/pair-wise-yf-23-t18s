import { usePowerDistributionStore } from "../src/stores/PowerDistributionStore";
import { computeCircuitLoads, computeImbalanceRatio, computePhaseLoads, validatePlan } from "../src/utils/powerPlan";

const store = () => usePowerDistributionStore.getState();
let failures = 0;
const check = (name: string, cond: boolean) => {
  console.log(`${cond ? "PASS" : "FAIL"} ${name}`);
  if (!cond) failures += 1;
};

const imbalanceOf = () => {
  const { fixtures, circuits } = store();
  return computeImbalanceRatio(computePhaseLoads(computeCircuitLoads(fixtures, circuits)));
};

async function main() {
  await store().load();
  check("加载 8 灯 6 回路 1 快照", store().fixtures.length === 8 && store().circuits.length === 6 && store().snapshots.length === 1);
  check("初始方案无违规", validatePlan(store().fixtures, store().circuits).length === 0);
  const initImbalance = imbalanceOf();
  check(`初始负载差 ${(initImbalance * 100).toFixed(1)}% 低于两成`, initImbalance <= 0.2);

  // 1. 挂到检修回路 C6 → 拦截，状态不变
  const before = store().fixtures.find((f) => f.id === 8)!.circuit_id;
  const ok1 = store().assignCircuit(8, 6);
  check("挂到检修回路被拦截", ok1 === false);
  check("拦截后挂接保持原状", store().fixtures.find((f) => f.id === 8)!.circuit_id === before);
  check("拦截后给出错误提示", (store().lastError ?? "").includes("检修"));

  // 2. 超载：把 PAR-01 功率调到 3000W，C1 合计 4000W ≈ 18.2A > 16A → 拦截
  const ok2 = store().setFixturePower(1, 3000);
  check("超载功率变更被拦截", ok2 === false);
  check("拦截后功率保持 1000W", store().fixtures.find((f) => f.id === 1)!.power_watt === 1000);

  // 3. 合法挂接：PAR-03 从 C5 挪到 C1（C1: 3200W ≈ 14.5A）
  const ok3 = store().assignCircuit(7, 1);
  check("合法挂接被接受", ok3 === true);
  check("接受后产生可恢复历史", store().usableHistory.length === 1);
  const imbalanced = imbalanceOf();
  check(`挪动后负载差 ${(imbalanced * 100).toFixed(1)}% 超过两成`, imbalanced > 0.2);

  // 4. 负载差超两成 → 禁止发布
  const ok4 = store().publishSnapshot("应被拦住");
  check("负载差超两成禁止发布", ok4 === false && store().snapshots.length === 1);
  check("发布拦截提示两成规则", (store().lastError ?? "").includes("两成"));

  // 5. 恢复最近可用方案 → PAR-03 回到 C5
  const ok5 = store().restoreLastUsable();
  check("恢复最近可用方案", ok5 === true && store().fixtures.find((f) => f.id === 7)!.circuit_id === 5);
  check("恢复后负载差回到两成内", imbalanceOf() <= 0.2);

  // 6. 回路侧拦截：C1 降到 5A（超载）、C1 转检修（带灯）均拦截；C6 空回路转正常放行
  check("回路降容超载被拦截", store().saveCircuitConfig(1, { rated_amp: 5 }) === false);
  check("带灯回路转检修被拦截", store().saveCircuitConfig(1, { maintenance_status: "MAINTENANCE" }) === false);
  check("空回路检修状态可调整", store().saveCircuitConfig(6, { maintenance_status: "NORMAL" }) === true);
  check("非法额定安培被拦截", store().saveCircuitConfig(1, { rated_amp: 0 }) === false);

  // 7. 发布快照 → 冻结，后续调整不影响
  const ok7 = store().publishSnapshot("首演测试");
  check("合规方案可发布快照", ok7 === true && store().snapshots.length === 2);
  const snap = store().snapshots.find((s) => s.title === "首演测试")!;
  const frozenCircuit = snap.hookups.find((h) => h.fixture_id === 7)!.circuit_id;
  store().assignCircuit(7, 2);
  check("发布后灯具调整不影响快照", snap.hookups.find((h) => h.fixture_id === 7)!.circuit_id === frozenCircuit);
  check("快照深拷贝回路配置", snap.circuits.find((c) => c.id === 6)!.maintenance_status === "NORMAL");

  // 8. 历史耗尽后恢复报错
  while (store().usableHistory.length > 0) store().restoreLastUsable();
  check("无可用方案时恢复被拦截", store().restoreLastUsable() === false);

  console.log(failures === 0 ? "ALL PASS" : `${failures} FAILURES`);
  process.exit(failures === 0 ? 0 : 1);
}

main();
