const pptx = require("pptxgenjs");

const ppt = new pptx();

// Theme colors
const BLUE = "1E6DF2";
const DARK = "1F2937";
const GRAY = "6B7280";
const GREEN = "34A853";
const BG = "F5F7FA";
const WHITE = "FFFFFF";

// Helper: add slide with title and content
function addTitleSlide(title, subtitle) {
  const slide = ppt.addSlide();
  slide.background = { color: DARK };
  slide.addText(title, {
    x: 0.8, y: 1.5, w: 9, h: 1.2,
    fontSize: 36, color: WHITE, bold: true, fontFace: "Microsoft YaHei",
    align: "center"
  });
  if (subtitle) {
    slide.addText(subtitle, {
      x: 0.8, y: 2.9, w: 9, h: 0.6,
      fontSize: 16, color: "9CA3AF", fontFace: "Microsoft YaHei",
      align: "center"
    });
  }
  return slide;
}

function addSectionSlide(num, title, subtitle) {
  const slide = ppt.addSlide();
  slide.background = { color: BLUE };
  slide.addText(`第${num}步`, {
    x: 0.8, y: 1.2, w: 9, h: 0.6,
    fontSize: 18, color: "93C5FD", fontFace: "Microsoft YaHei",
    align: "center"
  });
  slide.addText(title, {
    x: 0.8, y: 1.9, w: 9, h: 1,
    fontSize: 32, color: WHITE, bold: true, fontFace: "Microsoft YaHei",
    align: "center"
  });
  if (subtitle) {
    slide.addText(subtitle, {
      x: 0.8, y: 3.1, w: 9, h: 0.5,
      fontSize: 14, color: "BFDBFE", fontFace: "Microsoft YaHei",
      align: "center"
    });
  }
  return slide;
}

function addContentSlide(title, items, opts = {}) {
  const slide = ppt.addSlide();
  slide.background = { color: WHITE };

  // Top bar
  slide.addShape(ppt.ShapeType.rect, {
    x: 0, y: 0, w: 10, h: 0.08, fill: { color: BLUE }
  });

  slide.addText(title, {
    x: 0.6, y: 0.3, w: 8.8, h: 0.5,
    fontSize: 22, color: DARK, bold: true, fontFace: "Microsoft YaHei"
  });

  if (opts.subtitle) {
    slide.addText(opts.subtitle, {
      x: 0.6, y: 0.8, w: 8.8, h: 0.35,
      fontSize: 12, color: GRAY, fontFace: "Microsoft YaHei"
    });
  }

  const startY = opts.subtitle ? 1.2 : 0.95;

  if (typeof items === "string") {
    // Single text block
    slide.addText(items, {
      x: 0.6, y: startY, w: 8.8, h: 4.5,
      fontSize: 14, color: DARK, fontFace: "Microsoft YaHei",
      lineSpacing: 22, valign: "top"
    });
  } else if (Array.isArray(items)) {
    // List items - could be array of strings or array of {label, text} objects
    const itemHeight = Math.min(0.55, (4.8 - startY) / Math.max(items.length, 1));

    items.forEach((item, i) => {
      const y = startY + i * itemHeight;
      if (typeof item === "string") {
        slide.addText(`●  ${item}`, {
          x: 0.6, y: y, w: 8.8, h: itemHeight,
          fontSize: 13, color: DARK, fontFace: "Microsoft YaHei",
          valign: "middle"
        });
      } else {
        // { label, text }
        slide.addText([
          { text: `${item.label}`, options: { fontSize: 14, bold: true, color: BLUE } },
          { text: `  ${item.text}`, options: { fontSize: 13, color: DARK } }
        ], {
          x: 0.6, y: y, w: 8.8, h: itemHeight,
          fontFace: "Microsoft YaHei", valign: "middle"
        });
      }
    });
  }

  return slide;
}

function addComparisonSlide(title, leftTitle, leftItems, rightTitle, rightItems) {
  const slide = ppt.addSlide();
  slide.background = { color: WHITE };

  slide.addShape(ppt.ShapeType.rect, {
    x: 0, y: 0, w: 10, h: 0.08, fill: { color: BLUE }
  });

  slide.addText(title, {
    x: 0.6, y: 0.3, w: 8.8, h: 0.5,
    fontSize: 20, color: DARK, bold: true, fontFace: "Microsoft YaHei"
  });

  // Left column header
  slide.addShape(ppt.ShapeType.roundRect, {
    x: 0.5, y: 1, w: 4.2, h: 0.45,
    fill: { color: "FEE8E8" }, rectRadius: 4
  });
  slide.addText(leftTitle, {
    x: 0.5, y: 1, w: 4.2, h: 0.45,
    fontSize: 14, color: "DC2626", bold: true, fontFace: "Microsoft YaHei",
    align: "center", valign: "middle"
  });

  // Right column header
  slide.addShape(ppt.ShapeType.roundRect, {
    x: 5.3, y: 1, w: 4.2, h: 0.45,
    fill: { color: "DCFCE7" }, rectRadius: 4
  });
  slide.addText(rightTitle, {
    x: 5.3, y: 1, w: 4.2, h: 0.45,
    fontSize: 14, color: "16A34A", bold: true, fontFace: "Microsoft YaHei",
    align: "center", valign: "middle"
  });

  const itemH = Math.min(0.5, 3.5 / Math.max(leftItems.length, rightItems.length, 1));

  leftItems.forEach((item, i) => {
    slide.addText(`✗  ${item}`, {
      x: 0.5, y: 1.6 + i * itemH, w: 4.2, h: itemH,
      fontSize: 12, color: "991B1B", fontFace: "Microsoft YaHei",
      valign: "middle"
    });
  });

  rightItems.forEach((item, i) => {
    slide.addText(`✓  ${item}`, {
      x: 5.3, y: 1.6 + i * itemH, w: 4.2, h: itemH,
      fontSize: 12, color: "065F46", fontFace: "Microsoft YaHei",
      valign: "middle"
    });
  });

  return slide;
}

// ========== BUILD SLIDES ==========

// Slide 1: Title
const s1 = ppt.addSlide();
s1.background = { color: DARK };
s1.addShape(ppt.ShapeType.rect, {
  x: 0, y: 0, w: 10, h: 0.06, fill: { color: BLUE }
});
s1.addText("从0到1\n构建一站式服务平台", {
  x: 0.8, y: 1.2, w: 8.4, h: 2,
  fontSize: 38, color: WHITE, bold: true, fontFace: "Microsoft YaHei",
  align: "center", lineSpacing: 50
});
s1.addText("项目工作法 · 完整方法论沉淀", {
  x: 0.8, y: 3.2, w: 8.4, h: 0.5,
  fontSize: 16, color: "93C5FD", fontFace: "Microsoft YaHei",
  align: "center"
});
s1.addText("特步 · 制造与物流园区一站式服务平台", {
  x: 0.8, y: 4.2, w: 8.4, h: 0.4,
  fontSize: 12, color: GRAY, fontFace: "Microsoft YaHei",
  align: "center"
});

// Slide 2: Core Workflow
addContentSlide("核心工作流", [
  { label: "文档驱动", text: "先写文档，再写代码" },
  { label: "原型验证", text: "写代码前先验证方案" },
  { label: "技能固化", text: "重复劳动变成可复用流程" },
  { label: "渐进交付", text: "分模块、分阶段推进" },
  { label: "版本对应", text: "Git 提交记录文档和代码的对应关系" }
], { subtitle: "五个核心原则驱动项目全流程" });

// Slide 3: Workflow Diagram
const s3 = ppt.addSlide();
s3.background = { color: WHITE };
s3.addShape(ppt.ShapeType.rect, {
  x: 0, y: 0, w: 10, h: 0.08, fill: { color: BLUE }
});
s3.addText("项目全流程", {
  x: 0.6, y: 0.3, w: 8.8, h: 0.5,
  fontSize: 22, color: DARK, bold: true, fontFace: "Microsoft YaHei"
});

const steps = [
  "需求文档", "架构设计", "文档归类",
  "原型设计", "原型验证", "Skills固化",
  "代码开发", "Git提交"
];
const stepColors = [BLUE, BLUE, "3B82F6", "2563EB", "1D4ED8", "7C3AED", "059669", DARK];

steps.forEach((step, i) => {
  const row = Math.floor(i / 4);
  const col = i % 4;
  const x = 0.5 + col * 2.35;
  const y = 1.2 + row * 1.6;

  s3.addShape(ppt.ShapeType.roundRect, {
    x, y, w: 2, h: 0.8,
    fill: { color: stepColors[i] }, rectRadius: 6,
    shadow: { type: "outer", blur: 4, offset: 2, color: "000000", opacity: 0.15 }
  });
  s3.addText(`Step ${i + 1}`, {
    x, y: y + 0.05, w: 2, h: 0.3,
    fontSize: 9, color: "93C5FD", fontFace: "Microsoft YaHei",
    align: "center"
  });
  s3.addText(step, {
    x, y: y + 0.3, w: 2, h: 0.4,
    fontSize: 14, color: WHITE, bold: true, fontFace: "Microsoft YaHei",
    align: "center", valign: "middle"
  });

  // Arrow between columns
  if (col < 3) {
    s3.addText("→", {
      x: x + 2, y: y + 0.15, w: 0.35, h: 0.5,
      fontSize: 18, color: "CBD5E1", bold: true, align: "center", valign: "middle"
    });
  }
  // Down arrow
  if (row === 0 && col === 3) {
    s3.addText("↓", {
      x: x + 0.8, y: y + 0.8, w: 0.4, h: 0.4,
      fontSize: 20, color: "CBD5E1", bold: true, align: "center"
    });
  }
  if (row === 0 && col < 4) {
    s3.addText("↓", {
      x: x + 0.8, y: y + 0.8, w: 0.4, h: 0.4,
      fontSize: 20, color: "CBD5E1", bold: true, align: "center"
    });
  }
});

// Slide 4: Project Init
addSectionSlide("一", "项目初始化", "搭建标准化项目骨架");

addContentSlide("项目初始化 — 产物", [
  { label: "CLAUDE.md", text: "项目级 AI 指令，定义规范和工作流" },
  { label: "README.md", text: "项目简介和快速开始" },
  { label: ".gitignore", text: "忽略规则" },
  { label: ".github/", text: "CI/CD 流水线" },
  { label: ".vscode/", text: "编辑器配置" },
  { label: ".claude/", text: "AI 配置和 Skills 目录" },
  { label: "docs/", text: "文档目录" }
], { subtitle: "标准化模板一键生成，确保每个项目结构一致" });

// Slide 5: Init - Why
addComparisonSlide("为什么先做初始化",
  "混乱的做法",
  ["每个项目从零搭目录", "团队/AI 不知道规范", "不同项目风格各异"],
  "好的做法",
  ["标准化模板一键生成", "CLAUDE.md 就是\"宪法\"", ".vscode/ + .github/ 统一配置"]
);

// Slide 6: Requirements & Architecture
addSectionSlide("二", "需求梳理与架构设计", "将业务想法转化为结构化文档");

addContentSlide("需求总纲 — requirements.md", [
  { label: "项目简介", text: "一句话说清做什么" },
  { label: "项目背景", text: "痛点分析，为什么做" },
  { label: "项目目标", text: "可衡量的目标" },
  { label: "技术架构", text: "选型依据和关键约束" },
  { label: "分阶段目标", text: "试点 → 推广 → 全覆盖" },
  { label: "功能模块", text: "按模块列出功能清单+优先级" },
  { label: "系统集成", text: "对接哪些外部系统" },
  { label: "非功能需求", text: "性能/安全/兼容性" },
  { label: "变更记录", text: "版本管理，可追溯" }
], { subtitle: "所有后续工作的唯一依据" });

addContentSlide("架构设计 — architecture.md", [
  { label: "技术选型", text: "前端/后端/数据库/部署" },
  { label: "系统架构图", text: "分层架构：接入→应用→流程→集成" },
  { label: "模块划分", text: "模块职责和交互关系" },
  { label: "设计原则", text: "架构决策的依据" },
  { label: "主数据管理", text: "数据来源和同步方式" },
  { label: "决策记录 (ADR)", text: "重大决策的背景和权衡" },
  { label: "实施路线", text: "时间线规划" }
], { subtitle: "分层架构：接入层 → 应用层 → 流程层 → 集成层" });

// Slide 7: Document Organization
addSectionSlide("三", "文档归类管理", "建立清晰的文档归类体系");

addContentSlide("文档目录结构", [
  "01-蓝图方案/ — 原始蓝图、规划文档（只读归档）",
  "02-业务需求/ — 按模块拆分（HR/行政/生产/通用）",
  "03-原型方案/ — HTML可交互原型 + 说明文档",
  "04-PRD/ — 产品需求文档",
  "每个模块目录放 README.md 作为入口"
], { subtitle: "按模块不按类型，README导航" });

addContentSlide("归类的核心要点", [
  { label: "按模块不按类型", text: "业务需求按「模块」分类，而非文件类型" },
  { label: "README 导航", text: "每个模块目录放 README.md 作为入口" },
  { label: "归类即整理", text: "新文件立刻归类，不堆积到 docs/ 根目录" },
  { label: "可自动化", text: "用 organize-docs skill 自动扫描并建议归类" }
]);

// Slide 8: Prototype Design
addSectionSlide("四", "原型设计与验证", "写代码之前，先用可交互原型验证方案");

addContentSlide("原型设计方案", [
  "三端合一 HTML 原型（手机 + PC + 管理门户）",
  "手机端：mp-{模块名} 页面 + 底部导航切换",
  "PC 端：pc-{模块名} 页面 + 左侧导航 data-pc 绑定",
  "门户端：portal-{模块名} 页面 + data-portal 绑定",
  "优点：浏览器直接运行，可 Git 提交做 diff"
], { subtitle: "用 HTML 原型替代 Axure/Figma" });

// Slide 9: Validate
addContentSlide("原型验证流程 (validate-prototype)", [
  "Step 1: 读取 HTML 原型文件",
  "Step 2: 提取三类页面定义（m-page / pc-page / portal-page）",
  "Step 3: 提取导航引用（mNav调用 / data-pc / data-portal / onclick函数）",
  "Step 4: 逐项校验 — 目标是否存在? 函数是否定义? ID是否重复?",
  "Step 5: 输出验证报告"
], { subtitle: "自动化质量门禁，Axure/Figma 做不到的事" });

// Slide 10: Skills
addSectionSlide("五", "Skills 技能固化", "将重复性工作流程编码为可复用的 Skill");

addContentSlide("当前已沉淀的 Skills", [
  { label: "init-project", text: "项目脚手架一键生成" },
  { label: "organize-docs", text: "文档自动扫描归类" },
  { label: "prototype-designer", text: "原型方案 + PRD 生成" },
  { label: "validate-prototype", text: "HTML 原型断链自动检查" }
], { subtitle: "先有流程，后有 Skill — 做一次，沉淀一次" });

addContentSlide("Skill 设计原则", [
  { label: "先做再沉淀", text: "做过一次才知道流程对不对" },
  { label: "步骤严格", text: "用『不要跳过』约束 AI 行为" },
  { label: "产出可预期", text: "定义标准输出模板，每次格式一致" },
  { label: "版本管理", text: "Skill 文件纳入 Git，跟随项目演进" }
]);

// Slide 11: Memory System
addSectionSlide("六", "记忆系统与跨会话持久化", "AI 会话压缩后，关键上下文不会丢失");

addContentSlide("记忆体系分类", [
  { label: "user", text: "用户角色、知识水平、偏好" },
  { label: "feedback", text: "用户纠正和确认（含原因）" },
  { label: "project", text: "项目目标、当前任务、决策" },
  { label: "reference", text: "外部系统位置、文档索引" }
], { subtitle: ".claude/projects/{hash}/memory/ 目录" });

// Slide 12: Git
addSectionSlide("七", "Git 提交与版本管理", "每次变更对应一个提交，形成可追溯的演进历史");

addContentSlide("提交规范", [
  "提交信息使用中文",
  "格式：{动词}{名词} — {补充说明}",
  "示例：",
  "  · 初始化项目结构",
  "  · 整理 docs/ 目录结构，按功能模块拆分业务需求",
  "  · 新增 organize-docs skill 用于文档自动归类",
  "  · 人事通原型 V1.0 — 三端完整交互原型"
]);

// Slide 13: Evolution Log
addContentSlide("项目演进日志", [
  "28c26d5  初始化项目结构",
  "8aab796  补充项目背景、目标及功能模块需求",
  "caf727a  添加项目级 Skills 目录",
  "c4f5078  新增 prototype-designer skill",
  "bca6fa4  按功能模块拆分业务需求为独立md文件",
  "8f32386  新增 organize-docs skill",
  "b494642  归类新文档，同步蓝图V0.5",
  "c0ccd6e  人事通原型 V1.0 — 三端完整交互原型",
  "31dc9fe  新增项目工作法文档"
], { subtitle: "9 次提交，从骨架到完整方法论" });

// Slide 14: Summary
const s14 = ppt.addSlide();
s14.background = { color: DARK };
s14.addShape(ppt.ShapeType.rect, {
  x: 0, y: 0, w: 10, h: 0.06, fill: { color: BLUE }
});
s14.addText("总结：方法论地图", {
  x: 0.8, y: 0.4, w: 8.4, h: 0.7,
  fontSize: 28, color: WHITE, bold: true, fontFace: "Microsoft YaHei",
  align: "center"
});

const summaryItems = [
  { icon: "📋", text: "先写文档立规矩" },
  { icon: "🎨", text: "再做原型快验证" },
  { icon: "⚙️", text: "技能固化防走样" },
  { icon: "📈", text: "渐进交付控范围" }
];

summaryItems.forEach((item, i) => {
  const col = i % 2;
  const row = Math.floor(i / 2);
  const x = 0.8 + col * 4.5;
  const y = 1.5 + row * 1.5;

  s14.addShape(ppt.ShapeType.roundRect, {
    x, y, w: 3.8, h: 1.1,
    fill: { color: "374151" }, rectRadius: 8
  });
  s14.addText(item.icon, {
    x: x + 0.15, y: y + 0.15, w: 0.7, h: 0.8,
    fontSize: 28, align: "center", valign: "middle"
  });
  s14.addText(item.text, {
    x: x + 0.9, y: y + 0.15, w: 2.7, h: 0.8,
    fontSize: 16, color: WHITE, bold: true, fontFace: "Microsoft YaHei",
    valign: "middle"
  });
});

// Slide 15: Tool Chain
addContentSlide("工具链一览", [
  { label: "CLAUDE.md", text: "项目规范和行为约束" },
  { label: "requirements.md", text: "需求总纲" },
  { label: "architecture.md", text: "架构设计" },
  { label: "init-project skill", text: "项目初始化" },
  { label: "organize-docs skill", text: "文档分类" },
  { label: "prototype-designer skill", text: "原型 + PRD" },
  { label: "validate-prototype skill", text: "原型验证" },
  { label: "记忆系统", text: "上下文持久化" },
  { label: "Git + GitHub", text: "版本管理与 CI/CD" }
]);

// Slide 16: End
const s16 = ppt.addSlide();
s16.background = { color: DARK };
s16.addShape(ppt.ShapeType.rect, {
  x: 0, y: 0, w: 10, h: 0.06, fill: { color: BLUE }
});
s16.addText("谢谢", {
  x: 0.8, y: 1.8, w: 8.4, h: 1,
  fontSize: 48, color: WHITE, bold: true, fontFace: "Microsoft YaHei",
  align: "center"
});
s16.addText("文档驱动 · 原型验证 · 技能固化 · 渐进交付", {
  x: 0.8, y: 3, w: 8.4, h: 0.5,
  fontSize: 14, color: "93C5FD", fontFace: "Microsoft YaHei",
  align: "center"
});

// Save
const outputPath = "docs/项目工作法——从0到1构建一站式服务平台.pptx";
ppt.writeFile({ fileName: outputPath }).then(() => {
  console.log("PPT 已生成：" + outputPath);
}).catch(err => {
  console.error("生成失败:", err);
});
