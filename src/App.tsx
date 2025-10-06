import React, { useState } from 'react';
import { Iztrolabe } from './Iztrolabe';
import './App.css';

function App() {
  const [birthday, setBirthday] = useState('2000-01-01');
  const [birthTime, setBirthTime] = useState(1);
  const [gender, setGender] = useState<'male' | 'female'>('male');

  const handleBirthTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setBirthTime(parseInt(e.target.value, 10));
  };

  // 为了让时辰选择器的文本更友好，我们创建一个辅助函数
  const getBirthTimeLabel = (index: number) => {
    if (index === 0) return '子时 (23点 - 1点)';
    if (index === 1) return '丑时 (1点 - 3点)';
    if (index === 12) return '亥时 (21点 - 23点)';
    // 生成其他时辰的标签
    const start = index * 2 - 1;
    const end = index * 2 + 1;
    const chineseHour = ['寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌'][index - 2];
    return `${chineseHour}时 (${start}点 - ${end}点)`;
  };


  return (
      <div className="container">
        {/* 将输入区域包裹起来 */}
        <header className="input-section">
          <h2>紫微斗数排盘</h2>
          <div className="form-container">
            <div className="form-item">
              <label htmlFor="birthday">出生日期:</label>
              <input
                  id="birthday"
                  type="date"
                  value={birthday}
                  onChange={(e) => setBirthday(e.target.value)}
              />
            </div>
            <div className="form-item">
              <label htmlFor="birthtime">出生时辰:</label>
              <select id="birthtime" value={birthTime} onChange={handleBirthTimeChange}>
                {/* 使用 Array.from 生成13个时辰选项 */}
                {Array.from({ length: 13 }, (_, i) => (
                    <option key={i} value={i}>
                      {getBirthTimeLabel(i)}
                    </option>
                ))}
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

        {/* 斗数盘容器 */}
        <main className="chart-container">
          <Iztrolabe
              birthday={birthday}
              birthTime={birthTime}
              gender={gender}
              birthdayType='solar'
          />
        </main>
      </div>
  );
}

export default App;
