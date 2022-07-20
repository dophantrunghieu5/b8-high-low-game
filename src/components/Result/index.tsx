import { Button, Heading, Stack } from "@chakra-ui/react";
import { GAME_RESULT } from '../../constants';

type Props = {
    result?: GAME_RESULT.WIN | GAME_RESULT.LOSE,
    onPlayAgain: () => void
}

const Result = ({result, onPlayAgain} : Props) => {
    return <>
        <Stack mt="24px" spacing="16px">
            { result === GAME_RESULT.WIN && <Heading color="twitter.300" align="center">
                WIN!
            </Heading> }
            { result === GAME_RESULT.LOSE && <Heading color="red.300" align="center">
                LOSE!
            </Heading> }

            <Button
                colorScheme="blue"
                onClick={() => {
                    onPlayAgain()
                }}
            >
                Play Again
            </Button>
        </Stack>
    </>
}

export {
    Result
};
