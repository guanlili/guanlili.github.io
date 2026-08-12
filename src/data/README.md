# 地图数据来源

`china-provinces.json` 用于“我的足迹”页面的中国省级行政区边界展示。

- 来源：阿里云 DataV.GeoAtlas
- GeoAtlas 页面：https://datav.aliyun.com/portal/school/atlas/area_selector
- 原始数据：https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json
- 获取日期：2026-08-13
- 原始文件 SHA-256：`99adfeded5223848bbe37a0a12f8023e11ee12161c7800521c27db42fdeac275`

仓库中的 JSON 与上述原始文件逐字节一致。页面构建时只对坐标进行投影与显示级简化，不修改行政区名称或边界语义。

该来源记录用于保证数据可追溯，不代表对地图数据权利的额外声明。地图仅用于个人旅行记录展示；行政区边界与公开使用要求应以自然资源主管部门发布的标准地图及现行规定为准。
