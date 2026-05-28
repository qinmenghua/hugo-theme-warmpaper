---
title: "从零理解 Transformer 架构"
date: 2026-03-20
tags: ["AI", "深度学习", "Transformer"]
categories: ["技术", "AI"]
---

Transformer 是现代大语言模型的基石。本文从注意力机制出发，一步步推导其数学原理。

## 注意力机制

注意力机制的核心思想是让模型在处理某个位置时，能够"关注"到输入序列中的所有相关位置。

### Scaled Dot-Product Attention

```
Attention(Q, K, V) = softmax(QK^T / √d_k) × V
```

其中 Q、K、V 分别代表 Query、Key、Value 矩阵。

<!--more-->

### 多头注意力

多头注意力（Multi-Head Attention）将查询、键、值投影到多个子空间，并行计算注意力：

```python
def multi_head_attention(Q, K, V, num_heads):
    batch_size = Q.shape[0]
    d_model = Q.shape[-1]
    d_k = d_model // num_heads

    # 线性投影
    Q = linear(Q).reshape(batch_size, -1, num_heads, d_k)
    K = linear(K).reshape(batch_size, -1, num_heads, d_k)
    V = linear(V).reshape(batch_size, -1, num_heads, d_k)

    # 注意力计算
    scores = torch.matmul(Q, K.transpose(-2, -1)) / math.sqrt(d_k)
    attn = torch.softmax(scores, dim=-1)
    out = torch.matmul(attn, V)

    return out.reshape(batch_size, -1, d_model)
```

## 位置编码

由于自注意力本身不包含位置信息，Transformer 使用位置编码来注入序列位置：

```python
def positional_encoding(seq_len, d_model):
    pe = torch.zeros(seq_len, d_model)
    position = torch.arange(0, seq_len).unsqueeze(1)
    div_term = torch.exp(torch.arange(0, d_model, 2) * -(math.log(10000.0) / d_model))
    pe[:, 0::2] = torch.sin(position * div_term)
    pe[:, 1::2] = torch.cos(position * div_term)
    return pe
```

## 前馈神经网络

每个 Transformer 块中包含一个两层的前馈网络：

| 层 | 输入维度 | 输出维度 | 激活函数 |
|----|---------|---------|---------|
| 第一层 | d_model | d_ff | ReLU |
| 第二层 | d_ff | d_model | 无 |

## 完整架构

Transformer 由编码器和解码器组成，每层包含：

1. 多头自注意力
2. 前馈神经网络
3. 残差连接 + 层归一化

> "Attention is All You Need" — Vaswani et al., 2017

## 总结

Transformer 的核心创新在于完全基于注意力机制，抛弃了传统的循环和卷积结构。这使其能够高效并行训练，并能捕捉长距离依赖关系。
