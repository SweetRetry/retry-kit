# 市场规模

## 先定义被计算的量

明确 metric 是 revenue、GMV、buyer spend、units、customers 还是 usage；固定 geography、period、buyer、category、currency、含税口径和 nominal / real。若公开行业分类与目标市场不重合，写出映射和未覆盖部分。

## 双路径估算

尽量同时使用 top-down 与 bottom-up，再解释差异：

- **Top-down**：从政府统计、监管数据、行业原始数据或公司 filings 出发，逐层应用可解释的 category、geography、customer 与 channel filter。
- **Bottom-up**：从可服务客户数、购买频次、价格或实际交易量出发。基本形式为：

```text
market spend = eligible buyers × annual purchase rate × annual frequency × average spend
```

根据业务改用 `units × realized price`、`accounts × ARPA` 或 cohort 公式。输入必须使用一致的时间、币种和单位。

## TAM / SAM / SOM

- **TAM**：目标 job 在明确边界内的全部经济活动，不把相邻工具、服务或用户规模直接当作收入。
- **SAM**：对 TAM 的原始组成项应用产品能力、geography、regulation、language、channel 等约束，不直接乘一个主观百分比。
- **SOM**：在明确时间窗内，取 reachable demand、供给能力与销售吞吐的现实交集；用渠道覆盖、conversion、产能和竞争替换率推导，不写成“拿下 SAM 的 1%”。

## 区间与敏感性

为高不确定输入给出 low / base / high，展示结果最受哪个输入影响。报告每个输入的来源与 confidence。涉及增长率时保留起止值与公式：

```text
CAGR = (ending value / beginning value) ^ (1 / years) - 1
```

## 交叉检查

检查：

- stock 与 annual flow；
- revenue 与 GMV / spend；
- list price 与 realized price；
- company revenue 与 category revenue；
- 重复计算的 buyer、channel 或 product；
- 汇率、通胀与 fiscal/calendar year；
- 预测值与已发生数据。

完成标准：读者可用报告中的来源、公式和输入复算全部关键结果；无法可靠估算时给出有界范围或标记未知。
