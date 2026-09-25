export const formatDate = (value: string) => new Date(value).toLocaleString("zh-CN");
export const formatStatus = (value: string) => value.replace(/_/g, " ");
export const formatNumber = (value: number) => new Intl.NumberFormat("zh-CN").format(value);
export const formatRisk = (value: string) => ({ LOW: "低", MEDIUM: "中", HIGH: "高", CRITICAL: "严重", EXTREME: "极高" }[value] ?? value);
export const formatWatt = (value: number) => (value >= 1000 ? `${(value / 1000).toFixed(1)} kW` : `${formatNumber(value)} W`);
export const formatAmp = (value: number) => `${value.toFixed(1)} A`;
export const formatPercent = (value: number) => `${(value * 100).toFixed(1)}%`;
