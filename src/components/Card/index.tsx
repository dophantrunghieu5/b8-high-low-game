import { Center, Heading } from "@chakra-ui/react";
import { useMemo } from "react";

type Props = {
    value?: number
}
const Card = ({ value } : Props) => {
    const formattedValue = useMemo(() => {
        if(value === undefined) return '?';
        return value;
    }, [value])

    return <>
        <Center
            w="full"
            h="150px"
            px="24px"
            py="16px"
            bgColor="white"
            borderRadius="md"
            boxShadow="lg"
            flex={'none'}
        >
            <Heading fontSize="54px" color="gray.500">
                {formattedValue}
            </Heading>
        </Center>
    </>
}

export {
    Card
};
