import React from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  View,
  TextInput,
  Text,
  FlatList,
  TouchableOpacity
} from 'react-native';

import { Right } from "native-base";

import Icon from 'react-native-vector-icons/FontAwesome';

import Parse from "parse/react-native";

export default class HomeScreen extends React.Component {

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: 'List',
      headerRight: (
       <View 
          style={{marginRight: 15}}>
         <Icon name="sign-out" size={30} color="#00b5ec" 
          onPress=
            {() => {
              Alert.alert(
                'Sign out',
                'Are you sure do you want to exit?',
                [                  
                  {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                  },
                  {
                    text: 'Yes', onPress: () => {
                      Parse.User.logOut();
                      navigation.navigate('LogInStack')
                  }},
                ],
                {cancelable: false},
              );
              }
            } />
       </View>
      )
    };
  };


  constructor(props){
    super(props);
    this.state = {
      results: []
    }
  }

  componentWillMount(){
    Parse.User.currentAsync().then(user => {
      if (user == undefined) {
        this.props.navigation.navigate('LogInStack') 
      } else {
        let sessionToken = user.getSessionToken();
        switch (user) {
          case user:
            Parse.User.become(sessionToken).then(object => {
              this.getAllData();
            }).catch(error => {
              Alert.alert(
                error.message,
                'Please, do the log in again!',
                [
                  {text: 'OK', onPress: () => {this.props.navigation.navigate('LogInStack')}},
                ]
              )}
            );
            break;
            default:
              this.props.navigation.navigate('LogInStack');
              break;
          }
        }
      }
    )
  }


  _onPress = (id) => {
    alert(id)
  }

  getAllData = async () => {
    const query = new Parse.Query("Todo");
    query.exists("task");
    const resultQuery = await query.find();
    console.log(resultQuery);
    this.setState({results:resultQuery}); 
  }

  renderItem = ({item, separators}) => {
    return (
        <TouchableOpacity
          style={styles.borderFlatListItens}
          onPress={() => this._onPress(item.id)}>
          <View>
              <Text>{item.get("task")}</Text>
          </View>
          <Right>
            <Icon name="minus" size={16} color='#00b5ec' style={{}}/>
          </Right>
        </TouchableOpacity>
    )
  }
  
  render() {
    return (
      <View style={styles.container}>
       <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <View style={styles.containerInputs}> 
            <TextInput style={styles.inputTask}
              placeholder="Add tasks...."
              underlineColorAndroid='transparent' />
            <Icon type="Feather" name='plus' style={styles.icon} onChangeText={(password) => this.setState({password})}/>
          </View>
          <View style={{padding: 30, flex: 1}}>
            <Text style={styles.titleItems}>Items</Text>
            <FlatList
              data={this.state.results}
              showsVerticalScrollIndicator={false}
              renderItem={this.renderItem}
              showsVerticalScrollIndicator={true}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        </ScrollView>        
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    paddingTop: 30,
  },
  containerInputs:{
    flexDirection: 'row',
    justifyContent: 'center',
    margin: 30,
    borderWidth: 1,
    borderColor: '#00b5ec'
  },
  inputTask: {
    flex: 1,
    padding: 15,
  },
  icon: {
    color: 'grey',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
    fontSize: 20,
    color: '#00b5ec'
  },
  titleItems: {
    fontWeight: 'bold',
    fontSize: 25,
    marginBottom: 25
  },
  borderFlatListItens:{ 
    flexDirection: 'row', 
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#00b5ec'
  }
});
