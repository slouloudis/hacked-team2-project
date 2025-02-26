import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo'
import { Link } from 'expo-router'
import { Button, Text, View } from 'react-native'

export default function Page() {
  const { user } = useUser()

  return (
    <View>
      <SignedIn>
        <Text>Hello {user?.emailAddresses[0].emailAddress}</Text>
      </SignedIn>
      <SignedOut>
        <Button title="Sign in" onPress={() => { window.location.href = '/(auth)/sign-in'; }} />
        <Button title="Sign up" onPress={() => { window.location.href = '/(auth)/sign-up'; }} />
      </SignedOut>
    </View>
  )
}