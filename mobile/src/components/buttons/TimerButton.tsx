import React, { useState } from 'react';
import { Button } from 'react-native';

interface TimerButtonProps {
  onStart: () => void;
  onStop: () => void;
}

const TimerButton: React.FC<TimerButtonProps> = ({ onStart, onStop }) => {
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const handlePress = () => {
    if (isTimerRunning) {
      onStop();
    } else {
      onStart();
    }
    setIsTimerRunning((prev) => !prev);
  };

  return (
    <Button
      title={isTimerRunning ? 'Stop' : 'Start'}
      onPress={handlePress}
    />
  );
};

export default TimerButton;
