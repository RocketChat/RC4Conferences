import { getEventDeatils, getEventSpeakers } from "../../../lib/conferences/eventCall"

export const verifySpeaker = async (eid, acook, mailres) => {
    let spkMail = []
    let token=null
    
    try {
        if (acook) token = JSON.parse(acook).access_token

        const mailid = mailres.data.mail
        const spkData = await getEventSpeakers(eid, token)
        const eventdata = await getEventDeatils(eid)
        if (spkData.status === 200) {
            spkData.data.data.map((ispk) => {
                spkMail.push(ispk.attributes.email)
            })
        }
        if (spkMail.includes(mailid)) {
            return {isSpeaker: true, spkdata: spkData.data.data, eventdata: eventdata.data.data}
        }
        else {
            return {isSpeaker: false, spkdata: spkData.data.data, eventdata: eventdata.data.data}
        }
    }
    catch(e) {
        console.error("An error while getting speaker details", e)
        return {isSpeaker: false, spkdata: null, eventdata: null}
    }
}
