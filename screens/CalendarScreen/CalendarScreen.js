import React, { useState, useRef, useEffect } from "react";
import { Text, View, TouchableOpacity, Alert } from "react-native";
import styles from "./styles";
import { firebase } from "../../firebase/config";
import { ActivityIndicator, Appbar, DefaultTheme, List } from "react-native-paper";
import { Calendar } from "react-native-calendars";
import { LocaleConfig } from "react-native-calendars";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

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
    getLists(props.route.params.userID);
  }, []);

  const [selected, setSelected] = useState(
  new Date().getFullYear() 
  + "-" + 
  (new Date().getMonth() + 1)
  + "-" + 
  new Date().getDate());

  const [dates, setDates] = useState(null);
  const [loading, setLoading] = useState(true);
  const [markIt, setMarkIt] = useState(false);
  let [tasks, setTasks] = useState([]);

  const onDayPress = (day) => {
    if (Object.keys(dates).includes(day.dateString)) setMarkIt(true);
    else setMarkIt(false);
    setSelected(day.dateString);
  };
  

  const getLists = (userID) => {
    const listsRef = firebase.default.firestore().collection("lists");
    listsRef
      .where("createdBy", "==", userID)
      .onSnapshot((snapshot) => {
        const data = []
        snapshot.docs.map((doc) => {
          data.push({
            id: doc.id,
            ...doc.data(),
          })
          getTasks(doc.id)
        });
        getDates(data);
      });
  };

  const getTasks = (listID) => {
    const tasksRef = firebase.default.firestore().collection("tasks");
    tasksRef
      .where("listID", "==", listID)
      .where("done", "==", false)
      .onSnapshot((snapshot) => {
        let data = tasks
        snapshot.docs.forEach((doc) => {
          data.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        if (data.length === 0) setTasks(null);
        else setTasks(data);
      });
  };

  const getDates = (lists) => {
    let date = {};
    if (lists) {
      lists.map((list) => {
        const taskRef = firebase.default.firestore().collection("tasks");
        taskRef.where("listID", "==", list.id).where("done", "==", false).onSnapshot((snapshot) => {
          snapshot.docs.forEach((doc) => {
            const resul = new Date(doc.data().limit * 1000);
            const str =
              resul.getFullYear() +
              "-" +
              (resul.getMonth() + 1) +
              "-" +
              resul.getDate();
            if(date[str]){
              date[str].id.push(doc.id)
            }else{
              date[str] = {
                id: [doc.id],
                dotColor: "#3B99D8",
                selectedColor: "white",
                marked: true,
              };
            }
          });
          setDates(date);
        });
      });
    }
    setLoading(false);
  };

  const renderTasks = (items) => {
    const hash = {}
    tasks = tasks.filter(current => {
      const exist = !hash[current.id]
      hash[current.id] = true
      return exist
    })
    return(
      <List.Section title={selected}>
        {
          items[selected].id.map((id) => {
            return (
              tasks.map((task) => {
                if(task.id === id){
                  return(
                    <List.Item title={task.title} description={task.description} key={id}/>
                  )
                }
              })
            )
          })
        }
      </List.Section>
    )
  } 

  if (loading) {
    return (
      <View>
        <ActivityIndicator size="large" />
      </View>
    );
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
              dotColor: "white",
              marked: markIt,
            },
          }}
          style={styles.calendar}
          theme={{
            //Calendario
            calendarBackground: "#E8E8F4",
            //Mes
            monthTextColor: "#63656A",
            textMonthFontSize: 22,
            textMonthFontWeight: "bold",
            //Días
            textDayFontSize: 16,
            textDayFontWeight: "bold",
            todayTextColor: "#3B99D8",
            dayTextColor: "#63656A",
            //Flecha
            arrowColor: "#3B99D8",
            "stylesheet.calendar.header": {
              //mes header
              header: {
                marginTop: 3,
                borderRadius: 3,
                flexDirection: "row",
                backgroundColor: "#E8E8F4",
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
        <SafeAreaView>
            {
              dates
              ?
                (dates[selected]
                ?
                renderTasks(dates)
                :
                <List.Item title="No hay tareas para este dia" />
                )
              :
              <List.Item  title="Aún no tiene ninguna tarea creada" />
            }
        </SafeAreaView>
      </ScrollView>
    </>
  );
};

export default CalendarScreen;
