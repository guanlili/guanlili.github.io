---
layout: post
title: "🚀 实战部署：单卡4090跑通DeepSeek-OCR本地WebUI"
subtitle: "单卡RTX 4090跑通DeepSeek-OCR本地WebUI，6大血坑实录+一键启动"
author: "guanlili"
header-img: "img/about-bg.jpg"
header-img-credit: "@WebdesignerDepot"
header-img-credit-href: "medium.com/@WebdesignerDepot/poll-should-css-become-more-like-a-programming-language-c74eb26a4270"
header-mask: 0.4
tags:
  - DeepSeek-OCR
  - 4090部署
  - OCR本地部署
  - Gradio
  - Conda
  - PyTorch
  - flash-attn
  - modelscope
---
## 🚀 实战部署：单卡4090跑通DeepSeek-OCR本地WebUI


大家好！我是李梨。

最近，我们想在本地的 4090 服务器上部署大名鼎鼎的 DeepSeek-OCR 模型，搭建一个内部的 WebUI 测试服务。我是个“小白”，本以为会很顺利，结果一路上遇到了各种“拦路虎”。

这篇文章就是把我们从 0 到 1 成功运行的**完整步骤**，以及（更重要的）**所有报错和解决方案**，原汁原味地记录下来。

如果你也是刚接触 AI 部署，这篇文章也许能帮你节省几个小时的“抓耳挠腮”时间！

### 第一章：基础环境准备 (The "Happy Path")

我们的目标是使用一个社区的 [DeepSeek-OCR-Web-UI](https://github.com/newlxj/DeepSeek-OCR-Web-UI) 项目，它提供了一个 Gradio 界面，比较简单易用。

#### 🛠️ 第 0 步: "三件套" 跑不了

在开始之前，确保你的 Linux 服务器（或本地电脑）装好了三样东西：

1. **NVIDIA 驱动**：确保 4090 显卡驱动是最新的。
2. **Git**：用于下载代码。（`sudo apt install git`）
3. **Miniconda**：Python 环境管理的“神器”，避免把你电脑的 Python 环境搞乱。

#### 📦 第 1 步: 创建一个干净的 Python "沙盒"

我们使用 Conda 来创建一个专门给 OCR 用的环境，这里我们用 Python 3.12。

Bash

```
# 1. 创建一个叫 deepseek-ocr 的环境
conda create -n deepseek-ocr python=3.12 -y

# 2. 激活这个环境 (重要！后续所有命令都在这里执行)
conda activate deepseek-ocr

# 激活后，你的命令行前面会出现 (deepseek-ocr) 
```

#### 🔥 第 2 步: 安装 PyTorch (适配 4090 的核心)

这是第一个关键点。4090 跑模型需要 CUDA，而 PyTorch 必须和 CUDA 版本匹配。我们选择一个稳定组合：PyTorch 2.6 + CUDA 11.8。

Bash

```
# 直接运行这整条命令
pip install torch==2.6.0 torchvision==0.21.0 torchaudio==2.6.0 --index-url https://download.pytorch.org/whl/cu118
```

安装完成后，**立即检查** PyTorch 能否“看到”你的 4090 显卡：

Bash

```
python -c "import torch; print(f'CUDA 可用吗? {torch.cuda.is_available()}')"
```

> **[检查点]**：你**必须**看到输出 `CUDA 可用吗? True`。 如果是 `False`，停下来！检查你的 NVIDIA 驱动。

#### 🧠 第 3 步: 下载模型本体

模型文件很大，我们用 `modelscope` 工具下载。

Bash

```
# 1. 安装下载工具
pip install modelscope

# 2. 下载模型 (注意！记住你下载的这个路径，后面要用)
# 我们把它下载到 /home/bjrbds/deepseek-ocr-model
modelscope download --model deepseek-ai/DeepSeek-OCR --local_dir /home/bjrbds/deepseek-ocr-model
```

#### 🌐 第 4 步: 下载 WebUI 界面

Bash

```
# 1. 回到你的主目录
cd ~

# 2. 下载 WebUI 项目代码
git clone https://github.com/newlxj/DeepSeek-OCR-Web-UI.git

# 3. 进入项目文件夹
cd DeepSeek-OCR-Web-UI
```

#### 🧩 第 5 步: 安装 WebUI 的依赖

Bash

```
# 1. 安装 requirements.txt 里写好的依赖
pip install -r requirements.txt

# 2. 单独安装 flash-attn (一个加速库)
pip install flash-attn==2.7.3 --no-build-isolation
```

#### ✏️ 第 6 步: 告诉 WebUI 模型在哪

这是最后一步配置。编辑 `start_ocr_webui.py` 文件，告诉它我们第 3 步下载的模型路径。

Bash

```
vim start_ocr_webui.py
```

找到第 26 行左右，把 `self.model_path` 改成你自己的路径：

Python

```
# 原本:
# self.model_path = '/path/to/your/DeepSeek-OCR'

# 修改后 (使用你的真实路径):
self.model_path = '/home/bjrbds/deepseek-ocr-model'
```

保存并退出 (`:wq`)。

好了！按照“剧本”，我们现在应该可以运行了： `python start_ocr_webui.py` ...然而，**战斗才刚刚开始**。

### 第二章：小白“踩坑”实录 (The "Real Path")

我们遇到了 6 个拦路虎。如果你也遇到了，别慌，这里是答案。

#### 🕳️ 坑 1: `ModuleNotFoundError: No module named 'typer'`

**报错日志：** `import typer` `ModuleNotFoundError: No module named 'typer'`

**分析**：很明显，`requirements.txt` 里漏掉了一个 Gradio 依赖的包。 **✅ 解决**：手动装上它。

Bash

```
pip install typer
```

#### 🕳️ 坑 2: `pip` 说"装了"，Python 说"没有"？

**诡异现象**： 我运行 `pip install typer`，它提示 `Requirement already satisfied` (已经满足)。 但我再运行 `python start_ocr_webui.py`，**它还是报 `No module named 'typer'`**！

**分析**：这是个经典的 Python 环境冲突。`pip` 在你的用户目录 (`~/.local/lib...`) 找到了 `typer`，就“偷懒”了。但我们 Conda 环境里的 Python 只在自己的环境目录 (`~/.conda/envs/deepseek-ocr/lib...`) 里找。

**✅ 解决**：强制 `pip` 在**当前环境**里重新安装。

Bash

```
pip install --ignore-installed typer
```

#### 🕳️ 坑 3: `TypeError: argument of type 'bool' is not iterable`

**报错日志**： 一长串 `gradio` 和 `gradio_client` 的报错，最后指向 `TypeError: argument of type 'bool' is not iterable`。

**分析**：这是 `gradio` 库的一个 Bug，它和我们用的 Python 3.12 或其他库不兼容。 **✅ 解决**：升级 `gradio` 库到最新版。

Bash

```
pip install --upgrade gradio gradio_client
```

#### 🕳️ 坑 4: `模型加载失败: Incorrect path_or_model_id`

**报错日志**： `模型加载失败: Incorrect path_or_model_id: '/home/bjrbds/deepseek-ocr-model/DeepSeek-OCR'`

**分析**：我在第 6 步改配置时**画蛇添足**了。我以为模型在 `deepseek-ocr-model` 文件夹 *里面* 的 `DeepSeek-OCR` 文件夹里。 但 `modelscope` 已经把所有文件（`config.json` 等）**直接**下载到了 `deepseek-ocr-model` 根目录。

**✅ 解决**：重新编辑 `vim start_ocr_webui.py`，把路径改对。

Python

```
# 错误路径: self.model_path = '/home/bjrbds/deepseek-ocr-model/DeepSeek-OCR'
# 正确路径:
self.model_path = '/home/bjrbds/deepseek-ocr-model'
```

*(顺便：在解决这个问题的过程中，我们还遇到了一个 `pillow` 库的版本警告，用 `pip install --upgrade pillow` 顺手解决了。)*

### 第三章：让服务“活下去” (后台运行与日志)

我们总不能一直开着这个黑窗口（终端）。我们需要让它在后台稳定运行，并且把日志记录下来。

我选择了最简单粗暴的 `nohup` 命令。

#### 🚀 启动！

1. 确保你在 `(deepseek-ocr)` 环境下。
2. 确保你在项目目录 `/home/bjrbds/DeepSeek-OCR-Web-UI`。
3. 执行下面这条“天书”一样的命令：

Bash

```
nohup /home/bjrbds/.conda/envs/deepseek-ocr/bin/python start_ocr_webui.py > /home/bjrbds/DeepSeek-OCR-Web-UI/ocr-webui.log 2>&1 &
```

#### 📖 “天书”翻译

- `nohup ... &`：`nohup` (No Hang Up) 和 `&` 组合，让命令在后台运行，你关掉终端它也不死。
- `/home/bjrbds/.conda/envs/deepseek-ocr/bin/python`：**[重点]** 我们不能只写 `python`，必须用 Conda 环境里那个 Python 的**绝对路径**，`nohup` 才能找对环境。
- `> .../ocr-webui.log`：把所有正常的日志 (stdout) 输出到 `ocr-webui.log` 这个文件里。
- `2>&1`：把所有错误日志 (stderr) 也合并 ( `&1`) 到和正常日志 (`2>`) 一样的文件里。

#### 🏡 后续管理

- **怎么看日志？** `tail -f /home/bjrbds/DeepSeek-OCR-Web-UI/ocr-webui.log` (按 `Ctrl+C` 退出查看)

- **怎么停掉它？**

  Bash

  ```
  # 1. 找到它的进程号 (PID)
  ps aux | grep start_ocr_webui.py
  # 2. 杀死它 (假设 PID 是 12345)
  kill 12345
  ```

### 总结

我们成功了！

![image-20251118212853528](https://blog-1258476669.cos.ap-beijing.myqcloud.com/bjrb/image-20251118212853528.png?imageSlim)

这次部署虽然曲折，但非常有价值。我们不仅让 DeepSeek-OCR 跑了起来，还亲手解决了 Python 环境冲突、`gradio` Bug、模型路径错误、以及最关键的“CPU 假运行”问题。

希望这篇“踩坑”日记能帮到你！