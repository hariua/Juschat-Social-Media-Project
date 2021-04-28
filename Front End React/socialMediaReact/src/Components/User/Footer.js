import React from 'react'

export default function Footer() {
    return (
        <div>
            <div className="bg-dark">
                <div className="">

                    <div className="p-2 text-center text-white">
                        <div className="row  text-center">
                        <div className="col-md-12 p-2">
                        <span className="text-center">&#169;</span><span>Copyright 2021 | HK Developers | All Rights Reserved</span>
                        </div>
                        </div>
                        <div className="row" style={{ margin: "auto", cursor: "pointer", textDecoration: "none" }}>
                            <div className="col-md-12">
                            <a href="https://www.facebook.com/harikrishnanua.hk.3" target="_blank"> <span className="fab fa-facebook h4 text-white "></span></a>
                            <a href="https://www.instagram.com/harikrishnan.u.a/" target="_blank"><span className="fab fa-instagram h4  text-white ml-4"></span></a>
                            <a href="https://www.linkedin.com/in/harikrishnan-u-a-221833183/" target="_blank"><span className="fab fa-linkedin h4 text-white ml-4"></span></a>
                            <a href="https://github.com/hariua" target="_blank"><span className="fab fa-github h4 text-white ml-4"></span></a>
                        
                            </div>
                            </div>
                    </div>

                </div>
            </div>
        </div>
    )
}
