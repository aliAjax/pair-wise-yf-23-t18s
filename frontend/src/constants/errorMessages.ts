export const ERROR_MESSAGES = {
  AUTH_REQUIRED: "请先登录后再继续操作",
  RBAC_DENIED: "当前角色没有执行该动作的权限",
  VALIDATION_FAILED: "表单字段缺失或格式错误",
  RATE_LIMITED: "请求过于频繁，请稍后再试",
  CIRCUIT_OVERLOADED: "回路超载，本次变更已被拦截",
  CIRCUIT_UNDER_MAINTENANCE: "目标回路检修中，本次变更已被拦截",
  PHASE_IMBALANCE_EXCEEDED: "各相位负载差超过两成，不能发布演出快照",
  NO_USABLE_PLAN: "没有可恢复的最近可用方案"
};
