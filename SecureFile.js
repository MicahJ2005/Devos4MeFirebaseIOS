import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';

export default function SecureFile() {
  const [grantAccess, setGrantAccess] = useState(false);
  useEffect(() => {
    (async () => {
      const auth = await LocalAuthentication.authenticateAsync();
      console.log('auth', auth)
      if (auth.success) setGrantAccess(true);
      else setGrantAccess(false);
    })();
  }, []);
  return (
    <View style={styles.container}>
      {grantAccess && (
        <Text>this is the secret information: JSN#$@@@#NA*@!@#^^^??????</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});