// src/App.tsx
import React, { useState } from 'react';
import { Iztrolabe } from './Iztrolabe';
import type { AstrolabeData, HoroscopeData } from 'iztro/lib/data/types';
import './App.css';

// 定义一个精简数据类型的接口，以便在App组件中使用
interface PrunedAstrolabeData {
  gender: string;
  soul: string;
  body: string;
  fiveElementsClass: string;
  palaces: object[];
}

function App() {
  const [birthday, setBirthday] = useState('2000-01-01');
  const [birthTime, setBirthTime] = useState(1);
  const [gender, setGender] = useState<'male' | 'female'>('male');

  // --- AI 相关 State ---
  const [astrolabeData, setAstrolabeData] = useState<AstrolabeData | null>(null);
  const [selectedModel, setSelectedModel] = useState('Qwen/Qwen2.5-72B-Instruct');
  const [aiQuestion, setAiQuestion] = useState('请帮我分析一下我的事业运势。');
  const [aiResponse, setAiResponse] = useState('');
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [aiError, setAiError] = useState('');

  const modelOptions = [
    // ... 模型选项保持不变 ...
    {
      label: 'MO',
      options: [
        { label: 'Qwen3-Next-80B-A3B-Instruct', value: 'Qwen/Qwen3-Next-80B-A3B-Instruct' },
        { label: 'DeepSeek-V3.1', value: 'deepseek-ai/DeepSeek-V3.1' },
      ]
    },
  ];

  // --- 数据精简函数，现在位于App组件中 ---
  const pruneAstrolabeData = (data: AstrolabeData | null): PrunedAstrolabeData | null => {
    if (!data) return null;
    const simplifyStar = (star: any) => ({
      name: star.name,
      ...(star.brightness && { brightness: star.brightness }),
      ...(star.mutagen && { mutagen: star.mutagen }),
    });

    return {
      gender: data.gender,
      soul: data.soul,
      body: data.body,
      fiveElementsClass: data.fiveElementsClass,
      palaces: data.palaces.map(palace => ({
        name: palace.name,
        isBodyPalace: palace.isBodyPalace,
        heavenlyStem: palace.heavenlyStem,
        earthlyBranch: palace.earthlyBranch,
        stars: [...palace.majorStars.map(simplifyStar), ...palace.minorStars.map(simplifyStar)],
      })),
    };
  };

  // --- AI 解读请求函数 ---
  const handleGetAIInterpretation = async () => {
    if (!astrolabeData) {
      setAiError('请先生成命盘后再进行解读。');
      return;
    }
    if (!aiQuestion.trim()) {
      setAiError('请输入您想问的问题。');
      return;
    }
    setIsLoadingAI(true);
    setAiError('');
    setAiResponse('');
    try {
      const prunedData = pruneAstrolabeData(astrolabeData);
      if (!prunedData) {
        throw new Error('无法生成有效的命盘数据。');
      }
      const response = await fetch('/api/ziwei', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: aiQuestion,
          model: selectedModel,
          astrolabeData: prunedData,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '请求失败，请稍后再试。');
      }
      const result = await response.json();
      setAiResponse(result.answer);
    } catch (error: any) {
      setAiError(error.message);
    } finally {
      setIsLoadingAI(false);
    }
  };

  const handleBirthTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setBirthTime(parseInt(e.target.value, 10));
  };

  const getBirthTimeLabel = (index: number) => {
    if (index === 0) return '子时 (23点 - 1点)';
    if (index === 1) return '丑时 (1点 - 3点)';
    if (index === 12) return '亥时 (21点 - 23点)';
    const start = index * 2 - 1;
    const end = index * 2 + 1;
    const chineseHour = ['寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌'][index - 2];
    return `${chineseHour}时 (${start}点 - ${end}点)`;
  };

  return (
      <div className="container">
        <header className="input-section">
          <h2>紫微斗数排盘</h2>
          <div className="form-container">
            <div className="form-item">
              <label htmlFor="birthday">出生日期:</label>
              <input id="birthday" type="date" value={birthday} onChange={(e) => setBirthday(e.target.value)} />
            </div>
            <div className="form-item">
              <label htmlFor="birthtime">出生时辰:</label>
              <select id="birthtime" value={birthTime} onChange={handleBirthTimeChange}>
                {Array.from({ length: 13 }, (_, i) => (<option key={i} value={i}>{getBirthTimeLabel(i)}</option>))}
              </select>
            </div>
            <div className="form-item">
              <label htmlFor="gender">性别:</label>
              <select id="gender" value={gender} onChange={(e) => setGender(e.target.value as 'male' | 'female')}>
                <option value="male">男</option>
                <option value="female">女</option>
              </select>
            </div>
          </div>
        </header>

        <main className="chart-container">
          <Iztrolabe
              birthday={birthday}
              birthTime={birthTime}
              gender={gender}
              birthdayType='solar'
              onDataChange={(data) => setAstrolabeData(data.astrolabe)} // 接收 Iztrolabe 组件传出的数据
          />
        </main>

        <section className="ai-interpretation-section">
          <h3>AI 智能解读</h3>
          <div className="ai-form">
            <div className="ai-form-item">
              <label htmlFor="ai-model">选择模型:</label>
              <select id="ai-model" value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)}>
                {modelOptions.map((group) => (
                    <optgroup label={group.label} key={group.label}>
                      {group.options.map((option) => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </optgroup>
                ))}
              </select>
            </div>
            <div className="ai-form-item ai-form-item-full">
              <label htmlFor="ai-question">您想问什么？</label>
              <textarea id="ai-question" rows={3} value={aiQuestion} onChange={(e) => setAiQuestion(e.target.value)} placeholder="例如：请帮我分析一下我的事业发展方向和机遇。" />
            </div>
          </div>
          <button className="ai-submit-button" onClick={handleGetAIInterpretation} disabled={isLoadingAI || !astrolabeData}>
            {isLoadingAI ? '解读中...' : '获取AI解读'}
          </button>
          <div className="ai-response-area">
            {isLoadingAI && <div className="loader"></div>}
            {aiError && <p className="ai-error">错误: {aiError}</p>}
            {aiResponse && (<div className="ai-response"><pre>{aiResponse}</pre></div>)}
          </div>
        </section>
      </div>
  );
}

export default App;
