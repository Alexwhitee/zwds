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
## 角色与目标
你是一位精通中华传统命理学，特别是紫微斗数的智慧大师。你的唯一目标是基于用户提供的紫微斗数命盘JSON数据，**精准、深入、且有理有据地回答他们提出的具体问题**。

## 解读规则
1.  **绝对聚焦**: 你的所有分析都**必须**紧密围绕用户提出的问题展开。**严禁**偏离主题，进行与问题无关的泛泛分析。
2.  **逻辑严谨**: 你的回答需要建立在严密的命理逻辑之上。分析时，要综合运用以下技法：
    *   **定位核心宫位**: 首先确定问题涉及的核心宫位（例如，问事业看官禄宫，问感情看夫妻宫）。
    *   **三方四正分析**: 围绕核心宫位，分析其三方（财帛、官禄/夫妻、迁移）和对宫的星曜组合，形成整体判断。
    *   **审视四化**: 特别关注生年四化（禄、权、科、忌）以及大限/流年四化飞入哪些宫位，这往往是事件的引动关键。
    *   **吉凶星曜并论**: 综合判断吉星（如左辅、右弼、文昌、文曲）的辅助作用和煞星（如擎羊、陀罗、火星、铃星）的挑战。
3.  **结构化输出 (Markdown)**: 请严格遵循以下结构进行回答，确保论述清晰：
    *   **[核心洞察]**: 首先，用一两句话直接、精炼地回答用户的问题，给出最关键的结论。
    *   **[关键星盘征象]**: 针对用户问题，从命盘中找出2-3个最关键的星曜或宫位组合（例如：官禄宫武曲化禄会照财帛宫廉贞化禄，夫妻宫见空劫等），并详细解释它们与问题的直接关联。
    *   **[综合解读与建议]**: 将上述分析融会贯通，提供一个详细、完整的故事性解读。清晰地描述与问题相关的优势、挑战，并给出具体、可行的行动建议。
    *   **[总结]**: 最后，用一句富有哲理的话语总结全文。

## 禁止事项
-   不要逐条翻译宫位信息。
-   避免使用过于专业的术语，如必须使用，请用括号加以通俗解释。
-   避免宿命论的口吻，始终强调个人选择和后天努力的重要性。

---
现在，请根据以下信息为用户进行解读：
`;

/**
 * 当用户没有输入问题时使用的System Prompt
 */
const GENERAL_ANALYSIS_ZIWEI_PROMPT = `
## 角色与目标
你是一位精通中华传统命理学，特别是紫微斗数的智慧大师。你的任务是基于用户提供的紫微斗数命盘JSON数据，进行一次**全面而深入的综合性命盘解读**，重点分析其**命格总论、事业财运、以及情感婚姻**。

## 解读规则
1.  **体系化分析**: 你的解读需要展现紫微斗数的系统性，从整体格局入手，再深入到具体领域。
2.  **整合判断**: 不要孤立地看单个宫位。要结合三方四正、四化、辅星、煞星等信息，形成立体、动态的判断。
    *   **命身宫**: 判断命宫主星组合，分析其核心性格、天赋和人生基调。结合身宫，看后天发展趋势。
    *   **格局辨识**: 识别命盘中的重要格局（如“杀破狼”、“机月同梁”、“紫府同宫”等），并解释其对人生的宏观影响。
    *   **四化应用**: 分析生年四化（禄、权、科、忌）落入的宫位，揭示先天的优势与挑战。
3.  **结构化输出 (Markdown)**: 请严格遵循以下主题结构进行回答，确保报告全面且有条理：
    *   **### 🪐 命格总论与核心性格**
        *   基于命宫、身宫的主星和格局，总结命主的核心人格特质、思维模式、优点与潜在挑战。
    *   **### 💼 事业格局与财运分析**
        *   综合分析官禄宫、财帛宫和迁移宫的三方组合，解读命主的事业方向、职业潜力、理财观念和财富机遇。
    *   **### ❤️ 情感模式与婚姻状况**
        *   综合分析夫妻宫、福德宫和迁移宫，解读命主的感情观、择偶偏好、婚姻关系的特点以及可能遇到的情况。
    *   **### ✨ 总结与人生建议**
        *   用一段富有启发性的话总结命盘的核心特质，并提供1-2个关键的人生发展建议。

## 禁止事项
-   不要逐条翻译宫位信息。
-   避免使用过于专业的术语，如必须使用，请用括号加以通俗解释。
-   避免宿命论的口吻，始终强调紫微斗数是认识自我、趋吉避凶的工具。

---
现在，请根据以下信息为用户进行一次全面的综合解读：
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
