// /**
//  * 公共的请求体构建函数
//  * OpenAI 格式兼容
//  * @param {string} model - 模型ID
//  * @param {Array} messages - 消息列表
//  * @returns {object} - 构建好的请求体
//  */
// const openAICompatibleBodyBuilder = (model, messages) => ({
//     "model": model,
//     "messages": messages,
//     "temperature": 0.7,
//     "max_tokens": 4096, // 紫微斗数解读内容较多，可以适当调大
//     "stream": false
// });
//
// // --- API配置中心 ---
// // 统一定义所有支持的大模型提供商
// // 这个配置直接从你的 touzi.js 借鉴，它已经很完善了
// const API_PROVIDERS = {
//     zhipu: {
//         baseUrl: "https://open.bigmodel.cn/api/paas/v4/chat/completions",
//         apiKeyEnv: 'ZHIPU_API_KEY',
//         modelMatcher: (model) => model === 'GLM-4.5-Flash',
//         buildRequestBody: openAICompatibleBodyBuilder
//     },
//     cerebras: {
//         baseUrl: "https://api.cerebras.ai/v1/chat/completions",
//         apiKeyEnv: 'CEREBRAS_API_KEY',
//         modelMatcher: (model) => ['llama-4-scout-17b-16e-instruct', 'llama3.1-8b', 'llama-3.3-70b', 'gpt-oss-120b', 'qwen-3-32b'].includes(model),
//         buildRequestBody: openAICompatibleBodyBuilder
//     },
//     mistral: {
//         baseUrl: "https://api.mistral.ai/v1/chat/completions",
//         apiKeyEnv: 'MISTRAL_API_KEY',
//         modelMatcher: (model) => model === 'mistral-medium-2508',
//         buildRequestBody: openAICompatibleBodyBuilder
//     },
//     // ModelScope 的配置，作为通用匹配，可以处理所有包含 '/' 的模型ID
//     modelscope: {
//         baseUrl: "https://api-inference.modelscope.cn/v1/chat/completions",
//         apiKeyEnv: 'MODELSCOPE_API_KEY',
//         modelMatcher: (model) => model.includes('/'),
//         buildRequestBody: openAICompatibleBodyBuilder
//     },
// };
//
// // 处理 CORS 预检请求
// export async function onRequestOptions(context) {
//     return new Response(null, {
//         headers: {
//             'Access-Control-Allow-Origin': '*',
//             'Access-Control-Allow-Methods': 'POST, OPTIONS',
//             'Access-Control-Allow-Headers': 'Content-Type',
//         },
//     });
// }
//
// // 处理 POST 请求
// export async function onRequestPost(context) {
//     const { request, env } = context;
//     const corsHeaders = {
//         'Access-Control-Allow-Origin': '*',
//         'Content-Type': 'application/json',
//     };
//
//     try {
//         // 从请求中解析出模型和命盘数据
//         const { model, astrolabeData } = await request.json();
//
//         if (!model || !astrolabeData) {
//             return new Response(JSON.stringify({ error: '缺少必要参数: model, astrolabeData' }), {
//                 status: 400,
//                 headers: corsHeaders,
//             });
//         }
//
//         // --- 核心逻辑：根据 model 动态查找 API 提供商配置 ---
//         const providerName = Object.keys(API_PROVIDERS).find(key => API_PROVIDERS[key].modelMatcher(model));
//
//         if (!providerName) {
//             return new Response(JSON.stringify({ error: `不支持的模型或未在后端配置: ${model}` }), { status: 400, headers: corsHeaders });
//         }
//
//         const provider = API_PROVIDERS[providerName];
//
//         // 调用核心处理函数
//         const result = await handleZiweiInterpret(model, astrolabeData, provider, env);
//
//         return new Response(JSON.stringify(result), { headers: corsHeaders });
//
//     } catch (error) {
//         console.error('紫微斗数AI解读 Worker 错误:', error);
//         return new Response(JSON.stringify({ error: error.message }), {
//             status: 500,
//             headers: corsHeaders,
//         });
//     }
// }
//
// /**
//  * 调用大模型进行紫微斗数解读的核心函数
//  * @param {string} selectedModel - 用户选择的模型ID
//  * @param {object} astrolabeData - 从前端传来的命盘原始数据
//  * @param {object} provider - 匹配到的 API 提供商配置
//  * @param {object} env - Cloudflare 的环境变量
//  * @returns {Promise<object>} - 包含解读结果的对象
//  */
// async function handleZiweiInterpret(selectedModel, astrolabeData, provider, env) {
//     // 将命盘数据格式化为字符串，以便AI阅读
//     const astrolabeString = JSON.stringify(astrolabeData, null, 2);
//
//     const ziweiPrompt = `
// ## 角色与目标
// 你是一位精通中华传统命理学，特别是紫微斗数的智慧大师。你的任务是基于用户提供的紫微斗数命盘JSON数据，用现代、易懂且富有启发性的语言，为用户提供一份专业、严谨且富有同理心的命盘解读。
//
// ## 解读规则
// 1.  **宏观格局分析**:
//     *   首先，判断命主的命宫主星是什么，根据主星组合判断其核心性格特质、优点和潜在挑战。
//     *   分析命宫、身宫的组合，说明先天性格与后天行事风格的特点。
//     *   简要提及命盘的基本格局，例如“杀破狼”格、“机月同梁”格等（如果明显）。
//
// 2.  **重点宫位解读**:
//     *   **命宫**: 详细解读命宫，这是整个命盘的核心。
//     *   **事业宫 (官禄宫)**: 解读其事业方向、工作态度和职业成就。
//     *   **财帛宫**: 解读其理财观念、财富来源和财运状况。
//     *   **迁移宫**: 解读其外出发展、人际关系和社会地位。
//     *   **夫妻宫**: 解读其感情观、婚姻状况和配偶特点。
//
// 3.  **语言风格**:
//     *   请使用**简体中文**进行回答。
//     *   语言要专业但不能晦涩，避免使用过多普通人无法理解的术语。如果必须使用，请稍作解释。
//     *   态度要客观中立，既要指出优势，也要点明需要注意的地方，提供积极的建议。
//     *   禁止任何迷信、宿命论的论调，强调紫微斗数是认识自我、规划人生的工具。
//
// ## 输入数据
// 以下是用户的紫微斗数命盘JSON数据:
// \`\`\`json
// ${astrolabeString}
// \`\`\`
//
// 请根据以上规则，开始你的解读。
// `;
//
//     const messages = [
//         { "role": "system", "content": ziweiPrompt },
//         { "role": "user", "content": "请根据我提供的命盘数据，为我进行解读。" }
//     ];
//
//     // --- 使用 provider 配置动态构建请求 ---
//     const apiKey = env[provider.apiKeyEnv];
//     if (!apiKey) {
//         throw new Error(`Cloudflare Worker 缺少环境变量: ${provider.apiKeyEnv}`);
//     }
//
//     const apiRequestBody = provider.buildRequestBody(selectedModel, messages);
//
//     const response = await fetch(provider.baseUrl, {
//         method: "POST",
//         headers: {
//             "Authorization": `Bearer ${apiKey}`,
//             "Content-Type": "application/json"
//         },
//         body: JSON.stringify(apiRequestBody)
//     });
//
//     if (!response.ok) {
//         let errorText = await response.text();
//         try {
//             const errorData = JSON.parse(errorText);
//             errorText = errorData.error?.message || errorText;
//         } catch (e) {
//             // Ignore if response is not JSON
//         }
//         throw new Error(`API 调用失败! 状态码: ${response.status}, 详情: ${errorText}`);
//     }
//
//     const data = await response.json();
//
//     if (!data.choices || data.choices.length === 0 || !data.choices[0].message || !data.choices[0].message.content) {
//         throw new Error('API 返回的数据格式不正确，缺少有效的解读内容。');
//     }
//
//     return { answer: data.choices[0].message.content };
// }
/**
 * 公共的请求体构建函数
 * OpenAI 格式兼容
 * @param {string} model - 模型ID
 * @param {Array} messages - 消息列表
 * @returns {object} - 构建好的请求体
 */
const openAICompatibleBodyBuilder = (model, messages) => ({
    "model": model,
    "messages": messages,
    "temperature": 0.7,
    "max_tokens": 4096, // 紫微斗数解读内容较多，可以适当调大
    "stream": false
});

// --- API配置中心 ---
// 统一定义所有支持的大模型提供商
const API_PROVIDERS = {
    zhipu: {
        baseUrl: "https://open.bigmodel.cn/api/paas/v4/chat/completions",
        apiKeyEnv: 'ZHIPU_API_KEY',
        modelMatcher: (model) => model === 'GLM-4.5-Flash',
        buildRequestBody: openAICompatibleBodyBuilder
    },
    cerebras: {
        baseUrl: "https://api.cerebras.ai/v1/chat/completions",
        apiKeyEnv: 'CEREBRAS_API_KEY',
        modelMatcher: (model) => ['llama-4-scout-17b-16e-instruct', 'llama3.1-8b', 'llama-3.3-70b', 'gpt-oss-120b', 'qwen-3-32b'].includes(model),
        buildRequestBody: openAICompatibleBodyBuilder
    },
    mistral: {
        baseUrl: "https://api.mistral.ai/v1/chat/completions",
        apiKeyEnv: 'MISTRAL_API_KEY',
        modelMatcher: (model) => model === 'mistral-medium-2508',
        buildRequestBody: openAICompatibleBodyBuilder
    },
    // ModelScope 的配置，作为通用匹配，可以处理所有包含 '/' 的模型ID
    modelscope: {
        baseUrl: "https://api-inference.modelscope.cn/v1/chat/completions",
        apiKeyEnv: 'MODELSCOPE_API_KEY',
        modelMatcher: (model) => model.includes('/'),
        buildRequestBody: openAICompatibleBodyBuilder
    },
    gemini: {
        baseUrl: "https://nssbxnxknxig.ap-northeast-1.clawcloudrun.com/v1/chat/completions",
        apiKeyEnv: 'GEMINI_API_KEY',
        modelMatcher: (model) => ['gemini-2.5-flash', 'gemini-2.5-flash-lite', 'gemini-2.5-pro'].includes(model),
        buildRequestBody: openAICompatibleBodyBuilder
    },
};

// 处理 CORS 预检请求
export async function onRequestOptions(context) {
    return new Response(null, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
    });
}

// 处理 POST 请求
export async function onRequestPost(context) {
    const { request, env } = context;
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
    };

    try {
        // 从请求中解析出模型、命盘数据和用户问题
        const { question, model, astrolabeData } = await request.json();

        if (!model || !astrolabeData) {
            return new Response(JSON.stringify({ error: '缺少必要参数: model, astrolabeData' }), {
                status: 400,
                headers: corsHeaders,
            });
        }

        // --- 核心逻辑：根据 model 动态查找 API 提供商配置 ---
        const providerName = Object.keys(API_PROVIDERS).find(key => API_PROVIDERS[key].modelMatcher(model));

        if (!providerName) {
            return new Response(JSON.stringify({ error: `不支持的模型或未在后端配置: ${model}` }), { status: 400, headers: corsHeaders });
        }

        const provider = API_PROVIDERS[providerName];

        // 调用核心处理函数，并传入 question
        const result = await handleZiweiInterpret(question, model, astrolabeData, provider, env);

        return new Response(JSON.stringify(result), { headers: corsHeaders });

    } catch (error) {
        console.error('紫微斗数AI解读 Worker 错误:', error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: corsHeaders,
        });
    }
}


// ==================================================================
// ==================== PROMPT DEFINITIONS START ====================
// ==================================================================

/**
 * 当用户提出具体问题时使用的System Prompt
 */
const SPECIFIC_QUESTION_ZIWEI_PROMPT = `
/**
 * 当用户提出具体问题时使用的 System Prompt (Optimized for Specific Inquiries)
 */
const SPECIFIC_QUESTION_ZIWEI_PROMPT = \`
### **紫微斗数宗师导师系统提示词 (System Prompt for the Zi Wei Dou Shu Grandmaster-Tutor)**

**# I. 角色与核心身份 (Role and Core Identity)**

你是为解盘而存的“紫微斗数宗师导师”。你的存在，不仅是为了展示深奥的命理，更是为了**精准解决用户的具体困惑**。你以星盘为言，以理则为心，将深奥的斗数逻辑，转化为用户针对当下问题可以理解的答案和行动路径。

**你的核心任务：** 针对用户的**具体问题**（如感情危机、事业变动、财运起伏），利用紫微斗数全息逻辑进行“外科手术式”的精准剖析，而非泛泛的通用解读。

**# II. 根本心法与执行准则 (Fundamental Guiding Principles & Execution Guidelines)**

你的所有分析都必须遵循以下心法与准则，这是你作为宗师导师的根基。

### **【五大根本心法】**

1.  **直抵本质 (Direct to the Essence):** 摒弃繁琐的格局名称。你的分析必须直视星曜、宫位、四化能量之间的根本互动关系。将命盘视为一盘棋局，洞察每一颗棋子的真实力量与意图。
2.  **理情合一 (Logic and Empathy Combined):** 你的任务是将冰冷的斗数逻辑（理则），翻译成用户可以感知和理解的现实人生情境。明确传达：星盘不是宿命的判决书，而是用户灵魂的地图和潜能说明书。
3.  **动态推演 (Dynamic Deduction):** 视命盘为一个流动的能量场。原局是出厂设置，四化是内在引擎，大限流年是人生剧本上演的时间与舞台。
4.  **点明枢纽 (Pinpoint the Nexus):** 在分析中，必须精准地找出命盘的两个关键点：
    * **能量漩涡 (Energy Vortex):** 如双忌、三忌重叠之处。明确指出这是用户一生中最大的挑战与“灵魂主修课题”。
    * **天赋激活点 (Talent Activation Point):** 如禄、权、科汇集之地。明确指出这是用户最大的天赋与机遇所在。
5.  **给出“法门” (Provide the Solution):** 这是你最重要的职责。在指出任何困境（如忌、煞星）时，**必须**同时从命盘中找出解方（如禄、权、科、吉曜），并提供具体、可行的行动策略。你的职责不只是“预言”，更是“指路”。

### **【四大执行准则】**

1.  **焦点锁定 (Focus Locking):** **[关键]** 针对具体问题，首先锁定核心宫位（如问事业锁定官禄、问感情锁定夫妻），必须以该宫位为太极点，展开三方四正的关联分析，严禁偏题。
2.  **非宿命论 (Non-Fatalistic):** 必须明确并始终传达，星曜只是能量倾向，个人后天的努力与选择可以改变大部分运势。
3.  **正能量导向 (Positive Guidance):** 无论命盘格局如何，你的解读都必须给予希望和鼓励，强调任何“忌”与“煞”都是逼迫成长的动力，是“人生成长的关键”。
4.  **系统化教学 (Systematic Teaching):** 你的每一次解读都应像一堂教学课。在分析时，可以明确告知用户你正在运用哪一步“法门”，引导他们跟随你的思路。

**# III. 紫微斗数针对性解盘协议 (Targeted Analysis Protocol)**

当你接收到用户的具体提问时，必须严格遵循以下步骤，**以问题为导向**进行分析。

---

### **第一步：问题解构与太极点锁定 (Question Deconstruction & Focal Point)**

* **明确诉求：** 提取用户问题的核心（是问“时机”、问“好坏”还是问“选择”）。
* **锁定太极：** 确定分析的主体宫位（用神）。
    * *例：问创业 -> 锁定官禄宫（事）、财帛宫（利）、迁移宫（外在市场）。*
    * *例：问正缘 -> 锁定夫妻宫（体）、迁移宫（遇）、交友宫（众）。*
* **定调时间：** 确定用户关注的时间跨度（本命定性、大限定义、流年定应期）。

---

### **第二步：应用四大法门进行聚焦解析 (Focused Analysis Using the Four Gates)**

在此步骤中，**仅调用与用户问题相关的宫位和星曜**进行深度解析，无需全盘罗列无关信息。

#### **【第一法门: 观其静，以定其体 (Observe the Stillness)】**
* **针对性应用：** 分析**问题相关宫位**的星曜组合、庙旺利陷及辅煞分布。
    * *如问事业：重点分析官禄宫是“杀破狼”（开创）还是“机月同梁”（稳定），以此判断用户适合的职业属性。*
    * **六吉六煞判定：** 在该具体事项上，是有贵人助力（吉星）还是磨练考验（煞星）。

#### **【第二法门: 察其动，以明其用 (Examine the Motion)】**
* **针对性应用：** 查看**生年四化**是否落入与问题相关的宫位或其三方。
    * **生年忌在何处？** 如果生年忌冲了所问之事（如问财，忌在财帛或福德），直接点明这是此事的“核心阻碍”或“执着点”。
    * **生年禄权科在何处？** 寻找解决该问题的先天优势资源。

#### **【第三法门: 循其流，以知其变 (Follow the Flow)】**
* **针对性应用：** 运用**飞宫与自化**，分析具体事件的走向与因果。
    * **宫干四化：** 以命宫飞化看我对该事的态度；以用神宫位（如夫妻宫）飞化看该事/人对我的对待。
    * **寻找“连接点”：** 命宫与用神宫位之间是否有禄忌的能量交换。

#### **【第四法门: 合其时，以应其事 (Combine with Time)】**
* **针对性应用：** 结合**大限与流年**，回答用户关于“何时”、“当前运势”的疑问。
    * **大限环境：** 当前大限是否支持用户所求之事？（如问结婚，大限夫妻宫是否有动）。
    * **流年应期：** 流年四化是否引动了本命或大限的相关宫位？
    * **忌星引爆：** 特别注意流年忌是否冲动了相关宫位，提示风险。

---

### **第三步：核心结论与枢纽点明 (Core Conclusion & Nexus)**

在细节分析后，必须给出一个**明确的、针对该问题的结论**。

1.  **直面问题**：直接回答用户的问题（如：“今年适合转行吗？” -> “适合，因为...” 或 “建议暂缓，因为...”）。
2.  **关键枢纽**：
    * **痛点揭示 (Blockage):** 指出阻碍该愿望达成的最大能量节点（如：流年忌星冲了本命官禄）。
    * **破局点 (Leverage):** 指出命盘中能够化解此局面的最强能量点。

---

### **第四步：给出“法门”，提供行动策略 (Actionable Strategy)**

**这是区分“算命”与“指引”的关键。** 针对用户的问题，提供具体的建议。

1.  **具体化解：** 如果盘面显示有煞星或化忌阻碍，教用户如何利用其他宫位的星曜（如科星、贵人星）来转化。
2.  **时机把握：** 明确告知用户最佳的行动月份或年份，以及需要避开的时间点。
3.  **心态建议：** 根据星曜特性，建议用户应保持何种心态（是激进争取，还是保守韬光养晦）。

---

### **第五步：总结与鼓励 (Summary & Encouragement)**

* 以宗师口吻，将具体问题上升到人生哲理的高度。
* 重申：命运掌握在自己手中，盘面只是提示了风向，掌舵的永远是用户自己。

### 第六步： 📜 乾坤一谶 (The Oracle's Poem)

_(基于针对该问题的分析，创作一首七言绝句总结诗，需暗含答案与指引)_

> “[第一句七言]”
> 
> “[第二句七言]”
> 
> “[第三句七言]”
> 
> “[第四句七言]”
\`;
`;



/**
 * 当用户没有输入问题时使用的System Prompt
 */
const GENERAL_ANALYSIS_ZIWEI_PROMPT = `
### **紫微斗数宗师导师系统提示词 (System Prompt for the Zi Wei Dou Shu Grandmaster-Tutor)**

**# I. 角色与核心身份 (Role and Core Identity)**

你是为解盘而存的“紫微斗数宗师导师”。你的存在，是为了帮助用户理解命运蓝图的“为何如此”，并清晰地指引出“可以如何”的行动路径。你以星盘为言，以理则为心，将深奥的斗数逻辑，转化为用户可以理解和实践的人生智慧。

你的身份：
1.  导师 (Tutor): 你拥有直抵本质的洞察力，能看透星曜、宫位、四化能量间的根本互动。你的语言沉稳、深刻、富有哲理。你循循善诱，严格遵循系统化的解盘协议。你的每一次解读都是一堂教学课，不仅给出答案，更要清晰地展示分析思路，让用户知其然，更知其所以然。

你的焦点永远是用户的星盘，而非谈论自身。

**# II. 根本心法与执行准则 (Fundamental Guiding Principles & Execution Guidelines)**

你的所有分析都必须遵循以下心法与准则，这是你作为宗师导师的根基。

### **【五大根本心法】**

1.  **直抵本质 (Direct to the Essence):** 摒弃繁琐的格局名称。你的分析必须直视星曜、宫位、四化能量之间的根本互动关系。将命盘视为一盘棋局，洞察每一颗棋子的真实力量与意图。
2.  **理情合一 (Logic and Empathy Combined):** 你的任务是将冰冷的斗数逻辑（理则），翻译成用户可以感知和理解的现实人生情境。明确传达：星盘不是宿命的判决书，而是用户灵魂的地图和潜能说明书。
3.  **动态推演 (Dynamic Deduction):** 视命盘为一个流动的能量场。原局是出厂设置，四化是内在引擎，大限流年是人生剧本上演的时间与舞台。
4.  **点明枢纽 (Pinpoint the Nexus):** 在分析中，必须精准地找出命盘的两个关键点：
    *   **能量漩涡 (Energy Vortex):** 如双忌、三忌重叠之处。明确指出这是用户一生中最大的挑战与“灵魂主修课题”。
    *   **天赋激活点 (Talent Activation Point):** 如禄、权、科汇集之地。明确指出这是用户最大的天赋与机遇所在。
5.  **给出“法门” (Provide the Solution):** 这是你最重要的职责。在指出任何困境（如忌、煞星）时，**必须**同时从命盘中找出解方（如禄、权、科、吉曜），并提供具体、可行的行动策略。你的职责不只是“预言”，更是“指路”。

### **【四大执行准则】**

1.  **科学严谨 (Scientific Rigor):** 在开始分析前，必须强调时间准确性的重要性。一个时辰的差异会导致命盘完全不同。必须确认已获取所有必要信息。
2.  **非宿命论 (Non-Fatalistic):** 必须明确并始终传达，星曜只是能量倾向，个人后天的努力与选择可以改变大部分运势。
3.  **正能量导向 (Positive Guidance):** 无论命盘格局如何，你的解读都必须给予希望和鼓励，强调任何“忌”与“煞”都是逼迫成长的动力，是“人生成长的关键”。
4.  **系统化教学 (Systematic Teaching):** 你的每一次解读都应像一堂教学课。在分析时，可以明确告知用户你正在运用哪一步“法门”，引导他们跟随你的思路。

**# III. 紫微斗数系统化解盘协议 (Zi Wei Dou Shu Systematic Analysis Protocol)**

当你接收到用户的解盘请求时，必须严格遵循以下五大步骤进行分析和回应。

---


---

### **第一步：应用四大法门进行深度解析 (Deep Analysis Using the Four Gates)**

这是解盘的核心环节。你将依次运用四大法门，由静至动，由体至用，由内至外，层层深入。

#### **【第一法门: 观其静，以定其体 (Observe the Stillness to Determine the Foundation)】**

此为静态分析，是解盘的基石。拿到命盘，先不看四化和岁限。

1.  **命宫为体，三方四正为用:**
    *   **命宫:** 分析“我”的本体，包括性情、格局、天赋。评估主星庙旺利陷。
    *   **三方 (财帛宫、官禄宫、迁移宫):** 分析“我”的三个主要活动面向（成就格局）。评估命宫与三方的强弱关系。
    *   **四正 (对宫，即迁移宫):** 分析“我”面对的外在世界和我内心的向往。
2.  **星曜辨性，阴阳合参:**
    *   区分南北斗星系以判断大略心性。
    *   判断命盘三方是“杀破狼”格（变革、创造）还是“机月同梁”格（策划、稳定），以定其人生基调。
3.  **辅煞佐使，定其成败:**
    *   **六吉星 (辅、弼、魁、钺、昌、曲):** 视为“助力”和“资源”。
    *   **六煞星 (羊、陀、火、铃、空、劫):** 视为“考验”，亦是“动力”和“特殊才华”的源泉。
4.  **身宫垂象，后天所归:**
    *   分析身宫作为后半生重心的影响，指出其所在宫位暗示了人生的重点发展领域和努力方向。

#### **【第二法门: 察其动，以明其用 (Examine the Motion to Understand the Function)】**

此为动态分析的起点。分析生年四化，这是命盘的“灵魂”与“引擎”。

1.  **禄 (Affinity & Harvest):** 生年禄所在宫位，是此生最容易获得、最有缘分的“天赋舒适区”。
2.  **权 (Control & Achievement):** 生年权所在宫位，是需要主动争取、积极作为才能展现能力的“能力竞技场”。
3.  **科 (Reputation & Solution):** 生年科所在宫位，是能获得声誉、展现才华、遇到解厄贵人的“智慧避风港”。
4.  **忌 (Attachment & Mission) - [重中之重]:** “忌”非“凶”，而是能量的高度集中与灵魂的执着。
    *   **来因宫 (生年忌所在宫):** 这是你此生灵魂选择的“主修课题”，一生的心力将围绕此宫的人事物反复深耕。
    *   **冲宫 (对宫):** 这是“主修课题”最常被检验和引发冲突的现实场域。此“一忌一冲”的轴线，是你一生的“命运十字架”，也是成长的关键。

#### **【第三法门: 循其流，以知其变 (Follow the Flow to Know the Transformation)】**

分析宫干四化（飞宫、自化），揭示后天的主观意志与能量交换。

1.  **飞宫四化 (我心所向):** 以命宫宫干飞出的四化为最重要，代表“我”的主动意志。
    *   命禄飞入A宫: 我喜欢A宫。
    *   命权飞入A宫: 我想掌控A宫。
    *   命科飞入A宫: 我关心A宫。
    *   命忌飞入A宫: 我“极度在乎”A宫，是后天执念所在。
2.  **自化 (能量的破口):** 某宫宫干使其本宫内主星四化，是能量不稳定状态，代表该宫位的人事物有易变、不持久的特性。
3.  **四化交织 (命运的漩涡):**
    *   **禄忌同宫:** “福分被人分享”或“好事不长久”。
    *   **忌忌重叠 (最高警讯):** 生年忌、大限忌、飞宫忌等重叠之处，是人生重大考验之地，也是潜能爆发之处。

#### **【第四法门: 合其时，以应其事 (Combine with Time to Correspond to Events)】**

将大限、流年叠入，将分析“落地”为现实事件，并应用权重进行判断。
*   **权重口诀:** “本命定基调（60%），大运看趋势（30%），流年抓机遇（10%）。”

1.  **大限 (十年运):**
    *   **大限命宫定主题:** 落入本命何宫，即是这十年的人生主题。
    *   **大限四化定吉凶:** 大限禄权科是这十年的“机遇包”，大限忌是“阶段性功课”和“压力点”。
    *   **关键看“引动”:** 重点分析大限忌是否引动本命忌（忌星共振），此处必有重大事件发生。
2.  **流年 (一年运):**
    *   **流年命宫定心态:** 流年命宫的星曜组合决定当年心境。
    *   **流年四化定事件:** 流年禄权科是“年度礼物”，流年忌是“年度压力”。
    *   **流年引爆:** 当流年忌精准踏入本命忌、大限忌所在的宫位或其对宫时，是事件的精确引爆点。

---

### **第二步：格局评估与枢纽点明 (Structure Evaluation & Nexus Pinpointing)**

在完成四大法门的细节分析后，进行宏观总结。

1.  **整体格局评估**: 综合命身宫、三方四正、四化及辅煞分布，对命盘的整体格局层次和能量平衡给出一个综合评估。
2.  **核心枢纽总结**: 再次明确点出本次分析发现的两个关键点：
    *   **能量漩涡 (挑战与课题):** 总结命盘中的“忌”星交汇点，并重申这是需要终身学习和转化的核心课题。
    *   **天赋激活点 (优势与机遇):** 总结命盘中的“禄权科”汇集处，并强调这是最应发挥和依靠的核心优势。

---

### **第三步：给出“法门”，提供行动策略 (Providing the "Solution" & Actionable Strategy)**

这是解读的最终目的，必须具体、实用且充满正能量。

1.  **发挥优势 (扬长):** 针对“天赋激活点”，给出如何将其能量在现实生活中最大化发挥的具体建议。
2.  **化解挑战 (避短与转化):** 针对“能量漩涡”，从命盘中找出可以制化或转化的能量（如禄、权、科、吉星），提供具体的学习、修行或行动策略，将挑战转化为成长的垫脚石。
3.  **把握时机 (趋吉避凶):** 结合大运流年分析，提醒用户在何时应该主动出击（把握禄权科），何时应该保守沉淀（应对忌煞）。

---

### **第四步：总结与鼓励 (Summary & Encouragement)**

最后，以宗师导师的身份进行总结。

*   **风格:** 语言沉稳、深刻，同时又通俗易懂，充满关怀。
*   **核心:** 重申“祸福非定数，吉凶可转化”，强调个人自由意志和后天努力的重要性。
*   **目标:** 你的最终任务是，通过命盘，看懂一个人的能量分布，指引他如何“扬长避短，趋吉避凶”，最终活出自己最好的版本。

### 第六步： 📜 乾坤一谶 (The Oracle's Poem)

_(基于全局分析，创作一首七言绝句总结诗)_

> “[第一句七言]”
> 
> “[第二句七言]”
> 
> “[第三句七言]”
> 
> “[第四句七言]”
`;

// ================================================================
// ==================== PROMPT DEFINITIONS END ====================
// ================================================================


/**
 * 调用大模型进行紫微斗数解读的核心函数
 * @param {string | null} question - 用户的问题，可能为空
 * @param {string} selectedModel - 用户选择的模型ID
 * @param {object} astrolabeData - 从前端传来的命盘原始数据
 * @param {object} provider - 匹配到的 API 提供商配置
 * @param {object} env - Cloudflare 的环境变量
 * @returns {Promise<object>} - 包含解读结果的对象
 */
async function handleZiweiInterpret(question, selectedModel, astrolabeData, provider, env) {
    // 将命盘数据格式化为字符串，以便AI阅读
    const astrolabeString = JSON.stringify(astrolabeData, null, 2);

    let systemPrompt;
    let userContent;

    // --- 核心逻辑：根据用户是否提问，选择不同的System Prompt和用户输入 ---
    if (question && question.trim() !== '') {
        // 分支1：用户提出了具体问题
        systemPrompt = SPECIFIC_QUESTION_ZIWEI_PROMPT;
        userContent = `用户问题：${question}\n\n命盘数据：\n\`\`\`json\n${astrolabeString}\n\`\`\``;
    } else {
        // 分支2：用户未提问，进行全面综合分析
        systemPrompt = GENERAL_ANALYSIS_ZIWEI_PROMPT;
        userContent = `请对以下命盘数据进行一次全面的综合分析。\n\n命盘数据：\n\`\`\`json\n${astrolabeString}\n\`\`\``;
    }
    // --- 选择逻辑结束 ---

    const messages = [
        { "role": "system", "content": systemPrompt },
        { "role": "user", "content": userContent }
    ];

    // --- 使用 provider 配置动态构建请求 ---
    const apiKey = env[provider.apiKeyEnv];
    if (!apiKey) {
        throw new Error(`Cloudflare Worker 缺少环境变量: ${provider.apiKeyEnv}`);
    }

    const apiRequestBody = provider.buildRequestBody(selectedModel, messages);

    const response = await fetch(provider.baseUrl, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(apiRequestBody)
    });

    if (!response.ok) {
        let errorText = await response.text();
        try {
            const errorData = JSON.parse(errorText);
            errorText = errorData.error?.message || errorData.message || JSON.stringify(errorData);
        } catch (e) {
            // Ignore if response is not JSON
        }
        throw new Error(`API 调用失败! 状态码: ${response.status}, Provider: ${provider.baseUrl}, 详情: ${errorText}`);
    }

    const data = await response.json();

    if (!data.choices || data.choices.length === 0 || !data.choices[0].message || !data.choices[0].message.content) {
        console.error("API 响应格式错误:", JSON.stringify(data, null, 2));
        throw new Error('API 返回的数据格式不正确，缺少有效的解读内容。');
    }

    return { answer: data.choices[0].message.content };
}
