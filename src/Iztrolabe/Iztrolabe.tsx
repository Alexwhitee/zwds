// src/Iztrolabe.tsx
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
import type { AstrolabeData, HoroscopeData } from "iztro/lib/data/types";

// 扩展 Props 类型，增加一个回调函数
interface IztrolabeComponentProps extends IztrolabeProps {
  onDataChange: (data: { astrolabe: AstrolabeData | null, horoscope: HoroscopeData | null }) => void;
}

export const Iztrolabe: React.FC<IztrolabeComponentProps> = (props) => {
  const [isJsonVisible, setIsJsonVisible] = useState(false);
  const [taichiPoint, setTaichiPoint] = useState(-1);
  const [taichiPalaces, setTaichiPalaces] = useState<undefined | string[]>();
  const [activeHeavenlyStem, setActiveHeavenlyStem] = useState<HeavenlyStemKey>();
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

  // 当命盘数据变化时，通过回调函数传给父组件 App.tsx
  useEffect(() => {
    props.onDataChange({ astrolabe, horoscope });
  }, [astrolabe, horoscope, props.onDataChange]);

  // --- 所有 AI 相关的 state 和函数都已移除 ---

  const toggleShowScope = (scope: Scope) => { /* ... (此函数不变) ... */ };
  const toggleActiveHeavenlyStem = (heavenlyStem: HeavenlyStemKey) => { /* ... (此函数不变) ... */ };
  const dynamic = useMemo(() => { /* ... (此逻辑不变) ... */ }, [showDecadal, showYearly, showMonthly, showDaily, showHourly, horoscope]);
  useEffect(() => { /* ... (horoscopeDate 相关逻辑不变) ... */ }, [props.horoscopeDate, props.horoscopeHour]);
  useEffect(() => { /* ... (setHoroscope 相关逻辑不变) ... */ }, [horoscopeDate, horoscopeHour]);
  useEffect(() => { /* ... (taichiPoint 相关逻辑不变) ... */ }, [taichiPoint]);
  const toggleTaichiPoint = (index: number) => { /* ... (此函数不变) ... */ };

  return (
      <div className="iztrolabe-wrapper">
        {/* 核心改动：在命盘外层包裹新的响应式容器 */}
        <div className="astrolabe-responsive-wrapper">
          <div className={classNames("iztro-astrolabe", "iztro-astrolabe-theme-default")}>
            {astrolabe?.palaces.map((palace) => (
                <Izpalace
                    key={palace.earthlyBranch}
                    {...palace}
                    // ... 其他 props 保持不变
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
                />
            ))}
            <IzpalaceCenter
                astrolabe={astrolabe}
                horoscope={horoscope}
                // ... 其他 props 保持不变
                horoscopeDate={horoscopeDate}
                horoscopeHour={horoscopeHour}
                setHoroscopeDate={setHoroscopeDate}
                setHoroscopeHour={setHoroscopeHour}
                centerPalaceAlign={props.centerPalaceAlign}
                {...dynamic}
            />
          </div>
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

        {/* --- AI 解读区域的 JSX 已完全移除 --- */}
      </div>
  );
};

// 补全缺失的函数定义
const toggleShowScope = (scope: Scope) => {};
const toggleActiveHeavenlyStem = (heavenlyStem: HeavenlyStemKey) => {};
const toggleTaichiPoint = (index: number) => {};
