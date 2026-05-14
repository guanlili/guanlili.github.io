---
layout: post
title: "🚀 实战入门：在服务器单卡部署 ComfyUI + Wan2.1 文生视频最佳实践"
subtitle: "30分钟4090跑通Wan2.1，公司新媒体同事从此告别烧钱闭源工具"
author: "lili"
header-img: "img/about-bg.jpg"
header-img-credit: "@WebdesignerDepot"
header-img-credit-href: "medium.com/@WebdesignerDepot/poll-should-css-become-more-like-a-programming-language-c74eb26a4270"
header-mask: 0.4
tags: [AI, ComfyUI, 文生视频]
---
# 🚀 实战入门：在服务器单卡部署 ComfyUI + Wan2.1 文生视频最佳实践

**背景：** 公司新媒体同事用闭源工具烧钱烧到财务报警，素材还往外网扔，老板直接放话：“本地化，自己搞一个能文生视频的。” 

**目标：** 在一台全新的 Ubuntu 服务器上，“傻瓜式”地部署 ComfyUI，用于 Wan2.1 文生视频 (T2V)。

**核心原则：**

1. **环境隔离：** 绝不污染系统 Python，使用 `venv`。
2. **资源隔离：** 绝不抢占其他服务（如 vLLM），指定 GPU 运行。
3. **网络优化：** 全程使用国内镜像加速。
4. **稳定运维：** 使用 `screen` 进行后台持久化运行。

------

### 📚 一、环境准备 (Prerequisites)

在开始之前，确保您的新服务器满足以下条件。

1. **检查NVIDIA驱动与CUDA**

   - `nvidia-smi`
   - *确保能看到显卡列表（如 4090）和 CUDA 版本（如 12.x）。*

2. **检查核心工具**

   - `python3 --version` (推荐 Python 3.10 或 3.11)
   - `git --version`
   - `screen --version`

3. **(可选) 安装工具**

   - 如果缺少工具，运行：

     Bash

     ```
     sudo apt update
     sudo apt install python3-venv git screen
     ```

     | **组件**        | **详情**                    | **检查命令**        |
     | --------------- | --------------------------- | ------------------- |
     | **操作系统**    | Ubuntu (Linux)              | `uname -a`          |
     | **GPU**         | 8 x NVIDIA GeForce RTX 4090 | `nvidia-smi`        |
     | **NVIDIA 驱动** | 570.124.06                  | `nvidia-smi`        |
     | **CUDA 版本**   | 12.8 (由驱动支持)           | `nvidia-smi`        |
     | **Python 版本** | 3.10.9                      | `python3 --version` |
     | **Git 版本**    | 2.43.0                      | `git --version`     |

------

### 📦 二、项目安装与环境隔离 (v-e-n-v)

1. **创建项目根目录：**

   Bash

   ```
   cd ~
   mkdir My-ComfyUI
   cd My-ComfyUI
   ```

2. **创建虚拟环境：**

   Bash

   ```
   python3 -m venv venv
   ```

3. **(关键!) 激活虚拟环境：**

   Bash

   ```
   source venv/bin/activate
   ```

   - *您的终端提示符前面会出现 `(venv)` 标记。*

4. **克隆 ComfyUI：**

   Bash

   ```
   git clone https://github.com/comfyanonymous/ComfyUI.git
   cd ComfyUI
   ```

   - *此时，您应位于 `~/My-ComfyUI/ComfyUI` 目录，且 `(venv)` 已激活。*

------

### 🚀 三、安装依赖 (国内镜像加速)

1. **(推荐) 升级 pip：**

   Bash

   ```
   pip install --upgrade pip -i https://pypi.tuna.tsinghua.edu.cn/simple
   ```

2. **(关键) 安装 PyTorch (cu121)：**

   - *使用中科大 (USTC) 镜像，它对 PyTorch 的 `cuXXX` 路径支持最好。*

   Bash

   ```
   pip install torch torchvision torchaudio --index-url https://pypi.mirrors.ustc.edu.cn/pytorch-wheels/cu121
   ```

3. **安装 ComfyUI 其它依赖：**

   - *使用清华 (Tsinghua) PyPI 镜像。*

   Bash

   ```
   pip install -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple
   ```

------

### 💾 四、下载 Wan2.1 (T2V) 核心模型

- *我们使用 `hf-mirror.com` 国内镜像，并用 `wget -O` 直接保存到正确目录。*

1. **下载 T2V 核心模型 (约 5.18 GB):**

   Bash

   ```
   mkdir -p models/diffusion_models
   wget -O models/diffusion_models/wan2.1_t2v_1.3B_fp16.safetensors \
   https://hf-mirror.com/ali-vilab/wan2.1-t2v/resolve/main/diffusion_models/wan2.1_t2v_1.3B_fp16.safetensors
   ```

2. **下载文本编码器 (约 6.27 GB):**

   Bash

   ```
   mkdir -p models/text_encoders
   wget -O models/text_encoders/umt5_xxl_fp8_e4m3fn_scaled.safetensors \
   https://hf-mirror.com/ali-vilab/wan2.1-fun/resolve/main/text_encoders/umt5_xxl_fp8_e4m3fn_scaled.safetensors
   ```

3. **下载 VAE (约 242 MB):**

   Bash

   ```
   mkdir -p models/vae
   wget -O models/vae/wan_2.1_vae.safetensors \
   https://hf-mirror.com/ali-vilab/wan2.1-fun/resolve/main/vae/wan_2.1_vae.safetensors
   ```

------

### 🛠️ 五、安装 ComfyUI Manager (管理节点)

这是为了方便未来安装新的自定义节点。

1. **进入 `custom_nodes` 目录：**

   Bash

   ```
   cd ~/My-ComfyUI/ComfyUI/custom_nodes
   ```

2. **克隆 Manager：**

   Bash

   ```
   git clone https://github.com/ltdrdata/ComfyUI-Manager.git
   ```

3. **(重要) 未来如何手动安装节点：**

   - *我们以 `VideoHelperSuite` 为例，这是“傻瓜”步骤：*

   Bash

   ```
   # 1. 在 custom_nodes 目录克隆
   git clone https://github.com/Kosinkadink/ComfyUI-VideoHelperSuite.git
   
   # 2. 进入新节点目录
   cd ComfyUI-VideoHelperSuite
   
   # 3. (关键!) 激活 venv 并安装它的依赖
   source ../../../venv/bin/activate
   pip install -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple
   
   # 4. 回到 ComfyUI 根目录
   cd ../..
   ```

------

### 🖥️ 六、部署与日常维护 (Screen)

#### 1. 首次启动 (前台测试)

1. **回到 ComfyUI 根目录：**

   Bash

   ```
   cd ~/My-ComfyUI/ComfyUI
   ```

2. **(关键!) 激活虚拟环境** (如果已失效)：

   Bash

   ```
   source ../venv/bin/activate
   ```

3. **指定 GPU 6 启动：**

   Bash

   ```
   CUDA_VISIBLE_DEVICES=6 python main.py --listen
   ```

4. *在您本地电脑浏览器访问 `http://[服务器IP]:8188`。*

5. *拖入 T2V 工作流 (wan_t2v.json)，点击 "Queue Prompt" 测试。*

6. *测试成功后，在 SSH 终端按 `Ctrl + C` 停止。*

#### 2. 后台部署 (Screen)

1. **创建一个名为 `comfyui` 的 screen 会话：**

   Bash

   ```
   screen -S comfyui
   ```

2. *您会进入一个“新”的终端。在这个新终端里，执行标准启动流程：*

   Bash

   ```
   # 1. 进入目录
   cd ~/My-ComfyUI/ComfyUI
   
   # 2. 激活环境
   source ../venv/bin/activate
   
   # 3. 指定 GPU 6 启动 (这次不需要 &)
   CUDA_VISIBLE_DEVICES=6 python main.py --listen
   
   CUDA_VISIBLE_DEVICES=6 python main.py --listen --enable-cors
   ```

3. *程序开始运行。现在，您可以“脱离”这个会话了。*

   - **按 `Ctrl + A`，然后松开，再按 `D`。**

4. *您会返回主终端，看到 `[detached]`。程序已在后台运行，您可以关闭 SSH 了。*

#### 3. 日常维护

- **如何重连会话 (查看日志/停止程序):**

  Bash

  ```
  screen -r comfyui
  ```

  - *您会瞬间跳回 ComfyUI 的日志界面。按 `Ctrl + C` 即可停止。*

- **如何更新 ComfyUI:**

  1. `screen -r comfyui` (重连)
  2. `Ctrl + C` (停止)
  3. `git pull` (更新 ComfyUI 代码)
  4. `source ../venv/bin/activate` (激活环境)
  5. `pip install -r requirements.txt -i ...` (更新依赖)
  6. `CUDA_VISIBLE_DEVICES=6 python main.py --listen` (重新启动)
  7. `Ctrl + A, D` (脱离)

- **如何查看所有 screen 会话：**

  Bash

  ```
  screen -ls
  ```

------

### ❓ 七、常见问题 (Q&A)

- **Q: 提示 `Some Nodes Are Missing` (缺少节点)?**
  - **A:** 见【五.3】。`git clone` 节点到 `custom_nodes`，然后 `cd` 进去 `pip install -r requirements.txt`。
- **Q: 我要 T2V，为什么提示我上传视频?**
  - **A:** 您拖入了错误的工作流 (如 `wan2.1-fun.json`)。T2V 请使用 `wan_t2v.json` 工作流。
