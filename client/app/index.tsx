import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo'
import { Link } from 'expo-router'
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Svg, { Path } from 'react-native-svg'

export default function Page() {
  const { user } = useUser();

  return (
    <View style={styles.container}>
       <Image
        source={require('../assets/images/logo-nflk-2.png')}
        style={styles.image}
      />



      <Text>
      {/* {"\n"}
      {"\n"}
      {"\n"}
      {"\n"}
      {"\n"} */}



      </Text>
      <SignedIn>
        <Text>Hello {user?.emailAddresses[0].emailAddress}</Text>
      </SignedIn>
      <SignedOut>
        <Link href="/(auth)/sign-in">
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Sign in</Text>
          </TouchableOpacity>
        </Link>
        <Link href="/(auth)/sign-up">
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Sign up</Text>
          </TouchableOpacity>
        </Link>
        <Link href="/map" style={styles.titleText}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Map</Text>
          </TouchableOpacity>
        </Link>
      </SignedOut>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex', flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10
  },
  baseText: {
    fontFamily: 'Cochin',
  },
  titleText: {
    fontSize: 5,
    fontWeight: 'bold',
  },
  button: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FBE04C',
    paddingVertical: 10, // Adjusted padding for better text alignment
    paddingHorizontal: 10, // Adjusted padding for better text alignment
    borderRadius: 5,
    },
  buttonText: {
    color: 'black',
    textAlign: 'center',
    fontSize: 40, // Adjusted font size for better readability
  },
  image: {
    // width: 200,
    // height: 200,
    // marginBottom: 20,
  }
});