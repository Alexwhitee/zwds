import React, { useEffect, useMemo, useState } from "react";
import { JsonViewer } from "../JsonViewer/JsonViewer";
import { Izpalace } from "../Izpalace/Izpalace";
import { IztrolabeProps } from "./Iztrolabe.type";
import { IzpalaceCenter } from "../IzpalaceCenter";
import classNames from "classnames";
import { useIztro } from "iztro-hook";
import "./Iztrolabe.css";
import "../theme/default.css";
import { Scope } from "iztro/lib/data/types";
import { HeavenlyStemKey } from "iztro/lib/i18n";
import { getPalaceNames } from "iztro/lib/astro";

export const Iztrolabe: React.FC<IztrolabeProps> = (props) => {
  const [isJsonVisible, setIsJsonVisible] = useState(false);
  const [taichiPoint, setTaichiPoint] = useState(-1);
  const [taichiPalaces, setTaichiPalaces] = useState<undefined | string[]>();
  const [activeHeavenlyStem, setActiveHeavenlyStem] =
    useState<HeavenlyStemKey>();
  const [hoverHeavenlyStem, setHoverHeavenlyStem] = useState<HeavenlyStemKey>();
  const [focusedIndex, setFocusedIndex] = useState<number>();
  const [showDecadal, setShowDecadal] = useState(false);
  const [showYearly, setShowYearly] = useState(false);
  const [showMonthly, setShowMonthly] = useState(false);
  const [showDaily, setShowDaily] = useState(false);
  const [showHourly, setShowShowHourly] = useState(false);
  const [horoscopeDate, setHoroscopeDate] = useState<string | Date>();
  const [horoscopeHour, setHoroscopeHour] = useState<number>();


  const { astrolabe, horoscope, setHoroscope } = useIztro({
    birthday: props.birthday,
    birthTime: props.birthTime,
    gender: props.gender,
    birthdayType: props.birthdayType,
    fixLeap: props.fixLeap,
    isLeapMonth: props.isLeapMonth,
    lang: props.lang,
    astroType: props.astroType,
    options: props.options,
  });








  // --- 新增代码从这里开始 ---
  const [selectedModel, setSelectedModel] = useState('Qwen/Qwen2.5-72B-Instruct'); // 默认模型
  const [aiQuestion, setAiQuestion] = useState('请帮我分析一下我的事业运势。'); // 默认问题
  const [aiResponse, setAiResponse] = useState('');
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [aiError, setAiError] = useState('');
  const modelOptions = [
    {
      label: 'MO',
      options: [
        { label: 'Qwen3-Next-80B-A3B-Instruct', value: 'Qwen/Qwen3-Next-80B-A3B-Instruct' },
        { label: 'DeepSeek-V3.1', value: 'deepseek-ai/DeepSeek-V3.1' },
        { label: 'GLM-4.5', value: 'ZhipuAI/GLM-4.5' },
        { label: 'Qwen2.5-72B-Instruct', value: 'Qwen/Qwen2.5-72B-Instruct' },
        { label: 'Llama-4-Maverick-17B', value: 'LLM-Research/Llama-4-Maverick-17B-128E-Instruct' },
        { label: 'Mistral-Large-Instruct', value: 'mistralai/Mistral-Large-Instruct-2407' }
      ]
    },
    { label: 'BI', options: [{ label: 'GLM-4.5-Flash', value: 'GLM-4.5-Flash' }] },
    {
      label: 'CE', options: [
        { label: 'llama-4-scout-17b', value: 'llama-4-scout-17b-16e-instruct' },
        { label: 'llama3.1-8b', value: 'llama3.1-8b' },
        { label: 'llama-3.3-70b', value: 'llama-3.3-70b' },
        { label: 'gpt-oss-120b', value: 'gpt-oss-120b' },
        { label: 'qwen-3-32b', value: 'qwen-3-32b' }
      ]
    },
    { label: 'MI', options: [{ label: 'mistral-medium-2508', value: 'mistral-medium-2508' }] }
  ];
  const handleGetAIInterpretation = async () => {
    if (!astrolabe) {
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
      const prunedData = pruneAstrolabeData(astrolabe);
      if (!prunedData) {
        throw new Error('无法生成有效的命盘数据。');
      }
      const response = await fetch('/api/ziwei', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: aiQuestion,
          model: selectedModel,
          astrolabeData: prunedData, // 传递整个 astrolabe 对象
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











  const toggleShowScope = (scope: Scope) => {
    switch (scope) {
      case "decadal":
        setShowDecadal(!showDecadal);
        break;
      case "yearly":
        setShowYearly(!showYearly);
        break;
      case "monthly":
        setShowMonthly(!showMonthly);
        break;
      case "daily":
        setShowDaily(!showDaily);
        break;
      case "hourly":
        setShowShowHourly(!showHourly);
        break;
    }
  };

  const toggleActiveHeavenlyStem = (heavenlyStem: HeavenlyStemKey) => {
    if (heavenlyStem === activeHeavenlyStem) {
      setActiveHeavenlyStem(undefined);
    } else {
      setActiveHeavenlyStem(heavenlyStem);
    }
  };

  const dynamic = useMemo(() => {
    if (showHourly) {
      return {
        arrowIndex: horoscope?.hourly.index,
        arrowScope: "hourly" as Scope,
      };
    }

    if (showDaily) {
      return {
        arrowIndex: horoscope?.daily.index,
        arrowScope: "daily" as Scope,
      };
    }

    if (showMonthly) {
      return {
        arrowIndex: horoscope?.monthly.index,
        arrowScope: "monthly" as Scope,
      };
    }

    if (showYearly) {
      return {
        arrowIndex: horoscope?.yearly.index,
        arrowScope: "yearly" as Scope,
      };
    }

    if (showDecadal) {
      return {
        arrowIndex: horoscope?.decadal.index,
        arrowScope: "decadal" as Scope,
      };
    }
  }, [showDecadal, showYearly, showMonthly, showDaily, showHourly, horoscope]);

  useEffect(() => {
    setHoroscopeDate(props.horoscopeDate ?? new Date());
    setHoroscopeHour(props.horoscopeHour ?? 0);
  }, [props.horoscopeDate, props.horoscopeHour]);

  useEffect(() => {
    setHoroscope(horoscopeDate ?? new Date(), horoscopeHour);
  }, [horoscopeDate, horoscopeHour]);

  useEffect(() => {
    if (taichiPoint < 0) {
      setTaichiPalaces(undefined);
    } else {
      const palaces = getPalaceNames(taichiPoint);

      setTaichiPalaces(palaces);
    }
  }, [taichiPoint]);

  const toggleTaichiPoint = (index: number) => {
    if (taichiPoint === index) {
      setTaichiPoint(-1);
    } else {
      setTaichiPoint(index);
    }
  };


  /**
   * 精简紫微斗数数据，只保留核心信息传给AI
   * @param data 原始的 astrolabe 数据对象
   * @returns 精简后的数据对象
   */
  const pruneAstrolabeData = (data) => {
    if (!data) return null;
    // 简化单个星曜对象，只保留核心信息
    const simplifyStar = (star) => ({
      name: star.name,
      // brightness 和 mutagen 是核心信息，必须保留
      ...(star.brightness && { brightness: star.brightness }),
      ...(star.mutagen && { mutagen: star.mutagen }),
    });

    // 精简后的新数据对象
    const prunedData = {
      gender: data.gender,
      soul: data.soul,
      body: data.body,
      fiveElementsClass: data.fiveElementsClass,
      palaces: data.palaces.map(palace => {
        // 合并主星和辅星，因为它们同等重要
        const allCoreStars = [
          ...palace.majorStars.map(simplifyStar),
          ...palace.minorStars.map(simplifyStar),
        ];
        return {
          name: palace.name,
          isBodyPalace: palace.isBodyPalace,
          heavenlyStem: palace.heavenlyStem,
          earthlyBranch: palace.earthlyBranch,
          stars: allCoreStars, // 使用一个统一的 'stars' 数组
        };
      }),
    };
    return prunedData;
  };























  return (
    // <div
    //   className={classNames("iztro-astrolabe", "iztro-astrolabe-theme-default")}
    // >
         <div className="iztrolabe-wrapper">
             <div
               className={classNames(
                   "iztro-astrolabe",
                   "iztro-astrolabe-theme-default"
                 )}
             >
      {astrolabe?.palaces.map((palace) => {
        return (
          <Izpalace
            key={palace.earthlyBranch}
            focusedIndex={focusedIndex}
            onFocused={setFocusedIndex}
            horoscope={horoscope}
            showDecadalScope={showDecadal}
            showYearlyScope={showYearly}
            showMonthlyScope={showMonthly}
            showDailyScope={showDaily}
            showHourlyScope={showHourly}
            taichiPalace={taichiPalaces?.[palace.index]}
            toggleScope={toggleShowScope}
            activeHeavenlyStem={activeHeavenlyStem}
            toggleActiveHeavenlyStem={toggleActiveHeavenlyStem}
            hoverHeavenlyStem={hoverHeavenlyStem}
            setHoverHeavenlyStem={setHoverHeavenlyStem}
            toggleTaichiPoint={toggleTaichiPoint}
            {...palace}
          />
        );
      })}
      <IzpalaceCenter
        astrolabe={astrolabe}
        horoscope={horoscope}
        horoscopeDate={horoscopeDate}
        horoscopeHour={horoscopeHour}
        setHoroscopeDate={setHoroscopeDate}
        setHoroscopeHour={setHoroscopeHour}
        centerPalaceAlign={props.centerPalaceAlign}
        {...dynamic}
      />



                    </div>
                <div className="json-viewer-controls" style={{ marginTop: '20px', textAlign: 'center' }}>
                  <button
                    onClick={() => setIsJsonVisible(!isJsonVisible)}
                    style={{ padding: '8px 16px', cursor: 'pointer', fontSize: '14px', borderRadius: '4px', border: '1px solid #ccc' }}
                  >
                    {isJsonVisible ? "隐藏源数据" : "显示源数据"}
                  </button>
                </div>
           {isJsonVisible && (
                 <div className="json-viewer-container" style={{ marginTop: '15px' }}>
                     <JsonViewer data={{ astrolabe, horoscope }} />
                   </div>
               )}


           {/* --- 新增AI解读区域的JSX从这里开始 --- */}
           <div className="ai-interpretation-section">
             <h3>AI 智能解读</h3>
             <div className="ai-form">
               <div className="ai-form-item">
                 <label htmlFor="ai-model">选择模型:</label>
                 <select
                     id="ai-model"
                     value={selectedModel}
                     onChange={(e) => setSelectedModel(e.target.value)}
                 >
                   {modelOptions.map((group) => (
                       <optgroup label={group.label} key={group.label}>
                         {group.options.map((option) => (
                             <option key={option.value} value={option.value}>
                               {option.label}
                             </option>
                         ))}
                       </optgroup>
                   ))}
                 </select>
               </div>
               <div className="ai-form-item ai-form-item-full">
                 <label htmlFor="ai-question">您想问什么？</label>
                 <textarea
                     id="ai-question"
                     rows={3}
                     value={aiQuestion}
                     onChange={(e) => setAiQuestion(e.target.value)}
                     placeholder="例如：请帮我分析一下我的事业发展方向和机遇。"
                 />
               </div>
             </div>
             <button
                 className="ai-submit-button"
                 onClick={handleGetAIInterpretation}
                 disabled={isLoadingAI}
             >
               {isLoadingAI ? '解读中...' : '获取AI解读'}
             </button>
             <div className="ai-response-area">
               {isLoadingAI && <div className="loader"></div>}
               {aiError && <p className="ai-error">错误: {aiError}</p>}
               {aiResponse && (
                   <div className="ai-response">
                     <pre>{aiResponse}</pre>
                   </div>
               )}
             </div>
           </div>
           {/* --- 新增AI解读区域的JSX到这里结束 --- */}


     </div>


  );
};
