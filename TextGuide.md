# How to deploy LarkGPT
## 1. Create a new Bot in Lark OpenPlatform, and save appid & app secret in a text editor
Go to [Lark Open Platform](https://open.larksuite.com/app/), create a new **Custom App**, then go to **Credentials && Basic Info** tab, copy the appid and app secret.

<img width="1694" alt="image" src="https://github.com/bestony/LarkGPT/assets/13283837/88b027d3-418d-4590-983f-27b621fbd7c6">

## 2. Open Robot Feature in "Open Features" Tab
Go to "Open Features" Tab, and add Robot Features.
<img width="1503" alt="image" src="https://github.com/bestony/LarkGPT/assets/13283837/b0a71033-9b29-47e5-b9dd-f5aaafa1e2a2">

## 3. Create a new App in Aircode.io
Sign Up [Aircode](https://aircode.io/dashboard) and create a new App.

- AppName: your favorite bot name
- Runtime: Node.js 16
- Deployment region: US
- **Typescript: NO**

<img width="1451" alt="image" src="https://github.com/bestony/LarkGPT/assets/13283837/5ecec50e-f890-485a-a9ef-ec4b429f5ef2">


## 4. Copy code in [main.js](main.js), and paste in aircode's hello.js file.
Copy code from [main.js](main.js) 
<img width="1658" alt="image" src="https://github.com/bestony/LarkGPT/assets/13283837/5adcd280-e806-4e65-a8d6-9e36398cb852">

Then, go to aircode, remove all default code, and paste code from [main.js][main.js]

> **remove old, default code is required.**

<img width="1692" alt="image" src="https://github.com/bestony/LarkGPT/assets/13283837/56bd0cc8-3261-4923-ad43-164b761dcf39">


## 5. set Environments
Add 3 new Environment in **Environments** tab in page right top.

- `APPID`: value is your larksuite appid(you paste in text editor before), start with `cli_`
- `SECRET`: value is your larksuite secret(you paste in text editor before)
- `KEY`: value is your openai key,you can find it at [OpenAI Platform](https://platform.openai.com/account/api-keys), start with `sk-`

<img width="638" alt="image" src="https://github.com/bestony/LarkGPT/assets/13283837/74662a39-a211-4a7c-913b-1301427ed13e">

## 6. add requirements package
Install required package at **Dependencies** tab in page left bottom.

you need install two package `@larksuiteoapi/node-sdk` for invoke larksuite api, `axios` for invoke openai api.

![install gif](https://github.com/bestony/LarkGPT/assets/13283837/9bb0628a-1dbb-4719-83a4-e479a9292d2e)


## 7. Deploy 

If you done Code/Environments/requiredments pacakges, then you can click deploy to done your first deploy.

<img width="1706" alt="image" src="https://github.com/bestony/LarkGPT/assets/13283837/64e3f2ac-4bec-4913-841c-7495f0fe8308">

And you will get a invoke url, copy it into your text editor.

<img width="1029" alt="image" src="https://github.com/bestony/LarkGPT/assets/13283837/2063d24b-be5d-441f-b082-6493f18bb300">

## 8. Add required Scopes & events

Return to your Larksuite OpenPlatform Page, switch to **Permissions & Scopes** Page, add 3 Scopes.

- `im:message` Read and send messages in private and group chats 
- `im:message.group_at_msg` Read group chat messages mentioning the bot
- `im:message.p2p_msg` Read private messages sent to the bot

<img width="1679" alt="image" src="https://github.com/bestony/LarkGPT/assets/13283837/1a3736ba-3696-48c6-987c-cdc135c58b70">


Then switch to **Event Subscriptions** Tab, and set aircode's invoke url as **Request URL**

<img width="1252" alt="image" src="https://github.com/bestony/LarkGPT/assets/13283837/be1adb39-046b-4cc8-8758-fe0eb0edb148">

After set Request URL, Add Event

- `im.message.receive_v1` Message received v2.0

## 9. create a new version and release it 
Go to **Version Management & Release** Tab, and create a new version, and submit it to release.

<img width="1683" alt="image" src="https://github.com/bestony/LarkGPT/assets/13283837/67c3d5fe-37ce-43c9-bec1-f14f6a0f3710">

## 10. Search Bot name in Larksuite App, and say Hi to it

<img width="1250" alt="image" src="https://github.com/bestony/LarkGPT/assets/13283837/a2e517ba-911a-46be-8a03-7e221002bb3c">

