(function () {
  "use strict";

  var CAP_ROOM =
    typeof window !== "undefined" && window.__SOL_CAP_IMGS__ && typeof window.__SOL_CAP_IMGS__ === "object"
      ? window.__SOL_CAP_IMGS__
      : {};

  var CAP_REPLY =
    typeof window !== "undefined" && window.__SOL_CAP_REPLY_IMGS__ && typeof window.__SOL_CAP_REPLY_IMGS__ === "object"
      ? window.__SOL_CAP_REPLY_IMGS__
      : {};

  /** 与回复内配图顺序一一对应 */
  var CAP_REPLY_ALT = {
    faq: ["公区入口", "户外泳池"],
    rooms: ["豪华套房", "行政套房"],
    events: ["酒店婚礼现场"],
  };

  function getReplyImageUrls(key) {
    var list = CAP_REPLY[key];
    if (Array.isArray(list) && list.length) return list;
    var one = CAP_ROOM[key];
    return one ? [one] : [];
  }

  /** 五大核心能力：右侧对话示例（短文案以适配固定高度、无滚动） */
  var CAP_IMG = {
    booking: {
      title: "直连预订转化",
      summary: "从假日酒店官网、WhatsApp 或广告落地页进入的高意向宾客，由 GPTBots 完成房型、价格、取消政策和担保说明；EngageLab 对未完成预订用户通过 APP Push、WebPush、SMS、WhatsApp、Email 和 MA 旅程继续触达。",
      outcomes: ["减少前台重复答疑", "提升直订完成率", "保留高价值线索"],
      roles: {
        gptbots: "识别预算、日期、床型和会员诉求，调用房型知识库与预订流程节点。",
        engagelab: "对未完成预订、价格犹豫和会员权益咨询人群发起 MA 旅程触达。",
        livedesk: "在企业协议价、特殊担保或投诉场景中人工接管并记录跟进优先级。",
      },
      guest: "下周五入住假日酒店、周日离店，两大一小。想要连通房，尽量离电梯远些，含双早。能信用卡担保吗？",
      agent1:
        "Holiday Inn 12–14 层家庭连通房可订，已标注远离电梯井一侧。含双早，支持信用卡担保；入住前一日 18:00 前可免费取消。\n\n" +
        "需要我先为您锁价 10 分钟吗？",
      guest2: "先不锁价。儿童早餐怎么算？加床政策呢？",
      agent:
        "儿童 1.2m 以下早餐半价，以上按成人；加床视房型可加，费用以订单为准。\n\n" +
        "若您暂不下单，EngageLab 会在 2 小时后通过 WebPush/WhatsApp 发送房型保留提醒；点击「立即预约」可与顾问确认人数、床型与发票信息。",
      primary: "立即预约",
      secondary: "转人工",
    },
    faq: {
      title: "即时 FAQ 与设施咨询",
      summary: "GPTBots 基于假日酒店知识库回答班车、泳池、早餐、停车、会员权益等问题；异常、投诉或高价值咨询由 Livedesk 接管，避免信息断层。",
      outcomes: ["统一服务口径", "降低人工首响压力", "复杂问题快速升级"],
      roles: {
        gptbots: "连接 FAQ、设施、政策、会员权益和周边交通知识库，保持答复一致。",
        engagelab: "把常问问题沉淀为 MA 标签，为行前提醒、到店欢迎和复购活动分群。",
        livedesk: "接管高敏感问题、投诉和多语言咨询，并同步 GPTBots 会话上下文。",
      },
      guest: "假日酒店有机场班车吗？泳池、健身房要预约吗？加床怎么收费？",
      agent:
        "机场班车需提前 2 小时预约；泳池 6:30–22:00，高峰可能限流；健身房 24 小时开放；加床以订单房型确认为准。\n\n" +
        "附图：公区入口与泳池实景。若需要人工确认班车余位，我可以转 Livedesk。",
      primary: "设施一页通",
      secondary: "问前台",
    },
    rooms: {
      title: "房型与套餐推荐",
      summary: "GPTBots 根据差旅/亲子/会议场景推荐房型和套餐，解释价格、权益和升级理由；EngageLab 根据互动结果更新会员分层和后续营销旅程。",
      outcomes: ["提升套餐加购", "缩短比价决策", "沉淀会员偏好"],
      roles: {
        gptbots: "比较豪华、行政、亲子与长住套餐，结合预算和权益给出可解释推荐。",
        engagelab: "把房型兴趣、预算区间和权益偏好写入 MA，用于后续 Push/Email 精准触达。",
        livedesk: "处理团队价、长住协议价、发票和特殊账期等非标需求。",
      },
      guest: "假日酒店行政房和豪华套房怎么选？出差要安静写报告，预算约 1500/晚。",
      agent:
        "豪华套房适合会客，客厅+卧室；行政房更适合差旅，高楼层、行政酒廊、书桌更宽。\n\n" +
        "附图对比。若您是 IHG One Rewards 会员，我可以优先推荐含早餐和延迟退房权益的组合。",
      primary: "对比实拍",
      secondary: "报价单",
    },
    service: {
      title: "住中服务与工单闭环",
      summary: "住中服务由 GPTBots 收集房号、时间、过敏/偏好等关键信息；Livedesk 分派客房、餐饮或工程工单；EngageLab 回写行为，用于满意度和复购旅程。",
      outcomes: ["减少电话占线", "工单有状态可追踪", "服务偏好可复用"],
      roles: {
        gptbots: "在对话中收集服务细节，生成结构化工单并提示预计送达时间。",
        engagelab: "根据服务行为触发满意度、权益提醒和离店复购 MA 旅程。",
        livedesk: "分派客房/工程/餐饮任务，设置紧急程度并追踪 SLA 闭环。",
      },
      guest: "你好，能送一套洗漱和儿童拖鞋到假日酒店房间吗？还想晚点送一壶温水。",
      agent1:
        "可以。请提供房号、希望送达的大概时间；如有食物过敏或早餐备注，也请说明，我帮您建服务单。",
      guest2: "房号 1808。小朋友牛奶过敏，早餐请不要配乳制品。温水希望约 30 分钟后送到，谢谢。",
      agent:
        "已记录 Holiday Inn 1808 房，并生成服务单 HS-240815-018；过敏信息已同步餐饮与客房。\n\n" +
        "进度见下表，送达前会轻敲门。改时间或加急请告诉我。",
      primary: "看进度",
      secondary: "加急",
    },
    events: {
      title: "会议宴会与会员复购",
      summary: "GPTBots 承接婚宴、会议、企业活动和会员复购咨询，收集人数、日期、预算和场地偏好；EngageLab 以 MA 旅程持续培育线索，Livedesk 对高价值机会人工跟进。",
      outcomes: ["宴会线索不流失", "销售跟进更及时", "会员复购可运营"],
      roles: {
        gptbots: "询问活动日期、人数、预算、餐饮和房晚需求，输出可转交销售的摘要。",
        engagelab: "通过 Email、WhatsApp 和 APP Push 持续发送套餐资料、试菜提醒和会员复住权益。",
        livedesk: "宴会销售或会员运营专员接管高价值咨询，标记重要程度并闭环。",
      },
      guest: "假日酒店婚宴约 120 人，明年 5 月周末，想看厅、餐饮与婚房。",
      agent:
        "大厅约 8m 层高，适合 120 人圆桌；可组合婚房、试菜和宾客房价。附图婚礼现场参考。\n\n" +
        "我可以把需求摘要同步给 Livedesk 宴会销售，并由 EngageLab 发送套餐资料与试菜提醒。",
      primary: "套餐资料",
      secondary: "约顾问",
    },
  };

  function setCapPanel(key) {
    var data = CAP_IMG[key];
    var guestEl = document.getElementById("sol-cap-guest");
    var agentEl = document.getElementById("sol-cap-agent");
    var primaryEl = document.getElementById("sol-cap-action-primary");
    var secondaryEl = document.getElementById("sol-cap-action-secondary");
    var img0 = document.getElementById("sol-cap-media-0-img");
    var trig0 = document.getElementById("sol-cap-media-0-trigger");
    var img1 = document.getElementById("sol-cap-media-1-img");
    var trig1 = document.getElementById("sol-cap-media-1-trigger");
    var att = document.getElementById("sol-cap-reply-attachments");
    var bookingRow = document.getElementById("sol-cap-booking-row");
    var bookingAgent1El = document.getElementById("sol-cap-booking-agent-1");
    var guest2El = document.getElementById("sol-cap-guest-2");
    var serviceAgent1El = document.getElementById("sol-cap-service-agent-1");
    var serviceGuest2El = document.getElementById("sol-cap-service-guest-2");
    var serviceRich = document.getElementById("sol-cap-service-rich");
    var showcaseTitle = document.getElementById("sol-cap-showcase-title");
    var showcaseDesc = document.getElementById("sol-cap-showcase-desc");
    var outcomeEls = [
      document.getElementById("sol-cap-outcome-1"),
      document.getElementById("sol-cap-outcome-2"),
      document.getElementById("sol-cap-outcome-3"),
    ];
    var roleEls = {
      gptbots: document.getElementById("sol-cap-gptbots-role"),
      engagelab: document.getElementById("sol-cap-engagelab-role"),
      livedesk: document.getElementById("sol-cap-livedesk-role"),
    };
    var root = document.getElementById("capabilities");
    if (!data || !guestEl || !agentEl || !primaryEl || !secondaryEl || !root) return;

    guestEl.textContent = data.guest;
    agentEl.textContent = data.agent;
    primaryEl.textContent = data.primary;
    secondaryEl.textContent = data.secondary;

    if (showcaseTitle) showcaseTitle.textContent = data.title;
    if (showcaseDesc) showcaseDesc.textContent = data.summary || "";
    outcomeEls.forEach(function (el, index) {
      if (el) el.textContent = data.outcomes && data.outcomes[index] ? data.outcomes[index] : "";
    });
    Object.keys(roleEls).forEach(function (role) {
      if (roleEls[role] && data.roles && data.roles[role]) {
        roleEls[role].textContent = data.roles[role];
      }
    });

    if (key === "booking" && data.agent1 != null && bookingAgent1El && guest2El) {
      bookingAgent1El.textContent = data.agent1;
      guest2El.textContent = data.guest2;
      bookingAgent1El.hidden = false;
      bookingAgent1El.classList.remove("is-hidden");
      bookingAgent1El.setAttribute("aria-hidden", "false");
      guest2El.hidden = false;
      guest2El.classList.remove("is-hidden");
      guest2El.setAttribute("aria-hidden", "false");
    } else if (bookingAgent1El && guest2El) {
      bookingAgent1El.hidden = true;
      bookingAgent1El.classList.add("is-hidden");
      bookingAgent1El.setAttribute("aria-hidden", "true");
      guest2El.hidden = true;
      guest2El.classList.add("is-hidden");
      guest2El.setAttribute("aria-hidden", "true");
    }

    if (key === "service" && data.agent1 != null && serviceAgent1El && serviceGuest2El) {
      serviceAgent1El.textContent = data.agent1;
      serviceGuest2El.textContent = data.guest2;
      serviceAgent1El.hidden = false;
      serviceAgent1El.classList.remove("is-hidden");
      serviceAgent1El.setAttribute("aria-hidden", "false");
      serviceGuest2El.hidden = false;
      serviceGuest2El.classList.remove("is-hidden");
      serviceGuest2El.setAttribute("aria-hidden", "false");
    } else if (serviceAgent1El && serviceGuest2El) {
      serviceAgent1El.hidden = true;
      serviceAgent1El.classList.add("is-hidden");
      serviceAgent1El.setAttribute("aria-hidden", "true");
      serviceGuest2El.hidden = true;
      serviceGuest2El.classList.add("is-hidden");
      serviceGuest2El.setAttribute("aria-hidden", "true");
    }

    if (key === "booking") {
      primaryEl.classList.add("is-hidden");
      primaryEl.hidden = true;
    } else {
      primaryEl.classList.remove("is-hidden");
      primaryEl.hidden = false;
    }

    var urls = getReplyImageUrls(key);
    var alts = CAP_REPLY_ALT[key] || [];

    if (key === "booking") {
      if (bookingRow) {
        bookingRow.hidden = false;
        bookingRow.classList.remove("is-hidden");
      }
      if (serviceRich) {
        serviceRich.hidden = true;
        serviceRich.classList.add("is-hidden");
      }
      if (att) {
        att.hidden = true;
        att.classList.add("is-hidden");
      }
    } else if (key === "service") {
      if (bookingRow) {
        bookingRow.hidden = true;
        bookingRow.classList.add("is-hidden");
      }
      if (serviceRich) {
        serviceRich.hidden = false;
        serviceRich.classList.remove("is-hidden");
      }
      if (att) {
        att.hidden = true;
        att.classList.add("is-hidden");
      }
    } else {
      if (bookingRow) {
        bookingRow.hidden = true;
        bookingRow.classList.add("is-hidden");
      }
      if (serviceRich) {
        serviceRich.hidden = true;
        serviceRich.classList.add("is-hidden");
      }
      if (att) {
        att.hidden = false;
        att.classList.remove("is-hidden");
      }

      if (img0 && trig0 && urls[0]) {
        img0.src = urls[0];
        img0.alt = alts[0] || data.title + " 配图";
        trig0.setAttribute("data-lightbox-src", urls[0]);
        trig0.setAttribute("data-lightbox-alt", img0.alt);
      }

      if (img1 && trig1) {
        if (urls[1]) {
          img1.src = urls[1];
          img1.alt = alts[1] || data.title + " 配图 2";
          trig1.setAttribute("data-lightbox-src", urls[1]);
          trig1.setAttribute("data-lightbox-alt", img1.alt);
          trig1.hidden = false;
          trig1.classList.remove("is-hidden");
        } else {
          img1.removeAttribute("src");
          img1.alt = "";
          trig1.removeAttribute("data-lightbox-src");
          trig1.removeAttribute("data-lightbox-alt");
          trig1.hidden = true;
          trig1.classList.add("is-hidden");
        }
      }

      if (att) {
        att.setAttribute("data-count", urls.length > 1 ? "2" : "1");
      }
    }

    root.querySelectorAll(".sol-cap-row").forEach(function (btn) {
      var active = btn.getAttribute("data-cap-key") === key;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-selected", active ? "true" : "false");
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    var root = document.getElementById("capabilities");
    if (root) {
      function bindRow(el) {
        var key = el.getAttribute("data-cap-key");
        if (!key || !CAP_IMG[key]) return;

        el.addEventListener("mouseenter", function () {
          setCapPanel(key);
        });
        el.addEventListener("focus", function () {
          setCapPanel(key);
        });
        el.addEventListener("click", function () {
          setCapPanel(key);
        });
      }

      root.querySelectorAll(".sol-cap-row").forEach(bindRow);

      var first = Object.keys(CAP_IMG)[0];
      if (first) setCapPanel(first);
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
