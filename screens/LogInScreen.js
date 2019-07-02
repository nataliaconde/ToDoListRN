import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableHighlight
} from 'react-native';

import Parse from "parse/react-native";

export default class LogInScreen extends React.Component {
    static navigationOptions = {
        header: null,
    };
    
    constructor(props){
        super(props)
        this.state = {
            username: '',
            password: '',
            nameError: null
        }
    }

    submitAndClear = () => {
        this.setState({
            username: '',
            password: '',
            nameError: null
        })
    }

    goToSignUpPage = () =>{
        this.props.navigation.navigate('SignUpStack');
    }

    restorePassword = () =>{
        this.props.navigation.navigate('RestorePasswordStack');
    }

    onLogin = async() =>{
        let    
            username = this.state.username,
            password = this.state.password;

        if (username.trim() === "" || password.trim() === "" ) {
            this.setState(() => ({ nameError: `Fill the fields correctly.` }));
        } else {
            try {
                await Parse.User.logIn(username.toString(), password.toString());
                this.props.navigation.navigate('HomeStack');

                this.submitAndClear();
            } catch (error) {                
                this.setState(() => ({ nameError: error.message }));
                return (error)
            }
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.titlePage}>Log In</Text>

                <View style={styles.inputContainer}>
                    <TextInput style={styles.inputs}
                        keyboardType="email-address"
                        placeholder="Username"
                        value={this.state.username}
                        onChangeText={(username) => this.setState({username})}/>
                </View>
                
                <View style={styles.inputContainer}>
                <TextInput style={styles.inputs}
                    placeholder="Password"
                    secureTextEntry={true}
                    underlineColorAndroid='transparent'
                    value={this.state.password}
                    onChangeText={(password) => this.setState({password})}/>
                </View>


                {!!this.state.nameError && (
                    <View styles={styles.divError}>
                        <Text style={styles.divErrorFont}>{this.state.nameError}</Text>
                    </View>
                )}

                <TouchableHighlight style={[styles.buttonContainer, styles.loginButton]} onPress={this.onLogin}>
                    <Text style={styles.loginText}>Login</Text>
                </TouchableHighlight>

                <View style={styles.containerLinksRow}>
                    <TouchableHighlight style={styles.txtLink} onPress={this.restorePassword}>
                        <Text style={{fontWeight:'bold'}}>Forgot your password?</Text>
                    </TouchableHighlight>

                    <TouchableHighlight style={styles.txtLink} onPress={this.goToSignUpPage}>
                        <Text style={{fontWeight:'bold'}}>Register</Text>
                    </TouchableHighlight>
                </View>            
        </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: "#00b5ec",
      padding: 30
    },
    row: {
        flexDirection: "row"
    },
    titlePage:{
        marginBottom: 30,
        fontSize: 25,
        fontWeight: 'bold'
    },
    inputContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 5,
        height: 50,
        marginBottom: 15,
        flexDirection: 'row'
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
    inputs:{
        height: 50,
        marginLeft:16,
        flex:1,
    },
    fontAwesomeIcon:{
      width:30,
      height:30,
      marginLeft:15,
      justifyContent: 'center'
    },
    buttonContainer: {
        flexDirection: 'row',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom:20,
        width: 250,
        borderRadius: 5,
    },
    loginButton: {
        backgroundColor: 'transparent',
        borderBottomColor: '#fff',
        borderBottomWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    containerLinksRow:{
        marginTop: 50,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    txtLink:{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 15
    },  
    loginText: {
        color: '#fff',
    }
  });