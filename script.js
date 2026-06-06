/* ── BACK TO TOP ─────────────────────────────────────── */
var btt = document.getElementById('back-to-top');
var progressBar = document.getElementById('progress-bar');
window.addEventListener('scroll', function() {
  if (btt) {
    if (window.scrollY > 400) {
      btt.style.display = 'flex';
    } else {
      btt.style.display = 'none';
    }
  }
  // Progress bar
  var docH = document.documentElement.scrollHeight - window.innerHeight;
  var pct = docH > 0 ? (window.scrollY / docH * 100).toFixed(1) : 0;
  if (progressBar) progressBar.style.setProperty('--progress', pct + '%');
}, { passive: true });

/* ── NAV TOGGLE ─────────────────────────────────────── */
function toggleNav() {
  var sidebar = document.getElementById('sidebar');
  if (sidebar) sidebar.classList.toggle('open');
}

document.addEventListener('click', function(e) {
  var sidebar = document.getElementById('sidebar');
  var toggle  = document.getElementById('nav-toggle');
  if (sidebar && toggle && sidebar.classList.contains('open') &&
      !sidebar.contains(e.target) &&
      !toggle.contains(e.target)) {
    sidebar.classList.remove('open');
  }
});

/* Close sidebar when a nav link is clicked on mobile */
document.querySelectorAll('.nav-link').forEach(function(link) {
  link.addEventListener('click', function() {
    if (window.innerWidth < 900) {
      var sidebar = document.getElementById('sidebar');
      if (sidebar) sidebar.classList.remove('open');
    }
  });
});

/* ── COPY CODE ───────────────────────────────────────── */
window.copyCode = function(btn) {
  var pre = btn.closest('.code-wrap').querySelector('pre');
  if (!pre) return;
  navigator.clipboard.writeText(pre.innerText).then(function() {
    btn.textContent = '✓ تم النسخ';
    btn.classList.add('copied');
    setTimeout(function() {
      btn.textContent = 'نسخ';
      btn.classList.remove('copied');
    }, 2000);
  });
};

/* ── ACTIVE NAV HIGHLIGHT ─────────────────── */
// Adapted to work across multiple pages instead of just scroll
function updateActiveNav() {
  var currentPath = window.location.pathname.split('/').pop();
  if (!currentPath || currentPath === '') currentPath = 'index.html';
  
  var navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(function(link) {
    var href = link.getAttribute('href');
    if (!href) return;
    link.classList.remove('active');
    
    // Exact match
    if (href.includes(currentPath)) {
      // Check hash if we are on the same page
      if (href.includes('#')) {
        var hash = href.split('#')[1];
        var sec = document.getElementById(hash);
        if (sec) {
          var top = sec.getBoundingClientRect().top;
          if (top >= 0 && top <= window.innerHeight / 2) {
             // Not perfect scrollspy but handles multi-page
          }
        }
      } else {
        link.classList.add('active');
      }
    }
  });

  // Simple ScrollSpy for sections on the current page
  var sections = document.querySelectorAll('.section');
  if (sections.length > 0) {
    var currentSec = '';
    var headerH = 80;
    sections.forEach(function(sec) {
      var top = sec.getBoundingClientRect().top;
      if (top <= headerH + 40) currentSec = sec.id;
    });
    
    if (currentSec) {
      navLinks.forEach(function(link) {
        if (link.getAttribute('href') === currentPath + '#' + currentSec || link.getAttribute('href') === '#' + currentSec) {
          // Remove active from others, add to this
          navLinks.forEach(function(l) { l.classList.remove('active'); });
          link.classList.add('active');
        }
      });
    }
  }
}

window.addEventListener('scroll', updateActiveNav, { passive: true });
// Run once on load
document.addEventListener('DOMContentLoaded', updateActiveNav);

/* ── PLAYGROUND ──────────────────────────────────────── */
(function() {
  var pgRows = 3, pgCols = 3;
  var headers = ['الاسم','المادة','الدرجة','الحالة','التاريخ','الملاحظة','الإجمالي'];
  var cellData = [
    ['أحمد','رياضيات','92','ممتاز','2025-01','—','92'],
    ['سارة','فيزياء','85','جيد جداً','2025-01','—','85'],
    ['خالد','كيمياء','71','جيد','2025-01','—','71'],
    ['ريم','أحياء','95','ممتاز','2025-01','—','95'],
    ['فارس','تاريخ','60','مقبول','2025-01','—','60'],
    ['منى','جغرافيا','88','جيد جداً','2025-01','—','88'],
    ['ياسر','إنجليزي','77','جيد','2025-01','—','77'],
    ['نور','عربي','91','ممتاز','2025-01','—','91']
  ];

  function renderPlayground() {
    var pgEl = document.getElementById('pg-preview');
    if (!pgEl) return;
    var border   = document.getElementById('pg-border').value;
    var padding  = parseInt(document.getElementById('pg-padding').value);
    var hasHead  = document.getElementById('pg-thead').checked;
    var zebra    = document.getElementById('pg-zebra').checked;
    var collapse = document.getElementById('pg-collapse').checked;
    var hasCaption = document.getElementById('pg-caption').checked;

    var pxPad = padding + 'px ' + (padding + 4) + 'px';
    var tStyle = 'border-collapse:' + (collapse ? 'collapse' : 'separate') + ';font-family:IBM Plex Sans Arabic,sans-serif;direction:rtl;width:100%;';

    var prevHtml = '<table border="' + border + '" style="' + tStyle + '">';
    var codeHtml = '<table border="' + border + '">';

    if (hasCaption) {
      prevHtml += '<caption style="font-weight:700;margin-bottom:8px;color:#1a1a2e;">بيانات الطلاب</caption>';
      codeHtml += '\n  <caption>بيانات الطلاب</caption>';
    }

    if (hasHead) {
      var hRow = '<tr>';
      var cRow = '<tr>';
      for (var c = 0; c < pgCols; c++) {
        var h = headers[c] || ('عمود ' + (c + 1));
        hRow += '<th style="padding:' + pxPad + ';background:#1a3a5c;color:#00c8ff;text-align:right;border:1px solid #2a5a8c;">' + h + '</th>';
        cRow += '<th>' + h + '</th>';
      }
      hRow += '</tr>'; cRow += '</tr>';
      prevHtml += '<thead>' + hRow + '</thead>';
      codeHtml += '\n  <thead>\n    ' + cRow + '\n  </thead>';
    }

    var tbodyPrev = '<tbody>', tbodyCode = '\n  <tbody>';
    for (var r = 0; r < pgRows; r++) {
      var bg = (zebra && r % 2 === 1) ? '#edf3f9' : '#fff';
      var trPrev = '<tr style="background:' + bg + '">';
      var trCode = '<tr>';
      for (var c2 = 0; c2 < pgCols; c2++) {
        var val = (cellData[r] && cellData[r][c2]) ? cellData[r][c2] : ('خلية ' + (r + 1) + '-' + (c2 + 1));
        trPrev += '<td style="padding:' + pxPad + ';color:#1a1a2e;border:1px solid #dee2e6;text-align:right;">' + val + '</td>';
        trCode += '<td>' + val + '</td>';
      }
      trPrev += '</tr>'; trCode += '</tr>';
      tbodyPrev += trPrev; tbodyCode += '\n    ' + trCode;
    }
    tbodyPrev += '</tbody>'; tbodyCode += '\n  </tbody>';
    prevHtml += tbodyPrev + '</table>';
    codeHtml += tbodyCode + '\n</table>';

    document.getElementById('pg-preview').innerHTML = prevHtml;
    document.getElementById('pg-code').textContent = codeHtml;
  }

  window.pgAdjust = function(dim, delta) {
    if (dim === 'rows') {
      pgRows = Math.max(1, Math.min(8, pgRows + delta));
      document.getElementById('pg-rows-val').textContent = pgRows;
    } else {
      pgCols = Math.max(1, Math.min(7, pgCols + delta));
      document.getElementById('pg-cols-val').textContent = pgCols;
    }
    renderPlayground();
  };

  function initPlayground() {
    var pgEl = document.getElementById('pg-preview');
    if (!pgEl) return; // Exit if not on playground page

    var ids = ['pg-border','pg-padding','pg-thead','pg-zebra','pg-collapse','pg-caption'];
    ids.forEach(function(id) {
      var el = document.getElementById(id);
      if (el) el.addEventListener('change', renderPlayground);
      if (el) el.addEventListener('input', renderPlayground);
    });
    var rDec = document.getElementById('pg-rows-dec');
    var rInc = document.getElementById('pg-rows-inc');
    var cDec = document.getElementById('pg-cols-dec');
    var cInc = document.getElementById('pg-cols-inc');
    if (rDec) rDec.addEventListener('click', function(){ pgAdjust('rows', -1); });
    if (rInc) rInc.addEventListener('click', function(){ pgAdjust('rows', 1); });
    if (cDec) cDec.addEventListener('click', function(){ pgAdjust('cols', -1); });
    if (cInc) cInc.addEventListener('click', function(){ pgAdjust('cols', 1); });
    var cpBtn = document.getElementById('pg-copy-btn');
    if (cpBtn) cpBtn.addEventListener('click', function() {
      var code = document.getElementById('pg-code').textContent;
      navigator.clipboard.writeText(code).then(function() {
        cpBtn.textContent = '✓ تم';
        setTimeout(function(){ cpBtn.textContent = 'نسخ'; }, 2000);
      });
    });
    renderPlayground();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPlayground);
  } else {
    initPlayground();
  }
})();

/* ── REFERENCE TABLE SEARCH ──────────────────────────── */
(function() {
  function initRefSearch() {
    var wrap = document.querySelector('.ref-table-wrap');
    if (!wrap) return; // Only run on reference page
    
    // To prevent adding multiple search boxes if called multiple times
    if (document.getElementById('ref-search-box')) return;

    var searchBox = document.createElement('input');
    searchBox.id = 'ref-search-box';
    searchBox.type = 'text';
    searchBox.placeholder = '🔍 ابحث في جدول المرجع...';
    searchBox.style.cssText = 'width:100%;padding:10px 16px;background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-sm);color:var(--text);font-family:inherit;font-size:0.88rem;margin-bottom:12px;direction:rtl;outline:none;';
    searchBox.addEventListener('focus', function(){ this.style.borderColor = 'var(--cyan)'; });
    searchBox.addEventListener('blur', function(){ this.style.borderColor = 'var(--border)'; });
    wrap.parentNode.insertBefore(searchBox, wrap);
    var refTable = wrap.querySelector('.ref-table tbody');
    if (!refTable) return;
    searchBox.addEventListener('input', function() {
      var q = this.value.toLowerCase();
      Array.from(refTable.rows).forEach(function(row) {
        var text = row.textContent.toLowerCase();
        row.style.display = text.includes(q) ? '' : 'none';
      });
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initRefSearch);
  } else {
    initRefSearch();
  }
})();
