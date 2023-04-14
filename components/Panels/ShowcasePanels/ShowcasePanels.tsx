import { useMediaQuery } from "@mantine/hooks";
import { Flex, Card } from "@mantine/core";
import { SharedConversationPanel } from "./SharedConversationPanel/SharedConversationPanel";

export function ShowcasePanels() {

    let isMobile = useMediaQuery('(max-width: 768px)');

    return (
    <>
        {isMobile ?
            <div style={{overflow: 'hidden'}}>
            <Flex direction='column' py='xl' px='xs' style={{height: '90vh'}}>
                <div style={{height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <SharedConversationPanel key={1} index={1} />
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
                <div style={{display: 'flex', alignItems: 'center'}}>
                    <SharedConversationPanel key={1} index={1} />
                </div>
            </div>
    }
    </>
    )
}