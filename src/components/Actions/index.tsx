import { Button, Stack } from "@chakra-ui/react";
import { RiArrowDownSLine, RiArrowUpSLine } from "react-icons/ri";
import { USER_CHOOSE } from "../../constants";

type Props = {
    onChooseAction: (option: string) => void
}

const Actions = ({onChooseAction} : Props) => {
    return <>
        <Stack spacing="16px">
            <Button
                mt="32px"
                colorScheme="twitter"
                leftIcon={<RiArrowUpSLine />}
                isFullWidth
                onClick={() => onChooseAction(USER_CHOOSE.HIGHER)}
            >
                Higher
            </Button>
            <Button
                mt="8px"
                colorScheme="facebook"
                leftIcon={<RiArrowDownSLine />}
                isFullWidth
                onClick={() => onChooseAction(USER_CHOOSE.LOWER)}
            >
                Lower
            </Button>
        </Stack>
    </>
}

export {
    Actions
};


