"""GPTBots AI Demo — 聚合主页与各独立子项目。"""

from __future__ import annotations

import json

import requests
from flask import Flask, abort, jsonify, render_template, request
from werkzeug.utils import secure_filename

from survey_parser import build_queue_from_files

app = Flask(__name__)
app.config["MAX_CONTENT_LENGTH"] = 52 * 1024 * 1024  # 52MB

# 行业入口元数据：用于首页行业卡片
INDUSTRIES = [
    {
        "slug": "aviation",
        "title": "航空营销",
        "subtitle": "围绕航线与客群运营，提升投放效率与交易转化质量",
        "tag": "Aviation",
        "layout": "mesh",
        "stages_count": 4,
    },
    {
        "slug": "banking",
        "title": "金融银行",
        "subtitle": "围绕新户获取与存量激活，提升客户全生命周期价值",
        "tag": "Banking",
        "layout": "split",
        "stages_count": 4,
    },
    {
        "slug": "travel-hotel",
        "title": "旅游酒店",
        "subtitle": "围绕流量、直订与复住运营，提升经营韧性与收益质量",
        "tag": "Hotel",
        "layout": "bento",
        "stages_count": 4,
    },
    {
        "slug": "auto",
        "title": "汽车出行",
        "subtitle": "围绕线索质量与销售承接，提升线索到成交转化效率",
        "tag": "Auto",
        "layout": "survey",
        "stages_count": 4,
    },
]

# 行业详情：行业内按营销漏斗分层（拉新 -> 转化 -> 复购 -> 复盘）
INDUSTRY_DETAILS = {
    "aviation": {
        "slug": "aviation",
        "title": "航空营销案例中心",
        "subtitle": "按营销漏斗查看航空场景案例，从获客到复盘形成可执行闭环。",
        "tag": "Aviation",
        "stages": [
            {
                "key": "acquire",
                "name": "拉新获客",
                "title": "新客增长与航线引流",
                "goal": "提升有效触达与首单转化效率",
                "desc": "围绕新航线、目的地热点和节假日档期进行差异化投放，提升点击到首单的整体效率。",
                "actions": ["人群圈选", "多素材投放", "落地页引导"],
                "metrics": ["CTR", "CAC", "首单转化率"],
                "tags": ["内容生成", "素材理解", "自动化编排"],
            },
            {
                "key": "convert",
                "name": "转化促单",
                "title": "机票与附加服务转化",
                "goal": "提升支付转化率与客单结构",
                "desc": "针对比价犹豫与临门流失，优化票价、升舱与增值服务的组合推荐与触达节奏。",
                "actions": ["权益组合推荐", "转化提醒", "路径优化"],
                "metrics": ["CVR", "AOV", "加购率"],
                "tags": ["个性化推荐", "流程自动化", "效果追踪"],
            },
            {
                "key": "retain",
                "name": "会员复购",
                "title": "常旅客激活与复购提升",
                "goal": "提升会员活跃度与周期性复购",
                "desc": "针对沉默会员和高潜客群进行分层触达，推动里程活跃、权益兑换与复购。",
                "actions": ["会员分层", "权益激励", "周期运营"],
                "metrics": ["复购率", "活跃率", "兑换率"],
                "tags": ["分层运营", "触达自动化", "客户洞察"],
            },
            {
                "key": "review",
                "name": "营销复盘",
                "title": "活动归因与预算优化",
                "goal": "明确增长来源并优化下一轮投放",
                "desc": "基于渠道贡献、客群效果和漏斗流失进行复盘，形成可执行的预算重配建议。",
                "actions": ["渠道归因", "客群复盘", "预算重配"],
                "metrics": ["ROI", "渠道贡献度", "漏斗流失率"],
                "tags": ["数据洞察", "归因分析", "决策辅助"],
            },
        ],
    },
    "banking": {
        "slug": "banking",
        "title": "金融营销案例中心",
        "subtitle": "围绕银行营销增长场景，打通拉新、转化、复购与复盘闭环。",
        "tag": "Banking",
        "stages": [
            {
                "key": "acquire",
                "name": "拉新获客",
                "title": "新户增长与信用卡拉新",
                "goal": "提升有效线索量与新户转化率",
                "desc": "围绕信用卡与手机银行拉新活动，通过客群分层和权益主张测试提高开户效率。",
                "actions": ["人群投放", "权益测试", "线索分级"],
                "metrics": ["CTR", "留资率", "开户转化率"],
                "tags": ["内容生成", "分层运营", "流程自动化"],
            },
            {
                "key": "convert",
                "name": "转化促单",
                "title": "权益包与分期转化",
                "goal": "提升办理率与首月活跃",
                "desc": "面向高意向客户优化办理流程和权益组合，缩短从意向到办理的决策路径。",
                "actions": ["权益组合", "流程优化", "转化提醒"],
                "metrics": ["CVR", "办理完成率", "首月活跃率"],
                "tags": ["智能推荐", "流程编排", "效果追踪"],
            },
            {
                "key": "retain",
                "name": "会员复购",
                "title": "存量客户激活与价值提升",
                "goal": "提升活跃度与交叉销售效果",
                "desc": "针对沉默客群和高潜客群实施分层运营，提升复购、活跃和多产品渗透。",
                "actions": ["客群分层", "生命周期触达", "交叉推荐"],
                "metrics": ["活跃率", "复购率", "渗透率"],
                "tags": ["客户洞察", "触达自动化", "策略推荐"],
            },
            {
                "key": "review",
                "name": "营销复盘",
                "title": "渠道归因与客群效果复盘",
                "goal": "让营销投入与业务产出可追踪",
                "desc": "对活动进行渠道与客群分段复盘，识别高价值路径，支撑预算和策略优化。",
                "actions": ["渠道分析", "客群迁移", "预算优化"],
                "metrics": ["ROI", "渠道贡献度", "漏斗转化率"],
                "tags": ["数据洞察", "归因分析", "经营决策"],
            },
        ],
    },
    "travel-hotel": {
        "slug": "travel-hotel",
        "title": "酒店营销案例中心",
        "subtitle": "围绕旅客决策链路，构建拉新、转化、复住与复盘方案。",
        "tag": "Hotel",
        "stages": [
            {
                "key": "acquire",
                "name": "拉新获客",
                "title": "目的地引流与新客触达",
                "goal": "提升新访客与预订意向",
                "desc": "结合节假日和主题套餐投放，提升高质量流量占比，降低获客成本。",
                "actions": ["主题活动", "渠道分发", "定向触达"],
                "metrics": ["CTR", "到站率", "留资率"],
                "tags": ["内容生成", "素材理解", "自动化投放"],
            },
            {
                "key": "convert",
                "name": "转化促单",
                "title": "直订转化与套餐加购",
                "goal": "提升预订转化率与客单价",
                "desc": "通过房型对比、价格锚点与套餐推荐，提升浏览到下单的决策效率。",
                "actions": ["房型对比", "套餐推荐", "下单提醒"],
                "metrics": ["CVR", "直订占比", "AOV"],
                "tags": ["推荐引擎", "流程优化", "效果跟踪"],
            },
            {
                "key": "retain",
                "name": "会员复购",
                "title": "会员复住与权益运营",
                "goal": "提升复住率与会员价值",
                "desc": "基于入住周期和偏好分层触达，推动复住、升级和权益使用。",
                "actions": ["会员分层", "复住激励", "权益提醒"],
                "metrics": ["复住率", "活跃率", "权益使用率"],
                "tags": ["客户洞察", "自动化触达", "运营编排"],
            },
            {
                "key": "review",
                "name": "营销复盘",
                "title": "渠道成本与入住结构复盘",
                "goal": "优化渠道组合与经营效率",
                "desc": "分析不同渠道和房型结构的贡献，输出预算优化与运营策略建议。",
                "actions": ["渠道ROI", "收益分析", "预算重配"],
                "metrics": ["ROI", "渠道成本率", "RevPAR"],
                "tags": ["经营分析", "归因复盘", "决策辅助"],
            },
        ],
    },
    "auto": {
        "slug": "auto",
        "title": "汽车营销案例中心",
        "subtitle": "覆盖线索获取、到店转化、复购运营与营销复盘。",
        "tag": "Auto",
        "stages": [
            {
                "key": "acquire",
                "name": "拉新获客",
                "title": "新车型曝光与试驾线索获取",
                "goal": "提升高意向线索规模与质量",
                "desc": "围绕新车型和区域活动进行定向投放，获取可跟进的试驾与咨询线索。",
                "actions": ["车型投放", "人群定向", "线索分级"],
                "metrics": ["CTR", "线索转化率", "有效线索率"],
                "tags": ["内容生成", "人群洞察", "投放自动化"],
            },
            {
                "key": "convert",
                "name": "转化促单",
                "title": "试驾到店与订金转化",
                "goal": "提升到店率与订单转化率",
                "desc": "优化预约、到店承接和订金流程，减少线索到成交路径中的损耗。",
                "actions": ["预约优化", "到店提醒", "权益策略"],
                "metrics": ["到店率", "试驾转订单率", "订金支付率"],
                "tags": ["流程编排", "协同跟进", "效果追踪"],
            },
            {
                "key": "retain",
                "name": "会员复购",
                "title": "老客增购与售后运营",
                "goal": "提升老客生命周期价值",
                "desc": "通过保养、置换和增购场景运营，推动高价值客户的持续贡献。",
                "actions": ["保养提醒", "增购激励", "置换活动"],
                "metrics": ["复购率", "售后到店率", "增购转化率"],
                "tags": ["客户运营", "自动化触达", "价值分析"],
            },
            {
                "key": "review",
                "name": "营销复盘",
                "title": "线索质量与渠道效率复盘",
                "goal": "提升投放与销售协同效率",
                "desc": "复盘渠道线索质量和门店承接表现，形成下一轮投放与协同优化策略。",
                "actions": ["质量评估", "渠道对比", "预算优化"],
                "metrics": ["ROI", "有效线索占比", "单车获客成本"],
                "tags": ["经营分析", "归因复盘", "策略优化"],
            },
        ],
    },
}

# 四级案例数据：行业 -> 阶段 -> 案例列表
INDUSTRY_CASES = {
    "aviation": {
        "acquire": [
            {
                "id": "new-route-campaign",
                "title": "新航线首发拉新活动",
                "summary": "围绕新开航线，联合目的地内容与限时权益，提升有效触达与首单转化。",
                "target": "25-40岁高频出行与周末短途客群",
                "workflow": [
                    "按出行偏好拆分人群包",
                    "投放3组差异化创意",
                    "落地页承接目的地套餐",
                    "按小时回收素材效果并调预算",
                ],
                "kpis": ["CTR +22%", "CAC -14%", "首单转化率 +11%"],
                "deliverable": "输出可复用的新航线拉新SOP与素材优选清单。",
            }
        ],
        "convert": [
            {
                "id": "ancillary-upsell",
                "title": "附加服务加购提升",
                "summary": "在支付前关键节点推荐升舱与行李额组合，降低临门流失并提升客单。",
                "target": "已进入支付页但未完成下单用户",
                "workflow": [
                    "识别高意向订单会话",
                    "推荐升舱/行李额组合权益",
                    "触发限时决策提醒",
                    "按转化结果回调推荐策略",
                ],
                "kpis": ["CVR +9%", "AOV +12%", "加购率 +18%"],
                "deliverable": "沉淀支付前增购推荐规则与可视化监控看板。",
            }
        ],
        "retain": [
            {
                "id": "ffp-reactivation",
                "title": "常旅客沉默会员激活",
                "summary": "针对沉默会员做分层触达，推动里程活跃、权益兑换与复购。",
                "target": "近90天无交易但历史高价值会员",
                "workflow": [
                    "按RFM分层识别沉默会员",
                    "投放里程兑换任务",
                    "触发个性化权益提醒",
                    "跟踪复购与活跃提升",
                ],
                "kpis": ["复购率 +10%", "活跃率 +16%", "兑换率 +13%"],
                "deliverable": "形成会员唤醒策略模板与自动触达节奏表。",
            }
        ],
        "review": [
            {
                "id": "campaign-attribution",
                "title": "活动归因与预算重配",
                "summary": "对季度活动进行渠道与人群归因复盘，优化下一轮预算分配。",
                "target": "市场投放管理与经营分析团队",
                "workflow": [
                    "汇总全渠道投放数据",
                    "按客群/渠道拆解漏斗转化",
                    "识别高ROI组合与低效渠道",
                    "输出预算重配方案",
                ],
                "kpis": ["ROI +15%", "无效投放占比 -20%", "渠道贡献度可追踪"],
                "deliverable": "产出季度复盘报告与下一轮预算建议。",
            }
        ],
    }
}

# 行业解决方案：独立落地页卡片，聚合在 /industries/solutions
SOLUTIONS = [
    {
        "slug": "travel-hotel",
        "title": "旅游酒店",
        "subtitle": "前台接待、FAQ、房型与宴会等场景的智能化演示与接待能力编排。",
        "tag": "Hotel",
        "layout": "bento",
        "endpoint": "solution_travel_hotel",
        "industry_slug": "travel-hotel",
    },
]


# 子项目元数据：保留旧路由兼容
PROJECTS = [
    {
        "slug": "chat",
        "title": "智能对话",
        "subtitle": "流式回复 · 多轮上下文",
        "tag": "LLM",
        "layout": "mesh",
    },
    {
        "slug": "vision",
        "title": "视觉理解",
        "subtitle": "图像解析 · 场景描述",
        "tag": "Vision",
        "layout": "split",
    },
    {
        "slug": "workflow",
        "title": "流程编排",
        "subtitle": "节点画布 · 可编排 Agent",
        "tag": "Agent",
        "layout": "bento",
    },
    {
        "slug": "business-survey",
        "title": "商业调查",
        "subtitle": "表格逐行 · 演示文稿 / PDF 逐页 · 顺序调用 Agent",
        "tag": "Survey",
        "layout": "survey",
    },
]


def _project_by_slug(slug: str):
    for p in PROJECTS:
        if p["slug"] == slug:
            return p
    return None


def _industry_stage_by_keys(industry_slug: str, stage_key: str):
    industry = INDUSTRY_DETAILS.get(industry_slug)
    if not industry:
        return None, None, -1
    for idx, stage in enumerate(industry["stages"]):
        if stage["key"] == stage_key:
            return industry, stage, idx
    return industry, None, -1


def _stage_cases(industry_slug: str, stage_key: str):
    return INDUSTRY_CASES.get(industry_slug, {}).get(stage_key, [])


def _industry_stage_case_by_keys(industry_slug: str, stage_key: str, case_id: str):
    industry, stage, stage_index = _industry_stage_by_keys(industry_slug, stage_key)
    if not industry or not stage:
        return None, None, None, -1
    for case in _stage_cases(industry_slug, stage_key):
        if case["id"] == case_id:
            return industry, stage, case, stage_index
    return industry, stage, None, stage_index


@app.route("/")
def index():
    return render_template("index.html", industries=INDUSTRIES)


@app.route("/industries/solutions")
def industries_solutions_page():
    return render_template(
        "industries/solutions.html",
        industries=INDUSTRIES,
        solutions=SOLUTIONS,
    )


@app.route("/industries/<slug>")
def industry_page(slug: str):
    detail = INDUSTRY_DETAILS.get(slug)
    if not detail:
        abort(404)
    first_case_by_stage = {}
    for stage in detail["stages"]:
        cases = _stage_cases(slug, stage["key"])
        first_case_by_stage[stage["key"]] = cases[0]["id"] if cases else None
    industry_solution = next(
        (item for item in SOLUTIONS if item["industry_slug"] == slug), None
    )
    return render_template(
        "industries/detail.html",
        industry=detail,
        industries=INDUSTRIES,
        first_case_by_stage=first_case_by_stage,
        industry_solution=industry_solution,
    )


@app.route("/industries/<industry_slug>/<stage_key>")
def industry_stage_page(industry_slug: str, stage_key: str):
    industry, stage, stage_index = _industry_stage_by_keys(industry_slug, stage_key)
    if not industry or not stage:
        abort(404)

    prev_stage = industry["stages"][stage_index - 1] if stage_index > 0 else None
    next_stage = (
        industry["stages"][stage_index + 1]
        if stage_index < len(industry["stages"]) - 1
        else None
    )
    return render_template(
        "industries/stage.html",
        industry=industry,
        stage=stage,
        prev_stage=prev_stage,
        next_stage=next_stage,
        stage_cases=_stage_cases(industry_slug, stage_key),
    )


@app.route("/industries/<industry_slug>/<stage_key>/<case_id>")
def industry_case_page(industry_slug: str, stage_key: str, case_id: str):
    industry, stage, case, stage_index = _industry_stage_case_by_keys(
        industry_slug, stage_key, case_id
    )
    if not industry or not stage or not case:
        abort(404)

    prev_stage = industry["stages"][stage_index - 1] if stage_index > 0 else None
    next_stage = (
        industry["stages"][stage_index + 1]
        if stage_index < len(industry["stages"]) - 1
        else None
    )
    return render_template(
        "industries/case.html",
        industry=industry,
        stage=stage,
        case=case,
        prev_stage=prev_stage,
        next_stage=next_stage,
    )


@app.route("/projects/<slug>")
def project_page(slug: str):
    meta = _project_by_slug(slug)
    if not meta:
        abort(404)
    return render_template(f"projects/{slug}.html", project=meta, all_projects=PROJECTS)


@app.route("/solutions/travel-hotel")
def solution_travel_hotel():
    return render_template("solutions/travel-hotel.html")


@app.post("/api/survey/build-queue")
def survey_build_queue():
    """按上传文件顺序解析，生成待调用队列（Excel 行 / PPT 页 / PDF 页）。"""
    files = request.files.getlist("files")
    if not files or not any(f.filename for f in files):
        return jsonify({"error": "请至少上传一个文件"}), 400

    skip_first = request.form.get("skip_first_row") in ("1", "true", "on", "yes")
    ordered: list[tuple[str, bytes]] = []

    for f in files:
        if not f.filename:
            continue
        name = secure_filename(f.filename)
        data = f.read()
        if not data:
            continue
        ordered.append((name, data))

    if not ordered:
        return jsonify({"error": "文件为空"}), 400

    items, warnings = build_queue_from_files(ordered, skip_first_excel_row=skip_first)
    for i, it in enumerate(items):
        it["index"] = i + 1

    return jsonify({"items": items, "warnings": warnings, "count": len(items)})


@app.post("/api/survey/run")
def survey_run():
    """
    按队列顺序依次 POST 到用户配置的 Agent URL。
    请求体示例见下方 JSON 结构（便于对接后端）。
    """
    data = request.get_json(silent=True) or {}
    items = data.get("items") or []
    api_url = (data.get("apiUrl") or "").strip()
    api_key = (data.get("apiKey") or "").strip()
    global_text = (data.get("globalText") or "").strip()

    if not api_url:
        return jsonify({"error": "未配置 Agent API 地址"}), 400
    if not items:
        return jsonify({"error": "队列为空"}), 400
    if len(items) > 500:
        return jsonify({"error": "单次最多处理 500 条"}), 400

    headers = {"Content-Type": "application/json", "Accept": "application/json"}
    if api_key:
        headers["Authorization"] = f"Bearer {api_key}"

    results: list[dict] = []
    for it in items:
        payload = {
            "instruction": global_text,
            "chunk": it.get("text", ""),
            "chunk_type": it.get("kind", "unknown"),
            "meta": it.get("meta") or {},
            "label": it.get("label", ""),
        }
        try:
            r = requests.post(api_url, json=payload, headers=headers, timeout=120)
            body_preview = r.text[:8000] if r.text else ""
            try:
                body_json = r.json()
            except json.JSONDecodeError:
                body_json = None
            results.append(
                {
                    "ok": r.ok,
                    "status": r.status_code,
                    "label": it.get("label"),
                    "body_text": body_preview,
                    "body_json": body_json,
                }
            )
        except requests.RequestException as e:
            results.append(
                {
                    "ok": False,
                    "status": None,
                    "label": it.get("label"),
                    "error": str(e),
                }
            )

    return jsonify({"results": results})


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5001)
