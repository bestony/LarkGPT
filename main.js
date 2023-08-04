const aircode = require("aircode");
const lark = require("@larksuiteoapi/node-sdk");
var axios = require("axios");
const EventDB = aircode.db.table("event");
const MsgTable = aircode.db.table("msg"); // table use to save record of conversation

const LARK_APP_ID = process.env.APPID || ""; // Larksuite appid 
const LARK_APP_SECRET = process.env.SECRET || ""; // larksuite app secret
const OPENAI_KEY = process.env.KEY || ""; // OpenAI Key
const OPENAI_MODEL = process.env.MODEL || "gpt-3.5-turbo"; // GPT Model, default gpt 3.5 
const OPENAI_MAX_TOKEN = process.env.MAX_TOKEN || 1024; //  Max token param for openai

const client = new lark.Client({
  appId: LARK_APP_ID,
  appSecret: LARK_APP_SECRET,
  disableTokenCache: false,
  domain: lark.Domain.Lark
});

function logger(param) {
  console.error(`[CF]`, param);
}

async function reply(messageId, content) {
  try{
    return await client.im.message.reply({
    path: {
      message_id: messageId,
    },
    data: {
      content: JSON.stringify({
        text: content,
      }),
      msg_type: "text",
    },
  });
  } catch(e){
    logger("send message to Lark error",e,messageId,content);
  }
}


// Use Session ID to build coversation
async function buildConversation(sessionId, question) {
  let prompt = [];
  
  // read history record from msg table
  const historyMsgs = await MsgTable.where({ sessionId }).find();
  for (const conversation of historyMsgs) {
      // {"role": "system", "content": "You are a helpful assistant."},
      prompt.push({"role": "user", "content": conversation.question})
      prompt.push({"role": "assistant", "content": conversation.answer})
  }

  // build the latest question
  prompt.push({"role": "user", "content": question})
  return prompt;
}

//  save conversation
async function saveConversation(sessionId, question, answer) {
  const msgSize =  question.length + answer.length
  const result = await MsgTable.save({
    sessionId,
    question,
    answer,
    msgSize,
  });
  if (result) {
    // check and discard old conversation
    await discardConversation(sessionId);
  }
}

// if histroy size over max_token, drop the first question in conversation
async function discardConversation(sessionId) {
  let totalSize = 0;
  const countList = [];
  const historyMsgs = await MsgTable.where({ sessionId }).sort({ createdAt: -1 }).find();
  const historyMsgLen = historyMsgs.length;
  for (let i = 0; i < historyMsgLen; i++) {
    const msgId = historyMsgs[i]._id;
    totalSize += historyMsgs[i].msgSize;
    countList.push({
      msgId,
      totalSize,
    });
  }
  for (const c of countList) {
    if (c.totalSize > OPENAI_MAX_TOKEN) {
      await MsgTable.where({_id: c.msgId}).delete();
    }
  }
}

// clean old conversation
async function clearConversation(sessionId) {
  return await MsgTable.where({ sessionId }).delete();
}

// command process
async function cmdProcess(cmdParams) {
  switch (cmdParams && cmdParams.action) {
    case "/help":
      await cmdHelp(cmdParams.messageId);
      break;
    case "/clear": 
      await cmdClear(cmdParams.sessionId, cmdParams.messageId);
      break;
    default:
      await cmdHelp(cmdParams.messageId);
      break;
  }
  return { code: 0 }
} 

// help command
async function cmdHelp(messageId) {
  helpText = `Lark GPT manpages

Usage:
    /clear    remove conversation history for get a new, clean, bot context.
    /help     get more help message
  `
  await reply(messageId, helpText);
}

// 清除记忆指令
async function cmdClear(sessionId, messageId) {
  await clearConversation(sessionId)
  await reply(messageId, "✅ All history removed");
}

// get openai reply
async function getOpenAIReply(prompt) {

  var data = JSON.stringify({
    model: OPENAI_MODEL,
    messages: prompt
  });

  var config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://api.openai.com/v1/chat/completions",
    headers: {
      Authorization: `Bearer ${OPENAI_KEY}`,
      "Content-Type": "application/json",
    },
    data: data,
    timeout: 50000
  };

  try{
      const response = await axios(config);
    
      if (response.status === 429) {
        return 'Too many question, can you wait and re-ask later?';
      }
      // remove some \n
      return response.data.choices[0].message.content.replace("\n\n", "");
    
  }catch(e){
     logger(e.response.data)
     return "this question is too diffcult, you may ask my owner.";
  }

}

// self check doctor
async function doctor() {
  if (LARK_APP_ID === "") {
    return {
      code: 1,
      message: {
        zh_CN: "你没有配置 Lark 应用的 AppID，请检查 & 部署后重试",
        en_US:
          "Here is no Lark APP id, please check & re-Deploy & call again",
      },
    };
  }
  if (!LARK_APP_ID.startsWith("cli_")) {
    return {
      code: 1,
      message: {
        zh_CN:
          "你配置的 Lark 应用的 AppID 是错误的，请检查后重试。 Lark 应用的 APPID 以 cli_ 开头。",
        en_US:
          "Your Lark App ID is Wrong, Please Check and call again. Lark APPID must Start with cli",
      },
    };
  }
  if (LARK_APP_SECRET === "") {
    return {
      code: 1,
      message: {
        zh_CN: "你没有配置 Lark 应用的 Secret，请检查 & 部署后重试",
        en_US:
          "Here is no Lark APP Secret, please check & re-Deploy & call again",
      },
    };
  }

  if (OPENAI_KEY === "") {
    return {
      code: 1,
      message: {
        zh_CN: "你没有配置 OpenAI 的 Key，请检查 & 部署后重试",
        en_US: "Here is no OpenAI Key, please check & re-Deploy & call again",
      },
    };
  }

  if (!OPENAI_KEY.startsWith("sk-")) {
    return {
      code: 1,
      message: {
        zh_CN:
          "你配置的 OpenAI Key 是错误的，请检查后重试。OpenAI 的 KEY 以 sk- 开头。",
        en_US:
          "Your OpenAI Key is Wrong, Please Check and call again. Lark APPID must Start with cli",
      },
    };
  }
  return {
    code: 0,
    message: {
      zh_CN:
      "✅ 配置成功，接下来你可以在 Lark 应用当中使用机器人来完成你的工作。",
      en_US:
      "✅ Configuration is correct, you can use this bot in your Lark App",
      
    },
    meta: {
      LARK_APP_ID,
      OPENAI_MODEL,
      OPENAI_MAX_TOKEN,
    },
  };
}

async function handleReply(userInput, sessionId, messageId, eventId) {
  const question = userInput.text.replace("@_user_1", "");
  logger("question: " + question);
  const action = question.trim();
  if (action.startsWith("/")) {
    return await cmdProcess({action, sessionId, messageId});
  }
  const prompt = await buildConversation(sessionId, question);
  const openaiResponse = await getOpenAIReply(prompt);
  await saveConversation(sessionId, question, openaiResponse)
  await reply(messageId, openaiResponse);

  // update content to the event record
  const evt_record = await EventDB.where({ event_id: eventId }).findOne();
  evt_record.content = userInput.text;
  await EventDB.save(evt_record);
  return { code: 0 };
}

module.exports = async function (params, context) {
  //  if have a encrypt, let use close it.
  if (params.encrypt) {
    logger("user enable encrypt key");
    return {
      code: 1,
      message: {
        zh_CN: "你配置了 Encrypt Key，请关闭该功能。",
        en_US: "You have open Encrypt Key Feature, please close it.",
      },
    };
  }
  // process url_verification
  if (params.type === "url_verification") {
    logger("deal url_verification");
    return {
      challenge: params.challenge,
    };
  }
  // build a doctor for debug
  if (!params.hasOwnProperty("header") || context.trigger === "DEBUG") {
    logger("enter doctor");
    return await doctor();
  }
  // process event 
  if ((params.header.event_type === "im.message.receive_v1")) {
    let eventId = params.header.event_id;
    let messageId = params.event.message.message_id;
    let chatId = params.event.message.chat_id;
    let senderId = params.event.sender.sender_id.user_id;
    let sessionId = chatId + senderId;

    // process event only once.
    const count = await EventDB.where({ event_id: eventId }).count();
    if (count != 0) {
      logger("skip repeat event");
      return { code: 1 };
    }
    await EventDB.save({ event_id: eventId });

    // replay in private chat
    if (params.event.message.chat_type === "p2p") {
      // don't reply except text
      if (params.event.message.message_type != "text") {
        await reply(messageId, "Not support other format question, only text.");
        logger("skip and reply not support");
        return { code: 0 };
      }
      // reply text
      const userInput = JSON.parse(params.event.message.content);
      return await handleReply(userInput, sessionId, messageId, eventId);
    }

    // group chat process
    if (params.event.message.chat_type === "group") {
      const userInput = JSON.parse(params.event.message.content);
      return await handleReply(userInput, sessionId, messageId, eventId);
    }
  }

  logger("return without other log");
  return {
    code: 2,
  };
};
