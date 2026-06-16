(function () {
  "use strict";

  var SCRIPT_BASE_URL =
    document.currentScript && document.currentScript.src ? document.currentScript.src : document.baseURI;
  var backgroundChangeTimer = null;

  var CAP_CHANNELS = {
    app: {
      background: "../imgs/cap-deluxe-suite.png",
      title: "APP Push · 行前入住提醒",
      copy: "主动触达 Aurora Hotel 到店前宾客，点击后由 GPTBots AI Agent 承接问答、偏好采集与服务引导。",
      status: "AI Agent Online",
      chatLabel: "Live",
      guest: "明天几点可以入住？我想确认早餐和机场接送。",
      agent: "您的房间 15:00 后可入住。我可以帮您确认早餐偏好，并把机场接送需求同步给前台团队。",
      offerTitle: "入住前偏好确认",
      offerMeta: "早餐 · 接送 · 会员权益",
      ticketState: "Open",
      ticketTitle: "Pre-arrival Preferences",
      ticketCopy: "早餐偏好、机场接送和延迟退房权益已进入待确认队列。",
      ticketStatus: "AI Agent Handling",
      profileTag: "VIP Gold",
      profilePref: "安静楼层 · 海景房 · 含早餐",
      phoneStatus: "Online",
      phoneGuest: "我想确认明天入住和机场接送。",
      phoneAgent: "可以，我会为您确认接送需求，并同步早餐偏好。",
      phoneNote: "需要人工确认时，Livedesk 会接手继续服务。",
      journeyStep: "engage",
    },
    webpush: {
      background: "../imgs/cap-executive-suite.png",
      title: "WebPush · 官网未订召回",
      copy: "对浏览房型但未下单的访客发起浏览器触达，GPTBots 继续解释价格、政策和可订方案。",
      status: "EngageLab Triggered",
      chatLabel: "Website",
      guest: "刚才看的海景房还有吗？取消政策能再说一下吗？",
      agent: "仍有可订房型。我会先说明取消政策，并可根据您的预算推荐更合适的套餐。",
      offerTitle: "海景房继续预订",
      offerMeta: "官网访客 · 未完成预订",
      ticketState: "Warm Lead",
      ticketTitle: "Abandoned Booking Follow-up",
      ticketCopy: "官网高意向访客已被 WebPush 召回，等待 AI Agent 完成转化引导。",
      ticketStatus: "Conversion Guidance",
      profileTag: "Returning Visitor",
      profilePref: "海景房 · 灵活取消 · 双早",
      phoneStatus: "Web session",
      phoneGuest: "我从官网提醒点进来，想继续看刚才的房型。",
      phoneAgent: "我已找到您刚才浏览的套餐，可以继续帮您比较权益和取消政策。",
      phoneNote: "未下单用户可进入 MA 旅程，继续通过 Push/Email 触达。",
      journeyStep: "awareness",
    },
    sms: {
      background: "../imgs/cap-lobby-entrance.png",
      title: "SMS · 关键节点确认",
      copy: "用短信覆盖高到达率场景，包括订单确认、入住提醒、服务工单状态和紧急通知。",
      status: "SMS Delivered",
      chatLabel: "Ticket",
      guest: "短信里说服务单已派单，多久能送到房间？",
      agent: "服务单 HS-240815-018 已派给客房团队，预计 12 分钟内送达。",
      offerTitle: "服务单进度通知",
      offerMeta: "工单状态 · 高到达率",
      ticketState: "In Progress",
      ticketTitle: "Room Service Ticket",
      ticketCopy: "洗漱用品、儿童拖鞋和温水已完成派单，短信同步服务进度。",
      ticketStatus: "Housekeeping Assigned",
      profileTag: "In-house",
      profilePref: "轻敲门 · 儿童用品 · 温水",
      phoneStatus: "SMS link",
      phoneGuest: "我收到短信，想确认服务单状态。",
      phoneAgent: "服务团队已经接单，送达前会轻敲门。",
      phoneNote: "住中服务异常会自动提示 Livedesk 人工护航。",
      journeyStep: "serve",
    },
    whatsapp: {
      background: "../imgs/cap-pool.png",
      title: "WhatsApp · 海外宾客对话",
      copy: "海外宾客通过 WhatsApp 咨询交通、房型和特殊需求，GPTBots 多语言接待，人工随时兜底。",
      status: "Multi-channel Active",
      chatLabel: "WhatsApp",
      guest: "Do you have airport transfer service for tomorrow?",
      agent: "Yes, we can arrange airport transfer for you. Would you like me to add this request to your booking?",
      offerTitle: "Airport Transfer Request",
      offerMeta: "Overseas guest · Multi-language",
      ticketState: "Open",
      ticketTitle: "Airport Transfer",
      ticketCopy: "海外宾客接送需求已采集，等待前台确认车辆和时间。",
      ticketStatus: "Front Desk Confirming",
      profileTag: "Overseas",
      profilePref: "Airport transfer · English support",
      phoneStatus: "WhatsApp",
      phoneGuest: "Can you add airport transfer to my booking?",
      phoneAgent: "Yes. I will collect your arrival time and pass it to the front desk.",
      phoneNote: "复杂交通安排可转 Livedesk 坐席继续跟进。",
      journeyStep: "assist",
    },
    email: {
      background: "../imgs/cap-hotel-wedding.png",
      title: "Email · 长内容资料发送",
      copy: "Email 用于发送宴会方案、套餐资料、会员权益说明和售后资料，并回流打开/点击行为。",
      status: "Email Sent",
      chatLabel: "Lead",
      guest: "可以发一份会议厅和餐饮方案给我吗？",
      agent: "可以。我会把会议厅、茶歇、餐饮和房晚组合方案发送到您的邮箱，并同步销售顾问。",
      offerTitle: "会议宴会资料包",
      offerMeta: "会议厅 · 餐饮 · 房晚",
      ticketState: "Lead",
      ticketTitle: "Event Sales Material",
      ticketCopy: "会议宴会资料已通过 Email 发送，打开与点击行为将回流 MA 标签。",
      ticketStatus: "Sales Follow-up",
      profileTag: "Event Lead",
      profilePref: "120 人会议 · 茶歇 · 房晚",
      phoneStatus: "Email follow-up",
      phoneGuest: "我想收到会议方案和报价资料。",
      phoneAgent: "资料已发送。销售顾问可以基于您的预算继续确认厅型。",
      phoneNote: "高价值线索将由宴会销售人工跟进。",
      journeyStep: "follow",
    },
    ma: {
      background: "../imgs/cap-pool.png",
      title: "MA Journey · 全旅程编排",
      copy: "EngageLab MA 把住前、住中、住后串成自动旅程，让触达、问答、工单和复购形成闭环。",
      status: "Journey Running",
      chatLabel: "Journey",
      guest: "我下次入住还有会员权益吗？",
      agent: "根据您的入住记录，可进入复购权益旅程。我可以推荐下次入住套餐并保留偏好。",
      offerTitle: "离店复购旅程",
      offerMeta: "满意度 · 权益 · 二次预订",
      ticketState: "Automated",
      ticketTitle: "Post-stay Journey",
      ticketCopy: "满意度回访、会员权益提醒和二次入住优惠已进入自动旅程。",
      ticketStatus: "Loyalty Nurturing",
      profileTag: "Loyalty",
      profilePref: "复购权益 · 积分 · 常住房型",
      phoneStatus: "MA journey",
      phoneGuest: "这次入住不错，下次还有什么会员权益？",
      phoneAgent: "我可以根据您的历史偏好推荐下一次入住权益。",
      phoneNote: "行为标签会回流给 GPTBots 与 Livedesk。",
      journeyStep: "loyalty",
    },
    livedesk: {
      background: "../imgs/cap-lobby-entrance.png",
      title: "Live Desk · 人工护航兜底",
      copy: "投诉、紧急服务、复杂政策和高价值线索由 Livedesk 接管，AI 已采集信息同步给人工团队。",
      status: "Human Backup Ready",
      chatLabel: "Handoff",
      guest: "这个问题我需要人工马上处理。",
      agent: "我已整理您的诉求、房号、历史对话和优先级，正在转接 Livedesk 人工团队。",
      offerTitle: "人工接管摘要",
      offerMeta: "投诉 · 紧急 · 高价值线索",
      ticketState: "Priority",
      ticketTitle: "Livedesk Handoff",
      ticketCopy: "AI Agent 已把意图、字段和会话摘要同步给人工坐席，减少重复沟通。",
      ticketStatus: "Human Agent Assigned",
      profileTag: "Priority",
      profilePref: "紧急优先 · 人工跟进 · SLA",
      phoneStatus: "Human support",
      phoneGuest: "我需要人工处理这个问题。",
      phoneAgent: "人工团队已收到完整上下文，会继续为您处理。",
      phoneNote: "人工处理结果可继续回写旅程和标签。",
      journeyStep: "serve",
    },
    agent: {
      background: "../imgs/cap-deluxe-suite.png",
      title: "AI Agent · 24 小时智能管家",
      copy: "GPTBots AI Agent 承接全流程问答、知识库检索、偏好推荐、字段采集和流程引导。",
      status: "GPTBots Active",
      chatLabel: "AI Agent",
      guest: "帮我选一个适合亲子入住的套餐。",
      agent: "我会结合人数、预算、床型、早餐和历史偏好，为您推荐更适合亲子入住的房型和服务。",
      offerTitle: "个性化套餐推荐",
      offerMeta: "知识库 · 偏好 · 流程采集",
      ticketState: "Assisted",
      ticketTitle: "AI Concierge Session",
      ticketCopy: "AI Agent 正在结合知识库与历史偏好完成推荐，并在复杂需求时提示人工介入。",
      ticketStatus: "Answering & Collecting",
      profileTag: "Personalized",
      profilePref: "亲子入住 · 早餐 · 安静房间",
      phoneStatus: "AI concierge",
      phoneGuest: "我带孩子入住，怎么选房更合适？",
      phoneAgent: "我可以根据孩子年龄、预算和偏好推荐房型，并确认加床和早餐政策。",
      phoneNote: "AI 管家覆盖住前、住中和住后咨询。",
      journeyStep: "assist",
    },
  };

  function setText(id, value) {
    var el = document.getElementById(id);
    if (el && value != null) el.textContent = value;
  }

  function setChannelPanel(key) {
    var data = CAP_CHANNELS[key];
    var root = document.getElementById("capabilities");
    var consoleEl = document.getElementById("sol-cap-console");
    var panelEl = document.getElementById("sol-cap-panel");
    if (!data || !root) return;

    if (backgroundChangeTimer !== null) {
      window.clearTimeout(backgroundChangeTimer);
      backgroundChangeTimer = null;
    }

    if (consoleEl && data.background) {
      var backgroundEl = consoleEl.querySelector(".sol-cap-console__background");
      var backgroundUrl = new URL(data.background, SCRIPT_BASE_URL).href;
      var reduceMotion =
        typeof window.matchMedia === "function" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (!backgroundEl || reduceMotion) {
        if (backgroundEl) backgroundEl.classList.remove("is-changing");
        consoleEl.style.setProperty("--sol-cap-bg", 'url("' + backgroundUrl + '")');
      } else {
        backgroundEl.classList.add("is-changing");
        var timer = window.setTimeout(function () {
          consoleEl.style.setProperty("--sol-cap-bg", 'url("' + backgroundUrl + '")');
          window.requestAnimationFrame(function () {
            if (backgroundChangeTimer !== timer) return;
            backgroundEl.classList.remove("is-changing");
            backgroundChangeTimer = null;
          });
        }, 120);
        backgroundChangeTimer = timer;
      }
    }

    setText("sol-cap-context-title", data.title);
    setText("sol-cap-context-copy", data.copy);
    setText("sol-cap-status", data.status);
    setText("sol-cap-chat-label", data.chatLabel);
    setText("sol-cap-chat-guest", data.guest);
    setText("sol-cap-chat-agent", data.agent);
    setText("sol-cap-offer-title", data.offerTitle);
    setText("sol-cap-offer-meta", data.offerMeta);
    setText("sol-cap-ticket-state", data.ticketState);
    setText("sol-cap-ticket-title", data.ticketTitle);
    setText("sol-cap-ticket-copy", data.ticketCopy);
    setText("sol-cap-ticket-status", data.ticketStatus);
    setText("sol-cap-profile-tag", data.profileTag);
    setText("sol-cap-profile-pref", data.profilePref);
    setText("sol-cap-phone-status", data.phoneStatus);
    setText("sol-cap-phone-guest", data.phoneGuest);
    setText("sol-cap-phone-agent", data.phoneAgent);
    setText("sol-cap-phone-note", data.phoneNote);

    var activeButton = null;
    root.querySelectorAll(".sol-cap-channel").forEach(function (btn) {
      var active = btn.getAttribute("data-cap-channel") === key;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-selected", active ? "true" : "false");
      btn.setAttribute("tabindex", active ? "0" : "-1");
      if (active) activeButton = btn;
    });

    if (panelEl && activeButton) {
      panelEl.setAttribute("aria-labelledby", activeButton.id || "sol-cap-tab-" + key);
    }

    root.querySelectorAll(".sol-cap-journey__step").forEach(function (step) {
      step.classList.toggle("is-active", step.getAttribute("data-step") === data.journeyStep);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    var root = document.getElementById("capabilities");
    if (root) {
      var channels = Array.prototype.slice.call(root.querySelectorAll(".sol-cap-channel"));
      channels.forEach(function (el, index) {
        var key = el.getAttribute("data-cap-channel");
        if (!key || !CAP_CHANNELS[key]) return;

        el.addEventListener("click", function () {
          setChannelPanel(key);
        });
        el.addEventListener("keydown", function (event) {
          var targetIndex;

          switch (event.key) {
            case "ArrowDown":
            case "ArrowRight":
              targetIndex = (index + 1) % channels.length;
              break;
            case "ArrowUp":
            case "ArrowLeft":
              targetIndex = (index - 1 + channels.length) % channels.length;
              break;
            case "Home":
              targetIndex = 0;
              break;
            case "End":
              targetIndex = channels.length - 1;
              break;
            default:
              return;
          }

          event.preventDefault();
          var target = channels[targetIndex];
          var targetKey = target.getAttribute("data-cap-channel");
          target.focus();
          setChannelPanel(targetKey);
        });
      });

      setChannelPanel("app");
    }

    var progressNav = document.querySelector(".sol-progress");
    if (progressNav) {
      var progressLinks = Array.prototype.slice.call(progressNav.querySelectorAll(".sol-progress__dot"));
      var progressSections = progressLinks
        .map(function (link) {
          var id = link.getAttribute("data-target");
          return id ? document.getElementById(id) : null;
        })
        .filter(Boolean);

      function setProgress(index) {
        progressLinks.forEach(function (link, idx) {
          var isActive = idx === index;
          var isPassed = idx < index;
          link.classList.toggle("is-active", isActive);
          link.classList.toggle("is-passed", isPassed);
          if (isActive) {
            link.setAttribute("aria-current", "true");
          } else {
            link.removeAttribute("aria-current");
          }
        });
      }

      function getActiveIndex() {
        if (!progressSections.length) return 0;
        var triggerLine = window.scrollY + window.innerHeight * 0.4;
        var activeIndex = 0;
        progressSections.forEach(function (section, idx) {
          if (section.offsetTop <= triggerLine) {
            activeIndex = idx;
          }
        });
        return activeIndex;
      }

      var ticking = false;
      function refreshProgress() {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(function () {
          setProgress(getActiveIndex());
          ticking = false;
        });
      }

      setProgress(getActiveIndex());
      window.addEventListener("scroll", refreshProgress, { passive: true });
      window.addEventListener("resize", refreshProgress);
      progressLinks.forEach(function (link, idx) {
        link.addEventListener("click", function () {
          setProgress(idx);
        });
      });
    }

    var lightbox = document.getElementById("sol-lightbox");
    var lightboxImg = document.getElementById("sol-lightbox-img");
    if (!lightbox || !lightboxImg) return;

    var closeEls = lightbox.querySelectorAll("[data-lightbox-close]");
    var lastTrigger = null;

    function openLightbox(trigger) {
      var src = trigger.getAttribute("data-lightbox-src");
      if (!src) return;
      var alt = trigger.getAttribute("data-lightbox-alt") || "";
      lastTrigger = trigger;
      lightboxImg.src = src;
      lightboxImg.alt = alt;
      lightbox.hidden = false;
      lightbox.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      var closeBtn = lightbox.querySelector(".sol-lightbox__close");
      if (closeBtn) closeBtn.focus();
    }

    function closeLightbox() {
      lightbox.hidden = true;
      lightbox.setAttribute("aria-hidden", "true");
      lightboxImg.src = "";
      lightboxImg.alt = "";
      document.body.style.overflow = "";
      if (lastTrigger) lastTrigger.focus();
    }

    document.querySelectorAll(".js-lightbox-trigger").forEach(function (trigger) {
      trigger.addEventListener("click", function () {
        openLightbox(trigger);
      });
      trigger.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openLightbox(trigger);
        }
      });
    });

    closeEls.forEach(function (el) {
      el.addEventListener("click", closeLightbox);
    });

    var calendlyModal = document.getElementById("sol-calendly-modal");
    var openBookingBtn = document.getElementById("sol-cap-open-booking");

    function openCalendlyModal() {
      if (!calendlyModal) return;
      calendlyModal.hidden = false;
      calendlyModal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      var closeBtn = calendlyModal.querySelector(".sol-calendly-modal__close");
      if (closeBtn) closeBtn.focus();
    }

    function closeCalendlyModal() {
      if (!calendlyModal) return;
      calendlyModal.hidden = true;
      calendlyModal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      if (openBookingBtn) openBookingBtn.focus();
    }

    if (openBookingBtn) {
      openBookingBtn.addEventListener("click", openCalendlyModal);
    }

    if (calendlyModal) {
      calendlyModal.querySelectorAll("[data-calendly-close]").forEach(function (el) {
        el.addEventListener("click", closeCalendlyModal);
      });
    }

    document.addEventListener("keydown", function (event) {
      if (event.key !== "Escape") return;
      if (calendlyModal && !calendlyModal.hidden) {
        closeCalendlyModal();
        return;
      }
      if (lightbox && !lightbox.hidden) {
        closeLightbox();
      }
    });

  });
})();
