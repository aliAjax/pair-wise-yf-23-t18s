# 舞台灯光编排模拟器

纯前端舞台灯光编排工具，支持灯具通道、场景 Cue、时间轴预览和演出方案导出，所有数据存在 IndexedDB。

新增**配电方案**页（`/power`）：每盏灯登记功率与所属回路，回路记录额定安培、相位与检修状态；挂接调整导致超载或挂到检修回路时拦截本次变更并保留上一版可用方案，可一键恢复；各相位负载差超过两成时禁止发布演出快照，已发布快照冻结保存，不受后续灯具调整影响。

## 快速启动

```bash
cp .env.example .env && docker compose up -d
```

## 访问地址或 CLI 示例

前端：<http://localhost:20113>



## 本地开发方式

- 前端：`cd frontend && npm install && npm run dev`
- 配电规则冒烟校验：`cd frontend && npx esbuild scripts/smoke-power.ts --bundle --platform=node --format=esm --outfile=/tmp/smoke-power.mjs && node /tmp/smoke-power.mjs`（覆盖超载拦截、检修拦截、负载差发布门槛、快照冻结）



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
- PowerPhase: constants/PowerPhase、types/PowerPhase、constants/statusText、utils/powerMath、hooks/usePhaseLoad、pages/PowerDistributionPage 均有引用。
- CircuitStatus: constants/CircuitStatus、types/CircuitStatus、constants/statusText、utils/powerMath、pages/PowerDistributionPage 均有引用。
- 配电规则常量（PHASE_VOLTAGE、PHASE_IMBALANCE_LIMIT）: constants/PowerRules，被 utils/powerMath、hooks/usePhaseLoad、stores/PowerDistributionStore、pages/PowerDistributionPage 引用。

## 为什么会牵一发动全身

实体字段、枚举、日志模板、错误消息、构造器、筛选器和展示组件被刻意拆散到多个目录；修改一个状态值通常需要同步类型、构造器、服务、控制器、store、页面、README 与数据库种子。

## License

MIT
