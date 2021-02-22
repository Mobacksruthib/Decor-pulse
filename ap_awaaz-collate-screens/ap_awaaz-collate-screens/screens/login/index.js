import React, { PureComponent } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  CheckBox,
  TouchableOpacity,
  Alert,
  Button,
} from "react-native";
import CustomButton from "../../components/customButton";
import Card from "../../components/card";
import { setUser, setCart } from "../../redux/actions/actions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { data } from "../../mock-data";
import api from "../../api/api";
import InputPasswordToggle from "react-native-toggle-password-visibility-expo";
import Spinner from "react-native-loading-spinner-overlay";
import Toast, { DURATION } from "react-native-easy-toast";

class Login extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      userName: "",
      password: "",
      rememberMe: false,
      showPassword: false,
      loading: false,
    };
  }

  validateScreen = () => {
    const { userName, password } = this.state;
    var prefixzero = 10 - this.state.userName.length;

    if (userName && password && prefixzero == 0) {
      return true;
    }
    return false;
  };

  addZeroPrefix() {
    if (this.state.userName.length) {
      var newName = this.state.userName;
      var newName2 = newName.toString().padStart(10, "0");
      this.setState({ userName: newName2 });
    }
  }

  getCartId = async ({ dealerData, access_token }) => {
    const { dealerCode } = dealerData;
    let params = ["dealerCode=" + dealerCode + "_01"];
    try {
      const result = await api.fetchData("GETCART", params, access_token);
      // console.log("GETCART", result);

      let { carts } = result;
      let [findData] = carts.filter((item) => item.salesType == "RETAIL_SALES");
      // console.log("findData", findData);
      if (findData.cartID) {
        this.props.setCart({ cartId: findData.cartID });
        this.navigateToHome({ dealerData, access_token });
      } else {
        let tparams = [dealerCode + "/carts"];
        const createdCartResult = await api.postData(
          "CREATECART",
          tparams,
          access_token
        );
        // console.log("GETCART", createdCartResult);
        let [data2] = createdCartResult;
        this.props.setCart({ cartId: data2.code });
        this.navigateToHome({ dealerData, access_token });
      }
    } catch (err) {
      // console.log("error here", err);
      this.toast.show("Could not fetch the cart id");
      this.navigateToHome({ dealerData, access_token });
    }
  };

  navigateToHome = ({ dealerData, access_token }) => {
    this.setState({ loading: false });
    this.props.navigation.navigate("Home", {
      access_token,
      dealerData,
    });
  };

  handleLogin = () => {
    const isValid = this.validateScreen();
    //console.log(this.state.userName)
    if (isValid) {
      this.setState({ loading: true });
      // this.props.setUser(data.userDetails);
      // this.props.navigation.replace({ routeName: "Home" });
      const { userName, password } = this.state;
      let params = [
        "client_id=mobile_android",
        "client_secret=secret",
        "grant_type=client_credentials",
      ];
      let authValue = "";

      Promise.all([api.postData("BEARER", params, authValue)])
        .then((result) => {
          try {
            let [data] = result;
            console.log('result',data);
            let tparams = [
              "client_id=mobile_android",
              "client_secret=secret",
              "grant_type=password",
              "username=" + userName + "_01",
              "password=" + password,
            ];
            authValue = data.access_token;
            if (authValue !== undefined) {
              Promise.all([api.postData("ACCESS", tparams, authValue)])
                .then((result1) => {
                  try {
                    let [data1] = result1;
                    let dparams = ["dealerCode=" + userName];
                    authValue = data1.access_token;
                    //console.log("result1", data1);
                    if (data1.error === undefined) {
                      Promise.all([api.fetchData("DEALER", dparams, authValue)])
                        .then((result) => {
                          try {
                            let [data2] = result;
                            ("divisionCode");
                            let findData = data2.businessLine.filter(
                              (item) =>
                                item.divisionCode == "25"
                            );
                            // //console.log(findData);
                            if (findData.length) {
                              const details = {
                                access_token: authValue,
                                dealerData: data2,
                                userName,
                              };
                              this.props.setUser(details);
                              this.getCartId(details);
                            } else {
                              this.toast.show("Login Failed");
                            }
                          } catch (err) {
                            //console.log(err);
                          }
                        })
                        .catch((err) => {
                          //console.log("err", err);
                        });
                    } else {
                      this.toast.show("Login Failed\nInvalid Customer Code/Password");
                    }
                  } catch (err) {
                    //console.log(err);
                  }
                })
                .catch((err) => {
                  //console.log("err", err);
                });
            } else {
              this.toast.show("Token Failed");
            }
          } catch (err) {
            //console.log(err);
          }
        })
        .catch((err) => {
          //console.log("err", err);
        })
        .finally(() => {
          this.setState({ loading: false });
        });
    } else {
      this.toast.show(
        "Customer Code/ Password Invalid\nCustomer Code min 10 digit"
      );
    }
  };

  handleClear = () => {
    this.setState({
      userName: "",
      password: "",
    });
  };
  render() {
    const { navigation } = this.props;
    const resetUsrNmePwd = navigation.getParam("resetUsrNmePwd", false);
    //console.log("userNameVal-",resetUsrNmePwd);
    if (resetUsrNmePwd) {
      navigation.navigate("Login", { resetUsrNmePwd: false });
      this.setState({ userName: "", password: "" });
    }
    const { userName, password, showPassword, rememberMe } = this.state;
    return (
      <View style={styles.container}>
        <Spinner visible={this.state.loading} color="#17CFAD" />
        <View style={styles.imageContainer}>
          <Image
            style={styles.mainLogo}
            source={require("../../assets/asian_paints_logo.png")}
          />
        </View>

        <View style={styles.imageContainer}>
          <Image
            style={styles.appLogo}
            source={require("../../assets/Home_Decor_My_Awaaz.png")}
          />
        </View>
        <View style={styles.cardContainer}>
          <Card style={styles.card}>
            <TextInput
              placeholder="Customer Code"
              style={styles.custcodeInput}
              value={userName}
              onChangeText={(v) => {
                this.setState({ userName: v });
              }}
              onBlur={(e) => this.addZeroPrefix()}
            />
            <Image
              style={styles.tinyLogo}
              source={require("../../assets/humanicon.png")}
            />
          </Card>
        </View>
        <View style={styles.cardContainer}>
          <Card style={styles.card}>
            <InputPasswordToggle
              placeholder="Password"
              inputStyle={styles.textInput}
              value={password}
              onChangeText={(v) => {
                this.setState({ password: v });
              }}
            />
          </Card>
        </View>
        {/* <View style={styles.checkboxContainer}>
          <View style={styles.checkbox}>
            <CheckBox
              value={showPassword}
              onValueChange={(value) => {
                this.setState({ showPassword: value });
              }}
            />
            <Text style={styles.label}>show password</Text>
          </View>
          <View style={styles.checkbox}>
            <CheckBox
              value={rememberMe}
              onValueChange={(value) => {
                this.setState({ rememberMe: value });
              }}
            />
            <Text style={styles.label}>Remember Me</Text>
          </View>
        </View> */}

        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate("GenerateOtp");
            }}
          >
            <Text style={{ color: "#FF0C0C", fontSize: 15 }}>
              Forgot Password ?
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonsContainer}>
          <CustomButton
            title="LOGIN"
            style={styles.button}
            onPress={this.handleLogin}
            textStyle={{ color: "#FFFFFF" }}
          />
        </View>
        <Toast
          ref={(toast) => (this.toast = toast)}
          style={{ backgroundColor: "#502B85" }}
          position="center"
          positionValue={600}
          fadeInDuration={3000}
          fadeOutDuration={4000}
          opacity={0.8}
          textStyle={{
            color: "#FFFFFF",
            padding: 10,
            fontSize: 14,
            fontWeight: "bold",
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
  button: {
    display: "flex",
    height: 40,
    backgroundColor: "#502B85",
    paddingVertical: 12,
    paddingHorizontal: 25,
  },
  buttonsContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-evenly",
    display: "flex",
    paddingTop: "10%",
  },
  cardContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 35,
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  text: {
    color: "#17CFAD",
    fontSize: 42,
    fontWeight: "bold",
    textAlign: "center",
  },
  mainText: {
    fontSize: 30,
    lineHeight: 42,
    color: "#1564BF",
    textAlign: "center",
    fontWeight: "bold",
    paddingBottom: 15,
  },
  custcodeInput: {
    color: "grey",
    fontSize: 18,
    lineHeight: 24,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    paddingRight: 60,
    paddingLeft: 60,
  },
  textInput: {
    color: "grey",
    fontSize: 18,
    lineHeight: 24,
    textAlign: "center",
    width: "95%",
  },
  card: {
    width: "80%",
  },
  tinyLogo: {
    position: "absolute",
    right: 0,
    marginRight: 8,
    marginTop: 14,
  },
  userLogo: {
    width: 20,
    height: 20,
  },
  passwordLogo: {
    width: 20,
    height: 13,
    marginTop: 18,
  },
  mainLogo: {
    width: 150,
    height: 51,
    resizeMode: "contain",
  },
  appLogo: {
    width: 200,
    height: 40,
    resizeMode: "contain",
    marginBottom: 30,
  },
  imageContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  checkbox: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
  },
});

Login.navigationOptions = {
  headerVisible: "false",
  header: null,
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ setUser, setCart }, dispatch);
};

export default connect(null, mapDispatchToProps)(Login);

// export default Login;
