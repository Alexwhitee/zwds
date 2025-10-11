// // // // src/Iztrolabe.tsx
// // // import React, { useEffect, useMemo, useState } from "react";
// // // import { JsonViewer } from "../JsonViewer/JsonViewer";
// // // import { Izpalace } from "../Izpalace/Izpalace";
// // // import { IztrolabeProps } from "./Iztrolabe.type";
// // // import { IzpalaceCenter } from "../IzpalaceCenter";
// // // import classNames from "classnames";
// // // import { useIztro } from "iztro-hook";
// // // import "./Iztrolabe.css";
// // // import "../theme/default.css";
// // // import { Scope } from "iztro/lib/data/types";
// // // import { HeavenlyStemKey } from "iztro/lib/i18n";
// // // import { getPalaceNames } from "iztro/lib/astro";
// // // import type { AstrolabeData, HoroscopeData } from "iztro/lib/data/types";
// // //
// // // // 扩展 Props 类型，增加一个回调函数
// // // interface IztrolabeComponentProps extends IztrolabeProps {
// // //   onDataChange: (data: { astrolabe: AstrolabeData | null, horoscope: HoroscopeData | null }) => void;
// // // }
// // //
// // // export const Iztrolabe: React.FC<IztrolabeComponentProps> = (props) => {
// // //   const [isJsonVisible, setIsJsonVisible] = useState(false);
// // //   const [taichiPoint, setTaichiPoint] = useState(-1);
// // //   const [taichiPalaces, setTaichiPalaces] = useState<undefined | string[]>();
// // //   const [activeHeavenlyStem, setActiveHeavenlyStem] = useState<HeavenlyStemKey>();
// // //   const [hoverHeavenlyStem, setHoverHeavenlyStem] = useState<HeavenlyStemKey>();
// // //   const [focusedIndex, setFocusedIndex] = useState<number>();
// // //   const [showDecadal, setShowDecadal] = useState(false);
// // //   const [showYearly, setShowYearly] = useState(false);
// // //   const [showMonthly, setShowMonthly] = useState(false);
// // //   const [showDaily, setShowDaily] = useState(false);
// // //   const [showHourly, setShowShowHourly] = useState(false);
// // //   const [horoscopeDate, setHoroscopeDate] = useState<string | Date>();
// // //   const [horoscopeHour, setHoroscopeHour] = useState<number>();
// // //
// // //   const { astrolabe, horoscope, setHoroscope } = useIztro({
// // //     birthday: props.birthday,
// // //     birthTime: props.birthTime,
// // //     gender: props.gender,
// // //     birthdayType: props.birthdayType,
// // //     fixLeap: props.fixLeap,
// // //     isLeapMonth: props.isLeapMonth,
// // //     lang: props.lang,
// // //     astroType: props.astroType,
// // //     options: props.options,
// // //   });
// // //
// // //   // 当命盘数据变化时，通过回调函数传给父组件 App.tsx
// // //   useEffect(() => {
// // //     props.onDataChange({ astrolabe, horoscope });
// // //   }, [astrolabe, horoscope, props.onDataChange]);
// // //
// // //   // --- 所有 AI 相关的 state 和函数都已移除 ---
// // //
// // //   const toggleShowScope = (scope: Scope) => { /* ... (此函数不变) ... */ };
// // //   const toggleActiveHeavenlyStem = (heavenlyStem: HeavenlyStemKey) => { /* ... (此函数不变) ... */ };
// // //   const dynamic = useMemo(() => { /* ... (此逻辑不变) ... */ }, [showDecadal, showYearly, showMonthly, showDaily, showHourly, horoscope]);
// // //   useEffect(() => { /* ... (horoscopeDate 相关逻辑不变) ... */ }, [props.horoscopeDate, props.horoscopeHour]);
// // //   useEffect(() => { /* ... (setHoroscope 相关逻辑不变) ... */ }, [horoscopeDate, horoscopeHour]);
// // //   useEffect(() => { /* ... (taichiPoint 相关逻辑不变) ... */ }, [taichiPoint]);
// // //   const toggleTaichiPoint = (index: number) => { /* ... (此函数不变) ... */ };
// // //
// // //   return (
// // //       <div className="iztrolabe-wrapper">
// // //         {/* 核心改动：在命盘外层包裹新的响应式容器 */}
// // //         {/*<div className="astrolabe-responsive-wrapper">*/}
// // //           <div className={classNames("iztro-astrolabe", "iztro-astrolabe-theme-default")}>
// // //             {astrolabe?.palaces.map((palace) => (
// // //                 <Izpalace
// // //                     key={palace.earthlyBranch}
// // //                     {...palace}
// // //                     // ... 其他 props 保持不变
// // //                     focusedIndex={focusedIndex}
// // //                     onFocused={setFocusedIndex}
// // //                     horoscope={horoscope}
// // //                     showDecadalScope={showDecadal}
// // //                     showYearlyScope={showYearly}
// // //                     showMonthlyScope={showMonthly}
// // //                     showDailyScope={showDaily}
// // //                     showHourlyScope={showHourly}
// // //                     taichiPalace={taichiPalaces?.[palace.index]}
// // //                     toggleScope={toggleShowScope}
// // //                     activeHeavenlyStem={activeHeavenlyStem}
// // //                     toggleActiveHeavenlyStem={toggleActiveHeavenlyStem}
// // //                     hoverHeavenlyStem={hoverHeavenlyStem}
// // //                     setHoverHeavenlyStem={setHoverHeavenlyStem}
// // //                     toggleTaichiPoint={toggleTaichiPoint}
// // //                 />
// // //             ))}
// // //             <IzpalaceCenter
// // //                 astrolabe={astrolabe}
// // //                 horoscope={horoscope}
// // //                 // ... 其他 props 保持不变
// // //                 horoscopeDate={horoscopeDate}
// // //                 horoscopeHour={horoscopeHour}
// // //                 setHoroscopeDate={setHoroscopeDate}
// // //                 setHoroscopeHour={setHoroscopeHour}
// // //                 centerPalaceAlign={props.centerPalaceAlign}
// // //                 {...dynamic}
// // //             />
// // //           </div>
// // //         {/*</div>*/}
// // //
// // //         <div className="json-viewer-controls" style={{ marginTop: '20px', textAlign: 'center' }}>
// // //           <button
// // //               onClick={() => setIsJsonVisible(!isJsonVisible)}
// // //               style={{ padding: '8px 16px', cursor: 'pointer', fontSize: '14px', borderRadius: '4px', border: '1px solid #ccc' }}
// // //           >
// // //             {isJsonVisible ? "隐藏源数据" : "显示源数据"}
// // //           </button>
// // //         </div>
// // //         {isJsonVisible && (
// // //             <div className="json-viewer-container" style={{ marginTop: '15px' }}>
// // //               <JsonViewer data={{ astrolabe, horoscope }} />
// // //             </div>
// // //         )}
// // //
// // //         {/* --- AI 解读区域的 JSX 已完全移除 --- */}
// // //       </div>
// // //   );
// // // };
// // //
// // // // 补全缺失的函数定义
// // // const toggleShowScope = (scope: Scope) => {};
// // // const toggleActiveHeavenlyStem = (heavenlyStem: HeavenlyStemKey) => {};
// // // const toggleTaichiPoint = (index: number) => {};
// //
// //
// //
// //
// //
// //
// //
// //
// //
// //
// // // src/Iztrolabe/Iztrolabe.tsx
// // import React, { useEffect, useMemo, useState } from "react";
// // import { Izpalace } from "../Izpalace/Izpalace";
// // import { IztrolabeProps } from "./Iztrolabe.type";
// // import { IzpalaceCenter } from "../IzpalaceCenter";
// // import classNames from "classnames";
// // import { useIztro } from "iztro-hook";
// // import "./Iztrolabe.css";
// // import "../theme/default.css";
// // import { Scope } from "iztro/lib/data/types";
// // import { HeavenlyStemKey } from "iztro/lib/i18n";
// // import { getPalaceNames } from "iztro/lib/astro";
// // import type { AstrolabeData, HoroscopeData } from "iztro/lib/data/types";
// //
// // // 扩展 Props 类型，增加一个回调函数
// // interface IztrolabeComponentProps extends IztrolabeProps {
// //   onDataChange: (data: { astrolabe: AstrolabeData | null, horoscope: HoroscopeData | null }) => void;
// // }
// //
// // export const Iztrolabe: React.FC<IztrolabeComponentProps> = (props) => {
// //   const [taichiPoint, setTaichiPoint] = useState(-1);
// //   const [taichiPalaces, setTaichiPalaces] = useState<undefined | string[]>();
// //   const [activeHeavenlyStem, setActiveHeavenlyStem] = useState<HeavenlyStemKey>();
// //   const [hoverHeavenlyStem, setHoverHeavenlyStem] = useState<HeavenlyStemKey>();
// //   const [focusedIndex, setFocusedIndex] = useState<number>();
// //   const [showDecadal, setShowDecadal] = useState(false);
// //   const [showYearly, setShowYearly] = useState(false);
// //   const [showMonthly, setShowMonthly] = useState(false);
// //   const [showDaily, setShowDaily] = useState(false);
// //   const [showHourly, setShowShowHourly] = useState(false);
// //   const [horoscopeDate, setHoroscopeDate] = useState<string | Date>();
// //   const [horoscopeHour, setHoroscopeHour] = useState<number>();
// //
// //   const { astrolabe, horoscope, setHoroscope } = useIztro({
// //     birthday: props.birthday,
// //     birthTime: props.birthTime,
// //     gender: props.gender,
// //     birthdayType: props.birthdayType,
// //     fixLeap: props.fixLeap,
// //     isLeapMonth: props.isLeapMonth,
// //     lang: props.lang,
// //     astroType: props.astroType,
// //     options: props.options,
// //   });
// //
// //   // 当命盘数据变化时，通过回调函数传给父组件 App.tsx
// //   useEffect(() => {
// //     props.onDataChange({ astrolabe, horoscope });
// //   }, [astrolabe, horoscope, props]);
// //
// //   const toggleShowScope = (scope: Scope) => {
// //     switch (scope) {
// //       case "decadal":
// //         setShowDecadal(!showDecadal);
// //         break;
// //       case "yearly":
// //         setShowYearly(!showYearly);
// //         break;
// //       case "monthly":
// //         setShowMonthly(!showMonthly);
// //         break;
// //       case "daily":
// //         setShowDaily(!showDaily);
// //         break;
// //       case "hourly":
// //         setShowShowHourly(!showHourly);
// //         break;
// //     }
// //   };
// //
// //   const toggleActiveHeavenlyStem = (heavenlyStem: HeavenlyStemKey) => {
// //     if (activeHeavenlyStem === heavenlyStem) {
// //       setActiveHeavenlyStem(undefined);
// //     } else {
// //       setActiveHeavenlyStem(heavenlyStem);
// //     }
// //   };
// //
// //   const dynamic = useMemo(() => {
// //     return {
// //       showDecadal,
// //       showYearly,
// //       showMonthly,
// //       showDaily,
// //       showHourly,
// //       horoscope,
// //     };
// //   }, [showDecadal, showYearly, showMonthly, showDaily, showHourly, horoscope]);
// //
// //   useEffect(() => {
// //     if (props.horoscopeDate) {
// //       setHoroscopeDate(props.horoscopeDate);
// //     }
// //
// //     if (props.horoscopeHour !== undefined) {
// //       setHoroscopeHour(props.horoscopeHour);
// //     }
// //   }, [props.horoscopeDate, props.horoscopeHour]);
// //
// //   useEffect(() => {
// //     if (horoscopeDate && horoscopeHour !== undefined) {
// //       setHoroscope(horoscopeDate, horoscopeHour);
// //     }
// //   }, [horoscopeDate, horoscopeHour, setHoroscope]);
// //
// //   useEffect(() => {
// //     if (taichiPoint >= 0) {
// //       const palaceNames = getPalaceNames("zh-CN");
// //       const startIdx = taichiPoint;
// //       const result: string[] = [];
// //
// //       for (let i = 0; i < 12; i++) {
// //         const idx = (startIdx + i) % 12;
// //         result[i] = palaceNames[idx];
// //       }
// //
// //       setTaichiPalaces(result);
// //     } else {
// //       setTaichiPalaces(undefined);
// //     }
// //   }, [taichiPoint]);
// //
// //   const toggleTaichiPoint = (index: number) => {
// //     if (taichiPoint === index) {
// //       setTaichiPoint(-1);
// //     } else {
// //       setTaichiPoint(index);
// //     }
// //   };
// //
// //   return (
// //       <div className={classNames("iztro-astrolabe", "iztro-astrolabe-theme-default")}>
// //         {astrolabe?.palaces.map((palace) => (
// //             <Izpalace
// //                 key={palace.earthlyBranch}
// //                 {...palace}
// //                 focusedIndex={focusedIndex}
// //                 onFocused={setFocusedIndex}
// //                 horoscope={horoscope}
// //                 showDecadalScope={showDecadal}
// //                 showYearlyScope={showYearly}
// //                 showMonthlyScope={showMonthly}
// //                 showDailyScope={showDaily}
// //                 showHourlyScope={showHourly}
// //                 taichiPalace={taichiPalaces?.[palace.index]}
// //                 toggleScope={toggleShowScope}
// //                 activeHeavenlyStem={activeHeavenlyStem}
// //                 toggleActiveHeavenlyStem={toggleActiveHeavenlyStem}
// //                 hoverHeavenlyStem={hoverHeavenlyStem}
// //                 setHoverHeavenlyStem={setHoverHeavenlyStem}
// //                 toggleTaichiPoint={toggleTaichiPoint}
// //             />
// //         ))}
// //         <IzpalaceCenter
// //             astrolabe={astrolabe}
// //             horoscope={horoscope}
// //             horoscopeDate={horoscopeDate}
// //             horoscopeHour={horoscopeHour}
// //             setHoroscopeDate={setHoroscopeDate}
// //             setHoroscopeHour={setHoroscopeHour}
// //             centerPalaceAlign={props.centerPalaceAlign}
// //             {...dynamic}
// //         />
// //       </div>
// //   );
// // };
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
// // src/Iztrolabe/Iztrolabe.tsx
// import React, { useEffect, useMemo, useState } from "react";
// import { JsonViewer } from "../JsonViewer/JsonViewer";
// import { Izpalace } from "../Izpalace/Izpalace";
// import { IztrolabeProps } from "./Iztrolabe.type";
// import { IzpalaceCenter } from "../IzpalaceCenter";
// import classNames from "classnames";
// import { useIztro } from "iztro-hook";
// import "./Iztrolabe.css";
// import "../theme/default.css";
// import { Scope } from "iztro/lib/data/types";
// import { HeavenlyStemKey } from "iztro/lib/i18n";
// import { getPalaceNames } from "iztro/lib/astro";
// import type { AstrolabeData, HoroscopeData } from "iztro/lib/data/types";
//
// // 扩展 Props 类型，增加一个回调函数
// interface IztrolabeComponentProps extends IztrolabeProps {
//   onDataChange: (data: { astrolabe: AstrolabeData | null, horoscope: HoroscopeData | null }) => void;
// }
//
// export const Iztrolabe: React.FC<IztrolabeComponentProps> = (props) => {
//   const [isJsonVisible, setIsJsonVisible] = useState(false);
//   const [taichiPoint, setTaichiPoint] = useState(-1);
//   const [taichiPalaces, setTaichiPalaces] = useState<undefined | string[]>();
//   const [activeHeavenlyStem, setActiveHeavenlyStem] = useState<HeavenlyStemKey>();
//   const [hoverHeavenlyStem, setHoverHeavenlyStem] = useState<HeavenlyStemKey>();
//   const [focusedIndex, setFocusedIndex] = useState<number>();
//   const [showDecadal, setShowDecadal] = useState(false);
//   const [showYearly, setShowYearly] = useState(false);
//   const [showMonthly, setShowMonthly] = useState(false);
//   const [showDaily, setShowDaily] = useState(false);
//   const [showHourly, setShowShowHourly] = useState(false);
//   const [horoscopeDate, setHoroscopeDate] = useState<string | Date>();
//   const [horoscopeHour, setHoroscopeHour] = useState<number>();
//
//   const { astrolabe, horoscope, setHoroscope } = useIztro({
//     birthday: props.birthday,
//     birthTime: props.birthTime,
//     gender: props.gender,
//     birthdayType: props.birthdayType,
//     fixLeap: props.fixLeap,
//     isLeapMonth: props.isLeapMonth,
//     lang: props.lang,
//     astroType: props.astroType,
//     options: props.options,
//   });
//
//   // 当命盘数据变化时，通过回调函数传给父组件 App.tsx
//   useEffect(() => {
//     props.onDataChange({ astrolabe, horoscope });
//   }, [astrolabe, horoscope, props]);
//
//   const toggleShowScope = (scope: Scope) => {
//     switch (scope) {
//       case "decadal":
//         setShowDecadal(!showDecadal);
//         break;
//       case "yearly":
//         setShowYearly(!showYearly);
//         break;
//       case "monthly":
//         setShowMonthly(!showMonthly);
//         break;
//       case "daily":
//         setShowDaily(!showDaily);
//         break;
//       case "hourly":
//         setShowShowHourly(!showHourly);
//         break;
//     }
//   };
//
//   const toggleActiveHeavenlyStem = (heavenlyStem: HeavenlyStemKey) => {
//     if (activeHeavenlyStem === heavenlyStem) {
//       setActiveHeavenlyStem(undefined);
//     } else {
//       setActiveHeavenlyStem(heavenlyStem);
//     }
//   };
//
//   const dynamic = useMemo(() => {
//     return {
//       showDecadal,
//       showYearly,
//       showMonthly,
//       showDaily,
//       showHourly,
//       horoscope,
//     };
//   }, [showDecadal, showYearly, showMonthly, showDaily, showHourly, horoscope]);
//
//   useEffect(() => {
//     if (props.horoscopeDate) {
//       setHoroscopeDate(props.horoscopeDate);
//     }
//
//     if (props.horoscopeHour !== undefined) {
//       setHoroscopeHour(props.horoscopeHour);
//     }
//   }, [props.horoscopeDate, props.horoscopeHour]);
//
//   useEffect(() => {
//     if (horoscopeDate && horoscopeHour !== undefined) {
//       setHoroscope(horoscopeDate, horoscopeHour);
//     }
//   }, [horoscopeDate, horoscopeHour, setHoroscope]);
//
//   useEffect(() => {
//     if (taichiPoint >= 0) {
//       const palaceNames = getPalaceNames("zh-CN");
//       const startIdx = taichiPoint;
//       const result: string[] = [];
//
//       for (let i = 0; i < 12; i++) {
//         const idx = (startIdx + i) % 12;
//         result[i] = palaceNames[idx];
//       }
//
//       setTaichiPalaces(result);
//     } else {
//       setTaichiPalaces(undefined);
//     }
//   }, [taichiPoint]);
//
//   const toggleTaichiPoint = (index: number) => {
//     if (taichiPoint === index) {
//       setTaichiPoint(-1);
//     } else {
//       setTaichiPoint(index);
//     }
//   };
//
//   return (
//       <div className="iztrolabe-wrapper">
//         {/* 排盘主体 */}
//         <div className={classNames("iztro-astrolabe", "iztro-astrolabe-theme-default")}>
//           {astrolabe?.palaces.map((palace) => (
//               <Izpalace
//                   key={palace.earthlyBranch}
//                   {...palace}
//                   focusedIndex={focusedIndex}
//                   onFocused={setFocusedIndex}
//                   horoscope={horoscope}
//                   showDecadalScope={showDecadal}
//                   showYearlyScope={showYearly}
//                   showMonthlyScope={showMonthly}
//                   showDailyScope={showDaily}
//                   showHourlyScope={showHourly}
//                   taichiPalace={taichiPalaces?.[palace.index]}
//                   toggleScope={toggleShowScope}
//                   activeHeavenlyStem={activeHeavenlyStem}
//                   toggleActiveHeavenlyStem={toggleActiveHeavenlyStem}
//                   hoverHeavenlyStem={hoverHeavenlyStem}
//                   setHoverHeavenlyStem={setHoverHeavenlyStem}
//                   toggleTaichiPoint={toggleTaichiPoint}
//               />
//           ))}
//           <IzpalaceCenter
//               astrolabe={astrolabe}
//               horoscope={horoscope}
//               horoscopeDate={horoscopeDate}
//               horoscopeHour={horoscopeHour}
//               setHoroscopeDate={setHoroscopeDate}
//               setHoroscopeHour={setHoroscopeHour}
//               centerPalaceAlign={props.centerPalaceAlign}
//               {...dynamic}
//           />
//         </div>
//
//         {/* JSON 查看器区域 - 使用正常文档流，避免重叠 */}
//         <div className="json-viewer-section">
//           <div className="json-viewer-controls" style={{ marginTop: '20px', textAlign: 'center' }}>
//             <button
//                 onClick={() => setIsJsonVisible(!isJsonVisible)}
//                 style={{
//                   padding: '8px 16px',
//                   cursor: 'pointer',
//                   fontSize: '14px',
//                   borderRadius: '4px',
//                   border: '1px solid #ccc',
//                   backgroundColor: '#f8f9fa',
//                   transition: 'background-color 0.2s'
//                 }}
//                 onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e9ecef'}
//                 onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
//             >
//               {isJsonVisible ? "隐藏源数据" : "显示源数据"}
//             </button>
//           </div>
//           {isJsonVisible && (
//               <div className="json-viewer-container" style={{ marginTop: '15px' }}>
//                 <JsonViewer data={{ astrolabe, horoscope }} />
//               </div>
//           )}
//         </div>
//       </div>
//   );
// };










// src/Iztrolabe/Iztrolabe.tsx
import React, { useEffect, useMemo, useState, useRef, useLayoutEffect } from "react";
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

  // 新增：用于测量排盘实际高度的ref
  const astrolabeRef = useRef<HTMLDivElement>(null);
  const [astrolabeHeight, setAstrolabeHeight] = useState<number>(0);

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
  }, [astrolabe, horoscope, props]);

  // 新增：测量排盘实际高度
  useLayoutEffect(() => {
    if (astrolabeRef.current) {
      const updateHeight = () => {
        const rect = astrolabeRef.current!.getBoundingClientRect();
        setAstrolabeHeight(rect.height);
      };

      updateHeight();

      // 监听窗口大小变化
      window.addEventListener('resize', updateHeight);
      return () => window.removeEventListener('resize', updateHeight);
    }
  }, [astrolabe]); // 当astrolabe数据变化时重新计算

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
    if (activeHeavenlyStem === heavenlyStem) {
      setActiveHeavenlyStem(undefined);
    } else {
      setActiveHeavenlyStem(heavenlyStem);
    }
  };

  const dynamic = useMemo(() => {
    return {
      showDecadal,
      showYearly,
      showMonthly,
      showDaily,
      showHourly,
      horoscope,
    };
  }, [showDecadal, showYearly, showMonthly, showDaily, showHourly, horoscope]);

  useEffect(() => {
    if (props.horoscopeDate) {
      setHoroscopeDate(props.horoscopeDate);
    }

    if (props.horoscopeHour !== undefined) {
      setHoroscopeHour(props.horoscopeHour);
    }
  }, [props.horoscopeDate, props.horoscopeHour]);

  useEffect(() => {
    if (horoscopeDate && horoscopeHour !== undefined) {
      setHoroscope(horoscopeDate, horoscopeHour);
    }
  }, [horoscopeDate, horoscopeHour, setHoroscope]);

  useEffect(() => {
    if (taichiPoint >= 0) {
      const palaceNames = getPalaceNames("zh-CN");
      const startIdx = taichiPoint;
      const result: string[] = [];

      for (let i = 0; i < 12; i++) {
        const idx = (startIdx + i) % 12;
        result[i] = palaceNames[idx];
      }

      setTaichiPalaces(result);
    } else {
      setTaichiPalaces(undefined);
    }
  }, [taichiPoint]);

  const toggleTaichiPoint = (index: number) => {
    if (taichiPoint === index) {
      setTaichiPoint(-1);
    } else {
      setTaichiPoint(index);
    }
  };

  return (
      <div className="iztrolabe-wrapper">
        {/* 排盘区域：创建一个占位容器，其高度等于实际排盘高度 */}
        <div
            className="astrolabe-placeholder"
            style={{
              height: astrolabeHeight > 0 ? `${astrolabeHeight}px` : 'auto',
              position: 'relative',
              minHeight: '400px' // 设置最小高度，避免初始渲染时高度为0
            }}
        >
          {/* 实际的排盘 */}
          <div
              ref={astrolabeRef}
              className={classNames("iztro-astrolabe", "iztro-astrolabe-theme-default")}
          >
            {astrolabe?.palaces.map((palace) => (
                <Izpalace
                    key={palace.earthlyBranch}
                    {...palace}
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
                horoscopeDate={horoscopeDate}
                horoscopeHour={horoscopeHour}
                setHoroscopeDate={setHoroscopeDate}
                setHoroscopeHour={setHoroscopeHour}
                centerPalaceAlign={props.centerPalaceAlign}
                {...dynamic}
            />
          </div>
        </div>

        {/* JSON 查看器区域：现在它会自然地显示在占位容器的下方 */}
        <div className="json-viewer-section">
          <div className="json-viewer-controls" style={{ marginTop: '20px', textAlign: 'center' }}>
            <button
                onClick={() => setIsJsonVisible(!isJsonVisible)}
                style={{
                  padding: '8px 16px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                  backgroundColor: '#f8f9fa',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e9ecef'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
            >
              {isJsonVisible ? "隐藏源数据" : "显示源数据"}
            </button>
          </div>
          {isJsonVisible && (
              <div className="json-viewer-container" style={{
                marginTop: '15px',
                border: '1px solid #e0e0e0',
                borderRadius: '6px',
                padding: '15px',
                backgroundColor: '#f8f9fa',
                maxHeight: '400px',
                overflowY: 'auto'
              }}>
                <JsonViewer data={{ astrolabe, horoscope }} />
              </div>
          )}
        </div>
      </div>
  );
};
