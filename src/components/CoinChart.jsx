import React from 'react'
import axios from 'axios'
import {baseURL} from './baseURL'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  elements,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import Loader from './Loader'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const CoinChart = ({currency}) => {
  const [chartData, setChartData] = useState([])
  const {id} = useParams()
  const [days, setDays] = useState(1)
  const CoinChartData=async ()=>{
    try {
      const {data} = await axios.get(`${baseURL}/coins/${id}/market_chart?vs_currency=${currency}&days=${days}`)
    console.log(data.prices)
    setChartData(data.prices)
    console.log(data.prices)
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(()=> {
    CoinChartData()
  },[{currency}, id, days])

   const myData= {
    labels:chartData.map((value)=>{
    const date = new Date(value[0])
    const time = date.getHours()> 12 
    ? `${date.getHours() -12}: ${date.getMinutes()} PM`
    : `${date.getHours()} : ${date.getMinutes()} AM`
    return days===1 ? time: date.toLocaleDateString()
    }),
    datasets:[
      {

        label: `Price in Past Days${days} in ${currency}`,
        data: chartData.map((value)=>value[1]),
        borderColor: '#6EC3FF',
        borderWidth: '3',
      }
    ]
   }
  return (
    <>
    <div>
      <Line data={myData} options={{
        elements:{
          point:{
            radius:1,
          }
        }
      }} style={{marginTop:"5rem", width: "65rem"}} />
    </div>
    
    <div className="btn">
      <button onClick={()=> setDays(1)}>24 Hours</button>
      <button onClick={()=> setDays(30)}>1 Month</button>
      <button onClick={()=>setDays(90)}>3 Months</button>
      <button onClick={()=> setDays(365)}>1 Year</button>
    </div>
</>
  )
}

export default CoinChart