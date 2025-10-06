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

  return (
    <div className="container">
      <div className="form-container">
        <h2>输入信息</h2>
        <div className="form-item">
          <label>出生日期:</label>
          <input
            type="date"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
          />
        </div>
        <div className="form-item">
          <label>出生时辰:</label>
          <select value={birthTime} onChange={handleBirthTimeChange}>
            {Array.from({ length: 13 }, (_, i) => (
              <option key={i} value={i}>
                {i === 0 ? '子时 (0点)' : `${i * 2 - 1}点 - ${i * 2 + 1}点`}
              </option>
            ))}
          </select>
        </div>
        <div className="form-item">
          <label>性别:</label>
          <select value={gender} onChange={(e) => setGender(e.target.value as 'male' | 'female')}>
            <option value="male">男</option>
            <option value="female">女</option>
          </select>
        </div>
      </div>
      <div className="chart-container">
        <Iztrolabe
          birthday={birthday}
          birthTime={birthTime}
          gender={gender}
          birthdayType='solar'
        />
      </div>
    </div>
  );
}

export default App;
