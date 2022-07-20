import { Box, Button, Center, Flex, Heading } from "@chakra-ui/react";
import { Actions, Card, Result } from "./components";
import { createMachine, assign } from "xstate";
import { useMachine } from "@xstate/react";
import { GAME_STATE, GAME_ACTION, GAME_RESULT, USER_CHOOSE } from './constants';

/*
## 需求:
  - 完成比大小遊戲
    - 遊戲流程
      1. 按下 `Start Game` 按鈕會開始遊戲，`Start Game` 按鈕隨即消失
      2. 左邊的卡片中的 `?` 會變成亂數產生的數字 A
      3. 右邊的卡片下方會出現 `Higher` 和 `Lower` 的按鈕，讓 user 擇一點選
      4. 當 user 點選 `Higher` 和 `Lower` 其中一個按鈕後，兩個按鈕隨即消失
      5. 右邊的卡片中的 `?` 會變成亂數產生的數字 B
      6. 比較兩邊的數字大小，然後根據 user 的選擇，顯示遊戲結果在卡片下方，並出現 `Play Again` 按鈕
      7. 當 user 按下 `Play Again` 按鈕後，右邊的卡片中的數字 B 會變回 `?`
      8. 左邊的數字 A 會重新亂數產生，並回到上方第三步，繼續新的一場遊戲
    - 遊戲規則
      - 兩邊的數字都是隨機產生 1~10 之間的數字
      - 當 B > A 時，且 user 選擇 `Higher`，則遊戲結果為 WIN
      - 當 B > A 時，且 user 選擇 `Lower`，則遊戲結果為 LOSE
      - 當 B < A 時，且 user 選擇 `Higher`，則遊戲結果為 LOSE
      - 當 B < A 時，且 user 選擇 `Lower`，則遊戲結果為 WIN
      - 當 B = A 時，且 user 選擇 `Higher`，則遊戲結果為 LOSE
      - 當 B = A 時，且 user 選擇 `Lower`，則遊戲結果為 LOSE
## 加分項目:
  - 重構 components
  - 使用 XState 完成遊戲的狀態切換及邏輯
    - 文件：https://xstate.js.org/docs/

----------------
## Requirements:
  - Complete the High-Low Game
    - Game flow
      1. Start a new game by pressing "Start Game" button, and then hide the button
      2. The "?" in the left card will become a randomly generated number A
      3. Two buttons: "Higher" and "Lower" will show underneath the right card for user to choose upon
      4. After user clicked the “Higher” or “Lower” button, the two buttons will disappear
      5. The "?" in the right card will become a randomly generated number B
      6. Show the game result and “Play Again” button under the cards after comparing the high or low of the two numbers (A & B) and user’s choice
      7. After user clicked the “Play Again” button, the number B in the right card will change back to "?"
      8. Number A in the left card will be regenerated, return to step 3 to continue a new game
    - Game rule
      - The number A and B are always randomly generated between 1~10
      - When B > A and user chose `Higher`，the game result is WIN
      - When B > A and user chose `Lower`，the game result is LOSE
      - When B < A and user chose `Higher`，the game result is LOSE
      - When B < A and user chose `Lower`，the game result is WIN
      - When B = A and user chose `Higher`，the game result is LOSE
      - When B = A and user chose `Lower`，the game result is LOSE

## Bonus:
  - Please refactor the components
  - Complete the game with XState
    - document：https://xstate.js.org/docs/
*/

interface HighLowGameContext {
  leftCardValue?: number;
  rightCardValue?: number;
  result?: GAME_RESULT.WIN | GAME_RESULT.LOSE,
  userChoose?: USER_CHOOSE.HIGHER | USER_CHOOSE.LOWER
}

const randomCardValue = (context: HighLowGameContext) => {
  const min = 1;
  const max = 10;
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const winOrLose = (context: HighLowGameContext) => {
  const { leftCardValue, rightCardValue, userChoose } = context;
  if(leftCardValue === undefined || rightCardValue === undefined || userChoose === undefined) return GAME_RESULT.LOSE;

  if(userChoose === USER_CHOOSE.HIGHER) return rightCardValue > leftCardValue ? GAME_RESULT.WIN : GAME_RESULT.LOSE;
  if(userChoose === USER_CHOOSE.LOWER) return rightCardValue < leftCardValue ? GAME_RESULT.WIN : GAME_RESULT.LOSE;
  return GAME_RESULT.LOSE;
}

const highLowGame = createMachine<HighLowGameContext>({
  id: "highLow",
  initial: GAME_STATE.NEW,
  context: {
    leftCardValue: undefined,
    rightCardValue: undefined,
    userChoose: undefined,
    result: undefined,
  },
  states: {
    [GAME_STATE.NEW]: {
      on: { 
        [GAME_ACTION.START_GAME]: GAME_STATE.STARTED
      }
    },
    [GAME_STATE.STARTED]: {
      entry: assign({ 
        leftCardValue: (ctx) => randomCardValue(ctx),
        rightCardValue: (ctx) => undefined,
        userChoose: (ctx) => undefined,
        result: (ctx) => undefined,
      }),
      on: {
        [GAME_ACTION.USER_CHOOSE_ACTION]: {
          target: GAME_STATE.RESULT,
          actions:  assign({
            rightCardValue: (ctx) => randomCardValue(ctx),
            userChoose: (ctx, event) => event.data.userChoose
          })
        }
      }
    },
    [GAME_STATE.RESULT]: {
      entry: assign({ 
        result: (ctx) => winOrLose(ctx)
      }),
      on: {
        [GAME_ACTION.RESTART]: GAME_STATE.STARTED
      }
    }
  }
});

const App = () => {
  const [state, send] = useMachine(highLowGame);
  const { leftCardValue, rightCardValue, result: gameResult } = state.context;
  const gameStarted = !state.matches(GAME_STATE.NEW);
  const showResult = state.matches(GAME_STATE.RESULT);

  const startGame = () => {
    send(GAME_ACTION.START_GAME);
  }
  const handleUserAction = (option: string) => {
    if(!option) return;
    send({
      type: GAME_ACTION.USER_CHOOSE_ACTION,
      data: {
        userChoose: option
      }
    });
  }
  const playAgain = () => {
    send(GAME_ACTION.RESTART);
  }
  
  return (
    <Box bgColor="#f3f3f3" h="100vh">
      <Center pt="120px">
        <Flex w="400px" px="64px" direction="column" align="center">
          <Flex mb="64px">
            <Heading mr="16px" fontSize="36px" color="twitter.500">
              High
            </Heading>
            <Heading fontSize="36px" color="facebook.500">
              Low
            </Heading>
          </Flex>
          <Flex w="full" justify="space-between">
            <Flex maxW="120px" flex={1}>
              <Card value={leftCardValue}/>
            </Flex>
            <Flex maxW="120px" flex={1} direction="column">
              <Card value={rightCardValue}/>
              { gameStarted && !showResult && <Actions onChooseAction={(option) => handleUserAction(option)}/> }
            </Flex>
          </Flex>

          { !gameStarted && <Box mt="64px">
            <Button
              colorScheme="blue"
              onClick={() => startGame()}
            >
              Start Game
            </Button>
          </Box>}

          { showResult && <Result result={gameResult} onPlayAgain={() => playAgain()}/> }
        </Flex>
      </Center>
    </Box>
  );
};

export default App;
