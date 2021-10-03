import React from 'react'
import { Text } from 'react-native'

const Time = () => {
    <Text>`${hour < 10 ? 0 : ""} ${hour}:${minute < 10 ? 0 : ""}${minute} \n ${day}-${month}-${year}`;</Text>
}

export default Time;