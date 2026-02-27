// components/Modal/CaloriesInputModaltsx
interface CaloriesInputModalProps {
  isVisible: boolean;
  workoutDuration: number;
  onSave: (calories: number) => void;
  onCancel: () => void;
}

export {};