import PropTypes from "prop-types";
import React, { Component } from "react";
import { NavigationActions } from "react-navigation";
import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageBackground,
} from "react-native";
import { StackNavigator } from "react-navigation";

class SideMenu extends Component {
  navigateToScreen = (route) => () => {
    const navigateAction = NavigationActions.navigate({
      routeName: route,
    });
    this.props.navigation.dispatch(navigateAction);
  };

  constructor(props) {
    super(props);
  }

  renderMenuOptions = () => {
    const { navigation } = this.props;
    // const { dealerData } = this.props.userDetails;
    // const { dealerName, dealerCode } = dealerData;
    return (
      <>
        <View style={styles.userMenuItem}>
          <Image
            source={require("../../assets/user.png")}
            style={styles.userImage}
          />
        </View>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Home");
          }}
        >
        <ImageBackground
          resizeMode={'stretch'} // or cover
          style={{flex: 1}} 
          source={require('../../assets/grad-bg.png')}
        >
          <View style={styles.menuItem}>            
            <Image
              source={require("../../assets/dashboard.png")}
              style={styles.image}
            />
            <Text style={styles.menuItemText}>My Dashboard</Text>            
          </View>
          </ImageBackground>
        </TouchableOpacity>

        <View style={styles.divider}></View>

        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Search");
          }}
        >
        <ImageBackground
          resizeMode={'stretch'} // or cover
          style={{flex: 1}} 
          source={require('../../assets/grad-bg.png')}
        >
          <View style={styles.menuItem}>
            <Image
              source={require("../../assets/stock.png")}
              style={styles.image}
            />
            <Text style={styles.menuItemText}>Stock Check</Text>
          </View>
          </ImageBackground>
        </TouchableOpacity>
        <View style={styles.divider}></View>

        <TouchableOpacity
          onPress={() => {
            navigation.navigate("PlaceOrder");
          }}
        >
         <ImageBackground
          resizeMode={'stretch'} // or cover
          style={{flex: 1}} 
          source={require('../../assets/grad-bg.png')}
        >
         <View style={styles.menuItem}>
            <Image
              source={require("../../assets/menu_place_order.png")}
              style={styles.image}
            />
            <Text style={styles.menuItemText}>Place Order</Text>
          </View>
          </ImageBackground>
        </TouchableOpacity>

        <View style={styles.divider}></View>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("MyOrders");
          }}
        >
        <ImageBackground
          resizeMode={'stretch'} // or cover
          style={{flex: 1}} 
          source={require('../../assets/grad-bg.png')}
        >
          <View style={styles.menuItem}>
            <Image
              source={require("../../assets/menu_order.png")}
              style={styles.image}
            />
            <Text style={styles.menuItemText}>My Orders</Text>
          </View>
          </ImageBackground>
        </TouchableOpacity>

        <View style={styles.divider}></View>
      </>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <ScrollView>{this.renderMenuOptions()}</ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    flex: 1,
  },
  divider: {
    borderBottomWidth: 2,
    borderBottomColor: "#A5A5A5",
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  image: {
    resizeMode: "contain",
    width: 35,
    height: 35,
    marginRight: 10,
  },
  userMenuItem: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  userImage: {
    resizeMode: "contain",
    width: 90,
    height: 100,
  },
  menuItemText: {
    fontFamily: "OpenSans-SemiBold",
    fontSize: 20,
    lineHeight: 27,
  },
});

SideMenu.propTypes = {
  navigation: PropTypes.object,
};

export default SideMenu;
