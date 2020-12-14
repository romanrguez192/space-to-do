import React, { useState, useRef, useEffect } from "react";
import { Text, View, TouchableOpacity, Alert } from "react-native";
import styles from "./styles";
import { firebase } from "../../firebase/config";
import { ActivityIndicator, Appbar, DefaultTheme } from "react-native-paper";
import { Calendar } from "react-native-calendars";
import { LocaleConfig } from "react-native-calendars";
import { ScrollView } from "react-native-gesture-handler";

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
  dayNamesShort: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
  today: "Hoy",
};
LocaleConfig.defaultLocale = "es";

const CalendarScreen = (props) => {
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
        <Appbar.Action icon="dots-vertical" />
      </Appbar.Header>
    );
  };
  useEffect(() => {
    getLists(props.route.params.userID)
  }, [])

  const [selected, setSelected] = useState("");
  const [dates, setDates] = useState(null);
  const [loading, setLoading] = useState(true);
  const [markIt, setMarkIt] = useState(false);

  const onDayPress = (day) => {
    if(Object.keys(dates).includes(day.dateString))
      setMarkIt(true)
    else
      setMarkIt(false)
    setSelected(day.dateString);
  };

  const getLists = (userID) => {
    const listsRef = firebase.default.firestore().collection("lists");
    listsRef
      .where("createdBy", "==", userID)
      //.orderBy("createdAt", "desc")
      .onSnapshot((snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),

        }));
        getDates(data)
        
      })
  };

  
  
  const getDates = (lists) => {
    let date = []
    if(lists){
      lists.map((list) => {
        const taskRef = firebase.default.firestore().collection('tasks');
        taskRef.where("listID", "==", list.id)
        .onSnapshot(snapshot => {
          snapshot.docs.forEach(doc => {
            const resul = new Date(doc.data().limit * 1000)
            const str = ((resul.getFullYear() - 1969) + "-" + (resul.getMonth() + 1) + "-" + resul.getDate())
            date[str] = {dotColor: '#3B99D8', selectedColor: 'white', marked: true}
          })
          setDates(date)
        })
        
      })
    }
    setLoading(false)
  }

  if(loading){
    return(
      <View>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  return (
    <>
    <CustomHeader />
      <ScrollView>
        <Calendar
          enableSwipeMonths={true}
          onDayPress={onDayPress}
          //estilo de la fecha seleccionada
          markedDates={{
            ...dates,
            [selected]: {
              selected: true,
              disableTouchEvent: true,
              selectedColor: "#3B99D8",
              selectedTextColor: "white",
              dotColor: 'white',
              marked: markIt,
            },
          }}

          style={styles.calendar}
          theme={{
            //Calendario
            calendarBackground: "#E8E8F4",
            //Mes
            monthTextColor: "#ffffff",
            textMonthFontSize: 22,
            //Días
            textDayFontSize: 16,
            todayTextColor: "#3B99D8",
            dayTextColor: "#000000",
            //Flecha
            arrowColor: "white",
            "stylesheet.calendar.header": {
              //mes header
              header: {
                borderRadius: 3,
                flexDirection: "row",
                backgroundColor: "#3B99D8",
                justifyContent: "space-between",
              },
              //dias header
              dayHeader: {
                flexDirection: "row",
                justifyContent: "space-between",
                color: "#3B99D8",
                fontWeight: "bold",
              },
            },
          }}
          
        ></Calendar>
      </ScrollView>
    </>
  );
};

export default CalendarScreen;
