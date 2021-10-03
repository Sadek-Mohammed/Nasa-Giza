import React, { useState, useEffect } from 'react'
//import MapView, { Marker } from 'react-native-maps'
import { TouchableOpacity, Text, Button, View, SafeAreaView, Image, StyleSheet, DatePickerAndroidOpenReturn, Picker, ScrollView, TextInput, Alert } from 'react-native'
import { TagSelect } from 'react-native-tag-select';
import * as Location from 'expo-location';
import { Input } from "react-native-elements"
import { DateInput } from 'react-native-date-input';
import dayjs from 'dayjs';

const App = () => {
  const data = [
    { id: 1, label: 'Hourly' },
    { id: 2, label: 'Daily' },
    { id: 3, label: 'Weekly' },
    { id: 4, label: 'Monthly' },
    { id: 5, label: 'Annually' },
  ];
  const [latLangManual, setLatLangManual] = useState({ latitude: 0, longitude: 0 })
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [local, setLocal] = useState(null);
  const [mapRegion, setMapRegion] = useState(null);
  const [showOne, setShowOne] = useState(0);
  const [fetcher, setFetcher] = useState("");
  const [markers, setMarkers] = useState([]);
  const [lat, setLat] = useState("")
  const [long, setLong] = useState("")
  const [dateStart, setDateStart] = useState('')
  const [dateEnd, setDateEnd] = useState('')
  const [twoDates, setTwoDates] = useState(null)
  let dateinpstart = null, dateinpend = null;
  const handleStart = (date) => {
    setDateStart(date)
  }
  const handleEnd = (date) => {
    setDateEnd(date)
  }
  const focusstart = () => {
    if (!dateinpstart) {
      return;
    }

    dateinpstart.focus();
  };
  const focusend = () => {
    if (!dateinpend) {
      return;
    }

    dateinpend.focus();
  };
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
      console.log(location)
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
  let link = `https://power.larc.nasa.gov/api/temporal`
  const grab = () => {
    console.log("Hello")
    //fetch(`${link}/${x}/point?parameters=T2M&community=SB&longitude=${mapRegion.longitude}&latitude=${mapRegion.latitude}&start=2021101&end=2021102&format=JSON`)
  }
  const fetchingnow = () => {
    console.log("done")
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
    console.log(mapRegion)
    setMapRegion({
      longitude: y,
      latitudeDelta: mapRegion.latitudeDelta,
      latitude: x,
      longitudeDelta: mapRegion.longitudeDelta
    })
    console.log(mapRegion)
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
              <View style={{ flex: 1 }}>
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
          <TextInput
            style={styles.input}
            onChangeText={handleStart}
            value={dateStart}
            placeholder="Start Date (DD/MM/YYYY)"
            keyboardType="numeric"
            placeholderTextColor="#fff"
          />
          <TextInput
            style={styles.input}
            onChangeText={handleEnd}
            value={dateEnd}
            placeholder="End Date (DD/MM/YYYY)"
            keyboardType="numeric"
            placeholderTextColor="#fff"
          />
          <Button title="Check Interval"></Button>
        </View>
        {
          mapRegion == null ?
            null :
            <Text style={{ color: `black` }}>{`longitude is ${mapRegion.longitude} and latitude is ${mapRegion.latitude}`}</Text>
        }
        <Button title="fetch" color="rgb(211,207,201)" testID="black" />
        <TagSelect
          data={data}
          itemStyle={styles.item}
          itemLabelStyle={styles.choice}
          itemStyleSelected={styles.itemSelected}
          itemLabelStyleSelected={styles.labelSelected}
        />
        <Button title="HELLO" onPress={grab()} />
        {
          fetcher == "hourly" ?
            <Text style={{ marginLeft: 'auto', marginRight: 'auto', fontSize: 18 }}>Hourly</Text>
            :
            fetcher == "daily" ?
              <Text style={{ marginLeft: 'auto', marginRight: 'auto', fontSize: 18 }}>Daily</Text>
              :
              fetcher == "monthly" ?
                <Text style={{ marginLeft: 'auto', marginRight: 'auto', fontSize: 18 }}>Monthly</Text>
                :
                fetcher == "annually" ?
                  <Text style={{ marginLeft: 'auto', marginRight: 'auto', fontSize: 18 }}>Annually</Text>
                  :
                  <Text style={{ marginLeft: 'auto', marginRight: 'auto', fontSize: 18 }}>Put a valid value</Text>
        }
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
      color: 'white'
    }
  }
)

export default App
