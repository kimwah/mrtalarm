import * as WebBrowser from 'expo-web-browser';
import React,  { useState, useEffect }  from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { MonoText } from '../components/StyledText';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import * as TaskManager from 'expo-task-manager';

const LOCATION_TASK_NAME = 'background-location-task';

export default function HomeScreen() {
  const [hitcount, setHitcount] = useState(0);
  const [geoLocation, setGeoLocation] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [askLocation, setAskLocation] = useState(false);

  useEffect(()=>{
    let msg = '';
    if (Platform.OS === 'android' && !Constants.isDevice) {
      msg = 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!';
      setErrorMessage(msg);
      console.log(msg);
      // this.setState({
      //   errorMessage: ,
      // });
    } else {
      //this._getLocationAsync();
      msg = '- Mrt Location Tracker -';
      //setHitcount(hitcount+1);
      setErrorMessage(msg);
      console.log(msg);
      getMsg();
      console.log('dumping location',geoLocation, ' dumping askLocation', askLocation);
      //if (geoLocation==null) getLocationAsync();
      if (geoLocation === null) getLocationWatchAsync();
      // if (geoLocation==null) Location.watchPositionAsync(
      //   {
      //     accuracy: 6,
      //     timeInterval: 100,
      //    },
      //    newLocationUpdate);
      // }
    } 
  }); 

  let getMsg = () => {
    console.log('fire function');
  };

  let getLocationWatchAsync = async () => {
    if (!askLocation) 
    {
      let { status } = await Permissions.askAsync(Permissions.LOCATION);
      if (status !== 'granted') {      
        setErrorMessage('Permission to access location was denied' );
      } else {
        console.log("location permission granted! ");
        Location.watchPositionAsync(
          {
            accuracy: 6,
            timeInterval: 100,
           },
           newLocationUpdate);        
      }
      setAskLocation(true);
    }
  };

  let getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {      
      setErrorMessage('Permission to access location was denied' );
    }
  
    let location = await Location.getCurrentPositionAsync({});
    setGeoLocation(location);
    setHitcont(hitcount + 1);
    location.hitcount = hitcount;
    console.log(location);
  };

  let newLocationUpdate = (location)=> {
    console.log("=== new locaiton update ===");
    console.log(location);
    setGeoLocation(location);
  }
  //setInterval( getLocationAsync, 3000);

  let dispLoc = geoLocation;
  let lng = 0;
  let lat = 0;
  if (geoLocation!==null) {
    lng = geoLocation.coords.longitude;
    lat = geoLocation.coords.latitude;
  }
  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}>
        <View style={styles.welcomeContainer}>
          <Image
            source={
              __DEV__
                ? require('../assets/images/robot-dev.png')
                : require('../assets/images/robot-prod.png')
            }
            style={styles.welcomeImage}
          />
        </View>

        <View style={styles.getStartedContainer}>
          <DevelopmentModeNotice />

          <Text style={styles.getStartedText}>{errorMessage}</Text>
          <Text style={styles.getLocationText}>Location({lat},{lng})</Text>

          {
            /*
          <View
            style={[styles.codeHighlightContainer, styles.homeScreenFilename]}>
            <MonoText>screens/HomeScreen.js</MonoText>
          </View>
            */
          }

          <Text style={styles.getStartedText}>
            Change this text and your app will automatically reload.
          </Text>
        </View>

        <View style={styles.helpContainer}>
          <TouchableOpacity onPress={handleHelpPress} style={styles.helpLink}>
            <Text style={styles.helpLinkText}>
              Help, it didn’t automatically reload!
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.tabBarInfoContainer}>
        {
        /*
        <Text style={styles.tabBarInfoText}>
          This is a tab bar. You can edit it in:
        </Text>
        */
        }
      <TouchableOpacity onPress={handleLocationMonitor}>
        <Text>Enable background location</Text>
      </TouchableOpacity>        

        <View
          style={[styles.codeHighlightContainer, styles.navigationFilename]}>
          <MonoText style={styles.codeHighlightText}>
            navigation/MainTabNavigator.js
          </MonoText>
        </View>
      </View>
    </View>
  );
}

TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
  if (error) {
    // Error occurred - check `error.message` for more details.
    return;
  }
  if (data) {
    const { locations } = data;
    // do something with the locations captured in the background
    console.log("==========");
    console.log(locations);
  }
});


HomeScreen.navigationOptions = {
  header: null,
};

function DevelopmentModeNotice() {
  if (__DEV__) {
    const learnMoreButton = (
      <Text onPress={handleLearnMorePress} style={styles.helpLinkText}>
        Learn more
      </Text>
    );

    return (
      <Text style={styles.developmentModeText}>
        Development mode is enabled: your app will be slower but you can use
        useful development tools. {learnMoreButton}
      </Text>
    );
  } else {
    return (
      <Text style={styles.developmentModeText}>
        You are not in development mode: your app will run at full speed.
      </Text>
    );
  }
}

async function handleLocationMonitor() {
  const { status } = await Location.requestPermissionsAsync();
  if (status === 'granted') {
    await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
      accuracy: Location.Accuracy.Balanced,
    });
  }
};

function handleLearnMorePress() {
  WebBrowser.openBrowserAsync(
    'https://docs.expo.io/versions/latest/workflow/development-mode/'
  );
}

function handleHelpPress() {
  WebBrowser.openBrowserAsync(
    'https://docs.expo.io/versions/latest/workflow/up-and-running/#cant-see-your-changes'
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  getLocationText: {
    fontSize: 17,
    color: 'red',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
