---
layout: post
date: 2025-11-01
title: "🚀 实战进阶：ComfyUI + FastAPI 打造全能视频工坊：解锁 Wan2.2 图生视频 (I2V)"
subtitle: "从T2V到I2V：扩展FastAPI服务支持图生视频，实现文生图双模式"
author: "lili"
header-mask: 0.4
tags: [ComfyUI, FastAPI, Wan2.2, I2V, AI]
description: "扩展FastAPI服务以支持图生视频(I2V)：新增文件上传接口、前端双模式切换、ComfyUI工作流适配，实现一套代码同时支持T2V和I2V。"
---
# 🚀 实战进阶：ComfyUI + FastAPI 打造全能视频工坊：解锁 Wan2.2 图生视频 (I2V)

## 🚀 背景与目标

在上一篇文章中，我们利用 Ubuntu 服务器 (8x RTX 4090) 和 FastAPI，成功封装了 Wan2.1 的 **“文生视频” (T2V)** 功能。

然而，用户的需求往往更多元。除了文字生成，大家更希望上传一张照片（比如产品图、人像），让它动起来。这就需要用到 **Wan2.2 的图生视频 (Image-to-Video, I2V)** 能力。

**本篇目标：** 将我们的服务升级为“全能工坊”，实现：

1. **后端升级**：解决文件上传难题，自动对接 ComfyUI 的本地文件系统。
2. **接口新增**：增加 `/generate-i2v` 接口，支持 `multipart/form-data` 协议。
3. **前端升级**：实现 T2V/I2V 双模式切换，增加图片预览与上传功能。
4. **最终效果**：一套代码，同时驾驭两种主流视频生成模式。

------

## 🛠️ 第一步：ComfyUI 工作流准备

I2V 与 T2V 最大的区别在于输入端：它需要**一张图片**。

1. **加载工作流**：在 ComfyUI 中加载 Wan2.2 I2V 的工作流（确保包含 `LoadImage` 节点）。
2. **确认关键节点 ID**：
   - **LoadImage (图片加载)**：在我们的工作流中 ID 为 **`97`**。我们需要通过代码动态修改它的文件路径。
   - **Prompt (提示词)**：在 Wan2.2 Subgraph 中，ID 为 **`116`**（输入字段通常为 `text`）。
   - *(注：如果使用不同的工作流，请务必开启 ComfyUI 的 "Show Node IDs" 选项自行确认 ID)*。
3. **导出 API 模板**：
   - 点击右侧菜单的 **"Save (API format)"**。
   - 保存为 **`i2v_api.json`**。
   - 上传至服务器 `~/My-ComfyUI/` 目录。

------

## 💻 第二步：后端 FastAPI 改造 (核心)

这是本篇最硬核的部分。与 T2V 仅传递 JSON 不同，I2V 需要处理**二进制文件流**并将其保存到 ComfyUI 能读取的位置。

### 1. 引入必要库

我们需要 `UploadFile` 处理上传，`shutil` 保存文件，`os` 处理路径。

Python

```
import shutil
import os
import uuid
from fastapi import UploadFile, File, Form, HTTPException
```

### 2. 定义图片保存路径

ComfyUI 默认只能读取其根目录下 `input` 文件夹里的图片。FastAPI 接收到图片后，必须把它“搬运”过去。

Python

```
# 定义 ComfyUI 的 input 目录 (请根据实际路径修改)
COMFYUI_PATH = os.path.expanduser("~/My-ComfyUI/ComfyUI")
INPUT_DIR = os.path.join(COMFYUI_PATH, "input")

# 确保目录存在
if not os.path.exists(INPUT_DIR):
    os.makedirs(INPUT_DIR)
```

### 3. 实现 `/generate-i2v` 接口

核心逻辑：**接收上传 -> 保存到 Input 目录 -> 修改工作流 JSON (图片路径 & 提示词) -> 提交任务**。

Python

```
@app.post("/api/v1/generate-i2v")
async def generate_i2v(
    prompt: str = Form(...),        # 接收文本字段
    image: UploadFile = File(...)   # 接收文件字段
):
    # 1. 保存图片 (使用 uuid 防止文件名冲突)
    file_ext = os.path.splitext(image.filename)[1] or ".png"
    safe_filename = f"i2v_upload_{uuid.uuid4()}{file_ext}"
    file_path = os.path.join(INPUT_DIR, safe_filename)

    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"文件保存失败: {str(e)}")

    # 2. 加载并修改工作流
    if not I2V_WORKFLOW:
         raise HTTPException(status_code=500, detail="I2V 工作流未加载")
         
    workflow = I2V_WORKFLOW.copy()
    
    # 修改 LoadImage 节点 (ID: 97)，指向刚才保存的文件名
    if "97" in workflow:
        workflow["97"]["inputs"]["image"] = safe_filename
    
    # 修改提示词节点 (ID: 116)，注入用户输入的 Prompt
    if "116" in workflow and "text" in workflow["116"]["inputs"]:
        workflow["116"]["inputs"]["text"] = prompt

    # 3. 提交给 ComfyUI
    client_id = str(uuid.uuid4())
    payload = {"prompt": workflow, "client_id": client_id}
    
    try:
        response = requests.post(f"{COMFYUI_URL}/prompt", json=payload)
        response.raise_for_status()
        return {
            "status": "queued", 
            "task_id": response.json()['prompt_id'],
            "uploaded_image": safe_filename
        }
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"ComfyUI 调用失败: {str(e)}")
```

------

## 🎨 第三步：前端页面升级

我们将页面改造为**双标签页 (Tabs)** 结构，T2V 和 I2V 互不干扰。

### 1. HTML 结构变化 (增加 Tabs 和 上传区)

HTML

```
<div class="tabs">
    <div class="tab active" onclick="switchTab('t2v')">文生视频</div>
    <div class="tab" onclick="switchTab('i2v')">图生视频</div>
</div>

<div id="tab-i2v" class="tab-content">
    <div class="file-upload" onclick="document.getElementById('file_i2v').click()">
        <span>点击上传图片</span>
        <input type="file" id="file_i2v" accept="image/*" onchange="previewImage(this)">
    </div>
    <div id="preview_box" style="display:none">
        <img id="img_preview" style="max-height: 200px; margin-top:10px">
    </div>
    
    <div class="form-group">
        <label>提示词</label>
        <textarea id="prompt_i2v"></textarea>
    </div>
    <button id="btn_i2v" onclick="generateI2V()">🖼️ 生成视频</button>
</div>
```

### 2. JS 核心逻辑 (FormData)

在提交 I2V 任务时，**不能**再用 `JSON.stringify`，必须使用 **`FormData`** 对象来封装二进制文件。浏览器会自动设置 `Content-Type: multipart/form-data`，**千万不要手动设置 Content-Type 头**。

JavaScript

```
async function generateI2V() {
    const prompt = document.getElementById('prompt_i2v').value;
    const fileInput = document.getElementById('file_i2v');
    
    if (fileInput.files.length === 0) return alert("请先上传图片！");

    // 构建 FormData
    const formData = new FormData();
    formData.append('prompt', prompt);
    formData.append('image', fileInput.files[0]); // 放入文件对象

    // 发送请求
    await submitTask(`${API_BASE}/generate-i2v`, {
        method: 'POST',
        body: formData // 直接传 formData，不要加 headers
    }, 'btn_i2v');
}
```

------

## 🔍 第四步：部署与验证

1. **重启 FastAPI 服务**： 由于修改了 `api_server.py`，必须重启服务才能生效。

   Bash

   ```
   screen -r fastapi
   # 按 Ctrl+C 停止
   python api_server.py
   # 按 Ctrl+A, D 脱离
   ```

2. **验证接口**： 我们可以用 `curl` 模拟一次带图片的请求：

   Bash

   ```
   curl -X POST "http://127.0.0.1:9000/api/v1/generate-i2v" \
        -H "Content-Type: multipart/form-data" \
        -F "prompt=A cute cat running" \
        -F "image=@/path/to/your/test.jpg"
   ```

如果返回 `{"status": "queued", ...}`，说明图片已成功“穿透”FastAPI，并被 ComfyUI 的 LoadImage 节点读取。

------

## 📝 总结

通过这次升级，我们的 **AI 视频工坊** 已经具备了完整的商业雏形：

- **架构**：Python 后端处理文件流，自动调度 8 卡 4090 算力。
- **体验**：WebUI 支持可视化上传与预览，对用户友好。
- **扩展性**：基于同样的逻辑，我们未来可以轻松添加“图生图”、“视频重绘”等新功能。