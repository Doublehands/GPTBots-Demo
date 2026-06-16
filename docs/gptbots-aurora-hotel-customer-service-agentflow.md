# Aurora 酒店 AI 客服 Agent · 流程设计

## 1. 概述

本 Agent 面向 Aurora 酒店官网/活动页的 Livedesk 网页客服组件入口。GPTBots 负责自动识别宾客意图、检索酒店知识库、完成预订/服务/宴会线索的信息采集，并在必要时通过 Livedesk 转人工；EngageLab 不直接作为客服节点，而用于后续 APP Push、WebPush、SMS、WhatsApp、Email 与 MA 用户旅程触达。

首期采用“单入口 + 分类路由 + 知识库/采集/Workflow + Livedesk 人工服务”的结构，避免把价格、库存、取消规则等易变事实写死在 Prompt 中。

## 2. 资料接入

| 资料 | 形式 | GPTBots 机制 |
|---|---|---|
| 酒店 FAQ、设施说明、停车/班车/早餐/加床政策 | 静态文档 / Q&A | 知识库 + 知识搜索 |
| 房型、套餐、会员权益、会议宴会资料 | 静态文档 / 图文资料转文本 | 知识库 + 知识搜索 |
| 房态、价格、库存、订单、会员等级 | 外部系统 / API | Workflow 或 Tools 独立节点 |
| 住中服务派单、工单状态、SLA | Livedesk / 酒店工单系统 API | Workflow 独立节点；异常时转人工服务 |
| 用户联系方式、偏好、线索状态 | LiveDesk 联系人属性 + 用户属性 | 用户属性 + 变量赋值 |
| 用户上传图片或文件 | 图片/文档附件 | 首期不启用；如启用，Start 附件识别 + 多模态 LLM 转文字后再路由 |

## 3. 节点

| # | 类型 | 名称 | 用途 |
|---|---|---|---|
| 1 | Start | User Input | Livedesk 网页客服组件入口 |
| 2 | 变量赋值 | 初始化会话上下文 | 保存渠道、URL、LiveDesk 联系方式等基础上下文 |
| 3 | Classifier | 主意图路由 | 将用户输入分到预订、FAQ、房型推荐、住中服务、会议宴会/复购、转人工、其他 |
| 4 | 知识搜索 | FAQ/设施知识检索 | 检索 FAQ、设施、政策、会员等稳定资料 |
| 5 | LLM | FAQ/设施答复 | 基于知识库回答稳定问题 |
| 6 | 对话采集 | 预订需求采集 | 采集入住日期、离店日期、人数、房型偏好、预算、会员信息 |
| 7 | Workflow | 查询房态与价格 | 调酒店业务系统，返回可订房型/价格/库存 |
| 8 | LLM | 预订引导回复 | 解释房型、政策、下一步，并提示可转人工 |
| 9 | 对话采集 | 房型套餐偏好采集 | 采集场景、预算、会员等级、安静/亲子/差旅等偏好 |
| 10 | LLM | 房型套餐推荐 | 基于知识库和用户偏好推荐房型/套餐 |
| 11 | 对话采集 | 住中服务采集 | 采集房号、服务项目、送达时间、备注、紧急程度 |
| 12 | Workflow | 创建/查询服务工单 | 创建 Livedesk/酒店服务工单或查询状态 |
| 13 | LLM | 服务进度回复 | 告知工单摘要、预计处理、可加急/转人工 |
| 14 | 对话采集 | 会议宴会线索采集 | 采集活动类型、日期、人数、预算、餐饮/房晚需求、联系人 |
| 15 | Workflow | 创建销售线索/MA 标签 | 写入线索摘要，触发 EngageLab MA 后续触达 |
| 16 | LLM | 线索确认回复 | 确认资料已记录，说明销售/Livedesk 后续跟进 |
| 17 | LLM | 兜底澄清 | 处理无法分类或知识无结果的问题 |
| 18 | 人工服务 | 转 Livedesk 人工 | 将会话交给 Livedesk 坐席/队列 |
| 19 | End | Output | 输出自动回复 |
| 20 | 知识搜索 | 房型套餐知识检索 | 检索房型、套餐、会员权益资料 |

## 4. 连线

- 1 User Input → 2 初始化会话上下文
- 2 初始化会话上下文 --(成功)--> 3 主意图路由
- 2 初始化会话上下文 --(失败)--> 3 主意图路由
- 3 主意图路由 --(即时 FAQ 与设施咨询)--> 4 FAQ/设施知识检索
- 4 FAQ/设施知识检索 --(有结果)--> 5 FAQ/设施答复 → 19 Output
- 4 FAQ/设施知识检索 --(无结果)--> 17 兜底澄清 → 19 Output
- 3 主意图路由 --(直连预订咨询)--> 6 预订需求采集
- 6 预订需求采集 --(完成采集)--> 7 查询房态与价格 → 8 预订引导回复 → 19 Output
- 6 预订需求采集 --(采集失败)--> 18 转 Livedesk 人工
- 3 主意图路由 --(房型与套餐推荐)--> 9 房型套餐偏好采集
- 9 房型套餐偏好采集 --(完成采集)--> 20 房型套餐知识检索
- 20 房型套餐知识检索 --(有结果)--> 10 房型套餐推荐 → 19 Output
- 20 房型套餐知识检索 --(无结果)--> 17 兜底澄清 → 19 Output
- 9 房型套餐偏好采集 --(采集失败)--> 17 兜底澄清 → 19 Output
- 3 主意图路由 --(住中服务与工单)--> 11 住中服务采集
- 11 住中服务采集 --(完成采集)--> 12 创建/查询服务工单 → 13 服务进度回复 → 19 Output
- 11 住中服务采集 --(采集失败)--> 18 转 Livedesk 人工
- 3 主意图路由 --(会议宴会与复购线索)--> 14 会议宴会线索采集
- 14 会议宴会线索采集 --(完成采集)--> 15 创建销售线索/MA 标签 → 16 线索确认回复 → 19 Output
- 14 会议宴会线索采集 --(采集失败)--> 18 转 Livedesk 人工
- 3 主意图路由 --(明确要求人工/投诉/高风险)--> 18 转 Livedesk 人工
- 3 主意图路由 --(其他)--> 17 兜底澄清 → 19 Output
- 3 主意图路由 --(异常分支)--> 18 转 Livedesk 人工
- 7 查询房态与价格 --(异常/无可用结果，由 Workflow 内部返回状态)--> 8 预订引导回复；8 判断需人工时提示并可由用户再次触发人工分支
- 12 创建/查询服务工单 --(异常，由 Workflow 内部返回状态)--> 13 服务进度回复；13 对异常说明“已转人工处理”并可接 18
- 15 创建销售线索/MA 标签 --(异常，由 Workflow 内部返回状态)--> 16 线索确认回复；16 对异常说明将由 Livedesk 人工跟进

## 5. 节点详情

### [变量赋值] 初始化会话上下文

- `channel_source` = 覆盖 `{{sys_conversation_source}}`
- `browser_entry_url` = 覆盖 `{{browser_current_url}}`
- `browser_referrer_url` = 覆盖 `{{browser_source_url}}`
- `livedesk_contact_id` = 覆盖 `{{ld_contact_id}}`
- `guest_name` = 覆盖 `{{ld_full_name}}`
- `guest_phone` = 覆盖 `{{ld_phone}}`
- `guest_email` = 覆盖 `{{ld_email}}`
- 成功/失败都继续进入“主意图路由”，避免因属性缺失阻塞客服。

### [Classifier] 主意图路由

- 分类：`直连预订咨询`、`即时 FAQ 与设施咨询`、`房型与套餐推荐`、`住中服务与工单`、`会议宴会与复购线索`、`明确要求人工/投诉/高风险`、`其他`
- 运行模式：透传
- 路由要求：只选择一个最匹配分类；如果用户同时提出多个问题，优先处理更紧急或更明确的事项，安全/投诉/人工诉求最高优先级。

分支规则：

- `直连预订咨询`：用户询问入住/离店日期、房态、价格、担保、取消、连通房、含早、预订下一步。
- `即时 FAQ 与设施咨询`：用户询问班车、停车、泳池、健身房、早餐、加床、会员权益、地址、营业时间等稳定信息。
- `房型与套餐推荐`：用户希望比较房型、选择套餐、按预算/差旅/亲子/会员权益获得推荐。
- `住中服务与工单`：用户已入住或提供房号，希望送物、餐饮、洗衣、报修、查询服务进度或加急。
- `会议宴会与复购线索`：用户咨询会议、婚宴、活动、企业客户、会员复住、二次入住权益。
- `明确要求人工/投诉/高风险`：用户要求人工、投诉、退款争议、严重服务失败、财务/安全/隐私敏感问题。
- `其他`：无法确定意图、闲聊、超出酒店服务范围。

边界样例：

- “我想订下周五两晚，能不能保留房价？” → `直连预订咨询`
- “泳池几点关？附近停车怎么收费？” → `即时 FAQ 与设施咨询`
- “行政房和套房哪个适合出差？” → `房型与套餐推荐`
- “1808 房间需要儿童拖鞋和温水” → `住中服务与工单`
- “120 人婚宴有没有厅？” → `会议宴会与复购线索`
- “我要投诉，马上找人” → `明确要求人工/投诉/高风险`

### [知识搜索] FAQ/设施知识检索

- 知识库：`Aurora Hotel FAQ 与政策库`、`会员权益与服务标准库`
- 调用方式：强制调用
- 问题增强：开启
- 检索权重：混合搜索
- 知识相关性：0.55 起，根据上线测试调优
- 召回数量：5
- 知识重排：如知识库内容较多，开启重排
- 元数据过滤：可按 `doc_category` 过滤，示例值：`faq`、`room`、`event`、`member`

### [知识搜索] 房型套餐知识检索

- 知识库：`Aurora Hotel 房型与套餐库`、`会员权益与服务标准库`
- 调用方式：强制调用
- 问题增强：开启
- 检索权重：混合搜索
- 知识相关性：0.55 起，根据上线测试调优
- 召回数量：5
- 知识重排：如知识库内容较多，开启重排
- 说明：房型推荐分支使用独立知识搜索节点，避免与 FAQ 分支共用同一个 `有结果` 出口后触发双回复。

### [LLM] FAQ/设施答复

- 模型：平台默认强模型
- 返回格式：Text
- 知识：连接“FAQ/设施知识检索”
- 身份提示：

```text
你是 Aurora 酒店的 AI 客服助手，通过 Livedesk 网页客服组件服务宾客。

目标：
1. 基于知识数据回答酒店 FAQ、设施、政策、会员权益等问题。
2. 回答要简洁、礼貌、可执行。
3. 如果知识数据没有答案，不要编造；请说明需要前台或人工确认，并引导转 Livedesk 人工。
4. 对价格、房态、库存、取消政策等可能变化的信息，不要凭空给出数值；只引用知识数据或说明需系统确认。
5. 语言跟随用户；默认中文。

输出格式：
- 先直接回答用户问题。
- 如有多个事项，用短列表。
- 最后给一个下一步建议，例如“需要我帮您转人工确认吗？”。
```

### [对话采集] 预订需求采集

- 超过 6 轮未采齐则走采集失败
- 字段：
  - `check_in_date` datetime：入住日期
  - `check_out_date` datetime：离店日期
  - `guest_count` Integer：入住人数
  - `room_preference` String：房型/床型/连通房/楼层等偏好
  - `budget_range` String：预算范围，可选
  - `member_status` String：会员等级或是否为会员，可选
  - `contact_info` String：联系方式；若 `ld_phone` 或 `ld_email` 已有则不重复索要
- 采集话术要求：先回应需求，再只问缺失的关键字段；不要一上来索要全部信息。

### [Workflow] 查询房态与价格

- 选定工作流：`hotel_availability_quote`
- 入参：
  - `check_in_date` ← `{{预订需求采集.check_in_date}}`
  - `check_out_date` ← `{{预订需求采集.check_out_date}}`
  - `guest_count` ← `{{预订需求采集.guest_count}}`
  - `room_preference` ← `{{预订需求采集.room_preference}}`
  - `member_status` ← `{{预订需求采集.member_status}}`
  - `contact_id` ← `{{livedesk_contact_id}}`
- 用到的输出：
  - `available_rooms`
  - `quote_summary`
  - `booking_policy_summary`
  - `handoff_required`
  - `error_message`

### [LLM] 预订引导回复

- 模型：平台默认强模型
- 返回格式：Text
- 用户问题：追加 `用户原始输入：{{start_msg_text}}` 与 `房态报价结果：{{查询房态与价格}}`
- 身份提示：

```text
你是 Aurora 酒店的 AI 预订助手。你要根据 Workflow 返回的房态/报价结果给用户解释可选方案。

规则：
1. 只使用 Workflow 返回的房型、价格、库存和政策，不要自行编造。
2. 如果 `handoff_required` 为 true，说明原因并建议转 Livedesk 人工。
3. 如果没有可用房型，给出替代日期/偏好调整建议，并可转人工。
4. 如果用户暂不下单，说明可由 EngageLab 后续通过 APP Push、WebPush、SMS、WhatsApp、Email 或 MA 旅程发送提醒，但不要承诺具体发送时间，除非 Workflow 返回。
5. 语言跟随用户，语气专业温暖。

回复结构：
- 确认需求
- 推荐/结果摘要
- 政策或注意事项
- 下一步：继续预订、调整条件或转人工
```

### [对话采集] 房型套餐偏好采集

- 超过 5 轮未采齐则走采集失败
- 字段：
  - `stay_scenario` String：差旅/亲子/休闲/会议/长住
  - `budget_range` String：预算范围，可选
  - `room_preference` String：安静、高楼层、办公桌、亲子设施、行政酒廊等
  - `member_status` String：会员等级或权益偏好，可选

### [LLM] 房型套餐推荐

- 模型：平台默认强模型
- 返回格式：Text
- 知识：连接“房型套餐知识检索”
- 用户问题：追加 `用户原始输入：{{start_msg_text}}` 与 `偏好采集结果：{{房型套餐偏好采集}}`
- 身份提示：

```text
你是 Aurora 酒店的房型与套餐推荐助手。你根据用户偏好和知识数据推荐最合适的 1-3 个选择。

规则：
1. 推荐必须能从知识数据中找到依据。
2. 不要编造价格、库存或实时优惠。
3. 如果用户是会员或提到会员权益，优先解释可用权益，但不承诺未确认权益。
4. 每个推荐都说明“适合原因”和“需要人工/系统确认的事项”。
5. 如涉及企业价、长住价、特殊账期，建议转 Livedesk 人工。
```

### [对话采集] 住中服务采集

- 超过 5 轮未采齐则走采集失败
- 字段：
  - `room_number` String：房号
  - `service_items` String：服务项目，如送物、餐饮、洗衣、报修
  - `preferred_time` String：期望送达或处理时间
  - `special_notes` String：过敏、轻敲门、儿童用品等备注，可选
  - `urgency` String：普通/加急/紧急

### [Workflow] 创建/查询服务工单

- 选定工作流：`livedesk_service_ticket`
- 入参：
  - `ld_conversation_id` ← `{{ld_conversation_id}}`
  - `ld_contact_id` ← `{{livedesk_contact_id}}`
  - `room_number` ← `{{住中服务采集.room_number}}`
  - `service_items` ← `{{住中服务采集.service_items}}`
  - `preferred_time` ← `{{住中服务采集.preferred_time}}`
  - `special_notes` ← `{{住中服务采集.special_notes}}`
  - `urgency` ← `{{住中服务采集.urgency}}`
- 用到的输出：
  - `ticket_id`
  - `ticket_status`
  - `eta`
  - `assigned_team`
  - `handoff_required`

### [LLM] 服务进度回复

- 模型：平台默认强模型
- 返回格式：Text
- 用户问题：追加 `用户原始输入：{{start_msg_text}}` 与 `工单结果：{{创建/查询服务工单}}`
- 身份提示：

```text
你是 Aurora 酒店住中服务助手。你要把服务工单结果用宾客能理解的方式说明。

规则：
1. 如果创建成功，返回工单号、服务项目、预计处理时间和注意事项。
2. 如果 `handoff_required` 为 true 或工单异常，说明将转 Livedesk 人工处理。
3. 对紧急/投诉/安全类问题，建议人工接管。
4. 不要承诺无法从 Workflow 结果中确认的送达时间。
```

### [对话采集] 会议宴会线索采集

- 超过 6 轮未采齐则走采集失败
- 字段：
  - `event_type` String：会议/婚宴/企业活动/其他
  - `event_date` datetime：活动日期或时间范围
  - `attendee_count` Integer：人数
  - `budget_range` String：预算，可选
  - `catering_need` String：餐饮/试菜/茶歇需求，可选
  - `room_nights_need` String：是否需要房晚/婚房，可选
  - `contact_info` String：联系人信息；若 LiveDesk 已有则不重复索要

### [Workflow] 创建销售线索/MA 标签

- 选定工作流：`event_lead_ma_sync`
- 入参：
  - `ld_conversation_id` ← `{{ld_conversation_id}}`
  - `ld_contact_id` ← `{{livedesk_contact_id}}`
  - `event_type` ← `{{会议宴会线索采集.event_type}}`
  - `event_date` ← `{{会议宴会线索采集.event_date}}`
  - `attendee_count` ← `{{会议宴会线索采集.attendee_count}}`
  - `budget_range` ← `{{会议宴会线索采集.budget_range}}`
  - `catering_need` ← `{{会议宴会线索采集.catering_need}}`
  - `room_nights_need` ← `{{会议宴会线索采集.room_nights_need}}`
  - `browser_entry_url` ← `{{browser_entry_url}}`
- 用到的输出：
  - `lead_id`
  - `lead_priority`
  - `ma_tags`
  - `handoff_required`

### [LLM] 线索确认回复

- 模型：平台默认强模型
- 返回格式：Text
- 用户问题：追加 `线索同步结果：{{创建销售线索/MA 标签}}`
- 身份提示：

```text
你是 Aurora 酒店会议宴会与会员复购咨询助手。

规则：
1. 确认已记录的核心需求，不展示内部字段名。
2. 如果已生成 lead_id，可说明“已为您记录需求，宴会/销售顾问将跟进”。
3. 如果 `lead_priority` 高或 `handoff_required` 为 true，建议转 Livedesk 人工或销售队列。
4. 可说明后续可能通过 EngageLab 的 Email、WhatsApp、APP Push 等渠道发送资料，但不要承诺具体发送时间。
```

### [LLM] 兜底澄清

- 模型：平台默认强模型
- 返回格式：Text
- 身份提示：

```text
你是 Aurora 酒店 AI 客服助手。当前问题没有被明确分类，或知识库没有找到可靠答案。

请做到：
1. 不要编造答案。
2. 用一句话说明你可以帮助的范围：预订、设施政策、房型套餐、住中服务、会议宴会、转人工。
3. 询问用户希望先处理哪一项。
4. 如果用户表达不满、投诉或紧急情况，建议转 Livedesk 人工。
```

### [人工服务] 转 Livedesk 人工

- 三方系统：Livedesk
- 转交队列建议：
  - 投诉/高风险：`urgent_service_queue`
  - 预订复杂政策/企业协议价：`reservation_specialist_queue`
  - 住中服务异常：`hotel_service_queue`
  - 会议宴会高价值线索：`event_sales_queue`
- 转交摘要建议包含：
  - `ld_conversation_id`
  - `ld_contact_id`
  - 用户原始输入 `{{start_msg_text}}`
  - 已采集字段摘要
  - 建议优先级
  - 是否需要 EngageLab MA 后续触达

## 6. 变量与用户属性

| 名称 | 种类 | 类型 | 用途 |
|---|---|---|---|
| `guest_name` | 用户属性 | string | 宾客姓名，来自 Livedesk 或对话 |
| `guest_phone` | 用户属性 | string | 宾客电话，来自 Livedesk 或对话 |
| `guest_email` | 用户属性 | string | 宾客邮箱，来自 Livedesk 或对话 |
| `member_status` | 用户属性 | string | 会员状态/等级 |
| `room_preference` | 用户属性 | string | 长期房型偏好 |
| `service_preference` | 用户属性 | string | 服务偏好，如轻敲门、过敏备注 |
| `last_lead_type` | 用户属性 | string | 最近一次线索类型 |
| `channel_source` | 自定义变量 | string | 会话来源渠道 |
| `browser_entry_url` | 自定义变量 | string | 当前网页入口 |
| `browser_referrer_url` | 自定义变量 | string | 来源页面 |
| `livedesk_contact_id` | 自定义变量 | string | Livedesk 联系人 ID |
| `persona` | 自定义变量 | string | 统一客服人设：专业、温暖、国际连锁酒店风格 |
| `handoff_policy` | 自定义变量 | string | 转人工规则与优先级说明 |

## 7. 平台核对清单（搭建前绑定/确认）

- 知识库：
  - `Aurora Hotel FAQ 与政策库`
  - `Aurora Hotel 房型与套餐库`
  - `Aurora Hotel 会议宴会资料库`
  - `会员权益与服务标准库`
- Workflow：
  - `hotel_availability_quote`
  - `livedesk_service_ticket`
  - `event_lead_ma_sync`
- 人工服务：
  - 绑定 Livedesk
  - 配置转交队列：预订专家、酒店服务、投诉/紧急、会议宴会销售
- 用户属性：
  - `guest_name`
  - `guest_phone`
  - `guest_email`
  - `member_status`
  - `room_preference`
  - `service_preference`
  - `last_lead_type`
- 自定义变量：
  - `channel_source`
  - `browser_entry_url`
  - `browser_referrer_url`
  - `livedesk_contact_id`
  - `persona`
  - `handoff_policy`
- 渠道格式：
  - 当前为 Livedesk 网页客服组件；回复可用短列表和简洁 Markdown。
  - 首期不按 WhatsApp 专用格式设计；如后续单独接 WhatsApp，需要改为纯 URL 和单星加粗规则。
- 易变事实：
  - 价格、库存、房态、取消政策、具体发送时间不写入 Prompt。
  - 由知识库或 Workflow/API 返回后再展示。

## 8. 审查结果

- 分支连线：通过。Classifier 的 `其他` 与 `异常分支` 已连接，知识搜索 `无结果` 已连接，采集失败分支已连接，人工服务为终端节点。
- 变量引用：通过。设计中使用的平台变量来自上游 Start/LiveDesk/浏览器上下文，自定义变量和用户属性已声明。
- 采集机制：通过。首期采用对话采集，不依赖卡片 Form 回流。
- 渠道格式：通过。按 Livedesk 网页客服组件设计，未混入 WhatsApp 专用格式。
- 资料映射：通过。静态资料进知识库，动态房态/价格/工单/线索走 Workflow。
- 幻觉防护：通过。易变价格、库存、政策和发送时间均要求从知识库或 Workflow/API 获取。
