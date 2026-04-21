"""GPTBots AI Demo — 聚合主页与各独立子项目。"""

from __future__ import annotations

import json

import requests
from flask import Flask, abort, jsonify, render_template, request
from werkzeug.utils import secure_filename

from survey_parser import build_queue_from_files

app = Flask(__name__)
app.config["MAX_CONTENT_LENGTH"] = 52 * 1024 * 1024  # 52MB

# 子项目元数据：slug 对应 templates/projects/<slug>.html
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


@app.route("/")
def index():
    return render_template("index.html", projects=PROJECTS)


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
