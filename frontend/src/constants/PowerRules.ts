// 配电计算规则：单相回路按 220V 折算电流，三相位负载差超过两成禁止发布演出快照。
export const PHASE_VOLTAGE = 220;
export const PHASE_IMBALANCE_LIMIT = 0.2;
