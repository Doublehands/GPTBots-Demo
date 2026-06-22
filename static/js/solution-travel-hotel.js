(function () {
  "use strict";

  var DEMO_BRAND = "Aurora Hotel";
  var SCRIPT_BASE_URL =
    document.currentScript && document.currentScript.src ? document.currentScript.src : document.baseURI;
  var transitionTimers = new WeakMap();

  var TOUCHPOINT_CHANNELS = {
    app: {
      moment: "抵达前 72 小时",
      title: "一家人的假期，从从容出发开始",
      message: "入住提醒、机场接送、儿童俱乐部开放时间与早餐偏好已经为您整理好。",
      segment: "已预订的亲子家庭",
      trigger: "入住前 72 小时自动触发",
      objective: "降低行前不确定性并采集服务偏好",
    },
    webpush: {
      moment: "官网浏览后 30 分钟",
      title: "继续刚才心动的海岛家庭套餐",
      message: "您浏览的家庭套房仍可预订，灵活取消政策和儿童餐权益可以继续向智能管家咨询。",
      segment: "浏览房型但未完成预订的家庭",
      trigger: "高意向页面退出后自动召回",
      objective: "承接未完成预订并提升转化信心",
    },
    sms: {
      moment: "关键服务节点",
      title: "重要信息，用更高到达率及时确认",
      message: "接驳车辆已确认，司机将在航班抵达后于 3 号出口等候；服务变更可直接进入智能管家。",
      segment: "需要关键节点确认的宾客",
      trigger: "订单、接驳、工单或紧急状态变化",
      objective: "确保关键信息及时送达并减少服务遗漏",
    },
    whatsapp: {
      moment: "跨境咨询与行前沟通",
      title: "让国际宾客用熟悉的方式开始对话",
      message: "Airport transfer, family room options and children's activities are ready for your trip planning.",
      segment: "海外与多语言宾客",
      trigger: "宾客订阅或跨境旅程节点触发",
      objective: "降低语言与渠道门槛并连接连续服务",
    },
    email: {
      moment: "长内容与高价值方案",
      title: "把完整度假方案送进家庭决策清单",
      message: "房型对比、亲子活动日历、餐饮套餐和会员权益已整理为一封可回看的度假建议。",
      segment: "需要详细方案的家庭与团体客户",
      trigger: "资料申请、方案生成或会务线索形成",
      objective: "支撑长决策链并沉淀打开与点击行为",
    },
    ma: {
      moment: "全旅程自动编排",
      title: "每个行为，都成为下一次恰当服务的信号",
      message: "从预订提醒到住中关怀、满意度回访与下一季家庭活动，旅程按宾客状态持续推进。",
      segment: "不同生命周期与偏好的宾客分群",
      trigger: "行为、标签、订单与服务状态共同驱动",
      objective: "形成从获客、服务到复购的持续经营闭环",
    },
  };

  var CONCIERGE_MODES = {
    agent: {
      status: "GPTBots · 24/7 Online",
      title: "懂目的地，也记得每个家庭的偏好",
      role: "多语言问答、知识检索、个性化推荐、需求采集与服务流程引导。",
      guest: "两个孩子分别 5 岁和 9 岁，明天上午有什么适合全家的活动？",
      reply: "结合天气、年龄和您上次偏好的户外项目，我建议 09:30 的家庭帆船体验；我也可以一起确认早餐时段和接驳。",
      action: "采集参加人数并发起活动预约",
      actionStatus: "AI Handling",
      steps: [
        { text: "理解意图与家庭信息", state: "complete" },
        { text: "调用度假村知识与偏好", state: "active" },
        { text: "复杂场景转人工并保留上下文", state: "" },
      ],
      assurance: "标准需求由 AI 即时闭环，敏感、紧急或高价值场景由人工无缝接手。",
    },
    livedesk: {
      status: "Livedesk · Human Priority",
      title: "复杂时刻，由真正理解现场的人继续服务",
      role: "投诉、紧急住中服务、复杂政策、高价值机会，以及工单优先级、SLA 与闭环。",
      guest: "孩子身体不舒服，房间也需要尽快调整到离电梯更近的位置。",
      reply: "AI 已整理房号、家庭成员、当前需求和可用房型。人工坐席已接手，并将同步前台与值班经理优先处理。",
      action: "创建高优先级工单并同步现场团队",
      actionStatus: "Human Assigned",
      steps: [
        { text: "AI 汇总诉求与完整会话", state: "complete" },
        { text: "Livedesk 分配高优先级坐席", state: "complete" },
        { text: "现场团队处理并回写结果", state: "active" },
      ],
      assurance: "宾客无需重复描述问题，人工团队从完整上下文继续处理并负责结果。",
    },
  };

  var GUEST_JOURNEY = {
    prestay: {
      image: "../imgs/journey-prestay-family-v2.png",
      alt: "一家人共同规划度假行程",
      number: "01",
      moment: "Pre-stay · 住前",
      title: "把行前不确定，变成值得期待的准备",
      scenario: "从目的地与套餐咨询，到未完成预订召回、交通指引、儿童活动和餐饮偏好采集。",
      engagelab: "识别旅程节点并主动触达",
      gptbots: "承接问答、推荐与信息采集",
      livedesk: "处理复杂政策与高价值机会",
      outcome: "提高响应与预订信心，让服务准备发生在到店之前",
    },
    instay: {
      image: "../imgs/journey-instay-family-v2.png",
      alt: "一家人在度假村享受连续服务",
      number: "02",
      moment: "In-stay · 住中",
      title: "每一个即时需求，都能找到最快的处理路径",
      scenario: "设施与活动问答、餐饮和客房需求、维修工单、服务进度，以及紧急或敏感问题升级。",
      engagelab: "在欢迎、活动与服务节点发送关怀",
      gptbots: "即时受理高频需求并创建结构化任务",
      livedesk: "接管紧急场景并协调现场闭环",
      outcome: "缩短等待与重复沟通，让现场团队把精力留给真正需要判断的服务",
    },
    poststay: {
      image: "../imgs/journey-poststay-family-v2.png",
      alt: "宾客离店后继续获得会员与复购服务",
      number: "03",
      moment: "Post-stay · 住后",
      title: "离店不是结束，而是下一次家庭记忆的开始",
      scenario: "满意度回访、发票积分与遗失物咨询、会员权益提醒、个性化复购和季节活动培育。",
      engagelab: "按满意度、偏好与季节编排持续旅程",
      gptbots: "处理售后问答并推荐下一次合适方案",
      livedesk: "跟进客诉恢复与高价值复购机会",
      outcome: "沉淀可复用家庭偏好，把一次入住转化为长期宾客关系",
    },
  };

  function setText(id, value) {
    var element = document.getElementById(id);
    if (element && value != null) element.textContent = value;
  }

  function prefersReducedMotion() {
    return (
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }

  function transitionPanel(panel, render) {
    if (!panel || prefersReducedMotion()) {
      render();
      if (panel) panel.classList.remove("is-transitioning");
      return;
    }

    var previousTimer = transitionTimers.get(panel);
    if (previousTimer) window.clearTimeout(previousTimer);
    panel.classList.add("is-transitioning");

    var timer = window.setTimeout(function () {
      render();
      window.requestAnimationFrame(function () {
        panel.classList.remove("is-transitioning");
        transitionTimers.delete(panel);
      });
    }, 90);
    transitionTimers.set(panel, timer);
  }

  function setupTabs(config) {
    var root = document.getElementById(config.rootId);
    var panel = document.getElementById(config.panelId);
    if (!root || !panel) return;

    var tabs = Array.prototype.slice.call(root.querySelectorAll(config.tabSelector));
    if (!tabs.length) return;

    function activate(key, focusTab) {
      var activeTab = null;
      tabs.forEach(function (tab) {
        var active = tab.getAttribute(config.dataAttribute) === key;
        tab.classList.toggle("is-active", active);
        tab.setAttribute("aria-selected", active ? "true" : "false");
        tab.setAttribute("tabindex", active ? "0" : "-1");
        if (active) activeTab = tab;
      });

      if (!activeTab) return;
      panel.setAttribute("aria-labelledby", activeTab.id);
      transitionPanel(panel, function () {
        config.render(key);
      });
      if (focusTab) activeTab.focus();
    }

    tabs.forEach(function (tab, index) {
      tab.addEventListener("click", function () {
        activate(tab.getAttribute(config.dataAttribute), false);
      });

      tab.addEventListener("keydown", function (event) {
        var nextIndex;
        if (event.key === "ArrowRight" || event.key === "ArrowDown") {
          nextIndex = (index + 1) % tabs.length;
        } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
          nextIndex = (index - 1 + tabs.length) % tabs.length;
        } else if (event.key === "Home") {
          nextIndex = 0;
        } else if (event.key === "End") {
          nextIndex = tabs.length - 1;
        } else {
          return;
        }
        event.preventDefault();
        activate(tabs[nextIndex].getAttribute(config.dataAttribute), true);
      });
    });

    activate(config.defaultKey, false);
  }

  function renderTouchpoint(key) {
    var data = TOUCHPOINT_CHANNELS[key];
    if (!data) return;
    setText("touchpoint-moment", data.moment);
    setText("touchpoint-title", data.title);
    setText("touchpoint-message", data.message);
    setText("touchpoint-segment", data.segment);
    setText("touchpoint-trigger", data.trigger);
    setText("touchpoint-objective", data.objective);
  }

  function renderConcierge(key) {
    var data = CONCIERGE_MODES[key];
    if (!data) return;
    setText("concierge-status", data.status);
    setText("concierge-title", data.title);
    setText("concierge-role", data.role);
    setText("concierge-guest", data.guest);
    setText("concierge-reply", data.reply);
    setText("concierge-action", data.action);
    setText("concierge-action-status", data.actionStatus);
    setText("concierge-assurance", data.assurance);

    var steps = document.getElementById("concierge-steps");
    if (steps) {
      steps.replaceChildren();
      data.steps.forEach(function (step) {
        var item = document.createElement("li");
        item.textContent = step.text;
        if (step.state) item.classList.add("is-" + step.state);
        steps.appendChild(item);
      });
    }
  }

  function renderJourney(key) {
    var data = GUEST_JOURNEY[key];
    if (!data) return;
    var image = document.getElementById("journey-image");
    if (image) {
      image.src = new URL(data.image, SCRIPT_BASE_URL).href;
      image.alt = data.alt;
    }
    var number = document.querySelector(".sol-journey-stage__number");
    if (number) number.textContent = data.number;
    setText("journey-moment", data.moment);
    setText("journey-title", data.title);
    setText("journey-scenario", data.scenario);
    setText("journey-engagelab", "EngageLab · " + data.engagelab);
    setText("journey-gptbots", "GPTBots · " + data.gptbots);
    setText("journey-livedesk", "Livedesk · " + data.livedesk);
    setText("journey-outcome", data.outcome);
  }

  window.AuroraResortDemo = {
    TOUCHPOINT_CHANNELS: TOUCHPOINT_CHANNELS,
    CONCIERGE_MODES: CONCIERGE_MODES,
    GUEST_JOURNEY: GUEST_JOURNEY,
  };

  document.addEventListener("DOMContentLoaded", function () {
    setupTabs({
      rootId: "engagement-hub",
      panelId: "engagement-panel",
      tabSelector: "[data-touchpoint]",
      dataAttribute: "data-touchpoint",
      defaultKey: "app",
      render: renderTouchpoint,
    });

    setupTabs({
      rootId: "concierge-lobby",
      panelId: "concierge-panel",
      tabSelector: "[data-concierge-mode]",
      dataAttribute: "data-concierge-mode",
      defaultKey: "agent",
      render: renderConcierge,
    });

    setupTabs({
      rootId: "guest-journey",
      panelId: "journey-panel",
      tabSelector: "[data-journey-stage]",
      dataAttribute: "data-journey-stage",
      defaultKey: "prestay",
      render: renderJourney,
    });

    var messageAction = document.querySelector(".sol-message-action");
    if (messageAction) {
      messageAction.addEventListener("click", function () {
        document.getElementById("concierge-lobby").scrollIntoView({ behavior: "smooth" });
      });
    }

    var progressNav = document.querySelector(".sol-progress");
    if (progressNav) {
      var progressLinks = Array.prototype.slice.call(progressNav.querySelectorAll(".sol-progress__dot"));
      var sections = progressLinks
        .map(function (link) {
          return document.getElementById(link.getAttribute("data-target"));
        })
        .filter(Boolean);

      function updateProgress() {
        var triggerLine = window.scrollY + window.innerHeight * 0.42;
        var activeIndex = 0;
        sections.forEach(function (section, index) {
          if (section.offsetTop <= triggerLine) activeIndex = index;
        });
        progressLinks.forEach(function (link, index) {
          link.classList.toggle("is-active", index === activeIndex);
          link.classList.toggle("is-passed", index < activeIndex);
          if (index === activeIndex) link.setAttribute("aria-current", "true");
          else link.removeAttribute("aria-current");
        });
      }

      var ticking = false;
      function requestProgressUpdate() {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(function () {
          updateProgress();
          ticking = false;
        });
      }

      updateProgress();
      window.addEventListener("scroll", requestProgressUpdate, { passive: true });
      window.addEventListener("resize", requestProgressUpdate);
    }

    var modal = document.getElementById("sol-calendly-modal");
    var openButton = document.getElementById("sol-cap-open-booking");
    var lastFocus = null;

    function openModal() {
      if (!modal) return;
      lastFocus = document.activeElement;
      modal.hidden = false;
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      var closeButton = modal.querySelector(".sol-calendly-modal__close");
      if (closeButton) closeButton.focus();
    }

    function closeModal() {
      if (!modal) return;
      modal.hidden = true;
      modal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      if (lastFocus) lastFocus.focus();
    }

    if (openButton) openButton.addEventListener("click", openModal);
    if (modal) {
      modal.querySelectorAll("[data-calendly-close]").forEach(function (element) {
        element.addEventListener("click", closeModal);
      });
    }

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && modal && !modal.hidden) closeModal();
    });
  });
})();
