/* ==========================================================================
   Mero Billing – Case Study
   1. Mobile menu
   2. Information-architecture connector line
   3. Image lightbox
   ========================================================================== */
(function () {
  'use strict';
 
  /* ---------- 1. Mobile menu ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var panel = document.getElementById('menu-panel');
 
  function setMenu(open) {
    if (!toggle || !panel) return;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    panel.classList.toggle('is-open', open);
  }
 
  if (toggle && panel) {
    toggle.addEventListener('click', function () {
      setMenu(toggle.getAttribute('aria-expanded') !== 'true');
    });
 
    // close when a link is chosen, on Escape, or when clicking outside
    panel.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setMenu(false);
    });
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.site-nav')) setMenu(false);
    });
 
    // reset when resizing up to desktop
    window.addEventListener('resize', function () {
      if (window.innerWidth > 760) setMenu(false);
    });
  }
 
  /* ---------- 2. IA diagram: horizontal connector ----------
     The bar runs from the centre of the first top-level node to the centre
     of the last one. Widths depend on the font, so it is measured, not guessed. */
  var ia = document.querySelector('[data-ia]');
 
  function drawIA() {
    if (!ia) return;
    var branches = ia.querySelector('.ia__branches');
    var nodes = branches.querySelectorAll(':scope > .ia__branch > .node--l1');
    if (nodes.length < 2) return;
 
    var base = branches.getBoundingClientRect();
    var first = nodes[0].getBoundingClientRect();
    var last = nodes[nodes.length - 1].getBoundingClientRect();
 
    var left = first.left + first.width / 2 - base.left;
    var right = last.left + last.width / 2 - base.left;
 
    branches.style.setProperty('--line-left', left + 'px');
    branches.style.setProperty('--line-width', (right - left) + 'px');
  }
 
  if (ia) {
    drawIA();
    window.addEventListener('resize', drawIA);
    window.addEventListener('load', drawIA);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(drawIA);
  }
 
  /* ---------- 3. Lightbox ---------- */
  var box = document.getElementById('lightbox');
  var boxImg = box && box.querySelector('.lightbox__img');
  var closeBtn = box && box.querySelector('.lightbox__close');
  var lastFocus = null;
 
  function openBox(img) {
    lastFocus = document.activeElement;
    boxImg.src = img.currentSrc || img.src;
    boxImg.alt = img.alt;
    box.hidden = false;
    document.body.classList.add('is-locked');
    closeBtn.focus();
  }
 
  function closeBox() {
    box.hidden = true;
    boxImg.removeAttribute('src');
    document.body.classList.remove('is-locked');
    if (lastFocus) lastFocus.focus();
  }
 
  if (box) {
    document.addEventListener('click', function (e) {
      var trigger = e.target.closest('.zoomable');
      if (trigger) {
        var img = trigger.querySelector('img');
        if (img) openBox(img);
      }
    });
 
    box.addEventListener('click', function (e) {
      // close on backdrop, image, or the X – but not while panning a scrolled image
      if (e.target === box || e.target === boxImg || e.target.closest('.lightbox__close') ||
          e.target.classList.contains('lightbox__scroll')) {
        closeBox();
      }
    });
 
    document.addEventListener('keydown', function (e) {
      if (box.hidden) return;
      if (e.key === 'Escape') closeBox();
      if (e.key === 'Tab') { e.preventDefault(); closeBtn.focus(); } // keep focus inside the dialog
    });
  }
})();
 