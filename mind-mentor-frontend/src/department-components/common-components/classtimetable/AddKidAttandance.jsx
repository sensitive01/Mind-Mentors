import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getClassKidData } from '../../../api/service/employee/serviceDeliveryService'

const AddKidAttandance = () => {
    const {classId} = useParams()
    useEffect(()=>{
        const fetchData = async()=>{
            const reponse = await getClassKidData(classId)
            console.log(reponse)

        } 
        fetchData()

    },[])
  return (
    <div>AddKidAttandance</div>
  )
}

export default AddKidAttandance