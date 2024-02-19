import React, { useState } from 'react';
import { Button } from 'react-native-paper';

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
      icon={isTimerRunning ? 'stop' : 'play'}
      mode="contained"
      onPress={handlePress}>
      {isTimerRunning ? 'Stop' : 'Start'}
    </Button>
  );
};

export default TimerButton;
