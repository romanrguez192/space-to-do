import React, { useState, useRef, useEffect } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import styles from "./styles";
import { firebase } from "../../firebase/config";
import { Appbar, DefaultTheme } from "react-native-paper";
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

  const [selected, setSelected] = useState("");

  const onDayPress = (day) => {
    setSelected(day.dateString);
  };

  return (
    <View>
    <CustomHeader />
     <ScrollView>
        <Calendar
          enableSwipeMonths={true}
          onDayPress={onDayPress}
          //estilo de la fecha seleccionada
          markedDates={{
            [selected]: {
              selected: true,
              disableTouchEvent: true,
              selectedColor: "#3B99D8",
              selectedTextColor: "white",
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
    </View>
  );
};

export default CalendarScreen;
