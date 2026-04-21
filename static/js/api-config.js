/**
 * 按项目 slug 将 Agent API 配置存于 localStorage（演示用，生产请走后端或密钥托管）。
 */
(function () {
  var STORAGE_KEY = "gptbots_api_config_v1";

  function readAll() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    } catch (e) {
      return {};
    }
  }

  function writeAll(obj) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
  }

  window.GPTBotsApiConfig = {
    get: function (slug) {
      var all = readAll();
      return all[slug] || { apiUrl: "", apiKey: "" };
    },
    save: function (slug, cfg) {
      var all = readAll();
      all[slug] = {
        apiUrl: (cfg.apiUrl || "").trim(),
        apiKey: cfg.apiKey || "",
      };
      writeAll(all);
    },
  };

  function openModal(modal) {
    if (!modal) return;
    modal.hidden = false;
    document.documentElement.style.overflow = "hidden";
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.hidden = true;
    document.documentElement.style.overflow = "";
  }

  document.addEventListener("click", function (e) {
    var openBtn = e.target.closest("[data-api-config-open]");
    if (openBtn) {
      var slug = openBtn.getAttribute("data-project-slug");
      var modal = document.getElementById("api-config-modal-" + slug);
      if (!modal) return;
      var cfg = window.GPTBotsApiConfig.get(slug);
      var urlInput = modal.querySelector('[name="apiUrl"]');
      var keyInput = modal.querySelector('[name="apiKey"]');
      if (urlInput) urlInput.value = cfg.apiUrl || "";
      if (keyInput) keyInput.value = cfg.apiKey || "";
      openModal(modal);
      return;
    }

    var closeBtn = e.target.closest("[data-api-config-close]");
    if (closeBtn) {
      var m = closeBtn.closest(".api-modal");
      closeModal(m);
      return;
    }

    if (e.target.classList && e.target.classList.contains("api-modal")) {
      closeModal(e.target);
    }
  });

  document.addEventListener("submit", function (e) {
    var form = e.target;
    if (!form.classList || !form.classList.contains("api-config-form")) return;
    e.preventDefault();
    var slug = form.getAttribute("data-project-slug");
    var fd = new FormData(form);
    window.GPTBotsApiConfig.save(slug, {
      apiUrl: fd.get("apiUrl"),
      apiKey: fd.get("apiKey"),
    });
    var modal = form.closest(".api-modal");
    closeModal(modal);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    document.querySelectorAll(".api-modal:not([hidden])").forEach(function (m) {
      closeModal(m);
    });
  });
})();
