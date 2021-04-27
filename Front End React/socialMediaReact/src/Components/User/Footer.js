import React from 'react'

export default function Footer() {
    return (
        <div>
            <div className="bg-dark">
                <div>
                    <div className="p-2 text-center text-white"><span className="pr-2 ml-5">&#169;</span><span>Copyright 2021 | HK Developers | All Rights Reserved</span>
                    <div className="float-right" style={{ margin: "auto", cursor: "pointer", textDecoration: "none" }}>
                           <a href="https://www.facebook.com/harikrishnanua.hk.3" target="_blank"> <span className="fab fa-facebook h4 pr-4 text-white"></span></a>
                            <a href="https://www.instagram.com/harikrishnan.u.a/" target="_blank"><span className="fab fa-instagram h4 pr-4 text-white"></span></a>
                            <a href="https://www.linkedin.com/in/harikrishnan-u-a-221833183/" target="_blank"><span className="fab fa-linkedin h4 pr-4 text-white"></span></a>
                            <a href="https://github.com/hariua" target="_blank"><span className="fab fa-github h4 pr-3 text-white"></span></a>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}
