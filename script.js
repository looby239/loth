(() => {
  const root = document.documentElement;
  const themeToggle = document.getElementById("theme-toggle");
  const themeLabel = document.getElementById("theme-label");
  const progressBar = document.getElementById("scroll-progress");
  const studioClock = document.getElementById("studio-clock");
  const dockLinks = document.querySelectorAll(".dock-link");
  const observedSections = document.querySelectorAll("[data-observe]");
  const subscribeForm = document.getElementById("subscribe-form");
  const emailInput = document.getElementById("email-input");
  const formStatus = document.getElementById("form-status");

  // Theme Toggle (Light / Dark — Open Design Token Switcher)
  const applyTheme = (theme) => {
    root.setAttribute("data-theme", theme);
    if (themeLabel) {
      themeLabel.textContent = theme === "dark" ? "LIGHT" : "DARK";
    }
    try {
      localStorage.setItem("loth-theme", theme);
    } catch {
      // Ignore storage errors in restricted contexts
    }
  };

  try {
    const saved = localStorage.getItem("loth-theme");
    if (saved === "dark" || saved === "light") {
      applyTheme(saved);
    }
  } catch {
    // Ignore
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const current = root.getAttribute("data-theme") === "dark" ? "dark" : "light";
      applyTheme(current === "dark" ? "light" : "dark");
    });
  }

  // Live Vietnam studio clock
  const updateClock = () => {
    if (!studioClock) return;
    try {
      const now = new Intl.DateTimeFormat("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Ho_Chi_Minh",
        hour12: false,
      }).format(new Date());
      studioClock.textContent = `SGN ${now}`;
    } catch {
      studioClock.textContent = "SGN ICT";
    }
  };
  updateClock();
  setInterval(updateClock, 30000);

  // Scroll progress bar
  const updateProgress = () => {
    if (!progressBar) return;
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0;
    progressBar.style.width = `${pct}%`;
  };
  updateProgress();
  window.addEventListener("scroll", updateProgress, { passive: true });

  // Active floating dock section indicator
  if ("IntersectionObserver" in window && observedSections.length) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.getAttribute("data-observe");
          dockLinks.forEach((link) => {
            link.classList.toggle("is-active", link.dataset.section === id);
          });
        });
      },
      { rootMargin: "-35% 0px -45% 0px", threshold: 0 }
    );
    observedSections.forEach((sec) => sectionObserver.observe(sec));
  }

  // Scroll reveal
  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -20px 0px" }
    );
    revealItems.forEach((el) => revealObserver.observe(el));
  } else {
    revealItems.forEach((el) => el.classList.add("is-visible"));
  }

  // Interactive Philosophy Spec Matrix
  const pillarData = [
    {
      code: "SPEC // 01",
      tag: "TECHNICAL FABRIC",
      title: "Thở cùng làn da trong mọi cường độ",
      desc: "Mỗi thước vải tại loth được tuyển chọn kỹ lưỡng với khả năng thấm hút ẩm tức thì, khô nhanh và mềm mại khi tiếp xúc — giúp bạn giữ trọn sự tập trung trong suốt buổi tập.",
      m1Label: "ĐỘ THOÁNG KHÍ",
      m1Val: "Tối ưu hóa vi sợi",
      m2Label: "CẢM GIÁC CHẠM",
      m2Val: "Mát & Giảm ma sát",
    },
    {
      code: "SPEC // 02",
      tag: "ARCHITECTURAL FIT",
      title: "Đường cắt kiến trúc cho nam và nữ",
      desc: "Thay vì chạy theo xu hướng ngắn hạn, chúng tôi nghiên cứu tỷ lệ cơ thể khi vận động để tạo nên phom dáng gọn gàng, tôn nét tự nhiên và giữ phom bền bỉ qua nhiều mùa.",
      m1Label: "CẤU TRÚC ĐƯỜNG MAY",
      m1Val: "Phẳng & Hạn chế cấn",
      m2Label: "BẢNG MÀU",
      m2Val: "Trung tính vượt thời gian",
    },
    {
      code: "SPEC // 03",
      tag: "EVERYDAY MOTION",
      title: "Một thiết kế, nhiều nhịp sống",
      desc: "Trang phục loth không khép lại sau cánh cửa phòng tập. Sự tinh giản trong thiết kế giúp bạn chuyển tiếp tự nhiên từ buổi chạy sáng đến công việc và những cuộc hẹn cuối ngày.",
      m1Label: "TÍNH ỨNG DỤNG",
      m1Val: "Tập luyện & Thường nhật",
      m2Label: "TRỌNG LƯỢNG",
      m2Val: "Siêu nhẹ khi di chuyển",
    },
  ];

  const pillarTabs = document.querySelectorAll(".pillar-tab");
  const pillarStage = document.getElementById("pillar-stage");
  const stageCode = document.getElementById("stage-code");
  const stageTag = document.getElementById("stage-tag");
  const stageTitle = document.getElementById("stage-title");
  const stageDesc = document.getElementById("stage-desc");
  const stageMetrics = document.getElementById("stage-metrics");

  pillarTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const idx = Number(tab.dataset.pillar);
      const item = pillarData[idx];
      if (!item || tab.classList.contains("is-active")) return;

      pillarTabs.forEach((t) => {
        t.classList.remove("is-active");
        t.setAttribute("aria-selected", "false");
      });
      tab.classList.add("is-active");
      tab.setAttribute("aria-selected", "true");

      if (pillarStage) {
        pillarStage.classList.add("is-switching");
        setTimeout(() => {
          if (stageCode) stageCode.textContent = item.code;
          if (stageTag) stageTag.textContent = item.tag;
          if (stageTitle) stageTitle.textContent = item.title;
          if (stageDesc) stageDesc.textContent = item.desc;
          if (stageMetrics) {
            stageMetrics.innerHTML = `
              <div class="stage-spec-box">
                <span class="mono-meta">${item.m1Label}</span>
                <strong>${item.m1Val}</strong>
              </div>
              <div class="stage-spec-box">
                <span class="mono-meta">${item.m2Label}</span>
                <strong>${item.m2Val}</strong>
              </div>
            `;
          }
          pillarStage.classList.remove("is-switching");
        }, 150);
      }
    });
  });

  // Subtle Custom Cursor (Desktop pointer only)
  const dot = document.getElementById("cursor-dot");
  const ring = document.getElementById("cursor-ring");
  if (dot && ring && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;
    let visible = false;

    window.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      if (!visible) {
        visible = true;
        ringX = mouseX;
        ringY = mouseY;
        dot.style.opacity = "1";
        ring.style.opacity = "1";
      }
    });

    const animateRing = () => {
      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      requestAnimationFrame(animateRing);
    };
    requestAnimationFrame(animateRing);

    document.querySelectorAll("a, button, input").forEach((el) => {
      el.addEventListener("mouseenter", () => ring.classList.add("is-hover"));
      el.addEventListener("mouseleave", () => ring.classList.remove("is-hover"));
    });
  }

  // Static newsletter form feedback
  if (subscribeForm && emailInput && formStatus) {
    subscribeForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const email = emailInput.value.trim();
      const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

      if (!isValid) {
        formStatus.textContent = "Vui lòng nhập một địa chỉ email hợp lệ.";
        formStatus.classList.add("is-error");
        emailInput.focus();
        return;
      }

      formStatus.classList.remove("is-error");
      formStatus.textContent = "Cảm ơn bạn đã đăng ký. loth sẽ sớm gửi tin mới đến bạn.";
      subscribeForm.reset();
    });
  }
})();
