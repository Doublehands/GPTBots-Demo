(function () {
  var root = document.querySelector(".survey-page");
  if (!root) return;

  var slug = root.getAttribute("data-project-slug") || "business-survey";
  var fileInput = document.getElementById("survey-file-input");
  var drop = document.getElementById("survey-file-drop");
  var fileListEl = document.getElementById("survey-file-list");
  var skipFirst = document.getElementById("survey-skip-first");
  var globalText = document.getElementById("survey-global-text");
  var btnBuild = document.getElementById("survey-btn-build");
  var btnRun = document.getElementById("survey-btn-run");
  var queueMeta = document.getElementById("survey-queue-meta");
  var warningsEl = document.getElementById("survey-warnings");
  var queueBody = document.getElementById("survey-queue-body");
  var logEl = document.getElementById("survey-log");

  /** @type {File[]} */
  var files = [];
  /** @type {any[]|null} */
  var queueItems = null;

  function renderFileList() {
    fileListEl.innerHTML = "";
    files.forEach(function (f, i) {
      var li = document.createElement("li");
      li.className = "survey-file-row";
      li.innerHTML =
        '<span class="survey-file-row__order">' +
        (i + 1) +
        "</span>" +
        '<span class="survey-file-row__name" title="' +
        escapeAttr(f.name) +
        '">' +
        escapeHtml(f.name) +
        "</span>" +
        '<button type="button" class="survey-icon-btn" data-move="up" data-i="' +
        i +
        '" ' +
        (i === 0 ? "disabled" : "") +
        ">↑</button>" +
        '<button type="button" class="survey-icon-btn" data-move="down" data-i="' +
        i +
        '" ' +
        (i === files.length - 1 ? "disabled" : "") +
        ">↓</button>" +
        '<button type="button" class="survey-icon-btn" data-remove="' +
        i +
        '">移除</button>';
      fileListEl.appendChild(li);
    });
    btnBuild.disabled = files.length === 0;
    btnRun.disabled = true;
    queueItems = null;
    queueMeta.textContent = "尚未生成队列";
    queueBody.innerHTML = "";
    warningsEl.hidden = true;
  }

  function escapeHtml(s) {
    var d = document.createElement("div");
    d.textContent = s;
    return d.innerHTML;
  }

  function escapeAttr(s) {
    return String(s).replace(/"/g, "&quot;");
  }

  function addFiles(fileList) {
    for (var i = 0; i < fileList.length; i++) {
      files.push(fileList[i]);
    }
    renderFileList();
  }

  fileInput.addEventListener("change", function () {
    if (fileInput.files && fileInput.files.length) {
      addFiles(fileInput.files);
      fileInput.value = "";
    }
  });

  drop.addEventListener("dragover", function (e) {
    e.preventDefault();
    drop.style.borderColor = "rgba(0, 113, 227, 0.45)";
  });
  drop.addEventListener("dragleave", function () {
    drop.style.borderColor = "";
  });
  drop.addEventListener("drop", function (e) {
    e.preventDefault();
    drop.style.borderColor = "";
    if (e.dataTransfer.files && e.dataTransfer.files.length) {
      addFiles(e.dataTransfer.files);
    }
  });

  fileListEl.addEventListener("click", function (e) {
    var t = e.target;
    if (t.getAttribute("data-remove") !== null) {
      var ri = parseInt(t.getAttribute("data-remove"), 10);
      files.splice(ri, 1);
      renderFileList();
      return;
    }
    var move = t.getAttribute("data-move");
    if (move && t.getAttribute("data-i") !== null) {
      var i = parseInt(t.getAttribute("data-i"), 10);
      if (move === "up" && i > 0) {
        var a = files[i - 1];
        files[i - 1] = files[i];
        files[i] = a;
      } else if (move === "down" && i < files.length - 1) {
        var b = files[i + 1];
        files[i + 1] = files[i];
        files[i] = b;
      }
      renderFileList();
    }
  });

  btnBuild.addEventListener("click", function () {
    var fd = new FormData();
    files.forEach(function (f) {
      fd.append("files", f, f.name);
    });
    fd.append("skip_first_row", skipFirst.checked ? "1" : "0");

    btnBuild.disabled = true;
    queueMeta.textContent = "正在解析…";

    fetch("/api/survey/build-queue", { method: "POST", body: fd })
      .then(function (r) {
        return r.json().then(function (j) {
          return { ok: r.ok, status: r.status, body: j };
        });
      })
      .then(function (res) {
        btnBuild.disabled = files.length === 0;
        if (!res.ok) {
          queueMeta.textContent = res.body.error || "解析失败";
          queueItems = null;
          btnRun.disabled = true;
          return;
        }
        queueItems = res.body.items || [];
        var w = res.body.warnings || [];
        queueMeta.textContent = "共 " + (res.body.count || queueItems.length) + " 条，将按顺序调用 Agent";
        warningsEl.hidden = w.length === 0;
        if (w.length) {
          warningsEl.innerHTML = "<strong>提示</strong><ul>" + w.map(function (x) {
            return "<li>" + escapeHtml(x) + "</li>";
          }).join("") + "</ul>";
        }
        queueBody.innerHTML = "";
        queueItems.forEach(function (it) {
          var tr = document.createElement("tr");
          tr.innerHTML =
            "<td>" +
            it.index +
            "</td><td>" +
            escapeHtml(it.kind || "") +
            "</td><td>" +
            escapeHtml((it.text || "").slice(0, 200)) +
            (it.text && it.text.length > 200 ? "…" : "") +
            "</td>";
          queueBody.appendChild(tr);
        });
        btnRun.disabled = queueItems.length === 0;
      })
      .catch(function (err) {
        btnBuild.disabled = files.length === 0;
        queueMeta.textContent = "请求失败：" + err.message;
        queueItems = null;
        btnRun.disabled = true;
      });
  });

  btnRun.addEventListener("click", function () {
    if (!queueItems || !queueItems.length) return;
    var cfg = window.GPTBotsApiConfig.get(slug);
    if (!cfg.apiUrl) {
      logEl.textContent = "请先在「API 配置」中填写 Agent API 地址。";
      logEl.classList.remove("survey-log--empty");
      return;
    }

    btnRun.disabled = true;
    logEl.textContent = "正在顺序请求…\n";
    logEl.classList.remove("survey-log--empty");

    fetch("/api/survey/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: queueItems,
        globalText: globalText.value.trim(),
        apiUrl: cfg.apiUrl,
        apiKey: cfg.apiKey || "",
      }),
    })
      .then(function (r) {
        return r.json().then(function (j) {
          return { ok: r.ok, body: j };
        });
      })
      .then(function (res) {
        btnRun.disabled = queueItems.length === 0;
        if (!res.ok) {
          logEl.textContent = JSON.stringify(res.body, null, 2);
          return;
        }
        var lines = [];
        (res.body.results || []).forEach(function (row, idx) {
          lines.push("--- #" + (idx + 1) + " " + (row.label || "") + " ---");
          if (row.error) lines.push("错误: " + row.error);
          else {
            lines.push("HTTP " + row.status + " ok=" + row.ok);
            if (row.body_json != null) lines.push(JSON.stringify(row.body_json, null, 2));
            else if (row.body_text) lines.push(row.body_text);
          }
          lines.push("");
        });
        logEl.textContent = lines.join("\n") || "(无返回)";
      })
      .catch(function (err) {
        btnRun.disabled = queueItems.length === 0;
        logEl.textContent = "请求失败：" + err.message;
      });
  });

  renderFileList();
})();
