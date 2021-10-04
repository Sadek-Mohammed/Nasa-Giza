import React, { useState, useEffect } from 'react'
import { Dimensions, Text, Button, View, SafeAreaView, Image, StyleSheet, ScrollView, TextInput, Alert } from 'react-native'
import * as Location from 'expo-location';
import { LineChart } from 'react-native-chart-kit';

const App = () => {
  const [counter, setCounter] = useState(0)
  const [xVals, setXVals] = useState([])
  const [yVals, setYVals] = useState([])
  const [ccc, setCcc] = useState(0)
  const [latLangManual, setLatLangManual] = useState({ latitude: 0, longitude: 0 })
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [local, setLocal] = useState(null);
  const [mapRegion, setMapRegion] = useState(null);
  const [showOne, setShowOne] = useState(0);
  const [fetcher, setFetcher] = useState("");
  const [lat, setLat] = useState("")
  const [long, setLong] = useState("")
  const [dateStart, setDateStart] = useState('')
  const [dateEnd, setDateEnd] = useState('')

  const checkYear = () => {
    if (!dateStart) {
      Alert.alert("Please input a valid start year")
      return 0;
    }
    else if (parseInt(dateStart) < 2000) {
      Alert.alert("No data for years less than 2000")
      return 0;
    }
    else if (parseInt(dateStart) > 2019) {
      Alert.alert("No data for years more than 2019")
      return 0;
    }
    else if (!dateEnd) {
      Alert.alert("Please input a valid end year")
      return 0;
    }
    else if (parseInt(dateEnd) < 2001) {
      Alert.alert("No data for years less than 2001")
      return 0;
    }
    else if (parseInt(dateEnd) > 2020) {
      Alert.alert("No data for years more than 2020")
      return 0;
    }
    else {
      return 1;
    }
  }
  const handleStart = (date) => {
    setDateStart(date)
  }
  const handleEnd = (date) => {
    setDateEnd(date)
  }
  const handleFetch = () => {
    if (!checkYear) {
      return;
    }
    if (dateStart >= dateEnd) {
      Alert.alert("enter a start date smaller than end date")
      return;
    }
    if (dateEnd - dateStart != 1) {
      Alert.alert("Difference between start and end dates must be 1")
      return 0;
    }
    getData();
  }
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
      let location = await Location.getLastKnownPositionAsync({});
      setMapRegion({
        longitude: location.coords.longitude,
        latitude: location.coords.latitude,
        longitudeDelta: 0.015,
        latitudeDelta: 0.0121
      })
      setLocal({
        longitude: location.coords.longitude,
        latitude: location.coords.latitude,
        longitudeDelta: 0.015,
        latitudeDelta: 0.0121
      })
      setLocation(location);
    })();
  }, []);
  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }
  const updateOne = () => {
    if (showOne == 0) {
      setShowOne(1)
    }
    else {
      setShowOne(0)
    }
  }
  const doer = (e) => {
    setFetcher(e.target.value)
  }
  const inplat = (e) => {
    if (e.target.value < -90 || e.target.value > 90) {
      return;
    }
    setMapRegion({
      longitude: mapRegion.longitude,
      latitudeDelta: mapRegion.latitudeDelta,
      longitudeDelta: mapRegion.longitudeDelta,
      latitude: e.target.value
    })
  }
  const inpLon = (e) => {
    if (e.target.value < -180 || e.target.value > 180) {
      return;
    }
    setMapRegion({
      longitude: e.target.value,
      latitudeDelta: mapRegion.latitudeDelta,
      longitudeDelta: mapRegion.longitudeDelta,
      latitude: latitude
    })
  }
  const localized = () => {
    setMapRegion(local)
  }
  const onChangeNumberlat = (text) => {
    setLat(text)
    setLatLangManual({ longitude: latLangManual.longitude, latitude: text })
  }
  const onChangeNumberlong = (text) => {
    setLong(text)
    setLatLangManual({ longitude: text, latitude: latLangManual.latitude })
  }
  const submitInp = () => {
    let x = latLangManual.latitude, y = latLangManual.longitude
    if (x < -180 || x > 180 || !x || y < -90 || y > 90 || !y) {
      setLat(null)
      setLong(null)
      Alert.alert("Enter a valid location")
      return;
    }
    setMapRegion({
      longitude: y,
      latitudeDelta: mapRegion.latitudeDelta,
      latitude: x,
      longitudeDelta: mapRegion.longitudeDelta
    })
  }
  const clearVal = () => {
    setCcc(0)
    xVals.length = 0;
    yVals.length = 0;
  }
  let link = "https://power.larc.nasa.gov/api/temporal"
  const getData = async () => {
    if (counter > 0) {
      clearVal()
    }
    let resp = await fetch(`${link}/climatology/point?parameters=SOLAR_DEFICITS_BLW_CONSEC_01&community=re&longitude=${mapRegion.longitude}&latitude=${mapRegion.latitude}&start=${dateStart}&end=${dateEnd}&format=JSON`);
    let json = await resp.json();
    for (let one in json.properties.parameter.SOLAR_DEFICITS_BLW_CONSEC_01) {
      if (one != "ANN") {
        xVals.push(one)
        yVals.push(json.properties.parameter.SOLAR_DEFICITS_BLW_CONSEC_01[one])
      }
    }
    setCounter(counter + 1)
    setCcc(1)
  }
  return (
    <SafeAreaView style={styles.app}>
      <ScrollView>
        <Image source={require("./assets/icon.png")} style={{ width: 400, height: 400, marginRight: `auto`, marginLeft: `auto` }} />
        <View style={styles.wrapper}>
          <Text style={styles.text}>Choose a Location: </Text>
          <View style={{ width: `90%`, border: `1px solid red`, marginBottom: 10, marginTop: 10, marginRight: 'auto', marginLeft: 'auto' }}>
            <Button title="Enter Manually" onPress={updateOne} color="rgb(211,207,201)" style={{ width: '90%' }}>
            </Button>
          </View>
          {
            showOne ?
              <View style={{ flex: 1, paddingTop: 10, paddingBottom: 10 }}>
                <TextInput
                  style={styles.input}
                  onChangeText={onChangeNumberlat}
                  value={lat}
                  placeholder="Latitude: from -180 to 180"
                  keyboardType="numeric"
                  placeholderTextColor="#fff"
                />
                <TextInput
                  style={styles.input}
                  onChangeText={onChangeNumberlong}
                  value={long}
                  placeholder="Longitude: from -90 to 90"
                  keyboardType="numeric"
                  placeholderTextColor="#fff"
                />
                <View style={{ width: `50%`, border: `1px solid red`, marginBottom: 10, marginTop: 10, marginRight: 'auto', marginLeft: 'auto' }}>
                  <Button title="Send location" onPress={submitInp} color="rgb(211,207,201)">
                  </Button>
                </View>
              </View>
              : null
          }
          <View style={{ width: `90%`, border: `1px solid red`, marginBottom: 10, marginTop: 10, marginRight: 'auto', marginLeft: 'auto' }}>
            <Button title="Get Automatically" onPress={localized} color="rgb(211,207,201)" style={{ width: '90%' }}>
            </Button>
          </View>
        </View>
        <View style={{ backgroundColor: `rgb(207, 204, 204)`, padding: 10 }}>
          <Text style={{ color: `black`, marginLeft: `auto`, marginRight: `auto`, fontSize: 22 }}>Set an Interval: </Text>
          <View style={{ display: "flex", flexWrap: "nowrap" }}>
            <TextInput
              onChangeText={handleStart}
              value={dateStart}
              placeholder="Put a valid start year (2000-2019)"
              placeholderTextColor="#000"
            />
          </View>
          <View style={{ display: "flex", flexWrap: "nowrap" }}>
            <Text style={{ marginRight: "auto", marginLeft: "auto", fontSize: 18 }}>End:</Text>
            <TextInput
              onChangeText={handleEnd}
              value={dateEnd}
              placeholder="Put a valid end year must be one year more than start (2001-2020)"
              placeholderTextColor="#000"
            />
          </View>
        </View>
        {
          mapRegion == null ?
            null :
            <Text style={{ color: `black`, marginLeft: `auto`, marginRight: `auto` }}>{`Latitude is ${mapRegion.latitude}\nLongitude is ${mapRegion.longitude}`}</Text>
        }
        <Button title="Statistics" color="#e26a00" testID="black" />
        <View style={{ width: `60%`, border: `1px solid red`, marginBottom: 10, marginTop: 10, marginRight: 'auto', marginLeft: 'auto' }}>
          <Button title="Get Stats" onPress={handleFetch} color="rgb(211,207,201)">
          </Button>
        </View>
        <View>
          <Text style={{ marginLeft: 'auto', marginRight: 'auto', fontSize: 18 }}>Sun Irradiance</Text>
          {
            ccc == 0 ?
              <Text>Waiting for data....</Text>
              : <LineChart
                data={{
                  labels: xVals,
                  datasets: [
                    {
                      data: yVals
                    }
                  ]
                }}
                width={Dimensions.get("window").width - 20} // from react-native
                height={220}
                chartConfig={{
                  backgroundColor: "#e26a00",
                  backgroundGradientFrom: "#fb8c00",
                  backgroundGradientTo: "#ffa726",
                  decimalPlaces: 2, // optional, defaults to 2dp
                  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                  style: {
                    borderRadius: 16
                    , marginRight: `auto`,
                    marginLeft: `auto`
                  },
                  propsForDots: {
                    r: "6",
                    strokeWidth: "2",
                    stroke: "#ffa726"
                  }
                }}
                bezier
                style={{
                  marginVertical: 8,
                  borderRadius: 16
                }}
              />
          }
        </View>
      </ScrollView>
    </SafeAreaView >
  )
}

const styles = StyleSheet.create(
  {
    label: {
      width: `100%`,
    },
    app: {
      width: '100%',
      height: '100%',
      display: 'flex',
      padding: 10
    },
    title: {
      fontSize: 35,
      marginRight: `auto`,
      marginLeft: `auto`,
      color: 'aqua',
      fontWeight: '400',
      marginBottom: 50,
      marginTop: 50
    },
    text: {
      color: "white",
      backgroundColor: '#333',
      marginRight: `auto`,
      marginLeft: `auto`,
      fontSize: 22
    },
    heading: {
      fontSize: 24,
    },
    map: {
      flex: 1
    },
    label: {
      width: `50%`,
      marginRight: 20
    },
    input:
    {
      marginLeft: "auto",
      marginRight: "auto",
      width: `70%`,
      color: 'white'
    },
    btn: {
      marginRight: `auto`,
      marginLeft: `auto`,
      width: `75%`,
      color: `black`,
      paddingTop: 5,
      paddingBottom: 5
    }
    , wrapper: {
      backgroundColor: '#333',
      color: 'black',
      padding: 10
    }
  }
)

export default App
