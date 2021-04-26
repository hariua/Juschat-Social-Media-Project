import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import io from 'socket.io-client'
import server from '../../../../Server'
import './Chat.css'
const socket = io.connect(server)

export default function Chat() {
    const [messages, setMessages] = useState([])
    const [chatUserId, setChatUserId] = useState()
    const [chatUserName, setChatUserName] = useState()
    const [friendList, setFriendList] = useState([])
    const [chatInputMessage, setChatInputMessage] = useState('')
    let history = useHistory()
    useEffect(() => {
        console.log("rendering")
        let token = localStorage.getItem('jwt')
        if (!token) {
            history.push('/')
        }
        let data = {
            jwt: token,
            userId: localStorage.getItem('userId')
        }
        axios.post(server + '/getChatUsers', data).then((response) => {
            console.log(response);
            setFriendList(response.data)
        })
        socket.on('chatResponse', data => {
            receivedMessage(data)
        })
    }, [])
    const userClick = (receiver, receiverName, sender, senderName) => {
        console.log("userchanged");
        socket.emit("joinChat", ({ sender, receiver, senderName, receiverName }))
        setChatUserId(receiver)
        setChatUserName(receiverName)
        document.getElementById('chatHome').hidden = false
        let data={
            jwt:localStorage.getItem('jwt'),
            senderId:sender,
            receiverId:receiver
        }
        setMessages([])
        axios.post(server+'/getChatMessages',data).then((response)=>
        {
            console.log(response);
            setMessages(response.data)
        })
    }
    const chatSubmit = () => {
        let data = {
            msg: chatInputMessage,
            senderId: localStorage.getItem('userId'),
            receiverId: chatUserId
        }
        if (chatInputMessage.length > 0) {
            socket.emit('chatMessage', data)
        }
        document.getElementById('chatInput').value = ""
        let chatScroll = document.getElementById('chatScroll')
        chatScroll.scrollTop = chatScroll.scrollHeight

    }
    const receivedMessage = (message) => {
        setMessages(oldMsgs => [...oldMsgs, message])
        let chatScroll = document.getElementById('chatScroll')
        chatScroll.scrollTop = chatScroll.scrollHeight
    }
    return (
        <div >
            <div className="messaging" >
                <div className="inbox_msg">
                    <div className="inbox_people" >
                        <div className="headind_srch">
                            <div className="recent_heading ">
                                <h3 className="text-secondary ">Friends</h3>
                            </div>

                        </div>
                        <div className="inbox_chat scroll">
                            {friendList.length > 0 ? friendList.map((data, index) => {
                                return (
                                    <div className="chat_list active_chat" onClick={() => userClick(data.userId, data.userName, localStorage.getItem('userId'), localStorage.getItem('User'))} >
                                        <div className="chat_people">
                                            <div className="chat_img"> <img className="img-fluid rounded-circle" src={server + '/ProfileImages/' + data.userId + '.jpg'} alt="sunil"></img> </div>
                                            <div className="chat_ib">
                                                <h5 className="mt-2" >{data.userName}</h5>

                                            </div>
                                        </div>

                                    </div>
                                )
                            }) : <div></div>}

                        </div>




                    </div>
                    <div className="mesgs" id="chatHome" hidden>
                        <div className="row" >
                            <div className="col-12 p-3 bg-secondary" style={{ position: "fixed", zIndex: "10", width: "100%", marginTop: "-1.8%", marginLeft: "-0.8%" }}><p className="h4 text-white">{chatUserName}</p></div>
                        </div>
                        <div id="chatScroll" className="msg_history mt-5">
                            {messages.length > 0 ? messages.map((data, index) => {
                                return (
                                    <div key={index}>
                                        {data.senderId == chatUserId && data.receiverId == localStorage.getItem('userId') ? <div className="incoming_msg">
                                            <div className="incoming_msg_img"> <img className="img-fluid rounded-circle" src={server + '/ProfileImages/' + data.senderId + ".jpg"}></img> </div>
                                            <div className="received_msg">
                                                <div className="received_withd_msg">
                                                    {data.url === true ? <a style={{ textDecoration: "none" }} href={"https://" + data.Message} target="_blank"><p>{data.Message}</p></a> : <p>{data.Message}</p>}
                                                    <span className="time_date"> {data.time}   |    {data.date}</span></div>
                                            </div>
                                        </div> : data.senderId == localStorage.getItem('userId') ? <div className="outgoing_msg">
                                            <div className="sent_msg">
                                                {data.url === true ? <a style={{ textDecoration: "none" }} href={"https://" + data.Message} target="_blank"><p>{data.Message}</p></a> : <p>{data.Message}</p>}
                                                <span className="time_date"> {data.time}   |    {data.date}</span> </div>
                                        </div> : <div></div>}
                                    </div>
                                )
                            }) : <div></div>}





                        </div>
                        <div className="type_msg" >
                            <div className="input_msg_write">
                                <input type="text" id="chatInput" onChange={(event) => setChatInputMessage(event.target.value)} className="write_msg form-control" placeholder="Type a message" />
                                <button className="msg_send_btn" onClick={chatSubmit} type="button"><i className="fa fa-paper-plane" aria-hidden="true"></i></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}
