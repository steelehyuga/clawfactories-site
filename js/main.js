/* ClawFactories — Main JS */

(function () {
  'use strict';

  /* --- Pipeline Canvas Animation --- */
  var canvas = document.getElementById('pipeline-canvas');
  if (canvas) {
    var ctx = canvas.getContext('2d');
    var W, H, nodes, particles, animFrame;

    var AGENT_NODES = [
      { label: 'ORCHESTRATOR', role: 'hub' },
      { label: 'WRITER',       role: 'agent' },
      { label: 'EDITOR',       role: 'agent' },
      { label: 'MARKETER',     role: 'agent' },
    ];

    var ACCENT  = 'rgba(59, 130, 246,';   // blue
    var GOLD    = 'rgba(234, 179, 8,';    // amber
    var MUTED   = 'rgba(255,255,255,';

    function resize() {
      var rect = canvas.parentElement.getBoundingClientRect();
      W = canvas.width  = Math.round(rect.width  || 480);
      H = canvas.height = Math.round(rect.height || 420);
      buildLayout();
    }

    function buildLayout() {
      var cx = W * 0.5, cy = H * 0.5;
      var r  = Math.min(W, H) * 0.3;
      nodes = [];

      // Hub in centre
      nodes.push({ x: cx, y: cy, label: 'ORCHESTRATOR', role: 'hub', pulse: 0 });

      // Three agents arranged around the hub
      var angles = [-90, 30, 150]; // top, bottom-right, bottom-left
      var agentLabels = ['WRITER', 'EDITOR', 'MARKETER'];
      agentLabels.forEach(function(lbl, i) {
        var rad = (angles[i] * Math.PI) / 180;
        nodes.push({
          x: cx + r * Math.cos(rad),
          y: cy + r * Math.sin(rad),
          label: lbl,
          role: 'agent',
          pulse: 0,
          pulseOffset: i * 0.33
        });
      });

      particles = [];
    }

    function spawnParticle() {
      if (nodes.length < 2) return;
      // Pick a random agent → hub OR hub → agent
      var agentIdx = 1 + Math.floor(Math.random() * 3);
      var toHub    = Math.random() > 0.4;
      var from     = toHub ? nodes[agentIdx] : nodes[0];
      var to       = toHub ? nodes[0]        : nodes[agentIdx];
      particles.push({
        x: from.x, y: from.y,
        tx: to.x,  ty: to.y,
        prog: 0,
        speed: 0.006 + Math.random() * 0.006,
        color: toHub ? GOLD : ACCENT,
        size: 2.5 + Math.random() * 1.5,
      });
    }

    function draw(ts) {
      ctx.clearRect(0, 0, W, H);

      // Spawn particles periodically
      if (!draw._last || ts - draw._last > 320) {
        spawnParticle();
        draw._last = ts;
      }

      // Draw edges
      nodes.forEach(function(node, i) {
        if (i === 0) return; // skip hub-to-hub
        var hub = nodes[0];
        var grad = ctx.createLinearGradient(hub.x, hub.y, node.x, node.y);
        grad.addColorStop(0,   ACCENT + '0.25)');
        grad.addColorStop(0.5, ACCENT + '0.12)');
        grad.addColorStop(1,   ACCENT + '0.06)');
        ctx.beginPath();
        ctx.strokeStyle = grad;
        ctx.lineWidth   = 1.5;
        ctx.setLineDash([6, 6]);
        ctx.lineDashOffset = -(ts * 0.02);
        ctx.moveTo(hub.x, hub.y);
        ctx.lineTo(node.x, node.y);
        ctx.stroke();
        ctx.setLineDash([]);
      });

      // Draw particles
      particles = particles.filter(function(p) {
        p.prog += p.speed;
        if (p.prog >= 1) return false;
        var t  = p.prog;
        var ease = t < 0.5 ? 2*t*t : -1+(4-2*t)*t; // ease in-out
        p.x = nodes[0].x + (p.tx - nodes[0].x) * (p.tx === nodes[0].x ? t : ease);
        // linear interpolation
        var lx = p.x + (p.tx - p.x) * 0 ; // already set above — just interpolate directly
        var ix = (p.tx === nodes[0].x)
          ? nodes.find(function(n){ return n.x === p.tx && n.y === p.ty; }) || nodes[0]
          : nodes[0];
        lx = ix.x + (p.tx - ix.x) * ease;
        var ly = ix.y + (p.ty - ix.y) * ease;

        ctx.beginPath();
        ctx.arc(lx, ly, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color + (0.9 - p.prog * 0.6) + ')';
        ctx.fill();

        // Glow
        ctx.beginPath();
        ctx.arc(lx, ly, p.size * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = p.color + (0.15 - p.prog * 0.1) + ')';
        ctx.fill();
        return true;
      });

      // Draw nodes
      nodes.forEach(function(node) {
        var isHub  = node.role === 'hub';
        var radius = isHub ? 36 : 28;

        // Outer ring pulse
        node.pulse = (node.pulse + (isHub ? 0.018 : 0.014)) % (Math.PI * 2);
        var pulseR = radius + 10 + Math.sin(node.pulse) * 5;
        ctx.beginPath();
        ctx.arc(node.x, node.y, pulseR, 0, Math.PI * 2);
        ctx.strokeStyle = (isHub ? GOLD : ACCENT) + '0.12)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Glow halo
        var glow = ctx.createRadialGradient(node.x, node.y, radius * 0.5, node.x, node.y, radius * 2.2);
        glow.addColorStop(0,   (isHub ? GOLD : ACCENT) + '0.18)');
        glow.addColorStop(1,   (isHub ? GOLD : ACCENT) + '0)');
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius * 2.2, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        // Node circle background
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
        ctx.fillStyle   = isHub ? 'rgba(30,24,8,0.95)' : 'rgba(10,14,26,0.95)';
        ctx.strokeStyle = isHub ? GOLD + '0.6)' : ACCENT + '0.45)';
        ctx.lineWidth   = isHub ? 2 : 1.5;
        ctx.fill();
        ctx.stroke();

        // Label
        ctx.fillStyle  = isHub ? GOLD + '1)' : MUTED + '0.85)';
        ctx.font       = isHub ? '700 9px "Space Grotesk", sans-serif'
                               : '500 8px "DM Sans", sans-serif';
        ctx.textAlign  = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(node.label, node.x, node.y);
      });

      animFrame = requestAnimationFrame(draw);
    }

    window.addEventListener('resize', function() {
      cancelAnimationFrame(animFrame);
      resize();
      animFrame = requestAnimationFrame(draw);
    });

    resize();
    animFrame = requestAnimationFrame(draw);
  }
  /* --- END Pipeline Canvas --- */

  /* --- Smooth scroll for anchor links --- */
  document.addEventListener('click', function (e) {
    var anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;

    var id = anchor.getAttribute('href');
    if (id.length < 2) return;

    var target = document.querySelector(id);
    if (!target) return;

    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  /* --- Fade-in on scroll (IntersectionObserver) --- */
  var fadeEls = document.querySelectorAll('.fade-in');

  if ('IntersectionObserver' in window && fadeEls.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    fadeEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback: show everything immediately
    fadeEls.forEach(function (el) {
      el.classList.add('visible');
    });
  }
})();
