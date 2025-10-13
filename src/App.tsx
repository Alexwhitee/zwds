// // // src/App.tsx
// // //import React, { useState } from 'react';
// // // --- 修改后 ---
// // import React, { useState, useRef, useLayoutEffect } from 'react';
// // import { Iztrolabe } from './Iztrolabe';
// // import type { AstrolabeData, HoroscopeData } from 'iztro/lib/data/types';
// // import './App.css';
// //
// //
// //
// // // ... (所有 import 语句结束之后)
// // // --- 在这里粘贴下面的代码 --- //
// // // ===================================================================
// // // STEP 1: 定义响应式包裹组件
// // // ===================================================================
// // // const ResponsiveAstrolabe: React.FC<IztrolabeProps> = (props) => {
// // //   // 定义排盘的设计基准宽度，所有缩放都以此为参考
// // //   const BASE_WIDTH = 600;
// // //   // 创建 Refs 来引用 DOM 元素
// // //   const wrapperRef = useRef<HTMLDivElement>(null);
// // //   const astrolabeRef = useRef<HTMLDivElement | null>(null);
// // //   // 使用 useLayoutEffect 确保在浏览器绘制前完成计算，防止闪烁
// // //   useLayoutEffect(() => {
// // //     // 动态查找 Iztrolabe 组件渲染出的 .iztro-astrolabe 元素
// // //     if (wrapperRef.current) {
// // //       astrolabeRef.current = wrapperRef.current.querySelector('.iztro-astrolabe');
// // //     }
// // //     const calculateScale = () => {
// // //       if (!wrapperRef.current || !astrolabeRef.current) {
// // //         return;
// // //       }
// // //       // 1. 计算缩放比例
// // //       const currentWidth = wrapperRef.current.getBoundingClientRect().width;
// // //       const scale = currentWidth / BASE_WIDTH;
// // //       if (scale <= 0) return;
// // //       // 2. 应用 transform 缩放
// // //       astrolabeRef.current.style.transform = `scale(${scale})`;
// // //       astrolabeRef.current.style.transformOrigin = 'top left'; // 确保从左上角缩放
// // //       // 3. 动态修正高度，防止布局塌陷
// // //       const originalHeight = astrolabeRef.current.getBoundingClientRect().height / scale;
// // //       wrapperRef.current.style.height = `${originalHeight * scale}px`;
// // //     };
// // //     // 首次加载和窗口尺寸变化时执行计算
// // //     calculateScale();
// // //     window.addEventListener('resize', calculateScale);
// // //     // 组件卸载时清理事件监听器
// // //     return () => {
// // //       window.removeEventListener('resize', calculateScale);
// // //     };
// // //   }, [props]); // 当 props 变化（例如重新排盘）时，重新执行 effect
// // //   return (
// // //       <div className="astrolabe-scaler-wrapper" ref={wrapperRef}>
// // //         <Iztrolabe {...props} />
// // //       </div>
// // //   );
// // // };
// //
// // // src/App.tsx
// //
// // // ... (imports)
// //
// // // ===================================================================
// // // STEP 1: 定义响应式包裹组件 (优化版)
// // // ===================================================================
// // const ResponsiveAstrolabe: React.FC<IztrolabeProps> = (props) => {
// //   const wrapperRef = useRef<HTMLDivElement>(null);
// //   const astrolabeRef = useRef<HTMLDivElement | null>(null);
// //
// //   useLayoutEffect(() => {
// //     if (wrapperRef.current) {
// //       astrolabeRef.current = wrapperRef.current.querySelector('.iztro-astrolabe');
// //     }
// //
// //     const calculateScale = () => {
// //       if (!wrapperRef.current || !astrolabeRef.current) {
// //         return;
// //       }
// //
// //       // --- 优化点：直接从DOM获取基准宽度 ---
// //       // getBoundingClientRect() 会返回元素的实际渲染尺寸，不受transform影响
// //       const baseWidth = astrolabeRef.current.getBoundingClientRect().width;
// //
// //       // 如果已经有 transform，我们需要把它除掉来获得原始宽度
// //       // 但一个更简单的方法是假设第一次计算时没有 transform
// //       // 更好的是，我们可以直接用 offsetWidth，它不受 transform 影响
// //       const originalWidth = astrolabeRef.current.offsetWidth;
// //
// //       const containerWidth = wrapperRef.current.getBoundingClientRect().width;
// //
// //       // 防止除以0
// //       if (originalWidth === 0) return;
// //
// //       const scale = containerWidth / originalWidth;
// //
// //       if (scale <= 0) return;
// //
// //       astrolabeRef.current.style.transform = `scale(${scale})`;
// //
// //       // 高度计算逻辑保持不变，但更健壮
// //       const originalHeight = astrolabeRef.current.offsetHeight;
// //       wrapperRef.current.style.height = `${originalHeight * scale}px`;
// //     };
// //
// //     // 首次加载和窗口尺寸变化时执行计算
// //     calculateScale();
// //     window.addEventListener('resize', calculateScale);
// //
// //     return () => {
// //       window.removeEventListener('resize', calculateScale);
// //     };
// //   }, [props]);
// //
// //   return (
// //       <div className="astrolabe-scaler-wrapper" ref={wrapperRef}>
// //         {/*
// //         这里的 Iztrolabe 组件渲染出的 .iztro-astrolabe 元素
// //         现在会应用 App.css 中新增的 absolute 定位样式
// //       */}
// //         <Iztrolabe {...props} />
// //       </div>
// //   );
// // };
// //
// // // ... (App 组件保持不变)
// //
// //
// //
// // // 定义一个精简数据类型的接口，以便在App组件中使用
// // interface PrunedAstrolabeData {
// //   gender: string;
// //   soul: string;
// //   body: string;
// //   fiveElementsClass: string;
// //   palaces: object[];
// // }
// //
// // function App() {
// //   const [birthday, setBirthday] = useState('2000-01-01');
// //   const [birthTime, setBirthTime] = useState(1);
// //   const [gender, setGender] = useState<'male' | 'female'>('male');
// //
// //   // --- AI 相关 State ---
// //   const [astrolabeData, setAstrolabeData] = useState<AstrolabeData | null>(null);
// //   const [selectedModel, setSelectedModel] = useState('Qwen/Qwen2.5-72B-Instruct');
// //   const [aiQuestion, setAiQuestion] = useState('请帮我分析一下我的事业运势。');
// //   const [aiResponse, setAiResponse] = useState('');
// //   const [isLoadingAI, setIsLoadingAI] = useState(false);
// //   const [aiError, setAiError] = useState('');
// //
// //   const modelOptions = [
// //     // ... 模型选项保持不变 ...
// //     {
// //       label: 'MO',
// //       options: [
// //         { label: 'Qwen3-Next-80B-A3B-Instruct', value: 'Qwen/Qwen3-Next-80B-A3B-Instruct' },
// //         { label: 'DeepSeek-V3.1', value: 'deepseek-ai/DeepSeek-V3.1' },
// //       ]
// //     },
// //   ];
// //
// //   // --- 数据精简函数，现在位于App组件中 ---
// //   const pruneAstrolabeData = (data: AstrolabeData | null): PrunedAstrolabeData | null => {
// //     if (!data) return null;
// //     const simplifyStar = (star: any) => ({
// //       name: star.name,
// //       ...(star.brightness && { brightness: star.brightness }),
// //       ...(star.mutagen && { mutagen: star.mutagen }),
// //     });
// //
// //     return {
// //       gender: data.gender,
// //       soul: data.soul,
// //       body: data.body,
// //       fiveElementsClass: data.fiveElementsClass,
// //       palaces: data.palaces.map(palace => ({
// //         name: palace.name,
// //         isBodyPalace: palace.isBodyPalace,
// //         heavenlyStem: palace.heavenlyStem,
// //         earthlyBranch: palace.earthlyBranch,
// //         stars: [...palace.majorStars.map(simplifyStar), ...palace.minorStars.map(simplifyStar)],
// //       })),
// //     };
// //   };
// //
// //   // --- AI 解读请求函数 ---
// //   const handleGetAIInterpretation = async () => {
// //     if (!astrolabeData) {
// //       setAiError('请先生成命盘后再进行解读。');
// //       return;
// //     }
// //     if (!aiQuestion.trim()) {
// //       setAiError('请输入您想问的问题。');
// //       return;
// //     }
// //     setIsLoadingAI(true);
// //     setAiError('');
// //     setAiResponse('');
// //     try {
// //       const prunedData = pruneAstrolabeData(astrolabeData);
// //       if (!prunedData) {
// //         throw new Error('无法生成有效的命盘数据。');
// //       }
// //       const response = await fetch('/api/ziwei', {
// //         method: 'POST',
// //         headers: { 'Content-Type': 'application/json' },
// //         body: JSON.stringify({
// //           question: aiQuestion,
// //           model: selectedModel,
// //           astrolabeData: prunedData,
// //         }),
// //       });
// //       if (!response.ok) {
// //         const errorData = await response.json();
// //         throw new Error(errorData.error || '请求失败，请稍后再试。');
// //       }
// //       const result = await response.json();
// //       setAiResponse(result.answer);
// //     } catch (error: any) {
// //       setAiError(error.message);
// //     } finally {
// //       setIsLoadingAI(false);
// //     }
// //   };
// //
// //   const handleBirthTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
// //     setBirthTime(parseInt(e.target.value, 10));
// //   };
// //
// //   const getBirthTimeLabel = (index: number) => {
// //     if (index === 0) return '子时 (23点 - 1点)';
// //     if (index === 1) return '丑时 (1点 - 3点)';
// //     if (index === 12) return '亥时 (21点 - 23点)';
// //     const start = index * 2 - 1;
// //     const end = index * 2 + 1;
// //     const chineseHour = ['寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌'][index - 2];
// //     return `${chineseHour}时 (${start}点 - ${end}点)`;
// //   };
// //
// //   return (
// //       <div className="container">
// //         <header className="input-section">
// //           <h2>紫微斗数排盘</h2>
// //           <div className="form-container">
// //             <div className="form-item">
// //               <label htmlFor="birthday">出生日期:</label>
// //               <input id="birthday" type="date" value={birthday} onChange={(e) => setBirthday(e.target.value)} />
// //             </div>
// //             <div className="form-item">
// //               <label htmlFor="birthtime">出生时辰:</label>
// //               <select id="birthtime" value={birthTime} onChange={handleBirthTimeChange}>
// //                 {Array.from({ length: 13 }, (_, i) => (<option key={i} value={i}>{getBirthTimeLabel(i)}</option>))}
// //               </select>
// //             </div>
// //             <div className="form-item">
// //               <label htmlFor="gender">性别:</label>
// //               <select id="gender" value={gender} onChange={(e) => setGender(e.target.value as 'male' | 'female')}>
// //                 <option value="male">男</option>
// //                 <option value="female">女</option>
// //               </select>
// //             </div>
// //           </div>
// //         </header>
// //
// //         <main className="chart-container">
// //           {/*<Iztrolabe*/}
// //           {/*    birthday={birthday}*/}
// //           {/*    birthTime={birthTime}*/}
// //           {/*    gender={gender}*/}
// //           {/*    birthdayType='solar'*/}
// //           {/*    onDataChange={(data) => setAstrolabeData(data.astrolabe)} // 接收 Iztrolabe 组件传出的数据*/}
// //           {/*/>*/}
// //
// //
// //           <ResponsiveAstrolabe
// //               birthday={birthday}
// //               birthTime={birthTime}
// //               gender={gender}
// //               birthdayType='solar'
// //               onDataChange={(data) => setAstrolabeData(data.astrolabe)} // 接收 Iztrolabe 组件传出的数据
// //           />
// //         </main>
// //
// //         <section className="ai-interpretation-section">
// //           <h3>AI 智能解读</h3>
// //           <div className="ai-form">
// //             <div className="ai-form-item">
// //               <label htmlFor="ai-model">选择模型:</label>
// //               <select id="ai-model" value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)}>
// //                 {modelOptions.map((group) => (
// //                     <optgroup label={group.label} key={group.label}>
// //                       {group.options.map((option) => (
// //                           <option key={option.value} value={option.value}>{option.label}</option>
// //                       ))}
// //                     </optgroup>
// //                 ))}
// //               </select>
// //             </div>
// //             <div className="ai-form-item ai-form-item-full">
// //               <label htmlFor="ai-question">您想问什么？</label>
// //               <textarea id="ai-question" rows={3} value={aiQuestion} onChange={(e) => setAiQuestion(e.target.value)} placeholder="例如：请帮我分析一下我的事业发展方向和机遇。" />
// //             </div>
// //           </div>
// //           <button className="ai-submit-button" onClick={handleGetAIInterpretation} disabled={isLoadingAI || !astrolabeData}>
// //             {isLoadingAI ? '解读中...' : '获取AI解读'}
// //           </button>
// //           <div className="ai-response-area">
// //             {isLoadingAI && <div className="loader"></div>}
// //             {aiError && <p className="ai-error">错误: {aiError}</p>}
// //             {aiResponse && (<div className="ai-response"><pre>{aiResponse}</pre></div>)}
// //           </div>
// //         </section>
// //       </div>
// //   );
// // }
// //
// // export default App;
//
//
//
// // src/App.tsx
// import React, { useState, useRef, useLayoutEffect } from 'react';
// import { Iztrolabe } from './Iztrolabe/Iztrolabe';
// import { JsonViewer } from './JsonViewer/JsonViewer';
// import type { AstrolabeData, HoroscopeData } from 'iztro/lib/data/types';
// import { IztrolabeProps } from './Iztrolabe/Iztrolabe.type';
// import './App.css';
//
// // ===================================================================
// // STEP 1: 定义响应式包裹组件
// // ===================================================================
// const ResponsiveAstrolabe: React.FC<IztrolabeProps> = (props) => {
//   const wrapperRef = useRef<HTMLDivElement>(null);
//   const astrolabeRef = useRef<HTMLDivElement | null>(null);
//
//   useLayoutEffect(() => {
//     if (wrapperRef.current) {
//       astrolabeRef.current = wrapperRef.current.querySelector('.iztro-astrolabe');
//     }
//
//     const calculateScale = () => {
//       if (!wrapperRef.current || !astrolabeRef.current) {
//         return;
//       }
//
//       const originalWidth = astrolabeRef.current.offsetWidth;
//       const containerWidth = wrapperRef.current.getBoundingClientRect().width;
//
//       if (originalWidth === 0) return;
//
//       const scale = containerWidth / originalWidth;
//
//       if (scale <= 0) return;
//
//       astrolabeRef.current.style.transform = `scale(${scale})`;
//
//       const originalHeight = astrolabeRef.current.offsetHeight;
//       wrapperRef.current.style.height = `${originalHeight * scale}px`;
//     };
//
//     calculateScale();
//     window.addEventListener('resize', calculateScale);
//
//     return () => {
//       window.removeEventListener('resize', calculateScale);
//     };
//   }, [props]);
//
//   return (
//       <div className="astrolabe-scaler-wrapper" ref={wrapperRef}>
//         <Iztrolabe {...props} />
//       </div>
//   );
// };
//
// // 定义精简数据类型的接口
// interface PrunedAstrolabeData {
//   gender: string;
//   soul: string;
//   body: string;
//   fiveElementsClass: string;
//   palaces: object[];
// }
//
// function App() {
//   const [birthday, setBirthday] = useState('2000-01-01');
//   const [birthTime, setBirthTime] = useState(1);
//   const [gender, setGender] = useState<'male' | 'female'>('male');
//
//   // --- AI 相关 State ---
//   const [astrolabeData, setAstrolabeData] = useState<AstrolabeData | null>(null);
//   const [horoscopeData, setHoroscopeData] = useState<HoroscopeData | null>(null);
//   const [selectedModel, setSelectedModel] = useState('Qwen/Qwen2.5-72B-Instruct');
//   const [aiQuestion, setAiQuestion] = useState('请帮我分析一下我的事业运势。');
//   const [aiResponse, setAiResponse] = useState('');
//   const [isLoadingAI, setIsLoadingAI] = useState(false);
//   const [aiError, setAiError] = useState('');
//
//   // --- JSON 查看器 State ---
//   const [isJsonVisible, setIsJsonVisible] = useState(false);
//
//   const modelOptions = [
//     {
//       label: 'MO',
//       options: [
//         { label: 'Qwen3-Next-80B-A3B-Instruct', value: 'Qwen/Qwen3-Next-80B-A3B-Instruct' },
//         { label: 'DeepSeek-V3.1', value: 'deepseek-ai/DeepSeek-V3.1' },
//       ]
//     },
//   ];
//
//   // --- 数据精简函数 ---
//   const pruneAstrolabeData = (data: AstrolabeData | null): PrunedAstrolabeData | null => {
//     if (!data) return null;
//     const simplifyStar = (star: any) => ({
//       name: star.name,
//       ...(star.brightness && { brightness: star.brightness }),
//       ...(star.mutagen && { mutagen: star.mutagen }),
//     });
//
//     return {
//       gender: data.gender,
//       soul: data.soul,
//       body: data.body,
//       fiveElementsClass: data.fiveElementsClass,
//       palaces: data.palaces.map(palace => ({
//         name: palace.name,
//         isBodyPalace: palace.isBodyPalace,
//         heavenlyStem: palace.heavenlyStem,
//         earthlyBranch: palace.earthlyBranch,
//         stars: [...palace.majorStars.map(simplifyStar), ...palace.minorStars.map(simplifyStar)],
//       })),
//     };
//   };
//
//   // --- AI 解读请求函数 ---
//   const handleGetAIInterpretation = async () => {
//     if (!astrolabeData) {
//       setAiError('请先生成命盘后再进行解读。');
//       return;
//     }
//     if (!aiQuestion.trim()) {
//       setAiError('请输入您想问的问题。');
//       return;
//     }
//     setIsLoadingAI(true);
//     setAiError('');
//     setAiResponse('');
//     try {
//       const prunedData = pruneAstrolabeData(astrolabeData);
//       if (!prunedData) {
//         throw new Error('无法生成有效的命盘数据。');
//       }
//       const response = await fetch('/api/ziwei', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           question: aiQuestion,
//           model: selectedModel,
//           astrolabeData: prunedData,
//         }),
//       });
//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || '请求失败，请稍后再试。');
//       }
//       const result = await response.json();
//       setAiResponse(result.answer);
//     } catch (error: any) {
//       setAiError(error.message);
//     } finally {
//       setIsLoadingAI(false);
//     }
//   };
//
//   const handleBirthTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     setBirthTime(parseInt(e.target.value, 10));
//   };
//
//   const getBirthTimeLabel = (index: number) => {
//     if (index === 0) return '子时 (23点 - 1点)';
//     if (index === 1) return '丑时 (1点 - 3点)';
//     if (index === 12) return '亥时 (21点 - 23点)';
//     const start = index * 2 - 1;
//     const end = index * 2 + 1;
//     const chineseHour = ['寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌'][index - 2];
//     return `${chineseHour}时 (${start}点 - ${end}点)`;
//   };
//
//   // 接收 Iztrolabe 组件传出的数据
//   const handleDataChange = (data: { astrolabe: AstrolabeData | null; horoscope: HoroscopeData | null }) => {
//     setAstrolabeData(data.astrolabe);
//     setHoroscopeData(data.horoscope);
//   };
//
//   return (
//       <div className="app-container">
//         {/* 主内容区域 */}
//         <div className="main-content">
//           <header className="input-section">
//             <h2>紫微斗数排盘</h2>
//             <div className="form-container">
//               <div className="form-item">
//                 <label htmlFor="birthday">出生日期:</label>
//                 <input id="birthday" type="date" value={birthday} onChange={(e) => setBirthday(e.target.value)} />
//               </div>
//               <div className="form-item">
//                 <label htmlFor="birthtime">出生时辰:</label>
//                 <select id="birthtime" value={birthTime} onChange={handleBirthTimeChange}>
//                   {Array.from({ length: 13 }, (_, i) => (<option key={i} value={i}>{getBirthTimeLabel(i)}</option>))}
//                 </select>
//               </div>
//               <div className="form-item">
//                 <label htmlFor="gender">性别:</label>
//                 <select id="gender" value={gender} onChange={(e) => setGender(e.target.value as 'male' | 'female')}>
//                   <option value="male">男</option>
//                   <option value="female">女</option>
//                 </select>
//               </div>
//             </div>
//           </header>
//
//           <main className="chart-container">
//             <ResponsiveAstrolabe
//                 birthday={birthday}
//                 birthTime={birthTime}
//                 gender={gender}
//                 birthdayType='solar'
//                 onDataChange={handleDataChange}
//             />
//           </main>
//
//           <section className="ai-interpretation-section">
//             <h3>AI 智能解读</h3>
//             <div className="ai-form">
//               <div className="ai-form-item">
//                 <label htmlFor="ai-model">选择模型:</label>
//                 <select id="ai-model" value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)}>
//                   {modelOptions.map((group) => (
//                       <optgroup label={group.label} key={group.label}>
//                         {group.options.map((option) => (
//                             <option key={option.value} value={option.value}>{option.label}</option>
//                         ))}
//                       </optgroup>
//                   ))}
//                 </select>
//               </div>
//               <div className="ai-form-item ai-form-item-full">
//                 <label htmlFor="ai-question">您想问什么？</label>
//                 <textarea id="ai-question" rows={3} value={aiQuestion} onChange={(e) => setAiQuestion(e.target.value)} placeholder="例如：请帮我分析一下我的事业发展方向和机遇。" />
//               </div>
//             </div>
//             <button className="ai-submit-button" onClick={handleGetAIInterpretation} disabled={isLoadingAI || !astrolabeData}>
//               {isLoadingAI ? '解读中...' : '获取AI解读'}
//             </button>
//             <div className="ai-response-area">
//               {isLoadingAI && <div className="loader"></div>}
//               {aiError && <p className="ai-error">错误: {aiError}</p>}
//               {aiResponse && (<div className="ai-response"><pre>{aiResponse}</pre></div>)}
//             </div>
//           </section>
//         </div>
//
//         {/* 固定在底部的JSON查看器区域 */}
//         <div className="json-viewer-footer">
//           <div className="json-viewer-controls">
//             <button
//                 onClick={() => setIsJsonVisible(!isJsonVisible)}
//                 className="json-toggle-button"
//             >
//               {isJsonVisible ? "隐藏源数据" : "显示源数据"}
//             </button>
//           </div>
//           {isJsonVisible && (
//               <div className="json-viewer-container">
//                 <JsonViewer data={{ astrolabe: astrolabeData, horoscope: horoscopeData }} />
//               </div>
//           )}
//         </div>
//       </div>
//   );
// }
//
// export default App;
// src/App.tsx

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import React, { useState, useRef, useLayoutEffect } from 'react';
import { Iztrolabe } from './Iztrolabe/Iztrolabe';
import { JsonViewer } from './JsonViewer/JsonViewer';
import type { AstrolabeData, HoroscopeData } from 'iztro/lib/data/types';
import { IztrolabeProps } from './Iztrolabe/Iztrolabe.type';
import './App.css';

// ===================================================================
// 响应式包裹组件
// ===================================================================
const ResponsiveAstrolabe: React.FC<IztrolabeProps> = (props) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const astrolabeRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (wrapperRef.current) {
      astrolabeRef.current = wrapperRef.current.querySelector('.iztro-astrolabe');
    }

    const calculateScale = () => {
      if (!wrapperRef.current || !astrolabeRef.current) {
        return;
      }

      const originalWidth = astrolabeRef.current.offsetWidth;
      const containerWidth = wrapperRef.current.getBoundingClientRect().width;

      if (originalWidth === 0) return;

      const scale = containerWidth / originalWidth;

      if (scale <= 0) return;

      astrolabeRef.current.style.transform = `scale(${scale})`;

      const originalHeight = astrolabeRef.current.offsetHeight;
      wrapperRef.current.style.height = `${originalHeight * scale}px`;
    };

    calculateScale();
    window.addEventListener('resize', calculateScale);

    return () => {
      window.removeEventListener('resize', calculateScale);
    };
  }, [props]);

  return (
      <div className="astrolabe-scaler-wrapper" ref={wrapperRef}>
        <Iztrolabe {...props} />
      </div>
  );
};

// 定义精简数据类型的接口
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
  const [horoscopeData, setHoroscopeData] = useState<HoroscopeData | null>(null);
  //const [selectedModel, setSelectedModel] = useState('Qwen/Qwen2.5-72B-Instruct');
  const [selectedModel, setSelectedModel] = useState('Qwen/Qwen3-Next-80B-A3B-Instruct');
  const [aiQuestion, setAiQuestion] = useState('请帮我分析一下我的事业运势。');
  const [aiResponse, setAiResponse] = useState('');
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [aiError, setAiError] = useState('');

  // --- JSON 查看器 State ---
  const [isJsonVisible, setIsJsonVisible] = useState(false);



  // --- 新增代码: 为联系方式弹窗创建状态 ---
  const [isModalOpen, setIsModalOpen] = useState(false);


  // const modelOptions = [
  //   {
  //     label: 'MO',
  //     options: [
  //       { label: 'Qwen3-Next-80B-A3B-Instruct', value: 'Qwen/Qwen3-Next-80B-A3B-Instruct' },
  //       { label: 'DeepSeek-V3.1', value: 'deepseek-ai/DeepSeek-V3.1' },
  //     ]
  //   },
  // ];

  const modelOptions = [
    {
      label: 'CE（暂不可用）',
      options: [
        { label: 'llama-4-scout', value: 'llama-4-scout-17b-16e-instruct' },
        { label: 'llama3.1', value: 'llama3.1-8b' },
        { label: 'llama-3.3', value: 'llama-3.3-70b' },
        { label: 'gpt', value: 'gpt-oss-120b' },
        { label: 'qwen-3', value: 'qwen-3-32b' }
      ]
    },
    {
      label: 'MO',
      options: [
        { label: 'Qwen3-Next-80B', value: 'Qwen/Qwen3-Next-80B-A3B-Instruct' },
        { label: 'DeepSeek', value: 'deepseek-ai/DeepSeek-V3.1' },
        { label: 'GLM', value: 'ZhipuAI/GLM-4.5' },
        { label: 'Qwen2.5-72B', value: 'Qwen/Qwen2.5-72B-Instruct' },
        { label: 'Llama-4-Maverick', value: 'LLM-Research/Llama-4-Maverick-17B-128E-Instruct' },
        { label: 'Mistral-Large', value: 'mistralai/Mistral-Large-Instruct-2407' }
      ]
    },
    {
      label: 'BI',
      options: [
        { label: 'GLM', value: 'GLM-4.5-Flash' }
      ]
    },
    {
      label: 'MI',
      options: [
        { label: 'mistral-medium', value: 'mistral-medium-2508' }
      ]
    }
  ];


  // --- 数据精简函数 ---
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

  // 接收 Iztrolabe 组件传出的数据
  const handleDataChange = (data: { astrolabe: AstrolabeData | null; horoscope: HoroscopeData | null }) => {
    setAstrolabeData(data.astrolabe);
    setHoroscopeData(data.horoscope);
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
          <ResponsiveAstrolabe
              birthday={birthday}
              birthTime={birthTime}
              gender={gender}
              birthdayType='solar'
              onDataChange={handleDataChange}
          />
        </main>

        <section className="ai-interpretation-section">
          <h3>AI 限时免费解读</h3>
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
              <label htmlFor="ai-question">请输入您的具体问题（空白默认命盘整体分析）</label>
              <textarea id="ai-question" rows={3} value={aiQuestion} onChange={(e) => setAiQuestion(e.target.value)} placeholder="例如：请帮我分析一下我的事业发展方向和机遇。" />
            </div>
          </div>
          <button className="ai-submit-button" onClick={handleGetAIInterpretation} disabled={isLoadingAI || !astrolabeData}>
            {isLoadingAI ? '解读中...' : '获取AI解读'}
          </button>
          <div className="ai-response-area">
            {isLoadingAI && <div className="loader"></div>}
            {aiError && <p className="ai-error">错误: {aiError}</p>}
            {/*{aiResponse && (<div className="ai-response"><pre>{aiResponse}</pre></div>)}*/}

            {/* --- 修改点 2: 使用 ReactMarkdown 替换 pre 标签 --- */}
            {aiResponse && (
                <div className="ai-response">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {aiResponse}
                  </ReactMarkdown>
                </div>
            )}
          </div>
        </section>

        {/* JSON 查看器区域 - 现在放在 AI 解读区域的下方 */}
        <section className="json-viewer-section">
          <div className="json-viewer-controls">
            <button
                onClick={() => setIsJsonVisible(!isJsonVisible)}
                className="json-toggle-button"
            >
              {isJsonVisible ? "隐藏源数据" : "显示源数据"}
            </button>
          </div>
          {isJsonVisible && (
              <div className="json-viewer-container">
                <JsonViewer data={{ astrolabe: astrolabeData, horoscope: horoscopeData }} />
              </div>
          )}
        </section>




        {/* --- 新增代码: 添加页脚链接区域 --- */}
        <footer className="footer-links">
          <a href="https://www.xyy.abrdns.com/" target="_blank" rel="noopener noreferrer">网页访问</a>
          <a href="https://www.zb.abrdns.com/" target="_blank" rel="noopener noreferrer">排盘网站</a>
          <a href="https://www.yunxi.abrdns.com/" target="_blank" rel="noopener noreferrer">博客</a>
          <a href="https://www.yunxi.abrdns.com/app/明心紫微斗数.apk" target="_blank" rel="noopener noreferrer">app下载</a>
          {/* 使用 button 触发弹窗是更合适的做法 */}
          <button onClick={() => setIsModalOpen(true)} className="contact-button">
            联系方式
          </button>
        </footer>
        {/* --- 新增代码: 联系方式弹窗 (Modal) --- */}
        {isModalOpen && (
            // 遮罩层，点击可以关闭弹窗
            <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
              {/* 弹窗内容区，阻止事件冒泡以防点击内容区关闭弹窗 */}
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button
                    className="modal-close-button"
                    onClick={() => setIsModalOpen(false)}
                >
                  &times; {/* 这是一个漂亮的关闭图标 "×" */}
                </button>
                <h4>联系方式</h4>
                <img
                    src="/wechat-qr.png" // 对应 public 文件夹中的图片
                    alt="微信二维码"
                    className="qr-code-image"
                />
                <p>可截图并用微信扫一扫添加好友</p>
              </div>
            </div>
        )}




      </div>
  );
}

export default App;
