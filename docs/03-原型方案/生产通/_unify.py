"""Unify 生产通 portal sidebar branding and portalNav."""
import re

with open('生产通.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Brand the portal sidebar logo
content = content.replace(
    '<div class="logo"><i class="fas fa-th-large"></i> 一站式管理门户</div>',
    '<div class="logo"><span style="display:flex;align-items:center;gap:8px"><span style="font-weight:900;font-style:italic;font-size:22px;letter-spacing:-1px;color:#60A5FA;line-height:1">XTEP</span><span style="font-size:14px;color:rgba(255,255,255,.3);font-weight:300;line-height:1">|</span><span style="font-weight:600;font-size:15px;line-height:1">生产通 · 管理门户</span></span><div style="font-size:10px;color:rgba(255,255,255,.25);margin-top:2px;letter-spacing:1px">特步 · 一站式管理平台</div></div>'
)

# 2. Add icon to g-label
content = content.replace(
    '<div class="g-label">业务模块</div>',
    '<div class="g-label"><i class="fas fa-cogs"></i> 业务模块</div>'
)

# 3. Remove onclick handlers from portal nav items
content = re.sub(
    r'<button class="nav-item active" data-portal="portal-dashboard" onclick="portalNav\(\'portal-dashboard\',this\)">',
    '<button class="nav-item active" data-portal="portal-dashboard">',
    content
)
content = re.sub(
    r'<button class="nav-item" data-portal="([^"]+)" onclick="portalNav\(\'[^\']+\',this\)">',
    r'<button class="nav-item" data-portal="\1">',
    content
)

# 4. Replace portalNav function (2-param) with 1-param + event delegation
old_fn = '''function portalNav(id,btn){
  document.querySelectorAll('.portal-page').forEach(function(p){p.classList.remove('active')});
  var el=document.getElementById(id);if(el){el.classList.add('active')}
  document.querySelectorAll('.portal-sidebar .nav-item').forEach(function(n){n.classList.remove('active')});
  if(btn)btn.classList.add('active');
  else{var nb=document.querySelector('.portal-sidebar .nav-item[data-portal="'+id+'"]');if(nb)nb.classList.add('active');}
}'''

new_fn = '''function portalNav(pageId){
  document.querySelectorAll('.portal-page').forEach(function(p){p.classList.remove('active')});
  var el=document.getElementById(pageId);if(el){el.classList.add('active')}
  document.querySelectorAll('.portal-sidebar .nav-item').forEach(function(n){n.classList.remove('active')});
  var nav=document.querySelector('.portal-sidebar .nav-item[data-portal="'+pageId+'"]');
  if(nav) nav.classList.add('active');
}
document.querySelectorAll('.portal-sidebar .nav-item').forEach(function(item){
  item.addEventListener('click',function(){portalNav(this.dataset.portal)});
});'''

if old_fn in content:
    content = content.replace(old_fn, new_fn)
    print("portalNav function replaced")
else:
    print("WARNING: portalNav old_fn not found!")
    # Try finding with regex
    content = re.sub(
        r'function portalNav\(id,btn\)\{.*?document\.querySelectorAll\(\'\.portal-sidebar \.nav-item\'\).*?\}',
        new_fn,
        content,
        flags=re.DOTALL
    )
    print("Tried regex fallback")

# 5. Convert inline modalBgqr to portal page (add portal-bgqr-detail page)
modal_html = '''
    <!-- Modal for 报工确认详情 -->
    <div class="modal-overlay" id="modalBgqr" onclick="closeBgqr()">
      <div class="modal-content" onclick="event.stopPropagation()" style="max-width:620px">
        <div class="modal-header"><h3>报工确认详情</h3><button onclick="closeBgqr()"><i class="fas fa-times"></i></button></div>
        <div class="modal-body">'''

# Find and replace the modal
if modal_html in content:
    # Find the end of the modal
    modal_end = '''</div>
    </div>
    </div>'''
    # Replace the entire modal with a portal page
    # We'll add the portal page and remove the modal
    pass

# Instead, let's find the modal section more carefully
idx = content.find('<!-- Modal for 报工确认详情 -->')
if idx > 0:
    # Find the closing of this modal - it ends with closeBgqr function
    end_idx = content.find('function closeBgqr()', idx)
    if end_idx > 0:
        # Remove from modal comment to closeBgqr function
        before = content[:idx]
        after = content[end_idx:]

        # Add portal page for 报工确认
        portal_bgqr_page = '''
        <!-- Portal Detail: 报工确认详情 -->
        <div class="portal-page" id="portal-bgqr-detail">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:16px"><span style="cursor:pointer;font-size:14px;color:var(--p)" onclick="portalNav('portal-approval')"><i class="fas fa-arrow-left"></i> 返回审批管理</span></div>
          <div class="card" style="max-width:640px">
            <div class="card-title">报工确认详情</div>
            <div class="detail-grid">
              <div class="field"><label>员工姓名</label><div class="value">张三</div></div>
              <div class="field"><label>班组</label><div class="value">针车一班</div></div>
              <div class="field"><label>报工日期</label><div class="value">2026-05-22</div></div>
              <div class="field"><label>工序</label><div class="value">针车支流</div></div>
              <div class="field"><label>产量(件)</label><div class="value">1,200</div></div>
              <div class="field"><label>工时</label><div class="value">8h</div></div>
              <div class="field"><label>件资单价</label><div class="value">0.85 元/件</div></div>
              <div class="field"><label>件资金额</label><div class="value" style="color:var(--p);font-weight:700">1,020.00 元</div></div>
              <div class="field full"><label>备注</label><div class="value" style="padding:10px;background:var(--bg);border-radius:6px;font-weight:400">无异常</div></div>
            </div>
            <div style="display:flex;gap:8px;margin-top:20px">
              <button class="btn btn-p" onclick="showToast('已确认通过');portalNav('portal-approval')">确认通过</button>
              <button class="btn btn-sm btn-outline" onclick="portalNav('portal-approval')">返回</button>
            </div>
          </div>
        </div>
'''
        # Remove the modal HTML - from modal comment to closeBgqr function
        # Also remove the openBgqr/closeBgqr functions
        modal_section = content[idx:end_idx]
        content = content.replace(modal_section, '')

        # Remove openBgqr and closeBgqr functions
        content = re.sub(r'\nfunction openBgqr\(\)\{[^}]*\}\n', '', content)
        content = re.sub(r'\nfunction closeBgqr\(\)\{[^}]*\}\n', '', content)

        # Insert portal page before portal-content close
        marker = '      </div>\n    </div>\n  </div>\n</div>'
        # Find the SECOND occurrence (portal view, not PC view)
        first = content.find(marker)
        second = content.find(marker, first + 1)
        if second > 0:
            content = content[:second] + portal_bgqr_page + '\n' + content[second:]
            print("Portal 报工确认 page inserted")
        else:
            print("WARNING: Could not find portal closing marker")

        print("Modal for 报工确认 removed")

# 6. Also remove inline onclick calls using portalNav with null (pc page callers)
content = content.replace("onclick=\"portalNav('portal-approval',null)\"", "onclick=\"portalNav('portal-approval')\"")

with open('生产通.html', 'w', encoding='utf-8') as f:
    f.write(content)

print('生产通 transformation complete!')
