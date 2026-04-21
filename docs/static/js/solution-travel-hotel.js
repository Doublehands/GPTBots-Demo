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
      title: "无缝预订指导",
      guest: "下周五入住、周日离店，两大一小。想要连通房，尽量离电梯远些，含双早。能信用卡担保吗？",
      agent1:
        "12–14 层家庭连通房可订，已标注远离电梯井一侧。含双早，支持信用卡担保；入住前一日 18:00 前可免费取消。\n\n" +
        "需要我先为您锁价 10 分钟吗？",
      guest2: "先不锁价。儿童早餐怎么算？加床政策呢？",
      agent:
        "儿童 1.2m 以下早餐半价，以上按成人；加床视房型可加，费用以订单为准。\n\n" +
        "点击「立即预约」打开日历，可选时段并与顾问确认人数、床型与发票信息。",
      primary: "立即预约",
      secondary: "转人工",
    },
    faq: {
      title: "即时 FAQ 支持",
      guest: "班车？泳池、健身房要预约吗？加床怎么收费？",
      agent:
        "网约车优惠与地铁指引可查；泳池 6:30–22:00（高峰可能限流）；加床以订单确认为准。\n\n" +
        "附图：公区入口与泳池实景。",
      primary: "设施一页通",
      secondary: "问前台",
    },
    rooms: {
      title: "可视化房型发现",
      guest: "行政 vs 豪华套房？出差要安静写报告，预算约 1500/晚。",
      agent:
        "豪华：客厅+卧室，桌 1.2m。行政：高楼层+酒廊，桌更宽。\n\n" +
        "附图对比。要按朝向再筛吗？",
      primary: "对比实拍",
      secondary: "报价单",
    },
    service: {
      title: "客房服务助手",
      guest: "你好，能送一套洗漱和儿童拖鞋到房间吗？还想晚点送一壶温水。",
      agent1:
        "可以。请提供房号、希望送达的大概时间；如有食物过敏或早餐备注，也请说明，我帮您建服务单。",
      guest2: "房号 1808。小朋友牛奶过敏，早餐请不要配乳制品。温水希望约 30 分钟后送到，谢谢。",
      agent:
        "已记录房号 1808，并生成服务单 HS-240815-018；过敏信息已同步餐饮与客房。\n\n" +
        "进度见下表，送达前会轻敲门。改时间或加急请告诉我。",
      primary: "看进度",
      secondary: "加急",
    },
    events: {
      title: "婚礼及活动信息中心",
      guest: "婚宴约 120 人，明年 5 月周末，想看厅、餐饮与婚房。",
      agent:
        "大厅约 8m 层高，120 人圆桌；套餐与试菜可约。附图婚礼现场参考。\n\n" +
        "要锁销售沟通吗？",
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
    var root = document.getElementById("capabilities");
    if (!data || !guestEl || !agentEl || !primaryEl || !secondaryEl || !root) return;

    guestEl.textContent = data.guest;
    agentEl.textContent = data.agent;
    primaryEl.textContent = data.primary;
    secondaryEl.textContent = data.secondary;

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
