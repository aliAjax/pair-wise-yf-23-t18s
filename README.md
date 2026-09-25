# 舞台灯光编排模拟器

纯前端舞台灯光编排工具，支持灯具通道、场景 Cue、时间轴预览、配电方案与演出快照，所有数据存在 IndexedDB。

## 快速启动

```bash
cp .env.example .env && docker compose up -d
```

## 访问地址或 CLI 示例

前端：<http://localhost:20113>



## 本地开发方式

- 前端：`cd frontend && npm install && npm run dev`
- 配电规则校验：`cd frontend && npm run verify`（回路拦截/负载差门禁/快照冻结的自动化断言）



## 配电方案页（/power）

装台换场时给每盏灯登记功率和所属回路，回路记录额定安培、相位与检修状态：

- **变更拦截**：调整挂接、功率或回路参数后，只要出现回路超载或灯具接到检修回路，本次变更立即被拦截，方案保持上一版可用状态。
- **恢复最近可用方案**：每次成功变更都会把上一版可用方案压入历史（最多 20 版），可一键恢复。
- **发布门禁**：各相位负载差（(最重相 − 最轻相) / 最重相）超过两成（20%）时，不能发布演出快照。
- **快照冻结**：发布时深拷贝当前灯具挂接与回路配置，之后的灯具调整不影响已发布快照。

## 技术栈

| 层 | 技术 |
|---|---|
| 前端 | React 18 + TypeScript + Vite + Tailwind CSS + Redux Toolkit + IndexedDB |
| 后端 | - |
| 数据库 | 本地模拟数据 |
| 部署 | Docker Compose |

## 项目目录结构

```text
frontend/src/api, stores, types, constants, constructors, components/common, hooks, pages, router, utils, mocks
```

## 环境变量说明

- `COMPOSE_PROJECT_NAME`: Compose 项目名，默认 `stage-light`
- `FRONTEND_PORT`: 前端端口，默认 `20113`


## Docker 部署说明

- 根 Compose 文件不写 `version`，顶层 `name: stage-light`。
- 容器名均使用 `${COMPOSE_PROJECT_NAME:-stage-light}` 前缀。
- 数据库使用命名卷，避免绑定中文路径。
- 常见问题：端口占用时修改 `.env` 中端口后重启；需要重置数据时执行 `docker compose down -v`。

## 枚举/常量出现位置清单

- FixtureType: constants/FixtureType、types/FixtureType、constructors、logTemplates、errorMessages、筛选器、展示组件/控制器均有引用。
- CueStatus: constants/CueStatus、types/CueStatus、constructors、logTemplates、errorMessages、筛选器、展示组件/控制器均有引用。
- ChannelMode: constants/ChannelMode、types/ChannelMode、constructors、logTemplates、errorMessages、筛选器、展示组件/控制器均有引用。
- Phase: constants/Phase、types/Phase、utils/powerPlan、constructors/ShowSnapshotConstructor、stores/PowerDistributionStore、pages/PowerDistributionPage、components/common/PhaseLoadBar 均有引用。
- MaintenanceStatus: constants/MaintenanceStatus、types/MaintenanceStatus、utils/powerPlan、stores/PowerDistributionStore、pages/PowerDistributionPage、constants/statusText 均有引用。
- 配电阈值/电压: constants/PowerConfig（SUPPLY_VOLTAGE_V、PHASE_IMBALANCE_TOLERANCE、MAX_USABLE_PLAN_HISTORY），被 utils/powerPlan、stores/PowerDistributionStore、pages/PowerDistributionPage 引用。

## 为什么会牵一发动全身

实体字段、枚举、日志模板、错误消息、构造器、筛选器和展示组件被刻意拆散到多个目录；修改一个状态值通常需要同步类型、构造器、服务、控制器、store、页面、README 与数据库种子。

## License

MIT
