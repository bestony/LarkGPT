# 如何部署 LarkGPT ？
## 1. 在 Lark GPT 创建一个企业自建应用，并保存其 AppID 和 Secret 到文本编辑器中
前往 [Lark 开放平台](https://open.larksuite.com/app/),创建一个新的 **企业自建应用**, 并进入 **基础信息与凭证** tab 页,复制 AppID 和 App Secret

<img width="1694" alt="image" src="https://github.com/bestony/LarkGPT/assets/13283837/88b027d3-418d-4590-983f-27b621fbd7c6">

## 2. 在「添加应用能力」页面新增「机器人」能力
前往「添加应用能力」页面，新增机器人能力。
<img width="1503" alt="image" src="https://github.com/bestony/LarkGPT/assets/13283837/b0a71033-9b29-47e5-b9dd-f5aaafa1e2a2">

## 3. 在 AirCode 创建一个新的应用
注册 [AirCode](https://aircode.io/dashboard) ，并创建一个新的应用
- 应用名称: 你自己喜欢的机器人名称即可
- Runtime: Node.js 16
- Deployment region: US
- **Typescript: NO**

<img width="1451" alt="image" src="https://github.com/bestony/LarkGPT/assets/13283837/5ecec50e-f890-485a-a9ef-ec4b429f5ef2">


## 4. 复制  [main.js](main.js) 中的代码, 并粘贴到 aircode 中的 hello.js 文件
从 [main.js](main.js)  中复制代码
<img width="1658" alt="image" src="https://github.com/bestony/LarkGPT/assets/13283837/5adcd280-e806-4e65-a8d6-9e36398cb852">

并在 AirCode 中删除默认的代码，粘贴上来自 [main.js][main.js] 的代码。

> **移除默认生成的代码是必要的**

<img width="1692" alt="image" src="https://github.com/bestony/LarkGPT/assets/13283837/56bd0cc8-3261-4923-ad43-164b761dcf39">


## 5. 设置环境变量
在右上角的 **Environments** 中新增三个环境变量

- `APPID`: 你刚刚复制的 Larksuite 应用的应用 ID，一般以 `cli_` 开头
- `SECRET`: 你刚刚复制的 Larksuite 应用的 Secret
- `KEY`: 你的 OpenAI key，你可以在 [OpenAI Platform](https://platform.openai.com/account/api-keys) 找到，一般以 `sk-` 开头。

<img width="638" alt="image" src="https://github.com/bestony/LarkGPT/assets/13283837/74662a39-a211-4a7c-913b-1301427ed13e">

## 6. 添加需要的依赖包
在左下角的 **Dependencies** Tab 中添加需要的依赖包。

你需要安装两个依赖包
- `@larksuiteoapi/node-sdk` 用于调用 Larksuite 的 OpenAPI
- `axios` 用于调用 OpenAI 的依赖包

![install gif](https://github.com/bestony/LarkGPT/assets/13283837/9bb0628a-1dbb-4719-83a4-e479a9292d2e)


## 7. 部署 

如果你完成了代码、环境变量和依赖包的配置，就可以点击顶部的 Deploy 按钮，来完成你的第一次部署。

<img width="1706" alt="image" src="https://github.com/bestony/LarkGPT/assets/13283837/64e3f2ac-4bec-4913-841c-7495f0fe8308">

部署完成后，你会得到一个调用的 URL，复制这个链接到你的文本编辑器中。

<img width="1029" alt="image" src="https://github.com/bestony/LarkGPT/assets/13283837/2063d24b-be5d-441f-b082-6493f18bb300">

## 8. 添加需要的 Scope 和 Event

返回 Lark 开放平台，切换到「权限管理」页面，新增三个 Scope：

- `im:message` 获取与发送单聊、群组消息
- `im:message.group_at_msg` 获取用户在群组中@机器人的消息
- `im:message.p2p_msg` 获取用户发给机器人的单聊消息

<img width="1679" alt="image" src="https://github.com/bestony/LarkGPT/assets/13283837/1a3736ba-3696-48c6-987c-cdc135c58b70">


随后切换至 **事件订阅** Tab，并将 aircode 的请求地址设置为请求地址。

<img width="1252" alt="image" src="https://github.com/bestony/LarkGPT/assets/13283837/be1adb39-046b-4cc8-8758-fe0eb0edb148">

保存完成 URL 后，新增事件：

- `im.message.receive_v1` 接收消息 v2.0

## 9. 创建一个新的版本，并发布
前往「版本管理与发布」Tab，创建一个新的版本，并提交审核发布。

<img width="1683" alt="image" src="https://github.com/bestony/LarkGPT/assets/13283837/67c3d5fe-37ce-43c9-bec1-f14f6a0f3710">

## 10. 在 Lark App 中搜索机器人的名称，并给他 Say 个 Hi 吧～

<img width="1250" alt="image" src="https://github.com/bestony/LarkGPT/assets/13283837/a2e517ba-911a-46be-8a03-7e221002bb3c">

