/**
 * VAISHNAVI MISHRA – AI ENGINEER PORTFOLIO
 * Interactive logic: 3D Neural Canvas, Web Audio Chime, Live IST Clock,
 * Command Palette (⌘K), Theme Engine, Project Filter, & Speech Synthesis.
 */

(function () {
  'use strict';

  // ==========================================
  // 1. THEME ENGINE (Black Dark Mode Default)
  // ==========================================
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const htmlRoot = document.documentElement;

  function initTheme() {
    // Default permanently to dark black aesthetic
    let currentTheme = localStorage.getItem('theme');
    if (!currentTheme || currentTheme === 'light') {
      currentTheme = 'dark';
      localStorage.setItem('theme', 'dark');
    }
    htmlRoot.setAttribute('data-theme', currentTheme);
  }

  function toggleTheme() {
    const currentTheme = htmlRoot.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    htmlRoot.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    showToast(`Switched to ${newTheme} mode`);
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', toggleTheme);
  }
  initTheme();

  // ==========================================
  // 2. SCROLL PROGRESS BAR
  // ==========================================
  const scrollProgressBar = document.getElementById('scroll-progress');
  window.addEventListener('scroll', () => {
    const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    if (scrollProgressBar) {
      scrollProgressBar.style.width = scrolled + '%';
    }
  }, { passive: true });

  // ==========================================
  // 3. LIVE IST CLOCK (Asia/Kolkata, GMT+5:30)
  // ==========================================
  const istClockElement = document.getElementById('live-ist-clock');
  function updateISTClock() {
    if (!istClockElement) return;
    const now = new Date();
    const options = {
      timeZone: 'Asia/Kolkata',
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    };
    const timeString = new Intl.DateTimeFormat('en-GB', options).format(now);
    istClockElement.textContent = `${timeString} IST`;
  }
  setInterval(updateISTClock, 1000);
  updateISTClock();

  // ==========================================
  // 4. WEB AUDIO SYNTH CHIME (Interactive Sound)
  // ==========================================
  let audioCtx = null;
  function playSynapticChime(freq = 523.25) {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!audioCtx) audioCtx = new AudioContext();
      if (audioCtx.state === 'suspended') audioCtx.resume();

      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, audioCtx.currentTime + 0.15);

      gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.35);

      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.35);
    } catch (e) {
      // Audio autoplay policy fallback
    }
  }

  // ==========================================
  // 5. INTERACTIVE NEURAL TENSOR CANVAS (Fig. 1)
  // ==========================================
  const canvas = document.getElementById('neural-canvas');
  const canvasContainer = document.getElementById('canvas-container');
  const metricDisplay = document.getElementById('neural-metric');

  if (canvas && canvasContainer) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let mouse = { x: 0, y: 0, targetX: 0, targetY: 0, isHovering: false };
    let ripples = [];

    function resizeCanvas() {
      const rect = canvasContainer.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Generate Neural Architecture Nodes (Input -> Latent Embeddings -> Attention -> Output)
    const layers = [3, 5, 6, 4, 2];
    const nodes = [];
    const connections = [];

    layers.forEach((count, layerIdx) => {
      const xPercent = (layerIdx + 1) / (layers.length + 1);
      for (let i = 0; i < count; i++) {
        const yPercent = (i + 1) / (count + 1);
        nodes.push({
          layer: layerIdx,
          origX: xPercent,
          origY: yPercent,
          x: 0,
          y: 0,
          radius: layerIdx === 2 ? 4.5 : 3.5,
          phase: Math.random() * Math.PI * 2,
          speed: 0.02 + Math.random() * 0.03,
          activation: Math.random()
        });
      }
    });

    // Generate synaptic weights between adjacent layers
    for (let i = 0; i < nodes.length; i++) {
      for (let j = 0; j < nodes.length; j++) {
        if (nodes[j].layer === nodes[i].layer + 1) {
          // Connect dense or partial
          if (Math.random() > 0.35) {
            connections.push({
              from: i,
              to: j,
              weight: Math.random(),
              pulseProgress: Math.random()
            });
          }
        }
      }
    }

    // Mouse tracking over canvas
    canvasContainer.addEventListener('mousemove', (e) => {
      const rect = canvasContainer.getBoundingClientRect();
      mouse.targetX = (e.clientX - rect.left) / rect.width - 0.5;
      mouse.targetY = (e.clientY - rect.top) / rect.height - 0.5;
      mouse.isHovering = true;
    });

    canvasContainer.addEventListener('mouseleave', () => {
      mouse.targetX = 0;
      mouse.targetY = 0;
      mouse.isHovering = false;
    });

    // Click triggers Synaptic Ripple & Web Audio
    canvasContainer.addEventListener('click', (e) => {
      const rect = canvasContainer.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      ripples.push({
        x: clickX,
        y: clickY,
        r: 5,
        maxR: Math.max(width, height) * 0.6,
        alpha: 1
      });

      // Fluctuate loss metric for interactive feedback
      if (metricDisplay) {
        const loss = (0.005 + Math.random() * 0.015).toFixed(4);
        const acc = (98.2 + Math.random() * 1.6).toFixed(1);
        metricDisplay.textContent = `LOSS: ${loss} | ACC: ${acc}%`;
      }

      playSynapticChime(587.33); // D5 note chime
    });

    // Animation Loop
    let frame = 0;
    function animateNeuralTensor() {
      frame++;
      // Smooth camera interpolation
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      ctx.clearRect(0, 0, width, height);

      const isDark = htmlRoot.getAttribute('data-theme') !== 'light';
      const nodeColor = isDark ? '#38bdf8' : '#0284c7';
      const edgeColor = isDark ? 'rgba(56, 189, 248, 0.15)' : 'rgba(2, 132, 199, 0.12)';
      const pulseColor = isDark ? '#ffffff' : '#09090b';

      // Update node positions with 3D perspective shift & subtle breathing oscillation
      nodes.forEach((node) => {
        const tiltX = mouse.x * 24 * (node.origX - 0.5);
        const tiltY = mouse.y * 24 * (node.origY - 0.5);
        const breath = Math.sin(frame * node.speed + node.phase) * 3;

        node.x = node.origX * width + tiltX;
        node.y = node.origY * height + tiltY + breath;
      });

      // Draw Connections & Synaptic Pulses
      connections.forEach((conn) => {
        const n1 = nodes[conn.from];
        const n2 = nodes[conn.to];

        ctx.beginPath();
        ctx.strokeStyle = edgeColor;
        ctx.lineWidth = conn.weight * 1.5;
        ctx.moveTo(n1.x, n1.y);
        ctx.lineTo(n2.x, n2.y);
        ctx.stroke();

        // Pulsing data packet travelling along synapse
        conn.pulseProgress += 0.012 + conn.weight * 0.01;
        if (conn.pulseProgress > 1) conn.pulseProgress = 0;

        const px = n1.x + (n2.x - n1.x) * conn.pulseProgress;
        const py = n1.y + (n2.y - n1.y) * conn.pulseProgress;

        ctx.beginPath();
        ctx.fillStyle = pulseColor;
        ctx.arc(px, py, 1.5, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw Nodes
      nodes.forEach((node) => {
        ctx.beginPath();
        ctx.fillStyle = nodeColor;
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fill();

        // Outer glow on active middle nodes
        if (node.layer === 2) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius + 3, 0, Math.PI * 2);
          ctx.strokeStyle = isDark ? 'rgba(56, 189, 248, 0.3)' : 'rgba(2, 132, 199, 0.25)';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      });

      // Draw Synaptic Ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.r += 4;
        r.alpha -= 0.025;

        if (r.alpha <= 0) {
          ripples.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(r.x, r.y, r.r, 0, Math.PI * 2);
        ctx.strokeStyle = isDark ? `rgba(56, 189, 248, ${r.alpha * 0.7})` : `rgba(2, 132, 199, ${r.alpha * 0.6})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      requestAnimationFrame(animateNeuralTensor);
    }
    requestAnimationFrame(animateNeuralTensor);
  }

  // ==========================================
  // 6. AUDIO NAME PRONOUNCE BUTTON
  // ==========================================
  const pronounceBtn = document.getElementById('pronounce-btn');
  if (pronounceBtn) {
    pronounceBtn.addEventListener('click', () => {
      pronounceBtn.classList.add('speaking');
      playSynapticChime(440); // A4 keynote

      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance("Vaishnavi Mishra");
        utterance.rate = 0.9;
        utterance.pitch = 1.0;
        utterance.onend = () => pronounceBtn.classList.remove('speaking');
        utterance.onerror = () => pronounceBtn.classList.remove('speaking');
        window.speechSynthesis.speak(utterance);
      } else {
        setTimeout(() => pronounceBtn.classList.remove('speaking'), 800);
      }
    });
  }

  // ==========================================
  // 7. PROJECT FILTER TABS
  // ==========================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // ==========================================
  // 8. COMMAND PALETTE (⌘K / Ctrl+K)
  // ==========================================
  const cmdDialog = document.getElementById('cmd-dialog');
  const cmdPaletteBtn = document.getElementById('cmd-palette-btn');
  const cmdCloseBtn = document.getElementById('cmd-close-btn');
  const cmdInput = document.getElementById('cmd-input');
  const cmdItems = document.querySelectorAll('.cmd-item');

  function openCommandPalette() {
    if (cmdDialog) {
      cmdDialog.showModal();
      if (cmdInput) {
        cmdInput.value = '';
        cmdInput.focus();
        filterCommands('');
      }
    }
  }

  function closeCommandPalette() {
    if (cmdDialog) {
      cmdDialog.close();
    }
  }

  if (cmdPaletteBtn) {
    cmdPaletteBtn.addEventListener('click', openCommandPalette);
  }

  if (cmdCloseBtn) {
    cmdCloseBtn.addEventListener('click', closeCommandPalette);
  }

  // Close dialog on clicking backdrop
  if (cmdDialog) {
    cmdDialog.addEventListener('click', (e) => {
      const rect = cmdDialog.getBoundingClientRect();
      const isInDialog = (
        rect.top <= e.clientY &&
        e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX &&
        e.clientX <= rect.left + rect.width
      );
      if (!isInDialog) {
        closeCommandPalette();
      }
    });
  }

  // Global Keyboard Shortcut: ⌘K or Ctrl+K
  window.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (cmdDialog && cmdDialog.open) {
        closeCommandPalette();
      } else {
        openCommandPalette();
      }
    }
  });

  // Filter commands in palette
  function filterCommands(query) {
    const q = query.toLowerCase().trim();
    cmdItems.forEach((item) => {
      const text = item.textContent.toLowerCase();
      if (text.includes(q)) {
        item.style.display = 'flex';
      } else {
        item.style.display = 'none';
      }
    });
  }

  if (cmdInput) {
    cmdInput.addEventListener('input', (e) => {
      filterCommands(e.target.value);
    });

    cmdInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const visibleItems = Array.from(cmdItems).filter((i) => i.style.display !== 'none');
        if (visibleItems.length > 0) {
          executeCommand(visibleItems[0]);
        }
      }
    });
  }

  cmdItems.forEach((item) => {
    item.addEventListener('click', () => {
      executeCommand(item);
    });
  });

  function executeCommand(item) {
    const action = item.getAttribute('data-action');
    const target = item.getAttribute('data-target');

    closeCommandPalette();

    switch (action) {
      case 'goto':
        if (target) {
          const el = document.querySelector(target);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }
        break;
      case 'copy-email':
        copyToClipboard('vm1985@srmist.edu.in', 'Email copied to clipboard!');
        break;
      case 'copy-phone':
        copyToClipboard('+916386061984', 'Phone number copied to clipboard!');
        break;
      case 'toggle-theme':
        toggleTheme();
        break;
      case 'open-github':
        window.open('https://github.com/gensine', '_blank');
        break;
      case 'open-linkedin':
        window.open('https://www.linkedin.com/in/vaishnavi-mishra-386935296', '_blank');
        break;
      default:
        break;
    }
  }

  // ==========================================
  // 9. CLIPBOARD & TOAST SYSTEM
  // ==========================================
  const toast = document.getElementById('toast');
  let toastTimer = null;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  function copyToClipboard(text, successMsg = 'Copied to clipboard!') {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        showToast(successMsg);
      }).catch(() => {
        fallbackCopy(text, successMsg);
      });
    } else {
      fallbackCopy(text, successMsg);
    }
  }

  function fallbackCopy(text, successMsg) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      showToast(successMsg);
    } catch (err) {
      showToast('Failed to copy');
    }
    document.body.removeChild(textArea);
  }

  const copyEmailBtn = document.getElementById('copy-email-btn');
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      const email = copyEmailBtn.getAttribute('data-email') || 'vm1985@srmist.edu.in';
      copyToClipboard(email, 'Email copied: vm1985@srmist.edu.in');
    });
  }

  // ==========================================
  // 10. GITHUB CONTRIBUTIONS CALENDAR MATRIX
  // ==========================================
  const githubCalendar = document.getElementById('github-calendar');
  if (githubCalendar) {
    const totalWeeks = 48;
    const daysPerWeek = 7;
    const fragment = document.createDocumentFragment();

    for (let w = 0; w < totalWeeks; w++) {
      for (let d = 0; d < daysPerWeek; d++) {
        const cell = document.createElement('div');
        cell.className = 'calendar-cell';
        
        const rand = Math.random();
        let level = 0;
        let commits = 0;
        if (rand > 0.35) {
          level = 1;
          commits = Math.floor(Math.random() * 3) + 1;
        }
        if (rand > 0.65) {
          level = 2;
          commits = Math.floor(Math.random() * 4) + 3;
        }
        if (rand > 0.85) {
          level = 3;
          commits = Math.floor(Math.random() * 5) + 6;
        }
        if (rand > 0.94) {
          level = 4;
          commits = Math.floor(Math.random() * 8) + 10;
        }

        cell.classList.add(`lvl-${level}`);
        cell.title = commits === 0 ? 'No contributions' : `${commits} contributions on week ${w + 1}`;
        cell.addEventListener('click', () => {
          playSynapticChime(400 + level * 80);
          showToast(commits === 0 ? 'Rest day' : `${commits} commits pushed!`);
        });

        fragment.appendChild(cell);
      }
    }
    githubCalendar.appendChild(fragment);
  }

})();
