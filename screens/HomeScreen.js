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

import { Dialog } from 'react-native-simple-dialogs';

import { Right } from "native-base";

import Icon from 'react-native-vector-icons/FontAwesome';

import Parse from "parse/react-native";

export default class HomeScreen extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      results: [],
      item: '',
      nameErrorNew: null,
      nameErrorUpdate: null,
      dialogVisible: false,
      updateValueDialog: '',
      idObject: ''
    }
  }
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
    Alert.alert(
      "Choose an action",
      '',
      [
        {text: 'Delete', onPress: () => {
          this.setState({idObject: id});
          this._onPressDeleteObject()}},
        {text: 'Update', onPress: () => this.setState({dialogVisible: true})},
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        }       
      ],
      {cancelable: false}
    );

   
  }

  getAllData = async () => {
    const query = new Parse.Query("Todo");
    query.exists("task");
    const resultQuery = await query.find();
    console.log(resultQuery);
    this.setState({results:resultQuery}); 
  }

  addItem = () => {
    let item = this.state.item;

    if (item.trim() === "" ) {
      this.setState(() => ({ nameError: `Fill the fields correctly.` }));
    } else {
      const Todo = Parse.Object.extend("Todo");
      const todo = new Todo();

      todo.set("task", this.state.item);
      todo.set("userId",  Parse.User.current());
      console.log(this.state.item)
      
      todo.save().then(object => {
        this.getAllData();
      }).catch(error=> {console.log(error)})
    }
  }

  updateItem = () => {
    const query = new Parse.Query("Todo");
    query.get(this.state.idObject).then(object => {
      object.set("task", this.state.item);
      object.save().then(objUpdate => {
        this.getAllData();
        this.setState({dialogVisible: false})
      });
    });  
  }


  _onPressDeleteObject = async() => {
    const query = new Parse.Query("Todo");
    const object = await query.get(this.state.idObject);
    try{
      object.destroy();
      this.getAllData();
    } catch (e){
      alert(e)
    }
  }

  renderItem = ({item, separators}) => {
    return (
        <TouchableOpacity
          style={styles.borderFlatListItens}
          onPress={() => {
            this._onPress(item.id);
            this.setState({updateValueDialog:item.get("task")})
          }}>
          <View>
              <Text>{item.get("task")}</Text>
          </View>
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
              underlineColorAndroid='transparent'
              ref={'inputObject'}
              onChangeText={(text) => this.setState({item: text, nameError: null})}/>
            <Icon 
                type="Feather"
                name='plus' 
                style={styles.icon}                
                onPress={() => this.addItem()}/>
          </View>
          {!!this.state.nameErrorNew && (
            <View styles={styles.divError}>
                <Text style={styles.divErrorFont}>{this.state.nameErrorNew}</Text>
            </View>
          )}
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
          <Dialog
            visible={this.state.dialogVisible}
            title="Update object"
            onTouchOutside={() => this.setState({dialogVisible: false})} >
            <View style={styles.containerInputs}> 
              <TextInput style={styles.inputTask}
                placeholder="Add tasks...."
                underlineColorAndroid='transparent'
                value={this.state.updateValueDialog}
                onChangeText={(text) => this.setState({item: text, nameErrorUpdate: null})}/>
              <Icon 
                  type="Feather"
                  name='plus' 
                  style={styles.icon}                
                  onPress={() => this.updateItem()}/>
            </View>
            {!!this.state.nameErrorUpdate && (
              <View styles={styles.divError}>
                  <Text style={styles.divErrorFont}>{this.state.nameErrorUpdate}</Text>
              </View>
            )}
          </Dialog>
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
    fontSize: 40,
    color: '#00b5ec'
  },
  titleItems: {
    fontWeight: 'bold',
    fontSize: 25,
    marginBottom: 25
  },
  divErrorFont:{
    textAlign: 'center',
    color: '#721c24',
    backgroundColor: '#f8d7da',
    borderColor: '#f5c6cb',
    padding: 20,
    marginTop: 10,
    marginBottom: 10,
    borderWidth: 2,
  },
  borderFlatListItens:{ 
    flexDirection: 'row', 
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#00b5ec'
  }
});
