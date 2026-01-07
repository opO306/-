import { useGame } from "../app/providers/GameProvider";

export const useGameState = () => {
  const { state, dispatch, getJobTitle, onChoice, resetGameState } = useGame();

  return {
    gameState: state,
    onChoice,
    getJobTitle,
    resetGameState,
    dispatch,
  };
};