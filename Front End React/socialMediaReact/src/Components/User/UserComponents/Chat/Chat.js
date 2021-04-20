import React from 'react'
import './Chat.css'

export default function Chat() {
    return (
        <div>
            <div className="messaging">
                <div className="inbox_msg">
                    <div className="inbox_people">
                        <div className="headind_srch">
                            <div className="recent_heading">
                                <h4>Friends</h4>
                            </div>
                            <div className="srch_bar">
                                <div className="stylish-input-group">
                                    <input type="text" className="search-bar form-control" placeholder="Search" ></input>
                                </div>
                            </div>
                        </div>
                        <div className="inbox_chat scroll">
                            <div className="chat_list active_chat">
                                <div className="chat_people">
                                    <div className="chat_img"> <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil"></img> </div>
                                    <div className="chat_ib">
                                        <h5>Sunil Rajput <span className="chat_date">Dec 25</span></h5>
                                        <p>Test, which is a new approach to have all solutions
				                                astrology under one roof.</p>
                                    </div>
                                </div>
                                
                            </div>
                            <div className="chat_list active_chat">
                                <div className="chat_people">
                                    <div className="chat_img"> <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil"></img> </div>
                                    <div className="chat_ib">
                                        <h5>Sunil Rajput <span className="chat_date">Dec 25</span></h5>
                                        <p>Test, which is a new approach to have all solutions
				                                astrology under one roof.</p>
                                    </div>
                                </div>
                                
                            </div>
                        </div>
                        
                        


                    </div>
                    <div className="mesgs">
                        <div className="msg_history">
                            <div className="incoming_msg">
                                <div className="incoming_msg_img"> <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil"></img> </div>
                                <div className="received_msg">
                                    <div className="received_withd_msg">
                                        <p>Test which is a new approach to have all
				                                solutions</p>
                                        <span className="time_date"> 11:01 AM    |    June 9</span></div>
                                </div>
                            </div>
                            <div className="outgoing_msg">
                                <div className="sent_msg">
                                    <p>Test which is a new approach to have all
			                                solutions</p>
                                    <span className="time_date"> 11:01 AM    |    June 9</span> </div>
                            </div>



                        </div>
                        <div className="type_msg">
                            <div className="input_msg_write">
                                <input type="text" className="write_msg form-control" placeholder="Type a message" />
                                <button className="msg_send_btn" type="button"><i className="fa fa-paper-plane" aria-hidden="true"></i></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}
