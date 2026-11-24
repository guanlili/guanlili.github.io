---
layout: post
date: 2025-10-30
title: "🚀 进阶实战：自定义ComfyUI跑通Qwen2.5-VL实现Img2JSON"
subtitle: "利用8卡4090 + Qwen2.5多模态模型，构建企业级图片结构化打标系统"
author: "lili"
header-mask: 0.4
tags: [Qwen2.5-VL, ComfyUI, 4090部署, 踩坑指南, AI]
description: "从零开始搭建 Qwen2.5-VL 视觉理解服务，结合 ComfyUI 自定义工作流，实现图片到 JSON 的结构化输出，为智能图库系统提供核心能力。"
---
## 🚀 进阶实战：自定义ComfyUI跑通Qwen2.5-VL实现Img2JSON

**标签**：`Qwen2.5-VL`, `ComfyUI`, `RuoYi`, `4090部署`, `踩坑指南`

## 🚀 背景与目标

### 0. 背景：从“识字”到“懂图”的跨越

在上一篇文章中，我们分享了如何部署 DeepSeek-OCR。虽然它能精准提取文字，但应用一段时间后，我们发现了一个明显的痛点：**它“看得懂字”，但“看不懂图”**。

对于公司的历史图库归档来说，光把横幅上的字认出来是不够的。我们更需要 AI 告诉我们：

- **这是什么场景？**（会议？比赛？施工现场？）
- **谁在图片里？**（领导？专家？明星？）
- **体现了什么精神？**（拼搏？严谨？团结？）

为了解决这个问题，我决定利用手头的 **8张 RTX 4090** 服务器，基于目前最强的开源多模态模型 **Qwen2.5-VL-7B** 和 **ComfyUI**，搭建一套**“视觉理解打标系统”**。

与文生视频（Wan2.1）这种有大量成熟模板的任务不同，**“图片转结构化数据 (Img2JSON)”** 在 ComfyUI 社区还是个冷门领域。没有现成的作业可以抄，那就自己 DIY 一个工作流吧！

### 1.本篇目标

将我们的 AI 服务从简单的 OCR 升级为“全能视觉工坊”，实现：

1. **工作流自定义**：从零搭建 LoadImage -> Model -> Prompt -> JSON Output 的闭环。
2. **模型本地化**：解决内网服务器无法连接 HuggingFace 的问题，强制读取本地模型。
3. **输出结构化**：通过强约束 Prompt，让大模型稳定输出 JSON 格式，为后续对接业务系统（如 RuoYi）做准备。
4. **避坑指南**：解决版本冲突、网络报错等“劝退”级问题。

------

## 🛠️ 第一章：基础环境准备

我们的目标是搭建一个可视化的推理后端。

### 0. 显卡就位

和上次一样，确保你的 Linux 服务器装好了 NVIDIA 驱动和 Git。

### 1. 创建纯净的 ComfyUI 环境

这次我们直接使用官方 ComfyUI，它的扩展性是做这类实验的最佳选择。

Bash

```
# 1. 创建环境
conda create -n comfyui python=3.10 -y
conda activate comfyui

# 2. 克隆 ComfyUI (官方仓库)
git clone https://github.com/comfyanonymous/ComfyUI.git
cd ComfyUI

# 3. 安装依赖 (适配 CUDA 12.1)
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121
pip install -r requirements.txt
```

### 2. 下载“神级”模型 Qwen2.5-VL

模型文件很大，且为了避免 ComfyUI 运行时尝试联网下载导致报错，我们必须用 `modelscope` 把它完整下载到本地。

Bash

```
# 1. 规划目录：在 models 下新建 LLM 文件夹，专放语言模型
cd models
mkdir LLM && cd LLM

# 2. 下载 Qwen2.5-VL-7B-Instruct
# 注：7B 版本在 4090 上推理速度极快，效果也足够惊艳
pip install modelscope
python -c "from modelscope import snapshot_download; snapshot_download('Qwen/Qwen2.5-VL-7B-Instruct', cache_dir='.')"
```

### 3. 安装关键节点插件

ComfyUI 原生节点主要服务于绘图（SD），不支持 VLM（视觉语言模型）。我们需要安装第三方节点来“以此充好”。

Bash

```
cd ~/ComfyUI/custom_nodes

# 1. 核心推理节点 (必须支持 Qwen2.5 新架构)
# ⚠️ 注意：不要用旧版的 ComfyUI-Qwen-VL，它不支持 2.5
git clone https://github.com/StartIncredible/ComfyUI-Qwen2-VL.git
cd ComfyUI-Qwen2-VL && pip install -r requirements.txt

# 2. 必备辅助节点 (用于显示文本 Show Text)
# 原生 ComfyUI 没有“显示文本”的节点，这个插件是必装的
cd ..
git clone https://github.com/pythongosssss/ComfyUI-Custom-Scripts.git
```

### 4. DIY 自定义工作流

启动 ComfyUI (`python main.py`)，打开浏览器，开始我们的 DIY 之旅：

1. **Load Image**: 拖入一个图片加载节点。
2. **Qwen2-VL Loader**: 选择我们在第 2 步下载的模型路径。
3. **Chat / Sampler**: 这是核心处理单元。在这里输入我们的 **JSON 强约束提示词**。
4. **Show Text**: 连接输出端，用于查看结果。

**Prompt 模板（直接抄作业）：**

Plaintext

```
请分析图片，严格输出 JSON 格式，不要输出 Markdown 标记：
{
  "title": "新闻标题风格的简短描述",
  "description": "详细描述（画面内容+细节特征+精神内涵）",
  "tags": ["标签1", "标签2", "标签3"],
  "category": "从[体育/时政/会议/其他]中选一个"
}
```

按照剧本，点击 **Queue Prompt** 应该就能看到 JSON 了……然而，**真正的战斗才刚刚开始**。

![image-20251125135923181](https://blog-1258476669.cos.ap-beijing.myqcloud.com/bjrb/image-20251125135923181.png?imageSlim)

## 🔌 第二章：服务化封装 (Backend Integration)

在 ComfyUI 里跑通只是第一步，我们的最终目标是让 RuoYi 系统或者 Web 前端能直接调用它。我们需要将 ComfyUI 的 WebSocket 交互封装成简单的 RESTful API。

### 1. 导出 API 格式工作流

ComfyUI 默认保存的是编辑器格式（供人看的），我们需要 API 格式（供机器读的）。

1. 在 ComfyUI 设置里开启 **"Enable Dev mode Options"**。
2. 点击右侧菜单的 **"Save (API format)"**。
3. 保存为 `tagging_api.json` 并上传到服务器。
4. **关键点确认**：打开 JSON，找到 `LoadImage` 节点的 ID（假设是 `5`）和 QwenVL 节点的 ID（假设是 `14`）。

### 2. 升级 FastAPI 网关

我们需要修改之前的 `api_server.py`，增加图片打标接口。这里有一个**技术难点**：Qwen 输出的是文本，而之前的 T2V 接口处理的是视频 URL。我们需要兼容这两种逻辑。

**核心代码逻辑（Python）：**

Python

```
# 1. 引入正则库 (用于从大模型啰嗦的回答中提取纯 JSON)
import re

# 2. 新增打标接口
@app.post("/api/v1/tag-image")
async def tag_image(image: UploadFile = File(...)):
    # ... 保存图片代码省略 ...
    
    # 修改工作流：替换 LoadImage 的路径
    workflow = TAGGING_WORKFLOW.copy()
    workflow["5"]["inputs"]["image"] = safe_filename
    
    # 提交任务
    resp = requests.post(f"{COMFYUI_URL}/prompt", json={"prompt": workflow, ...})
    return {"status": "queued", "task_id": resp.json()['prompt_id']}

# 3. 升级状态查询接口 (解析 JSON)
@app.get("/api/v1/status/{task_id}")
def get_task_status(task_id: str):
    # ... 获取 history ...
    
    # 如果是打标任务，Qwen 的输出通常在 'outputs' -> node_id -> 'text'/'string'
    # 哪怕 Prompt 强调了只输出 JSON，大模型有时还是会加 Markdown 符号
    # 所以必须用正则清洗
    raw_text = node_output.get("text")[0]
    json_match = re.search(r'\{.*\}', raw_text, re.DOTALL)
    
    if json_match:
        clean_json = json_match.group(0)
        return {"status": "complete", "tag_data": json.loads(clean_json)}
    
    return {"status": "complete", "tag_data": {"raw": raw_text}}
```

通过这段正则清洗代码，无论 Qwen 输出的是 `Here is the JSON: {...}` 还是 `json {...} `，我们都能精准提取出结构化数据。

------

## 🖥️ 第三章：前端可视化 (Frontend Visualization)

有了 API，我们再给它加个漂亮的“皮肤”。在 `index.html` 中增加一个 **[AI 识图]** 的标签页。

### 1. 交互设计

我们需要一个简洁的界面：

- **左侧**：文件上传区 + 图片预览。
- **右侧**：结构化数据展示卡片（标题、描述、标签）。

### 2. 渲染逻辑

当 API 返回 JSON 数据后，前端需要将其格式化展示，而不是直接把 JSON 字符串甩在脸上。

**JavaScript 渲染代码：**

JavaScript

```
function renderTags(data) {
    const box = document.getElementById('tagResult');
    const fields = {
        "title": "📌 标题",
        "category": "🗂️ 分类",
        "description": "📝 画面描述",
        "tags": "🏷️ 标签"
    };

    let html = "";
    for(let key in fields) {
        if(data[key]) {
            let content = data[key];
            // 如果是数组（标签），渲染成漂亮的徽章样式
            if(Array.isArray(content)) {
                content = content.map(c => `<span class="badge">${c}</span>`).join(" ");
            }
            html += `<div class="item"><strong>${fields[key]}:</strong> <div>${content}</div></div>`;
        }
    }
    box.innerHTML = html;
}
```

### 3. 最终效果展示

![image-20251125140305782](https://blog-1258476669.cos.ap-beijing.myqcloud.com/bjrb/image-20251125140305782.png?imageSlim)

现在，我们上传一张“姚明打篮球”的照片：

- **Title**: 姚明持球突破防守球员
- **Tags**: [姚明 NBA 篮球 进攻 运球 防守 球迷]
- **Description**: 画面捕捉到篮球赛场上的一幕，身穿红色战袍的球员正准备运球过半场，而对手紧随其后进行防守。球场上观众热情高涨，为双方加油助威…体现了团队合作和竞争精神。

**它真的“看懂”了！**

------

## 🏁 结语：构建企业级 AI 中台的雏形

至此，我们的服务器已经不再是一个冰冷的算力堆砌，而是一个初具规模的 **AI 中台**：

1. **能力层**：基于 ComfyUI + 4090，集成了 OCR (DeepSeek)、VLM (Qwen2.5)、T2V (Wan2.1) 多种能力。
2. **服务层**：通过 FastAPI 统一封装，屏蔽了底层的显存管理、模型加载等复杂性。
3. **应用层**：简单的 WebUI 验证了可行性，下一步即可无缝对接 RuoYi 后台管理系统。

**从“识字”到“懂图”，不仅是技术的升级，更是对数据价值挖掘深度的提升。** 接下来，我们将探索如何利用这些结构化标签，构建一个支持自然语言检索的智能图库系统。

> **本文环境快照**：
>
> - OS: Ubuntu 22.04
> - GPU: 8x RTX 4090
> - ComfyUI: v0.3.x
> - Model: Qwen2.5-VL-7B-Instruct (Int4/FP16)
> - Python: 3.10



------

## ☠️ 附录：小白“踩坑”实录 (The Real Path)

这次遇到的拦路虎比 OCR 那次还凶猛，特别是网络问题。

### 🕳️ 坑 1: `Network is unreachable` (Hugging Face 连不上)

- **报错日志**：`huggingface_hub.errors.LocalEntryNotFoundError` ... `OS Error: Network is unreachable`.
- **分析**：我在节点下拉菜单里选了 `Qwen2.5-VL-7B-Instruct`，插件误以为我填的是 Hugging Face 的模型 ID，于是试图去官网下载配置文件，但公司内网服务器不通外网。
- ✅ 解决：移动模型，把手动下载的模型放在My-ComfyUI/ComfyUI/models/LLM/Qwen-VL目录下，这个目录是插件自动创建的，就会乖乖读取硬盘，不再尝试联网。

### 🕳️ 坑 2: 版本不匹配 (V1 vs V2.5)

- **诡异现象**：一开始我用了 `1038lab` 的插件，死活加载不起来模型，或者报 `KeyError`。
- **分析**：Qwen 分一代 (VL) 和二代 (2.5-VL)，架构变了。旧插件只认老模型。
- **✅ 解决**：果断删除旧插件，换用 `StartIncredible/ComfyUI-Qwen2-VL`。在 AI 领域，**选对插件比努力更重要**。

### 🕳️ 坑 3: `Prompt has no outputs`

- **报错日志**：点击运行直接红框报错：`Prompt has no outputs`。
- **分析**：ComfyUI 的“懒加载”机制。如果一个工作流没有“终点”（比如保存图片或显示文本），系统会觉得“反正你也不看结果，我就不跑了”。我一开始忘了连 `Show Text` 节点。
- **✅ 解决**：务必安装 `ComfyUI-Custom-Scripts` 插件，并把大模型的输出端连到 `Show Text` 节点上，给工作流一个“句号”。
