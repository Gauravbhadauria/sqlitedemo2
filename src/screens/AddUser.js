import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {openDatabase} from 'react-native-sqlite-storage';
import {useNavigation} from '@react-navigation/native';
let db = openDatabase({name: 'UserDatabase.db'});
const AddUser = () => {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const saveUser = () => {
    console.log(name, email, address);
    db.transaction(function (tx) {
      tx.executeSql(
        'INSERT INTO table_user (name, email, address) VALUES (?,?,?)',
        [name, email, address],
        (tx, results) => {
          console.log('Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
            Alert.alert(
              'Success',
              'You are Registered Successfully',
              [
                {
                  text: 'Ok',
                  onPress: () => navigation.navigate('Home'),
                },
              ],
              {cancelable: false},
            );
          } else alert('Registration Failed');
        },
        error => {
          console.log(error);
        },
      );
    });
  };
  useEffect(() => {
    db.transaction(txn => {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='table_user'",
        [],
        (tx, res) => {
          console.log('item:', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS table_user', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS table_user(user_id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(20), email VARCHAR(50), address VARCHAR(100))',
              [],
            );
          }
        },
        error => {
          console.log(error);
        },
      );
    });
  }, []);
  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Enter User Name"
        style={styles.input}
        value={name}
        onChangeText={txt => setName(txt)}
      />
      <TextInput
        placeholder="Enter User Email"
        value={email}
        onChangeText={txt => setEmail(txt)}
        style={[styles.input, {marginTop: 20}]}
      />
      <TextInput
        placeholder="Enter User Address"
        value={address}
        onChangeText={txt => setAddress(txt)}
        style={[styles.input, {marginTop: 20}]}
      />
      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => {
          saveUser();
        }}>
        <Text style={styles.btnText}>Save User</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddUser;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  input: {
    width: '80%',
    height: 50,
    borderRadius: 10,
    borderWidth: 0.3,
    alignSelf: 'center',
    paddingLeft: 20,
    marginTop: 100,
  },
  addBtn: {
    backgroundColor: 'purple',
    width: '80%',
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    alignSelf: 'center',
  },
  btnText: {
    color: '#fff',
    fontSize: 18,
  },
});
