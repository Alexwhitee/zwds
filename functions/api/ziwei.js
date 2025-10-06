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
// 这个配置直接从你的 touzi.js 借鉴，它已经很完善了
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
        // 从请求中解析出模型和命盘数据
        const { model, astrolabeData } = await request.json();

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

        // 调用核心处理函数
        const result = await handleZiweiInterpret(model, astrolabeData, provider, env);

        return new Response(JSON.stringify(result), { headers: corsHeaders });

    } catch (error) {
        console.error('紫微斗数AI解读 Worker 错误:', error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: corsHeaders,
        });
    }
}

/**
 * 调用大模型进行紫微斗数解读的核心函数
 * @param {string} selectedModel - 用户选择的模型ID
 * @param {object} astrolabeData - 从前端传来的命盘原始数据
 * @param {object} provider - 匹配到的 API 提供商配置
 * @param {object} env - Cloudflare 的环境变量
 * @returns {Promise<object>} - 包含解读结果的对象
 */
async function handleZiweiInterpret(selectedModel, astrolabeData, provider, env) {
    // 将命盘数据格式化为字符串，以便AI阅读
    const astrolabeString = JSON.stringify(astrolabeData, null, 2);

    const ziweiPrompt = `
## 角色与目标
你是一位精通中华传统命理学，特别是紫微斗数的智慧大师。你的任务是基于用户提供的紫微斗数命盘JSON数据，用现代、易懂且富有启发性的语言，为用户提供一份专业、严谨且富有同理心的命盘解读。

## 解读规则
1.  **宏观格局分析**:
    *   首先，判断命主的命宫主星是什么，根据主星组合判断其核心性格特质、优点和潜在挑战。
    *   分析命宫、身宫的组合，说明先天性格与后天行事风格的特点。
    *   简要提及命盘的基本格局，例如“杀破狼”格、“机月同梁”格等（如果明显）。

2.  **重点宫位解读**:
    *   **命宫**: 详细解读命宫，这是整个命盘的核心。
    *   **事业宫 (官禄宫)**: 解读其事业方向、工作态度和职业成就。
    *   **财帛宫**: 解读其理财观念、财富来源和财运状况。
    *   **迁移宫**: 解读其外出发展、人际关系和社会地位。
    *   **夫妻宫**: 解读其感情观、婚姻状况和配偶特点。

3.  **语言风格**:
    *   请使用**简体中文**进行回答。
    *   语言要专业但不能晦涩，避免使用过多普通人无法理解的术语。如果必须使用，请稍作解释。
    *   态度要客观中立，既要指出优势，也要点明需要注意的地方，提供积极的建议。
    *   禁止任何迷信、宿命论的论调，强调紫微斗数是认识自我、规划人生的工具。

## 输入数据
以下是用户的紫微斗数命盘JSON数据:
\`\`\`json
${astrolabeString}
\`\`\`

请根据以上规则，开始你的解读。
`;

    const messages = [
        { "role": "system", "content": ziweiPrompt },
        { "role": "user", "content": "请根据我提供的命盘数据，为我进行解读。" }
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
            errorText = errorData.error?.message || errorText;
        } catch (e) {
            // Ignore if response is not JSON
        }
        throw new Error(`API 调用失败! 状态码: ${response.status}, 详情: ${errorText}`);
    }

    const data = await response.json();

    if (!data.choices || data.choices.length === 0 || !data.choices[0].message || !data.choices[0].message.content) {
        throw new Error('API 返回的数据格式不正确，缺少有效的解读内容。');
    }

    return { answer: data.choices[0].message.content };
}
