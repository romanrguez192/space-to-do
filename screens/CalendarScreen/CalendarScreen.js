import React, { useState, useRef, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Alert,
  DatePickerIOSComponent,
} from "react-native";
import styles from "./styles";
import { firebase } from "../../firebase/config";
import {
  ActivityIndicator,
  Appbar,
  DefaultTheme,
  List,
} from "react-native-paper";
import { Calendar, Agenda, CalendarTheme } from "react-native-calendars";
import { LocaleConfig } from "react-native-calendars";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import LoadScreen from "../LoadScreen/LoadScreen";
import { Input, Icon, Overlay, ListItem } from "react-native-elements";

LocaleConfig.locales["es"] = {
  monthNames: [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ],
  monthNamesShort: [
    "Ene",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],
  dayNames: [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ],
  dayNamesShort: ["DOM", "LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB"],
  today: "Hoy",
};
LocaleConfig.defaultLocale = "es";

const CalendarScreen = (props) => {
  const createEmptyDates = () => {
    const datess = {};

    for (let year = 2017; year <= 2023; year++) {
      for (let month = 1; month <= 12; month++) {
        for (let day = 1; day <= 31; day++) {
          const date =
            year +
            "-" +
            (month < 10 ? "0" : "") +
            month +
            "-" +
            (day < 10 ? "0" : "") +
            day;

          datess[date] = [];
        }
      }
    }

    console.log("Salio aki");
    return datess;
  };

  const [dates, setDates] = useState(createEmptyDates());
  const [loading, setLoading] = useState(true);
  const [ids, setIds] = useState([]);

  useEffect(() => {
    getTasks(props.route.params.userID);
  }, []);

  const CustomHeader = () => {
    return (
      <Appbar.Header
        theme={{
          ...DefaultTheme,
          roundness: 2,
          colors: {
            ...DefaultTheme.colors,
            primary: "#e54e42",
          },
        }}
      >
        <Appbar.Action
          icon="menu"
          onPress={() => props.navigation.toggleDrawer()}
        />
        <Appbar.Content title="Calendario" />
      </Appbar.Header>
    );
  };

  const getTasks = (id) => {
    const tasksRef = firebase.default.firestore().collection("tasks");
    tasksRef
      .where("userID", "==", id)
      .where("done", "==", false)
      .onSnapshot((snapshot) => {
        snapshot.docs.forEach((doc) => {
          console.log("A");
          const resul = new Date(doc.data().limit * 1000);
          const year = resul.getFullYear();
          const month = resul.getMonth() + 1;
          const day = resul.getDate();

          const date =
            year +
            "-" +
            (month < 10 ? "0" : "") +
            month +
            "-" +
            (day < 10 ? "0" : "") +
            day;

          if (!ids.includes(doc.id)) {
            dates[date].push(doc.data());
            ids.push(doc.id);
          }
        });
        setLoading(false);
      });
  };

  const getDateFromString = (limit) => {
    const resul = new Date(limit * 1000);

    const getTime = (date) => {
      let hours = date.getHours() % 12;
      let minutes = date.getMinutes();

      hours = hours ? hours : 12;
      minutes = minutes < 10 ? "0" + minutes : minutes;

      return hours + ":" + minutes + " " + (date.getHours() < 12 ? "AM" : "PM");
    };

    return (
      resul.getDate() +
      "/" +
      (resul.getMonth() + 1) +
      "/" +
      resul.getFullYear() +
      " " +
      getTime(resul)
    );
  };

  if (loading) {
    return <LoadScreen />;
  }

  return (
    <>
      <CustomHeader />
      <Agenda
        items={dates}
        renderItem={(item, firstItemInDay) => {
          return (
            <View style={{paddingTop: 22}} >
              <List.Accordion
                title={item.title}
                description={getDateFromString(item.limit)}
                titleStyle={
                  ({ fontWeight: "bold" },
                  item.done
                    ? { textDecorationLine: "line-through" }
                    : undefined)
                }
                descriptionStyle={
                  new Date(item.limit * 1000) < new Date()
                    ? { color: "red" }
                    : undefined
                }
                style={{ paddingBottom: 0 }}
                theme={{
                  ...DefaultTheme,
                  roundness: 2,
                  colors: {
                    ...DefaultTheme.colors,
                    primary: "#e54e42",
                  },
                }}
              >
                <TouchableOpacity activeOpacity={0.7} /*onLongPress={}*/>
                  <List.Item
                    style={{ paddingTop: 0 }}
                    description={item.description}
                    descriptionStyle={
                      item.done
                        ? { textDecorationLine: "line-through" }
                        : undefined
                    }
                    titleStyle={{ display: "none" }}
                  />
                </TouchableOpacity>
              </List.Accordion>
            </View>
          );
        }}
        renderEmptyDate={() => {
          return (
            <View style={{paddingTop: 22}} >
              <Text style={{marginTop: 22}}>No hay tareas para este día</Text>
            </View>
          );
        }}
      />
    </>
  );
};

export default CalendarScreen;
