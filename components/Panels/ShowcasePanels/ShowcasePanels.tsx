import { useMediaQuery } from "@mantine/hooks";
import { Flex, Card, Center, ActionIcon } from "@mantine/core";
import { SharedConversationPanel } from "./SharedConversationPanel/SharedConversationPanel";
import { TbArrowDown, TbArrowUp } from "react-icons/tb";
import { useState } from "react";

export function ShowcasePanels() {

    let isMobile = useMediaQuery('(max-width: 768px)');
    const [currentIndex, setCurrentIndex] = useState<number>(1);
    const [totalCount, setTotalCount] = useState<number>(1);

    return (
    <>
        {isMobile ?
            <div style={{overflow: 'hidden'}}>
            <Flex direction='column' py='xl' px='xs' style={{height: '85vh'}}>
                <div style={{height: '100%', display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center'}}>
                    <ActionIcon size='xl' radius='xl' mb='xl' onClick={() => {setCurrentIndex(currentIndex-1)}} disabled={currentIndex <= 1}>
                        <TbArrowUp size={28} />
                    </ActionIcon>
                    <SharedConversationPanel key={currentIndex} index={currentIndex} setTotalCount={setTotalCount}/>
                    <ActionIcon size='xl' radius='xl' onClick={() => {setCurrentIndex(currentIndex+1)}} disabled={currentIndex === totalCount}>
                        <TbArrowDown size={28} />
                    </ActionIcon>
                </div>
            </Flex>
            </div>
        :
            <div style={{height: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: '-6rem'}}>
                {/* <div style={{display: 'flex', alignItems: 'center', marginRight: '20px'}}>
                    <Card shadow='md' pt={5} style={isMobile ? {} : {width: '300px'}}>
                        <AttributePanel profile={profile} setProfile={setProfile}/>
                    </Card>
                </div> */}
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    <ActionIcon size='xl' radius='xl' mb='xl' onClick={() => {setCurrentIndex(currentIndex-1)}} disabled={currentIndex <= 1}>
                        <TbArrowUp size={28} />
                    </ActionIcon>
                    <SharedConversationPanel key={currentIndex} index={currentIndex} setTotalCount={setTotalCount}/>
                    <ActionIcon size='xl' radius='xl' onClick={() => {setCurrentIndex(currentIndex+1)}} disabled={currentIndex === totalCount}>
                        <TbArrowDown size={28} />
                    </ActionIcon>
                </div>
            </div>
    }
    </>
    )
}