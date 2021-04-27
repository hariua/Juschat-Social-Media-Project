import React, { useEffect, useState } from 'react'
import {
  CWidgetDropdown,
  CRow,
  CCol
} from '@coreui/react'
import ChartLineSimple from './ChartLineSimple'
import ChartBarSimple from './ChartBarSimple'
import { useHistory } from 'react-router'
import axios from 'axios'
import server from '../../../../Server'


const AdminDashboard = () => {
    let history = useHistory()
    const [dashboardData,setDashboardData] = useState()
    useEffect(()=>
    {
        let token = localStorage.getItem('jwt1')
        if(!token)
        {
         history.push('/admin')   
        }
        axios.get(server+'/admin/adminDashboardData?jwt1='+token).then((response)=>
        {
            console.log(response);
            setDashboardData(response.data)
        })
    },[])

    // render
    return (
     <div className="container-fluid">
         <div className="col-lg-10 col-md-12 float-right">
         <CRow>
        <CCol sm="6" lg="3">
          <CWidgetDropdown style={{backgroundColor: "rgb(1,3,70)",
background: "linear-gradient(90deg, rgba(1,3,70,1) 0%, rgba(5,27,166,1) 52%)",border:"none"}}
            color="blue"
            className="h5"
            header="16"
            text="Total Users"
            footerSlot={
              <ChartLineSimple
                pointed
                className="c-chart-wrapper mt-3 mx-3"
                style={{height: '70px'}}
                dataPoints={[65, 59, 84, 84, 51, 55, 40]}
                pointHoverBackgroundColor="primary"
                label="Users"
                
              />
            }
          >
          </CWidgetDropdown>
        </CCol>
  
        <CCol sm="6" lg="3">
          <CWidgetDropdown style={{backgroundColor: "rgb(19,142,0)",
background: "linear-gradient(90deg, rgba(19,142,0,1) 0%, rgba(48,235,4,1) 100%)",border:"none"}}
            color="gradient-info"
            header="3"
            className="h5"
            text="Blocked Users"
            footerSlot={
              <ChartLineSimple
                pointed
                className="mt-3 mx-3"
                style={{height: '70px'}}
                dataPoints={[1, 18, 9, 17, 34, 22, 11]}
                pointHoverBackgroundColor="info"
                options={{ elements: { line: { tension: 0.00001 }}}}
                label="Users"
              
              />
            }
          >
            
          </CWidgetDropdown>
        </CCol>
  
        <CCol sm="6" lg="3">
          <CWidgetDropdown style={{backgroundColor: "rgb(242,188,6)",
background: "linear-gradient(90deg, rgba(242,188,6,1) 0%, rgba(255,244,5,1) 100%)",border:"none"}}
            color="gradient-warning"
            header="10"
            className="h5"
            text="Total Posts"
            footerSlot={
              <ChartLineSimple
                className="mt-3"
                style={{height: '70px'}}
                backgroundColor="rgba(255,255,255,.2)"
                dataPoints={[78, 81, 80, 45, 34, 12, 40]}
                options={{ elements: { line: { borderWidth: 2.5 }}}}
                pointHoverBackgroundColor="warning"
                label="Posts"
                
              />
            } 
          >
            
          </CWidgetDropdown>
        </CCol>
  
        <CCol sm="6" lg="3">
          <CWidgetDropdown style={{backgroundColor: "rgb(242,6,6)",
background: "linear-gradient(90deg, rgba(242,6,6,1) 0%, rgba(255,5,149,100%)",border:"none"}}
            color="gradient-danger"
            header="5"
            className="h5"
            text="Reported Posts"
            footerSlot={
              <ChartBarSimple
                className="mt-3 mx-3"
                style={{height: '70px'}}
                backgroundColor="rgb(250, 152, 152)"
                label="Posts"
                
              />
            }
          >
            
          </CWidgetDropdown>
        </CCol>
      </CRow>
         </div>
     </div>
    )
  }

export default AdminDashboard
